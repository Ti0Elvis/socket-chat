import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { RoomModule } from "./room/room.module";
import { AppController } from "./app,controller";
import { MongooseModule } from "@nestjs/mongoose";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: ".env" }),
    MongooseModule.forRoot(process.env.DB_URI as string),
    RoomModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
