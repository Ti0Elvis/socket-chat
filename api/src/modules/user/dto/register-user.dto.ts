import { IsEmail, IsNotEmpty, IsString, IsUrl } from "class-validator";

export class RegisterUserDto {
  @IsString()
  @IsNotEmpty()
  clerk_id: string;

  @IsString()
  @IsNotEmpty()
  first_name: string;

  @IsString()
  @IsNotEmpty()
  last_name: string;

  @IsString()
  @IsNotEmpty()
  full_name: string;

  @IsUrl()
  image_url: string;

  @IsEmail()
  email_address: string;
}
