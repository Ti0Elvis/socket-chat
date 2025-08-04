import { Model } from "mongoose";
import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Room, RoomDocument } from "./room.schema";

@Injectable()
export class RoomService {
  constructor(
    @InjectModel(Room.name) private _RoomModule_: Model<RoomDocument>
  ) {}
}
