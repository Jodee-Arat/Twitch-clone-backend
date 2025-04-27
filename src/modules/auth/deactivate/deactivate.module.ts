import { Module } from "@nestjs/common";
import { DeactivateService } from "./deactivate.service";
import { DeactivateResolver } from "./deactivate.resolver";
import { TelegramService } from "../../libs/telegram/telegram.service";

@Module({
  providers: [DeactivateResolver, DeactivateService],
})
export class DeactivateModule {}
