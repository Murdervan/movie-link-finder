import { type User, type InsertUser, type Visitor } from "@shared/schema";
import { users, visitors } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getVisitorCount(): Promise<number>;
  incrementVisitorCount(): Promise<number>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async getVisitorCount(): Promise<number> {
    const [visitor] = await db.select().from(visitors);
    if (!visitor) {
      const [newVisitor] = await db.insert(visitors).values({ count: 0 }).returning();
      return newVisitor.count;
    }
    return visitor.count;
  }

  async incrementVisitorCount(): Promise<number> {
    const [visitor] = await db.select().from(visitors);
    if (!visitor) {
      const [newVisitor] = await db.insert(visitors).values({ count: 1 }).returning();
      return newVisitor.count;
    }
    const [updated] = await db
      .update(visitors)
      .set({ count: visitor.count + 1 })
      .returning();
    return updated.count;
  }
}

export const storage = new DatabaseStorage();
