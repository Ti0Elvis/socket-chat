import type { HydratedDocument } from "mongoose";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop({ type: String, required: true, unique: true })
  clerk_id: string;

  @Prop({ type: String, required: true })
  first_name: string;

  @Prop({ type: String, required: true })
  last_name: string;

  @Prop({ type: String, required: true })
  full_name: string;

  @Prop({ type: String, required: true })
  image_url: string;

  @Prop({ type: String, required: true })
  email_address: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
