import type { HydratedDocument } from "mongoose";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

export type UserDocument = HydratedDocument<User>;

@Schema({ _id: false })
export class Clerk {
  @Prop({ required: true, unique: true })
  id: string;

  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ required: true })
  fullName: string;

  @Prop({ required: true })
  imageUrl: string;

  @Prop({ required: true })
  emailAddress: string;
}

export const ClerkSchema = SchemaFactory.createForClass(Clerk);

@Schema()
export class User {
  @Prop({ type: ClerkSchema, required: true })
  clerk: Clerk;
}

export const UserSchema = SchemaFactory.createForClass(User);
