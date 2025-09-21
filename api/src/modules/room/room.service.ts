import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common";
import { Types, type Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { CreateRoomDto } from "./dto/create-room.dto";
import { Room, type RoomDocument } from "./room.schema";

@Injectable()
export class RoomService {
  constructor(
    @InjectModel(Room.name) private _RoomModule_: Model<RoomDocument>
  ) {}

  async createRoom(body: CreateRoomDto) {
    const room = await this._RoomModule_.findOne({ name: body.name });

    if (room !== null) {
      throw new BadRequestException("There is already a room with this name");
    }

    try {
      const payload: Room = {
        name: body.name,
        language: body.language,
        owner: body.clerk_id,
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

  async findAllRooms(page: number) {
    if (Number.isNaN(page) === true) {
      throw new BadRequestException("Please insert as param a correct number");
    }

    const size = 3;
    const rooms = await this._RoomModule_
      .find()
      .skip((page - 1) * size)
      .limit(size)
      .exec();

    return rooms;
  }

  async findRoomById(id: Types.ObjectId) {
    if (Types.ObjectId.isValid(id) === false) {
      throw new BadRequestException("Invalid _id");
    }

    const room = await this._RoomModule_.findById(id);

    if (room === null) {
      throw new NotFoundException("Room not found");
    }

    return room;
  }

  async deleteRoomById(id: Types.ObjectId, owner: string) {
    const room = await this.findRoomById(id);

    if (room.owner !== owner) {
      throw new BadRequestException(
        "You can't delete this room because you are not the owner"
      );
    }

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
