import type { Request, Response, NextFunction } from "express";

const AUTOMATION_API_KEY = process.env.AUTOMATION_API_KEY || "dev-automation-key-change-in-production";

export function requireAutomationAuth(req: Request, res: Response, next: NextFunction) {
  const apiKey = req.headers["x-automation-api-key"] || req.query.apiKey;

  if (!apiKey || apiKey !== AUTOMATION_API_KEY) {
    return res.status(401).json({
      error: "Unauthorized",
      message: "Valid automation API key required. Set X-Automation-API-Key header or apiKey query param."
    });
  }

  next();
}

export function optionalAutomationAuth(req: Request, res: Response, next: NextFunction) {
  const apiKey = req.headers["x-automation-api-key"] || req.query.apiKey;
  
  if (apiKey && apiKey === AUTOMATION_API_KEY) {
    (req as any).authenticated = true;
  }
  
  next();
}
