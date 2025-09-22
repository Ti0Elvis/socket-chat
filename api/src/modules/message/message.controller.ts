import { Controller } from "@nestjs/common";
import { MessageService } from "./message.service";

@Controller("message")
export class MessageController {
  constructor(private readonly _MessageService_: MessageService) {}
}
