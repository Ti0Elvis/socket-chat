import { Types } from "mongoose";
import { RoomService } from "./room.service";
import { CreateRoomDto } from "./dto/create-room.dto";
import { Body, Controller, Delete, Get, Param, Post } from "@nestjs/common";

@Controller("room")
export class RoomController {
  constructor(private _RoomService_: RoomService) {}

  @Post("create")
  async createRoom(@Body() body: CreateRoomDto) {
    return this._RoomService_.createRoom(body);
  }

  @Get("find-all-rooms/:page")
  async findAllRooms(@Param("page") page: number) {
    return await this._RoomService_.findAllRooms(page);
  }

  @Get("find-room/:id")
  async findRoomById(@Param("id") id: Types.ObjectId) {
    return await this._RoomService_.findRoomById(id);
  }

  @Delete("delete-room/:id/:owner")
  async deleteRoomById(
    @Param("id") id: Types.ObjectId,
    @Param("owner") owner: string
  ) {
    return await this._RoomService_.deleteRoomById(id, owner);
  }
}
