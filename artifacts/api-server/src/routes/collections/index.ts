import { Router } from "express";
import type { Request, Response } from "express";

const RAWG_BASE = "https://api.rawg.io/api";
const API_KEY = process.env.RAWG_API_KEY;

export const COLLECTIONS = [
  { slug: "best-story-games", title: "Best Story Games", description: "Immersive narratives that will pull you in and never let go.", genres: "role-playing-games-rpg,adventure", tags: "story-rich", ordering: "-rating", emoji: "📖" },
  { slug: "best-open-world-games", title: "Best Open World Games", description: "Vast worlds to explore with no limits to your adventure.", tags: "open-world", ordering: "-rating", emoji: "🌍" },
  { slug: "best-horror-games", title: "Best Horror Games", description: "Games that will terrify and thrill you in equal measure.", genres: "action", tags: "horror", ordering: "-rating", emoji: "👻" },
  { slug: "best-rpg-games", title: "Best RPG Games", description: "Level up, build your character, and live another life.", genres: "role-playing-games-rpg", ordering: "-metacritic", emoji: "⚔️" },
  { slug: "best-indie-games", title: "Best Indie Games", description: "Passion projects with heart — the gems of gaming.", tags: "indie", ordering: "-rating", emoji: "💎" },
  { slug: "best-multiplayer-games", title: "Best Multiplayer Games", description: "Compete, cooperate, and dominate with friends.", tags: "multiplayer", ordering: "-rating", emoji: "🎮" },
  { slug: "best-action-games", title: "Best Action Games", description: "Adrenaline-pumping gameplay from start to finish.", genres: "action", ordering: "-metacritic", emoji: "💥" },
  { slug: "best-survival-games", title: "Best Survival Games", description: "Gather, craft, build, and survive against all odds.", tags: "survival", ordering: "-rating", emoji: "🏕️" },
  { slug: "best-co-op-games", title: "Best Co-op Games", description: "Better together — games built for playing with friends.", tags: "co-op", ordering: "-rating", emoji: "🤝" },
  { slug: "best-strategy-games", title: "Best Strategy Games", description: "Think before you act — games for the tactical mind.", genres: "strategy", ordering: "-metacritic", emoji: "🧠" },
  { slug: "best-racing-games", title: "Best Racing Games", description: "Rev your engines and hit the track at full speed.", genres: "racing", ordering: "-rating", emoji: "🏎️" },
  { slug: "low-end-pc-games", title: "Low-End PC Games", description: "Great games that run on almost any hardware.", tags: "low-spec", ordering: "-rating", emoji: "💻" },
  { slug: "top-rated-all-time", title: "Top Rated All Time", description: "The highest-rated games ever made across all platforms.", ordering: "-metacritic", emoji: "🏆" },
];

const router = Router();

router.get("/", (_req: Request, res: Response) => {
  res.json(COLLECTIONS.map(({ slug, title, description, emoji }) => ({ slug, title, description, emoji })));
});

router.get("/:slug", async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;
    const collection = COLLECTIONS.find(c => c.slug === slug);
    if (!collection) { res.status(404).json({ error: "Collection not found" }); return; }

    const params = new URLSearchParams({ key: API_KEY!, page_size: "20", ordering: collection.ordering || "-rating" });
    if (collection.genres) params.set("genres", collection.genres);
    if (collection.tags) params.set("tags", collection.tags);

    const response = await fetch(`${RAWG_BASE}/games?${params}`);
    if (!response.ok) { res.status(502).json({ error: "Upstream error" }); return; }
    const data = await response.json() as { results: unknown[]; count: number };

    res.json({
      slug: collection.slug,
      title: collection.title,
      description: collection.description,
      emoji: collection.emoji,
      count: data.count,
      results: data.results,
    });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Failed to fetch collection" });
  }
});

export default router;
