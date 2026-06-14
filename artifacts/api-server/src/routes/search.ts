import { Router } from "express";
import type { Request, Response } from "express";
import { rawgFetch } from "./games/rawg";

const router = Router();

// Parses natural language queries into RAWG parameters
function parseSearchIntent(q: string): { params: Record<string, string | number>; intent: string } {
  const lower = q.toLowerCase();
  const params: Record<string, string | number> = {};
  let intent = "search";

  // Ordering intents
  if (lower.includes("best") || lower.includes("top rated") || lower.includes("top-rated")) {
    params.ordering = "-metacritic";
    intent = "top-rated";
  } else if (lower.includes("trending") || lower.includes("popular")) {
    params.ordering = "-added";
    intent = "trending";
  } else if (lower.includes("new") || lower.includes("latest") || lower.includes("recent")) {
    params.ordering = "-released";
    intent = "new-releases";
  }

  // Genre extraction
  const genreMap: Record<string, string> = {
    action: "action",
    adventure: "adventure",
    rpg: "role-playing-games-rpg",
    "role-playing": "role-playing-games-rpg",
    shooter: "shooter",
    strategy: "strategy",
    puzzle: "puzzle",
    racing: "racing",
    sports: "sports",
    fighting: "fighting",
    horror: "horror",
    simulation: "simulation",
    arcade: "arcade",
    platformer: "platformer",
    indie: "indie",
    "open world": "open-world",
    "open-world": "open-world",
    multiplayer: "massively-multiplayer",
    "story": "adventure",
  };
  for (const [keyword, genre] of Object.entries(genreMap)) {
    if (lower.includes(keyword)) {
      params.genres = genre;
      break;
    }
  }

  // Tag-based filtering
  const tagMap: Record<string, string> = {
    "low-end pc": "low-spec",
    "low end pc": "low-spec",
    "4 gb ram": "low-spec",
    "co-op": "co-op",
    "coop": "co-op",
    "story rich": "story-rich",
    "open world": "open-world",
    sandbox: "sandbox",
    survival: "survival",
    "horror": "horror",
    multiplayer: "multiplayer",
  };
  for (const [keyword, tag] of Object.entries(tagMap)) {
    if (lower.includes(keyword)) {
      params.tags = tag;
      break;
    }
  }

  // "games like X" — search for X
  const likeMatch = lower.match(/games?\s+like\s+(.+)/);
  if (likeMatch) {
    params.search = likeMatch[1].trim();
    intent = `similar-to-${likeMatch[1].trim()}`;
  } else if (q && !params.genres && !params.tags) {
    // Fallback: just do a text search
    params.search = q;
  }

  // RAM-based filter
  const ramMatch = lower.match(/(\d+)\s*gb\s*ram/);
  if (ramMatch) {
    const ram = parseInt(ramMatch[1]);
    if (ram <= 4) params.tags = "low-spec";
    intent = `low-spec-${ram}gb`;
  }

  // Storage-based filter
  const storageMatch = lower.match(/under\s+(\d+)\s*gb/);
  if (storageMatch) {
    intent = `under-${storageMatch[1]}gb`;
  }

  return { params, intent };
}

router.get("/", async (req: Request, res: Response) => {
  try {
    const q = (req.query.q as string) || "";
    const page = req.query.page ? Number(req.query.page) : 1;
    const page_size = req.query.page_size ? Number(req.query.page_size) : 20;

    const { params, intent } = parseSearchIntent(q);

    const data = await rawgFetch("/games", {
      ...params,
      page,
      page_size,
    }) as { count: number; results: unknown[] };

    res.json({
      query: q,
      intent,
      count: data.count,
      results: data.results,
    });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Search failed" });
  }
});

export default router;
