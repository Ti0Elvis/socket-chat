import { Model, Types } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { Room, RoomDocument } from "./room.schema";
import { CreateRoomDto } from "./dto/create-room.dto";
import { JoinToRoomDto } from "./dto/join-to-room.dto";
import { UserService } from "@/modules/user/user.service";
import { HttpException, Injectable } from "@nestjs/common";

@Injectable()
export class RoomService {
  constructor(
    @InjectModel(Room.name) private _RoomModule_: Model<RoomDocument>,
    private _UserService_: UserService
  ) {}

  async FindById(_id: Types.ObjectId) {
    if (Types.ObjectId.isValid(_id) === false) {
      throw new HttpException("Invalid _id", 400);
    }

    const room = await this._RoomModule_.findById(_id);

    if (room === null) {
      throw new HttpException("Room not found", 404);
    }

    return room;
  }

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

  async Join(query: JoinToRoomDto) {
    const user = await this._UserService_.FindByClerkId(query.user_id);
    const room = await this.FindById(query.room_id);

    try {
      if (room.users.includes(user._id) === false) {
        room.users.push(user._id);

        await room.save();
      }

      return `Join to room "${room.name}"`;
    } catch (error) {
      console.error(error);
      throw new HttpException("Error occurred while user joining to room", 500);
    }
  }

  async Delete(_id: Types.ObjectId) {
    const room = await this.FindById(_id);

    try {
      await room.deleteOne();

      return "Room deleted successfully";
    } catch (error) {
      console.error(error);
      throw new HttpException("Error occurred while deleting room", 500);
    }
  }
}
