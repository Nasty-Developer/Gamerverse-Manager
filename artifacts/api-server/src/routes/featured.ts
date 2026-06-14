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

interface RawgResponse {
  results: GameSummary[];
}

const FEATURED_COLLECTIONS = [
  {
    id: "open-world-legends",
    title: "Open World Legends",
    description: "Vast worlds that defined the genre — explore, discover, and lose yourself for hundreds of hours.",
    imageUrl: "https://media.rawg.io/media/games/618/618c2031a07bbff6b4f611f10b6bcdbc.jpg",
    params: { genres: "open-world", ordering: "-rating", page_size: 6 },
  },
  {
    id: "must-play-rpgs",
    title: "Must-Play RPGs",
    description: "Epic stories, deep character systems, and worlds that breathe — the best RPGs of all time.",
    imageUrl: "https://media.rawg.io/media/games/456/456dea5e1c7e3cd07060601f68f6aa05.jpg",
    params: { genres: "role-playing-games-rpg", ordering: "-metacritic", page_size: 6 },
  },
  {
    id: "indie-masterpieces",
    title: "Indie Masterpieces",
    description: "Proof that the best ideas don't need the biggest budgets. Handcrafted experiences that punch far above their weight.",
    imageUrl: "https://media.rawg.io/media/games/562/562553814dd54e001a541e4ee83a591c.jpg",
    params: { genres: "indie", ordering: "-metacritic", page_size: 6 },
  },
];

router.get("/", async (req: Request, res: Response) => {
  try {
    const results = await Promise.all(
      FEATURED_COLLECTIONS.map(async (collection) => {
        const data = await rawgFetch("/games", collection.params) as RawgResponse;
        return {
          id: collection.id,
          title: collection.title,
          description: collection.description,
          imageUrl: collection.imageUrl,
          games: data.results || [],
        };
      })
    );
    res.json(results);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Failed to fetch featured collections" });
  }
});

export default router;
