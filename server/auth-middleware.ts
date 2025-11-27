import type { Request, Response, NextFunction } from "express";
import type { Session, SessionData } from "express-session";
import { storage } from "./storage";

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

export interface MemberSessionData extends SessionData {
  memberId?: number;
  memberEmail?: string;
  memberRole?: string;
}

export interface AuthenticatedRequest extends Request {
  session: Session & Partial<MemberSessionData>;
  member?: {
    id: number;
    email: string;
    fullName: string;
    role: string;
    isCASMember: boolean;
    isCANNMember: boolean;
  };
}

export const requireMemberAuth = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.session?.memberId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required. Please log in.",
      });
    }

    const member = await storage.getMember(req.session.memberId);
    if (!member) {
      req.session.destroy(() => {});
      return res.status(401).json({
        success: false,
        message: "Session invalid. Please log in again.",
      });
    }

    if (member.status !== "active") {
      req.session.destroy(() => {});
      return res.status(403).json({
        success: false,
        message: "Your account is not active. Please contact support.",
      });
    }

    req.member = {
      id: member.id,
      email: member.email,
      fullName: member.fullName,
      role: member.role,
      isCASMember: member.isCASMember,
      isCANNMember: member.isCANNMember,
    };

    next();
  } catch (error) {
    console.error("[Auth Middleware] Error:", error);
    return res.status(500).json({
      success: false,
      message: "Authentication error. Please try again.",
    });
  }
};

export const requireCANNMember = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  if (!req.member) {
    return res.status(401).json({
      success: false,
      message: "Authentication required.",
    });
  }

  if (!req.member.isCANNMember && req.member.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "CANN membership required to access this content.",
    });
  }

  next();
};

export const requireAdmin = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  if (!req.member) {
    return res.status(401).json({
      success: false,
      message: "Authentication required.",
    });
  }

  if (req.member.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Admin access required.",
    });
  }

  next();
};

export const optionalMemberAuth = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (req.session?.memberId) {
      const member = await storage.getMember(req.session.memberId);
      if (member && member.status === "active") {
        req.member = {
          id: member.id,
          email: member.email,
          fullName: member.fullName,
          role: member.role,
          isCASMember: member.isCASMember,
          isCANNMember: member.isCANNMember,
        };
      }
    }
    next();
  } catch (error) {
    next();
  }
};
