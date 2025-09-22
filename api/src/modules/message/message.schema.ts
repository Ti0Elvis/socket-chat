import { Room } from "../room/room.schema";
import { HydratedDocument, Types } from "mongoose";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

export type MessageDocument = HydratedDocument<Message>;

@Schema({ timestamps: true })
export class Message {
  @Prop({ type: String, required: true, minlength: 1, maxlength: 255 })
  content: string;

  @Prop({ type: Object, required: true })
  sender: {
    clerk_id: string;
    fullname: string;
  };

  @Prop({ type: Types.ObjectId, required: true, ref: Room.name })
  room_id: Types.ObjectId;

  @Prop({ type: Boolean, default: false })
  is_deleted: boolean;
}

export const MessageSchema = SchemaFactory.createForClass(Message);
