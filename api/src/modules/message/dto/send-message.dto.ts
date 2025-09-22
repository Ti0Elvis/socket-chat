import {
  IsNotEmpty,
  IsString,
  IsMongoId,
  ValidateNested,
  Length,
} from "class-validator";
import { Types } from "mongoose";
import { Type } from "class-transformer";

class SenderDto {
  @IsString()
  @IsNotEmpty()
  clerk_id: string;

  @IsString()
  @IsNotEmpty()
  fullname: string;
}

export class SendMessageDto {
  @Length(1, 255)
  @IsString()
  @IsNotEmpty()
  content: string;

  @ValidateNested()
  @Type(() => SenderDto)
  sender: SenderDto;

  @IsMongoId()
  room_id: Types.ObjectId;
}
