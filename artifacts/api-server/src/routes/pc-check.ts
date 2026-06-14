import { Router } from "express";
import type { Request, Response } from "express";
import { rawgFetch } from "./games/rawg";

const router = Router();

interface PlatformEntry {
  platform: { id: number; name: string; slug: string };
  requirements?: { minimum?: string; recommended?: string };
}

interface GameDetail {
  slug: string;
  name: string;
  platforms?: PlatformEntry[];
}

// Rough GPU tier score (higher = more powerful)
function getGpuScore(gpu: string): number {
  const g = gpu.toLowerCase();
  if (g.includes("rtx 4090") || g.includes("rtx 4080")) return 100;
  if (g.includes("rtx 4070") || g.includes("rtx 3090") || g.includes("rtx 3080")) return 90;
  if (g.includes("rtx 3070") || g.includes("rtx 4060") || g.includes("rx 6800")) return 80;
  if (g.includes("rtx 3060") || g.includes("rtx 2070") || g.includes("rx 6700")) return 70;
  if (g.includes("rtx 2060") || g.includes("gtx 1080") || g.includes("rx 5700")) return 60;
  if (g.includes("gtx 1070") || g.includes("gtx 1660") || g.includes("rx 580")) return 50;
  if (g.includes("gtx 1060") || g.includes("rx 570")) return 40;
  if (g.includes("gtx 1050") || g.includes("rx 560")) return 30;
  if (g.includes("gtx 960") || g.includes("rx 480")) return 25;
  if (g.includes("gtx 750") || g.includes("rx 460")) return 18;
  if (g.includes("intel hd") || g.includes("intel uhd") || g.includes("intel iris")) return 10;
  return 35; // default: mid-range
}

function getCpuScore(cpu: string): number {
  const c = cpu.toLowerCase();
  if (c.includes("i9") || c.includes("ryzen 9")) return 100;
  if (c.includes("i7") || c.includes("ryzen 7")) return 80;
  if (c.includes("i5") || c.includes("ryzen 5")) return 60;
  if (c.includes("i3") || c.includes("ryzen 3")) return 40;
  if (c.includes("pentium") || c.includes("celeron") || c.includes("athlon")) return 20;
  return 50;
}

router.post("/", async (req: Request, res: Response) => {
  try {
    const { gameSlug, cpu, gpu, ram } = req.body as { gameSlug: string; cpu: string; gpu: string; ram: number };

    const gameData = await rawgFetch(`/games/${gameSlug}`) as GameDetail;

    // Find PC requirements
    const pcPlatform = gameData.platforms?.find(
      (p) => p.platform.slug === "pc"
    );

    const minReqs = pcPlatform?.requirements?.minimum || "";
    const recReqs = pcPlatform?.requirements?.recommended || "";

    // Score user's system
    const gpuScore = getGpuScore(gpu);
    const cpuScore = getCpuScore(cpu);
    const ramGb = Number(ram);

    const details: { component: string; status: "pass" | "warn" | "fail"; message: string }[] = [];

    // RAM check
    let ramStatus: "pass" | "warn" | "fail" = "pass";
    let ramMsg = "";
    if (ramGb >= 16) { ramStatus = "pass"; ramMsg = `${ramGb}GB RAM — exceeds most game requirements`; }
    else if (ramGb >= 8) { ramStatus = "pass"; ramMsg = `${ramGb}GB RAM — meets typical requirements`; }
    else if (ramGb >= 4) { ramStatus = "warn"; ramMsg = `${ramGb}GB RAM — meets minimum but may limit performance`; }
    else { ramStatus = "fail"; ramMsg = `${ramGb}GB RAM — below most game minimums`; }
    details.push({ component: "RAM", status: ramStatus, message: ramMsg });

    // GPU check
    let gpuStatus: "pass" | "warn" | "fail";
    let gpuMsg = "";
    if (gpuScore >= 70) { gpuStatus = "pass"; gpuMsg = `${gpu} — high-end GPU, excellent performance expected`; }
    else if (gpuScore >= 40) { gpuStatus = "pass"; gpuMsg = `${gpu} — capable GPU for most titles`; }
    else if (gpuScore >= 25) { gpuStatus = "warn"; gpuMsg = `${gpu} — may struggle with demanding games`; }
    else { gpuStatus = "fail"; gpuMsg = `${gpu} — below recommended for most modern games`; }
    details.push({ component: "GPU", status: gpuStatus, message: gpuMsg });

    // CPU check
    let cpuStatus: "pass" | "warn" | "fail";
    let cpuMsg = "";
    if (cpuScore >= 60) { cpuStatus = "pass"; cpuMsg = `${cpu} — solid CPU for gaming`; }
    else if (cpuScore >= 40) { cpuStatus = "warn"; cpuMsg = `${cpu} — may bottleneck in demanding games`; }
    else { cpuStatus = "fail"; cpuMsg = `${cpu} — may struggle with modern titles`; }
    details.push({ component: "CPU", status: cpuStatus, message: cpuMsg });

    // Overall result
    const failCount = details.filter((d) => d.status === "fail").length;
    const warnCount = details.filter((d) => d.status === "warn").length;

    let result: "can_run" | "may_run" | "not_recommended";
    let explanation = "";

    if (failCount >= 2) {
      result = "not_recommended";
      explanation = `Your system may have difficulty running ${gameData.name}. Key hardware components are below the recommended specifications.`;
    } else if (failCount === 1 || warnCount >= 2) {
      result = "may_run";
      explanation = `Your system can likely run ${gameData.name} at reduced settings. Some components are below recommended specs.`;
    } else {
      result = "can_run";
      explanation = `Your system meets the requirements for ${gameData.name}. You should be able to run it comfortably.`;
    }

    res.json({
      gameSlug,
      gameName: gameData.name,
      result,
      explanation,
      minimumRequirements: minReqs,
      recommendedRequirements: recReqs,
      details,
    });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Failed to check compatibility" });
  }
});

export default router;
