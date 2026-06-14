import { Router } from "express";
import type { Request, Response } from "express";

const router = Router();

const MOCK_NEWS = [
  {
    id: "1",
    title: "The Most Anticipated Games of 2025 — Release Dates and Everything We Know",
    excerpt: "From massive open worlds to intimate indie darlings, 2025 is shaping up to be one of the most exciting years in gaming history.",
    imageUrl: "https://media.rawg.io/media/games/618/618c2031a07bbff6b4f611f10b6bcdbc.jpg",
    source: "GamerVerse Editorial",
    publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    category: "News",
    url: "#",
  },
  {
    id: "2",
    title: "Best Open World Games to Play Right Now — 2025 Edition",
    excerpt: "We ranked the top 15 open world games available today, from vast RPG epics to atmospheric survival sandboxes.",
    imageUrl: "https://media.rawg.io/media/games/456/456dea5e1c7e3cd07060601f68f6aa05.jpg",
    source: "GamerVerse Editorial",
    publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    category: "Feature",
    url: "#",
  },
  {
    id: "3",
    title: "PC Gaming on a Budget: Best Games for Low-End Systems in 2025",
    excerpt: "You don't need a $3,000 rig to have a great time. These titles run beautifully on older hardware.",
    imageUrl: "https://media.rawg.io/media/games/562/562553814dd54e001a541e4ee83a591c.jpg",
    source: "GamerVerse Editorial",
    publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
    category: "Guide",
    url: "#",
  },
  {
    id: "4",
    title: "Indie Games That Took the Industry by Storm This Year",
    excerpt: "Small studios, big ideas. These indie titles proved that passion and creativity beat budget every time.",
    imageUrl: "https://media.rawg.io/media/games/328/3283617cb7d75d67257525ead50b.jpg",
    source: "GamerVerse Editorial",
    publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    category: "Feature",
    url: "#",
  },
  {
    id: "5",
    title: "Multiplayer Games with the Healthiest Communities Right Now",
    excerpt: "Finding a multiplayer game with great players can be harder than the game itself. We found the hidden gems.",
    imageUrl: "https://media.rawg.io/media/games/736/7369a35f265194e8f1e178c28338555.jpg",
    source: "GamerVerse Editorial",
    publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 36).toISOString(),
    category: "Feature",
    url: "#",
  },
  {
    id: "6",
    title: "Horror Games That Actually Scared Us — Ranked",
    excerpt: "From psychological dread to jump scares that still haunt us, these horror games are genuinely terrifying.",
    imageUrl: "https://media.rawg.io/media/games/490/49016e06ae2103881ff6373248843069.jpg",
    source: "GamerVerse Editorial",
    publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    category: "Feature",
    url: "#",
  },
];

router.get("/", async (req: Request, res: Response) => {
  try {
    const page_size = req.query.page_size ? Number(req.query.page_size) : 6;
    res.json(MOCK_NEWS.slice(0, page_size));
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Failed to fetch news" });
  }
});

export default router;
