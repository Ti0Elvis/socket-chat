import type { Types } from "mongoose";
import { IsMongoId, IsNotEmpty, IsString } from "class-validator";

export class LeaveRoom {
  @IsString()
  @IsNotEmpty()
  user_id: string;

  @IsMongoId()
  room_id: Types.ObjectId;
}
