import prisma from "../prismaClient.js";
import { verifyToken } from "../utils/jwt.js";

export async function requireAuth(req, res, next) {
  try {
    let token = null;

    // Prefer HttpOnly cookie
    if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }

    // Fallback to Authorization: Bearer
    if (!token && req.headers.authorization) {
      const [scheme, value] = req.headers.authorization.split(" ");
      if (scheme === "Bearer" && value) {
        token = value;
      }
    }

    if (!token) {
      return res.status(401).json({ error: "Unauthorized: missing token" });
    }

    const decoded = verifyToken(token);
    if (!decoded || !decoded.userId) {
      return res.status(401).json({ error: "Unauthorized: invalid token" });
    }

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      include: { role: true },
    });

    if (!user) {
      return res.status(401).json({ error: "Unauthorized: user not found" });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error("requireAuth error", err);
    return res.status(401).json({ error: "Unauthorized" });
  }
}

export function requireRole(roles = []) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: "Not authenticated" });
    }
    if (roles.length === 0) {
      return next();
    }
    // Check role name from the relation object
    const userRoleName = req.user.role?.name;
    if (!userRoleName || !roles.includes(userRoleName)) {
      return res.status(403).json({ error: "Forbidden: insufficient permissions" });
    }
    next();
  };
}
