import { Router } from "express";
import type { Request, Response } from "express";
import { getAuth } from "@clerk/express";
import { db, favoritesTable } from "@workspace/db";
import { eq, and } from "drizzle-orm";

const router = Router();

router.get("/", async (req: Request, res: Response) => {
  try {
    const { userId } = getAuth(req);
    if (!userId) { res.status(401).json({ error: "Unauthorized" }); return; }
    const favorites = await db.select().from(favoritesTable).where(eq(favoritesTable.userId, userId));
    res.json(favorites);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Failed to fetch favorites" });
  }
});

router.post("/", async (req: Request, res: Response) => {
  try {
    const { userId } = getAuth(req);
    if (!userId) { res.status(401).json({ error: "Unauthorized" }); return; }
    const { gameSlug, gameName, gameBackground, gameRating, gameGenres } = req.body;
    const [inserted] = await db.insert(favoritesTable).values({
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
    res.status(500).json({ error: "Failed to add favorite" });
  }
});

router.delete("/:gameSlug", async (req: Request, res: Response) => {
  try {
    const { userId } = getAuth(req);
    if (!userId) { res.status(401).json({ error: "Unauthorized" }); return; }
    await db.delete(favoritesTable).where(
      and(eq(favoritesTable.userId, userId), eq(favoritesTable.gameSlug, String(req.params.gameSlug)))
    );
    res.status(204).send();
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Failed to remove favorite" });
  }
});

export default router;
