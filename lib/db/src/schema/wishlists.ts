import { pgTable, serial, text, real, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const wishlistsTable = pgTable("wishlists", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(),
  gameSlug: text("game_slug").notNull(),
  gameName: text("game_name").notNull(),
  gameBackground: text("game_background"),
  gameRating: real("game_rating").notNull().default(0),
  gameGenres: text("game_genres").notNull().default(""),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertWishlistSchema = createInsertSchema(wishlistsTable).omit({ id: true, createdAt: true });
export type InsertWishlist = z.infer<typeof insertWishlistSchema>;
export type WishlistItem = typeof wishlistsTable.$inferSelect;
