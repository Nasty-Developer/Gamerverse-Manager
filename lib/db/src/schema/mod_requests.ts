import { pgTable, serial, text, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const modRequestsTable = pgTable("mod_requests", {
  id: serial("id").primaryKey(),
  userId: text("user_id"),
  gameName: text("game_name").notNull(),
  modName: text("mod_name").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(),
  status: text("status").notNull().default("requested"),
  votes: integer("votes").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertModRequestSchema = createInsertSchema(modRequestsTable).omit({ id: true, createdAt: true, votes: true });
export type InsertModRequest = z.infer<typeof insertModRequestSchema>;
export type ModRequest = typeof modRequestsTable.$inferSelect;
