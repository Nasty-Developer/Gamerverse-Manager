import { Router } from "express";
import type { Request, Response } from "express";
import { getAuth } from "@clerk/express";
import { db, gameRequestsTable } from "@workspace/db";
import { desc } from "drizzle-orm";

const router = Router();

router.get("/", async (req: Request, res: Response) => {
  try {
    const requests = await db.select().from(gameRequestsTable).orderBy(desc(gameRequestsTable.createdAt)).limit(50);
    res.json(requests);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Failed to fetch game requests" });
  }
});

router.post("/", async (req: Request, res: Response) => {
  try {
    const { userId } = getAuth(req);
    const { gameName, platform, notes } = req.body;
    if (!gameName || !platform) {
      res.status(400).json({ error: "gameName and platform are required" });
      return;
    }
    const [inserted] = await db.insert(gameRequestsTable).values({
      userId: userId || null,
      gameName,
      platform,
      notes: notes || null,
      status: "pending",
    }).returning();
    res.status(201).json(inserted);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Failed to create game request" });
  }
});

export default router;
