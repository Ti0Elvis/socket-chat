import type { Model } from "mongoose";
import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { User, UserDocument } from "./user.schema";

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private _UserModel_: Model<UserDocument>
  ) {}
}
