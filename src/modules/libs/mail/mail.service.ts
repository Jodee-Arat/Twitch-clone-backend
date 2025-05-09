import { MailerService } from "@nestjs-modules/mailer";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { render } from "@react-email/components";
import { VerificationTemplate } from "./templates/verification.template";
import { PasswordRecoveryTemplate } from "./templates/passowrd-recovery.template";
import { type SessionMetadata } from "@/src/shared/types/session-metadata.types";
import { DeactivateTemplate } from "./templates/deactivate.template";
import { AccountDeletionTemplate } from "./templates/account-deletion.template";
import { EnableTwoFactorTemplate } from "./templates/enable-two-factor.template";
import { VerifyChannelTemplate } from "./templates/verify-channel.template";

@Injectable()
export class MailService {
  constructor(
    private readonly configService: ConfigService,
    private readonly mailerService: MailerService
  ) {}

  async sendVerificationToken(email: string, token: string) {
    const domain = this.configService.getOrThrow<string>("ALLOWED_ORIGIN");
    const html = await render(VerificationTemplate({ domain, token }));

    return this.sendMail(email, "Верификация аккаунта", html);
  }
  async sendPasswordResetToken(
    email: string,
    token: string,
    metadata: SessionMetadata
  ) {
    const domain = this.configService.getOrThrow<string>("ALLOWED_ORIGIN");
    const html = await render(
      PasswordRecoveryTemplate({ domain, token, metadata })
    );

    return this.sendMail(email, "Сброс пароля", html);
  }

  async sendDeactivateToken(
    email: string,
    token: string,
    metadata: SessionMetadata
  ) {
    const html = await render(DeactivateTemplate({ token, metadata }));

    return this.sendMail(email, "Деактивация аккаунта", html);
  }

  private sendMail(email: string, subject: string, html: string) {
    return this.mailerService.sendMail({
      to: email,
      subject,
      html,
    });
  }

  async sendAccountDeletion(email: string) {
    const html = await render(AccountDeletionTemplate());

    return this.sendMail(email, "Аккаунт удалён", html);
  }

  async sendEnableTwoFactor(email: string) {
    const domain = this.configService.getOrThrow<string>("ALLOWED_ORIGIN");
    const html = await render(EnableTwoFactorTemplate({ domain }));

    return this.sendMail(email, "Обеспечьте свою безопасность", html);
  }

  async sendVerifyChannel(email: string) {
    const html = await render(VerifyChannelTemplate());

    return this.sendMail(email, "Ваш канал верифицирован", html);
  }
}
