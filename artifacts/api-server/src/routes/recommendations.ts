import { Router } from "express";
import type { Request, Response } from "express";
import { rawgFetch } from "./games/rawg";

const router = Router();

interface GameSummary {
  id: number;
  slug: string;
  name: string;
  background_image?: string;
  rating: number;
  rating_top: number;
  ratings_count: number;
  released?: string;
  metacritic?: number;
  playtime: number;
  genres: { id: number; name: string; slug: string }[];
  platforms: { platform: { id: number; name: string; slug: string } }[];
  tags: { id: number; name: string; slug: string }[];
  short_screenshots: { id: number; image: string }[];
}

function buildReasonMessage(genres: string, tags: string, basedOn: string): string {
  const parts: string[] = [];
  if (basedOn) parts.push(`you enjoy games like ${basedOn}`);
  if (genres) {
    const genreNames = genres.split(",").join(", ");
    parts.push(`you like ${genreNames} games`);
  }
  if (tags) {
    const tagNames = tags.split(",").join(", ");
    parts.push(`your interest in ${tagNames}`);
  }
  if (parts.length === 0) return "it's highly rated and popular";
  return parts.join(" and ");
}

router.get("/", async (req: Request, res: Response) => {
  try {
    const genres = (req.query.genres as string) || "";
    const tags = (req.query.tags as string) || "";
    const basedOn = (req.query.based_on as string) || "";
    const page_size = req.query.page_size ? Number(req.query.page_size) : 12;

    const params: Record<string, string | number> = {
      ordering: "-rating",
      page_size,
    };
    if (genres) params.genres = genres;
    if (tags) params.tags = tags;
    if (basedOn) params.search = basedOn;

    const data = await rawgFetch("/games", params) as { count: number; results: GameSummary[] };

    const reason = buildReasonMessage(genres, tags, basedOn);
    const results = data.results.map((game) => ({
      game,
      reason: `Recommended because ${reason}.`,
      score: game.rating,
    }));

    const basedOnDescription = basedOn
      ? `games similar to "${basedOn}"`
      : genres
      ? `${genres} games`
      : "popular games";

    res.json({
      results,
      based_on: basedOnDescription,
    });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Failed to fetch recommendations" });
  }
});

export default router;
