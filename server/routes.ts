import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  app.get("/api/visitors", async (_req, res) => {
    const count = await storage.getVisitorCount();
    res.json({ count });
  });

  app.post("/api/visitors/increment", async (_req, res) => {
    const count = await storage.incrementVisitorCount();
    res.json({ count });
  });

  return httpServer;
}
