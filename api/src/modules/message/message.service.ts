import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from "@nestjs/common";
import { Model, Types } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { SendMessageDto } from "./dto/send-message.dto";
import { Message, MessageDocument } from "./message.schema";

@Injectable()
export class MessageService {
  constructor(
    @InjectModel(Message.name) private _MessageModule_: Model<MessageDocument>
  ) {}

  async sendMessage(body: SendMessageDto) {
    try {
      const payload: Message = {
        ...body,
        is_deleted: false,
      };

      const message = await this._MessageModule_.create(payload);

      return message;
    } catch (error) {
      console.error("Error sending message:", error);
      throw new InternalServerErrorException("Error sending message");
    }
  }

  async findAllByRoom(room_id: Types.ObjectId) {
    try {
      if (Types.ObjectId.isValid(room_id) === false) {
        throw new BadRequestException("Invalid room ID");
      }

      const messages = await this._MessageModule_.find({ room_id }).exec();

      return messages;
    } catch (error) {
      console.error("Error retrieving messages:", error);
      throw new InternalServerErrorException("Error retrieving messages");
    }
  }
}
