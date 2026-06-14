import { Router } from "express";
import type { Request, Response } from "express";
import { getAuth } from "@clerk/express";
import { db, recentlyViewedTable } from "@workspace/db";
import { eq, and, desc } from "drizzle-orm";

const router = Router();

router.get("/", async (req: Request, res: Response) => {
  try {
    const { userId } = getAuth(req);
    if (!userId) { res.status(401).json({ error: "Unauthorized" }); return; }
    const items = await db
      .select()
      .from(recentlyViewedTable)
      .where(eq(recentlyViewedTable.userId, userId))
      .orderBy(desc(recentlyViewedTable.viewedAt))
      .limit(12);
    res.json(items);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Failed to fetch recently viewed" });
  }
});

router.post("/", async (req: Request, res: Response) => {
  try {
    const { userId } = getAuth(req);
    if (!userId) { res.status(401).json({ error: "Unauthorized" }); return; }
    const { gameSlug, gameName, gameBackground, gameRating, gameGenres } = req.body;
    await db.delete(recentlyViewedTable).where(
      and(eq(recentlyViewedTable.userId, userId), eq(recentlyViewedTable.gameSlug, gameSlug))
    );
    const [inserted] = await db.insert(recentlyViewedTable).values({
      userId,
      gameSlug,
      gameName,
      gameBackground: gameBackground || null,
      gameRating: gameRating || 0,
      gameGenres: gameGenres || "",
    }).returning();
    res.status(201).json(inserted);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Failed to track view" });
  }
});

export default router;
