import { Controller, Get } from "@nestjs/common";

@Controller("/")
export class AppController {
  constructor() {}

  @Get("/")
  HealthCheck() {
    return true;
  }
}
