import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common";
import type { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { User, type UserDocument } from "./user.schema";
import { RegisterUserDto } from "./dto/register-user.dto";

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private _UserModel_: Model<UserDocument>
  ) {}

  async FindByClerkId(clerk_id: string) {
    const user = await this._UserModel_.findOne({ clerk_id });

    if (user === null) {
      throw new NotFoundException("User not found");
    }

    return user;
  }

  async IsRegistered(clerk_id: string) {
    return !!(await this.FindByClerkId(clerk_id));
  }

  async Register(body: RegisterUserDto) {
    // We don't use the FindByClerkId method because it throws an error when the user is not found.
    // In this method, we want to silently handle non-existing users without throwing an error.
    const existingUser = await this._UserModel_.findOne({
      clerk_id: body.clerk_id,
    });

    if (existingUser !== null) {
      return "User is already registered";
    }

    try {
      await this._UserModel_.create(body);

      return "User created successfully";
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(
        "Error occurred while creating user"
      );
    }
  }

  async DeleteByClerkId(clerk_id: string) {
    const user = await this.FindByClerkId(clerk_id);

    try {
      await user.deleteOne();

      return "User deleted successfully";
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(
        "Error occurred while deleting user"
      );
    }
  }
}
