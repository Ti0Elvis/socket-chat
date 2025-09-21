import { NestFactory } from "@nestjs/core";
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

  // Use the port 10000 because on "Render" is the port necessary to run the project
  await app.listen(process.env.PORT || 10000, "0.0.0.0");
}
void bootstrap();
