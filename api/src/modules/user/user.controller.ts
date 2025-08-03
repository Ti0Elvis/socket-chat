import { UserService } from "./user.service";
import { RegisterUserDto } from "./dto/register-user.dto";
import { Body, Controller, Delete, Get, Param, Post } from "@nestjs/common";

@Controller("user")
export class UserController {
  constructor(private _UserService_: UserService) {}

  @Get("/find-by-clerkId/:id")
  async FindByClerkId(@Param("id") id: string) {
    return await this._UserService_.FindByClerkId(id);
  }

  @Post("/create")
  async RegisterIfNotExists(@Body() body: RegisterUserDto) {
    return await this._UserService_.RegisterIfNotExists(body);
  }

  @Delete("/delete/:id")
  async Delete(@Param("id") id: string) {
    return await this._UserService_.Delete(id);
  }
}
