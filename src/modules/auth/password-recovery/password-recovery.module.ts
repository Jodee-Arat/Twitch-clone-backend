import { Module } from "@nestjs/common";
import { PasswordRecoveryService } from "./password-recovery.service";
import { PasswordRecoveryResolver } from "./password-recovery.resolver";
import { TelegramService } from "../../libs/telegram/telegram.service";

@Module({
  providers: [PasswordRecoveryResolver, PasswordRecoveryService],
})
export class PasswordRecoveryModule {}
