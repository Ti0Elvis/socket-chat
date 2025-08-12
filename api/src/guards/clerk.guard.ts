import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import type { Request } from "express";
import { verifyToken } from "@clerk/backend";

@Injectable()
export class ClerkAuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const auth = request.headers.authorization;

    if (auth === undefined || auth.startsWith("Bearer ") === false) {
      throw new UnauthorizedException("Invalid authorization token");
    }

    const token = auth.replace("Bearer ", "");

    // This is only to verify if the token is correct we don't save the user information
    try {
      await verifyToken(token, {
        secretKey: process.env.CLERK_SECRET_KEY,
      });

      return true;
    } catch (error) {
      console.error("Token verification failed:", error);
      throw new UnauthorizedException("Invalid token");
    }
  }
}
