import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from "@nestjs/common";
import { UserService } from "./user.service";
import { ClerkAuthGuard } from "@/guards/clerk.guard";
import { RegisterUserDto } from "./dto/register-user.dto";

@Controller("user")
@UseGuards(ClerkAuthGuard)
export class UserController {
  constructor(private _UserService_: UserService) {}

  @Get("/is-registered/:clerk_id")
  async IsRegistered(@Param("clerk_id") clerk_id: string) {
    return await this._UserService_.IsRegistered(clerk_id);
  }

  @Post("/register")
  async Register(@Body() body: RegisterUserDto) {
    return await this._UserService_.Register(body);
  }

  @Delete("/delete/:clerk_id")
  async DeleteByClerkId(@Param("clerk_id") clerk_id: string) {
    return await this._UserService_.DeleteByClerkId(clerk_id);
  }
}
