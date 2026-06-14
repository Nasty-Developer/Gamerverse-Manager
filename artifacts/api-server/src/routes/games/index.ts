import { Router } from "express";
import type { Request, Response } from "express";
import { rawgFetch } from "./rawg";

const router = Router();

router.get("/", async (req: Request, res: Response) => {
  try {
    const { search, genres, platforms, ordering, page, page_size, dates, metacritic, tags } = req.query;
    const data = await rawgFetch("/games", {
      search: search as string,
      genres: genres as string,
      platforms: platforms as string,
      ordering: (ordering as string) || "-rating",
      page: page ? Number(page) : 1,
      page_size: page_size ? Number(page_size) : 20,
      dates: dates as string,
      metacritic: metacritic as string,
      tags: tags as string,
    });
    res.json(data);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Failed to fetch games" });
  }
});

router.get("/trending", async (req: Request, res: Response) => {
  try {
    const { page_size } = req.query;
    const now = new Date();
    const threeMonthsAgo = new Date(now);
    threeMonthsAgo.setMonth(now.getMonth() - 3);
    const dates = `${threeMonthsAgo.toISOString().split("T")[0]},${now.toISOString().split("T")[0]}`;
    const data = await rawgFetch("/games", {
      ordering: "-added",
      dates,
      page_size: page_size ? Number(page_size) : 12,
    });
    res.json(data);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Failed to fetch trending games" });
  }
});

router.get("/new-releases", async (req: Request, res: Response) => {
  try {
    const { page_size } = req.query;
    const now = new Date();
    const sixMonthsAgo = new Date(now);
    sixMonthsAgo.setMonth(now.getMonth() - 6);
    const dates = `${sixMonthsAgo.toISOString().split("T")[0]},${now.toISOString().split("T")[0]}`;
    const data = await rawgFetch("/games", {
      ordering: "-released",
      dates,
      page_size: page_size ? Number(page_size) : 12,
    });
    res.json(data);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Failed to fetch new releases" });
  }
});

router.get("/top-rated", async (req: Request, res: Response) => {
  try {
    const { page_size } = req.query;
    const data = await rawgFetch("/games", {
      ordering: "-metacritic",
      metacritic: "80,100",
      page_size: page_size ? Number(page_size) : 12,
    });
    res.json(data);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Failed to fetch top-rated games" });
  }
});

router.get("/:slug/similar", async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;
    const data = await rawgFetch(`/games/${slug}/game-series`, { page_size: 8 }) as { count: number; results: unknown[] };
    if (data.count === 0) {
      const suggested = await rawgFetch(`/games/${slug}/suggested`, { page_size: 8 });
      res.json(suggested);
      return;
    }
    res.json(data);
  } catch {
    try {
      const { slug } = req.params;
      const suggested = await rawgFetch(`/games/${slug}/suggested`, { page_size: 8 });
      res.json(suggested);
    } catch (err2) {
      req.log.error(err2);
      res.status(500).json({ error: "Failed to fetch similar games" });
    }
  }
});

router.get("/:slug/screenshots", async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;
    const data = await rawgFetch(`/games/${slug}/screenshots`);
    res.json(data);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Failed to fetch screenshots" });
  }
});

router.get("/:slug", async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;
    const data = await rawgFetch(`/games/${slug}`);
    res.json(data);
  } catch (err) {
    req.log.error(err);
    res.status(404).json({ error: "Game not found" });
  }
});

export default router;
