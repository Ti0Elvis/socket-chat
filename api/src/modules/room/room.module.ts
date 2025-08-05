import { Module } from "@nestjs/common";
import { RoomService } from "./room.service";
import { RoomGateway } from "./room.gateway";
import { Room, RoomSchema } from "./room.schema";
import { MongooseModule } from "@nestjs/mongoose";
import { RoomController } from "./room.controller";
import { UserModule } from "@/modules/user/user.module";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Room.name, schema: RoomSchema }]),
    UserModule,
  ],
  controllers: [RoomController],
  providers: [RoomService, RoomGateway],
})
export class RoomModule {}
