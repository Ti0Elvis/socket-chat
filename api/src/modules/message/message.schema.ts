import { Room } from "../room/room.schema";
import { HydratedDocument, Types } from "mongoose";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

export type MessageDocument = HydratedDocument<Message>;

@Schema({ timestamps: true })
export class Message {
  @Prop({ type: String, required: true, minlength: 5, maxlength: 255 })
  content: string;

  @Prop({ type: Object, required: true })
  sender: {
    img_url: string;
    clerk_id: string;
    fullname: string;
  };

  @Prop({ type: Types.ObjectId, required: true, ref: Room.name })
  room_id: Types.ObjectId;
}

export const MessageSchema = SchemaFactory.createForClass(Message);
