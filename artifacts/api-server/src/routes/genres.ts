import { Router } from "express";
import type { Request, Response } from "express";
import { rawgFetch } from "./games/rawg";

const router = Router();

router.get("/", async (req: Request, res: Response) => {
  try {
    const data = await rawgFetch("/genres", { page_size: 20 });
    res.json(data);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Failed to fetch genres" });
  }
});

export default router;
