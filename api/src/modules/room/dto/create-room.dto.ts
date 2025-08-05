import { IsNotEmpty, IsString, MaxLength } from "class-validator";

export class CreateRoomDto {
  @IsString()
  @IsNotEmpty()
  user_id: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  language: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(12)
  tag: string;
}
