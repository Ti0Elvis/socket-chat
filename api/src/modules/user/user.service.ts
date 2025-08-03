import type { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { User, UserDocument } from "./user.schema";
import { RegisterUserDto } from "./dto/register-user.dto";
import { HttpException, Injectable } from "@nestjs/common";

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private _UserModel_: Model<UserDocument>
  ) {}

  async FindByClerkId(id: string) {
    const user = await this._UserModel_.findOne({ "clerk.id": id });

    if (user === null) {
      throw new HttpException("User not found", 404);
    }

    return user;
  }

  async RegisterIfNotExists(body: RegisterUserDto) {
    // We don't use the FindByClerkId method because it throws an error when the user is not found.
    // In this method, we want to silently handle non-existing users without throwing an error.
    const existingUser = await this._UserModel_.findOne({
      "clerk.id": body.id,
    });

    if (existingUser !== null) {
      return "User is already registered";
    }

    try {
      const payload: User = { clerk: { ...body } };

      await this._UserModel_.create(payload);

      return "User created successfully";
    } catch (error) {
      console.error(error);
      throw new HttpException("Error occurred while creating user", 500);
    }
  }

  async Delete(id: string) {
    const user = await this.FindByClerkId(id);

    try {
      await user.deleteOne();

      return "User deleted successfully";
    } catch (error) {
      console.error(error);
      throw new HttpException("Error occurred while deleting user", 500);
    }
  }
}
