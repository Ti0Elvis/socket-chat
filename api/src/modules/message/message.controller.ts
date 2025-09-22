import { Types } from "mongoose";
import { MessageService } from "./message.service";
import { Controller, Get, Param } from "@nestjs/common";

@Controller("message")
export class MessageController {
  constructor(private readonly _MessageService_: MessageService) {}

  @Get("find-all-by-room/:room_id")
  async findAllByRoom(@Param("room_id") room_id: Types.ObjectId) {
    return await this._MessageService_.findAllByRoom(room_id);
  }
}
