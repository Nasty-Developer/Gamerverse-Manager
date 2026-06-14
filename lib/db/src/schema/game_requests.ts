import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const gameRequestsTable = pgTable("game_requests", {
  id: serial("id").primaryKey(),
  userId: text("user_id"),
  gameName: text("game_name").notNull(),
  platform: text("platform").notNull(),
  notes: text("notes"),
  status: text("status").notNull().default("pending"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertGameRequestSchema = createInsertSchema(gameRequestsTable).omit({ id: true, createdAt: true });
export type InsertGameRequest = z.infer<typeof insertGameRequestSchema>;
export type GameRequest = typeof gameRequestsTable.$inferSelect;
