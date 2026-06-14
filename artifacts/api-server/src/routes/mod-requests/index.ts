import { Router } from "express";
import type { Request, Response } from "express";
import { getAuth } from "@clerk/express";
import { db, modRequestsTable } from "@workspace/db";
import { desc, eq, sql } from "drizzle-orm";

const router = Router();

router.get("/", async (req: Request, res: Response) => {
  try {
    const requests = await db.select().from(modRequestsTable).orderBy(desc(modRequestsTable.votes), desc(modRequestsTable.createdAt)).limit(50);
    res.json(requests);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Failed to fetch mod requests" });
  }
});

router.post("/", async (req: Request, res: Response) => {
  try {
    const { userId } = getAuth(req);
    const { gameName, modName, description, category } = req.body;
    if (!gameName || !modName || !description || !category) {
      res.status(400).json({ error: "gameName, modName, description and category are required" });
      return;
    }
    const [inserted] = await db.insert(modRequestsTable).values({
      userId: userId || null,
      gameName,
      modName,
      description,
      category,
      status: "requested",
    }).returning();
    res.status(201).json(inserted);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Failed to create mod request" });
  }
});

router.post("/:id/vote", async (req: Request, res: Response) => {
  try {
    const id = parseInt(String(req.params.id));
    if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }
    const [updated] = await db.update(modRequestsTable)
      .set({ votes: sql`${modRequestsTable.votes} + 1` })
      .where(eq(modRequestsTable.id, id))
      .returning();
    if (!updated) { res.status(404).json({ error: "Mod request not found" }); return; }
    res.json(updated);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Failed to vote" });
  }
});

export default router;
