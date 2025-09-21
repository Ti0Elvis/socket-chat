import { HydratedDocument } from "mongoose";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

export type RoomDocument = HydratedDocument<Room>;

@Schema({ timestamps: true })
export class Room {
  @Prop({ type: String, unique: true, required: true })
  name: string;

  @Prop({ type: String, required: true })
  language: string;

  @Prop({ type: String, required: true })
  owner: string;

  @Prop({ type: String, required: true, maxlength: 24 })
  tag: string;
}

export const RoomSchema = SchemaFactory.createForClass(Room);
