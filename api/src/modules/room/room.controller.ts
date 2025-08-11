import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from "@nestjs/common";
import type { Types } from "mongoose";
import { RoomService } from "./room.service";
import { ClerkAuthGuard } from "@/guards/clerk.guard";
import { CreateRoomDto } from "./dto/create-room.dto";

@Controller("room")
@UseGuards(ClerkAuthGuard)
export class RoomController {
  constructor(private _RoomService_: RoomService) {}

  @Get("/find-by-id/:_id")
  async FindById(@Param("_id") _id: Types.ObjectId) {
    return await this._RoomService_.FindById(_id);
  }

  @Get("/find-all")
  async FindAll() {
    return await this._RoomService_.FindAll();
  }

  @Post("/create")
  async Create(@Body() body: CreateRoomDto) {
    return await this._RoomService_.Create(body);
  }

  @Delete("/delete/:_id")
  async Delete(@Param("_id") _id: Types.ObjectId) {
    return await this._RoomService_.Delete(_id);
  }
}
