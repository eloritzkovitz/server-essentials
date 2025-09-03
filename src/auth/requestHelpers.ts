import { Request } from "express";

/**
 * Gets the authenticated user's ID from the request.
 * @param req - Express request object.
 * @returns The user ID or undefined.
 */
export function getUserId(req: Request): string | undefined {
  return (req as any).user?.id;
}

/**
 * Gets the authenticated user's email from the request.
 * @param req - Express request object.
 * @returns The user email or undefined.
 */
export function getUserEmail(req: Request): string | undefined {
  return (req as any).user?.email;
}

/**
 * Gets the authenticated user's refresh token from the request.
 * @param req - Express request object.
 * @returns The refresh token or undefined.
 */
export function getUserRefreshToken(req: Request): string | undefined {
  return (req as any).user?.refreshToken;
}

/**
 * Gets the authenticated user's role from the request.
 * @param req - Express request object.
 * @returns The user role or undefined.
 */
export function getUserRole(req: Request): string | undefined {
  return (req as any).user?.role;
}

/**
 * Checks if the authenticated user has a specific role.
 * @param req - Express request object.
 * @param role - Role to check.
 * @returns True if user has the role, false otherwise.
 */
export function userHasRole(req: Request, role: string): boolean {
  return (req as any).user?.role === role;
}
