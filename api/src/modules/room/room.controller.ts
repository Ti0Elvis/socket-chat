import { RoomService } from "./room.service";
import { ClerkAuthGuard } from "@/guards/clerk.guard";
import { CreateRoomDto } from "./dto/create-room.dto";
import { Body, Controller, Get, Post, UseGuards } from "@nestjs/common";

@Controller("room")
@UseGuards(ClerkAuthGuard)
export class RoomController {
  constructor(private _RoomService_: RoomService) {}

  @Get("/find-all")
  async FindAll() {
    return await this._RoomService_.FindAll();
  }

  @Post("/create")
  async Create(@Body() body: CreateRoomDto) {
    return await this._RoomService_.Create(body);
  }
}
