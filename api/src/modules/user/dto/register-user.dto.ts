import { IsEmail, IsNotEmpty, IsString, IsUrl } from "class-validator";

export class RegisterUserDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsString()
  @IsNotEmpty()
  fullName: string;

  @IsUrl()
  imageUrl: string;

  @IsEmail()
  emailAddress: string;
}
