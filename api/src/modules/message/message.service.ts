import type { Model } from "mongoose";
import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Message, MessageDocument } from "./message.schema";

@Injectable()
export class MessageService {
  constructor(
    @InjectModel(Message.name) private _MessageModule_: Model<MessageDocument>
  ) {}
}
