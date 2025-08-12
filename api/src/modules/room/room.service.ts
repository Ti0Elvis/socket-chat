import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common";
import { type Model, Types } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { UserService } from "../user/user.service";
import { CreateRoomDto } from "./dto/create-room.dto";
import { Room, type RoomDocument } from "./room.schema";

@Injectable()
export class RoomService {
  constructor(
    @InjectModel(Room.name) private _RoomModule_: Model<RoomDocument>,
    private _UserService_: UserService
  ) {}

  async FindById(_id: Types.ObjectId) {
    if (Types.ObjectId.isValid(_id) === false) {
      throw new BadRequestException("Invalid _id");
    }

    const room = await this._RoomModule_.findById(_id);

    if (room === null) {
      throw new NotFoundException("Room not found");
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
    const user = await this._UserService_.FindByClerkId(body.clerk_id);
    const room = await this._RoomModule_.findOne({ name: body.name });

    if (room !== null) {
      throw new BadRequestException("There is already a room with this name");
    }

    try {
      const payload: Room = {
        name: body.name,
        language: body.language,
        owner: user._id,
        users: [],
        tag: body.tag,
      };

      const room = await this._RoomModule_.create(payload);

      return room;
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(
        "Error occurred while creating room"
      );
    }
  }

  async Join(query: { clerk_id: string; room_id: Types.ObjectId }) {
    const user = await this._UserService_.FindByClerkId(query.clerk_id);
    const room = await this.FindById(query.room_id);

    try {
      if (room.users.includes(user._id) === false) {
        room.users.push(user._id);

        await room.save();
      }

      return "Join to room";
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(
        "Error occurred while user joining to room"
      );
    }
  }

  async Leave(query: { clerk_id: string; room_id: Types.ObjectId }) {
    const user = await this._UserService_.FindByClerkId(query.clerk_id);
    const room = await this.FindById(query.room_id);

    try {
      const index = room.users.findIndex(
        (id) => id.toString() === user._id.toString()
      );

      if (index !== -1) {
        room.users.splice(index, 1);

        await room.save();
      }

      return "Leave room";
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(
        "Error occurred while user leaving the room"
      );
    }
  }

  // This is insecure because it does not validate that the user is the room owner
  async Delete(_id: Types.ObjectId) {
    const room = await this.FindById(_id);

    try {
      await room.deleteOne();

      return "Room deleted successfully";
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(
        "Error occurred while deleting room"
      );
    }
  }
}
