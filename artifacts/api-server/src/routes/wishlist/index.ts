import { Router } from "express";
import type { Request, Response } from "express";
import { getAuth } from "@clerk/express";
import { db, wishlistsTable } from "@workspace/db";
import { eq, and } from "drizzle-orm";

const router = Router();

router.get("/", async (req: Request, res: Response) => {
  try {
    const { userId } = getAuth(req);
    if (!userId) { res.status(401).json({ error: "Unauthorized" }); return; }
    const items = await db.select().from(wishlistsTable).where(eq(wishlistsTable.userId, userId));
    res.json(items);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Failed to fetch wishlist" });
  }
});

router.post("/", async (req: Request, res: Response) => {
  try {
    const { userId } = getAuth(req);
    if (!userId) { res.status(401).json({ error: "Unauthorized" }); return; }
    const { gameSlug, gameName, gameBackground, gameRating, gameGenres } = req.body;
    if (!gameSlug || !gameName) {
      res.status(400).json({ error: "gameSlug and gameName are required" });
      return;
    }
    const [inserted] = await db.insert(wishlistsTable).values({
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
    res.status(500).json({ error: "Failed to add to wishlist" });
  }
});

router.delete("/:gameSlug", async (req: Request, res: Response) => {
  try {
    const { userId } = getAuth(req);
    if (!userId) { res.status(401).json({ error: "Unauthorized" }); return; }
    await db.delete(wishlistsTable).where(
      and(eq(wishlistsTable.userId, userId), eq(wishlistsTable.gameSlug, String(req.params.gameSlug)))
    );
    res.status(204).send();
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Failed to remove from wishlist" });
  }
});

export default router;
