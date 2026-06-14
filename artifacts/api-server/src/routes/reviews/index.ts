import { Router } from "express";
import type { Request, Response } from "express";
import { getAuth } from "@clerk/express";
import { db, reviewsTable } from "@workspace/db";
import { eq, and } from "drizzle-orm";

const router = Router();

router.get("/", async (req: Request, res: Response) => {
  try {
    const gameSlug = req.query.gameSlug as string;
    if (!gameSlug) { res.status(400).json({ error: "gameSlug is required" }); return; }
    const reviews = await db.select().from(reviewsTable).where(eq(reviewsTable.gameSlug, gameSlug));
    res.json(reviews);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Failed to fetch reviews" });
  }
});

router.post("/", async (req: Request, res: Response) => {
  try {
    const { userId } = getAuth(req);
    if (!userId) { res.status(401).json({ error: "Unauthorized" }); return; }
    const { gameSlug, rating, content, username } = req.body;
    const [inserted] = await db.insert(reviewsTable).values({
      userId,
      username: username || "Anonymous",
      gameSlug,
      rating: Number(rating),
      content,
    }).returning();
    res.status(201).json(inserted);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Failed to create review" });
  }
});

router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const { userId } = getAuth(req);
    if (!userId) { res.status(401).json({ error: "Unauthorized" }); return; }
    await db.delete(reviewsTable).where(
      and(eq(reviewsTable.id, Number(req.params.id)), eq(reviewsTable.userId, userId))
    );
    res.status(204).send();
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Failed to delete review" });
  }
});

export default router;
