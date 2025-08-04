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

  @Get("/find-by-clerkId/:clerkId")
  async FindByClerkId(@Param("clerkId") id: string) {
    return await this._UserService_.FindByClerkId(id);
  }

  @Post("/register-if-not-exists")
  async RegisterIfNotExists(@Body() body: RegisterUserDto) {
    return await this._UserService_.RegisterIfNotExists(body);
  }

  @Delete("/delete-by-clerkId/:clerkId")
  async DeleteByClerkId(@Param("clerkId") id: string) {
    return await this._UserService_.DeleteByClerkId(id);
  }
}
