import { MailerService } from "@nestjs-modules/mailer";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { render } from "@react-email/components";
import { VerificationTemplate } from "./templates/verification.template";
import { PasswordRecoveryTemplate } from "./templates/passowrd-recovery.template";
import { type SessionMetadata } from "@/src/shared/types/session-metadata.types";

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

  private sendMail(email: string, subject: string, html: string) {
    return this.mailerService.sendMail({
      to: email,
      subject,
      html,
    });
  }
}
