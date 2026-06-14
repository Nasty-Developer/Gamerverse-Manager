import { pgTable, serial, text, real, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const recentlyViewedTable = pgTable("recently_viewed", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(),
  gameSlug: text("game_slug").notNull(),
  gameName: text("game_name").notNull(),
  gameBackground: text("game_background"),
  gameRating: real("game_rating").notNull().default(0),
  gameGenres: text("game_genres").notNull().default(""),
  viewedAt: timestamp("viewed_at").defaultNow().notNull(),
});

export const insertRecentlyViewedSchema = createInsertSchema(recentlyViewedTable).omit({ id: true, viewedAt: true });
export type InsertRecentlyViewed = z.infer<typeof insertRecentlyViewedSchema>;
export type RecentlyViewed = typeof recentlyViewedTable.$inferSelect;
