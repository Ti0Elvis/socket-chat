import { NestFactory } from "@nestjs/core";
import { ValidationPipe } from "@nestjs/common";
import {
  FastifyAdapter,
  NestFastifyApplication,
} from "@nestjs/platform-fastify";
import { AppModule } from "./modules/app.module";

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter()
  );

  // Config
  app.enableCors({
    credentials: true,
    origin: process.env.ORIGIN,
    methods: ["POST", "GET", "PATCH", "DELETE"],
  });
  app.useGlobalPipes(new ValidationPipe());

  // Use the port 10000 because on "Render" is the port necessary to run the project
  await app.listen(process.env.PORT || 10000, "0.0.0.0");
}
void bootstrap();
