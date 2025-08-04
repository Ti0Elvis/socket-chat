import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { RoomModule } from "./room/room.module";
import { UserModule } from "./user/user.module";
import { AppController } from "./app.controller";
import { MongooseModule } from "@nestjs/mongoose";

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: ".env", isGlobal: true }),
    MongooseModule.forRoot(process.env.DB_URI!),
    UserModule,
    RoomModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
