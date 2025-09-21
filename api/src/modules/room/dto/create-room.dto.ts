import { IsNotEmpty, IsString, MaxLength } from "class-validator";

export class CreateRoomDto {
  @IsString()
  @IsNotEmpty()
  clerk_id: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  language: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(24)
  tag: string;
}
