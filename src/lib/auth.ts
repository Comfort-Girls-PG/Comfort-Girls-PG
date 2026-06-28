import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "comfort-girls-pg-secret-key-13579";

export interface DecodedUser {
  id: string;
  email: string;
  role: "Guest" | "Resident" | "Admin" | "Staff";
}

export function generateToken(payload: { id: string; email: string; role: string }): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

export function verifyToken(token: string): DecodedUser | null {
  try {
    return jwt.verify(token, JWT_SECRET) as DecodedUser;
  } catch (err) {
    console.error("JWT Verification error:", err);
    return null;
  }
}

export function getAuthenticatedUser(request: Request): DecodedUser | null {
  const authHeader = request.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }
  const token = authHeader.split(" ")[1];
  return verifyToken(token);
}
