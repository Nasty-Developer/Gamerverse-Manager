import { Router, type IRouter } from "express";
import healthRouter from "./health";
import gamesRouter from "./games";
import genresRouter from "./genres";
import platformsRouter from "./platforms";
import searchRouter from "./search";
import recommendationsRouter from "./recommendations";
import favoritesRouter from "./favorites";
import reviewsRouter from "./reviews";
import recentlyViewedRouter from "./recently-viewed";
import pcCheckRouter from "./pc-check";
import newsRouter from "./news";
import featuredRouter from "./featured";

const router: IRouter = Router();

router.use(healthRouter);
router.use("/games", gamesRouter);
router.use("/genres", genresRouter);
router.use("/platforms", platformsRouter);
router.use("/search", searchRouter);
router.use("/recommendations", recommendationsRouter);
router.use("/favorites", favoritesRouter);
router.use("/reviews", reviewsRouter);
router.use("/recently-viewed", recentlyViewedRouter);
router.use("/pc-check", pcCheckRouter);
router.use("/news", newsRouter);
router.use("/featured", featuredRouter);

export default router;
