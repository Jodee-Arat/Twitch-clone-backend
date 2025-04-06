import { PrismaService } from "@/src/core/prisma/prisma.service";
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { MailService } from "../../libs/mail/mail.service";
import { Request } from "express";
import { ResetPasswordInput } from "./inputs/reset-password.input";
import { generateToken } from "@/src/shared/utils/generate-token.util";
import { TokenType } from "@/prisma/generated";
import { getSessionMetadata } from "@/src/shared/utils/session-metadata.util";
import { NewPasswordInput } from "./inputs/new-password.input";
import { hash } from "argon2";

@Injectable()
export class PasswordRecoveryService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly mailService: MailService
  ) {}

  async resetPassword(
    req: Request,
    input: ResetPasswordInput,
    userAgent: string
  ) {
    const { email } = input;

    const user = await this.prismaService.user.findUnique({ where: { email } });

    if (!user) {
      throw new NotFoundException("Пользователь не найден");
    }

    const resetToken = await generateToken(
      this.prismaService,
      user,
      TokenType.PASSWORD_RESET
    );

    const metadata = getSessionMetadata(req, userAgent);

    await this.mailService.sendPasswordResetToken(
      user.email,
      resetToken.token,
      metadata
    );

    return true;
  }

  async newPassword(input: NewPasswordInput) {
    const { password, token } = input;

    const existingToken = await this.prismaService.token.findUnique({
      where: {
        token,
        type: TokenType.PASSWORD_RESET,
      },
    });
    if (!existingToken) {
      throw new NotFoundException("Токен не найден");
    }

    const hasExpired = new Date(existingToken.expiresIn) < new Date();

    if (hasExpired) {
      throw new BadRequestException("Токен устарел");
    }

    await this.prismaService.user.update({
      where: {
        id: existingToken.userId,
      },
      data: {
        password: await hash(password),
      },
    });
    await this.prismaService.token.delete({
      where: {
        id: existingToken.id,
        type: TokenType.PASSWORD_RESET,
      },
    });

    return true;
  }
}
