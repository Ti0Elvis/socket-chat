import {
  CanActivate,
  ExecutionContext,
  HttpException,
  Injectable,
} from "@nestjs/common";
import type { Request } from "express";
import { verifyToken } from "@clerk/backend";

@Injectable()
export class ClerkAuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const auth = request.headers.authorization;

    if (auth === undefined || auth.startsWith("Bearer ") === false) {
      throw new HttpException("Missing or invalid Authorization header", 401);
    }

    const token = auth.replace("Bearer ", "");

    try {
      const { session, userId, claims } = await verifyToken(token, {
        secretKey: process.env.CLERK_SECRET_KEY,
      });

      request["user"] = { userId, session, claims };

      return true;
    } catch (error) {
      console.error("Token verification failed:", error);
      throw new HttpException("Invalid token", 401);
    }
  }
}
