import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { Room, RoomDocument } from "./room.schema";
import { CreateRoomDto } from "./dto/create-room.dto";
import { UserService } from "@/modules/user/user.service";
import { HttpException, Injectable } from "@nestjs/common";

@Injectable()
export class RoomService {
  constructor(
    @InjectModel(Room.name) private _RoomModule_: Model<RoomDocument>,
    private _UserService_: UserService
  ) {}

  async FindAll() {
    return await this._RoomModule_
      .find({})
      .populate("owner")
      .populate("users")
      .sort({ updatedAt: -1 });
  }

  async Create(body: CreateRoomDto) {
    const user = await this._UserService_.FindByClerkId(body.user_id);
    const room = await this._RoomModule_.findOne({ name: body.name });

    if (room !== null) {
      throw new HttpException("There is already a room with this name", 400);
    }

    try {
      const payload: Room = {
        name: body.name,
        language: body.language,
        owner: user._id,
        users: [user._id],
        tag: body.tag,
      };

      const room = await this._RoomModule_.create(payload);

      return room;
    } catch (error) {
      console.error(error);
      throw new HttpException("Error occurred while creating room", 500);
    }
  }
}
