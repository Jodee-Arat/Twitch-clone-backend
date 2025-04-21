import { PrismaService } from "@/src/core/prisma/prisma.service";
import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { CreateUserInput } from "./inputs/create-user.input";
import { hash, verify } from "argon2";
import { VerificationService } from "../verification/verification.service";
import { type User } from "@/prisma/generated";
import { ChangeEmailInput } from "./inputs/change-email.input";
import { ChangePasswordInput } from "./inputs/change-passwors.input";

@Injectable()
export class AccountService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly verificationService: VerificationService
  ) {}

  async me(id: string) {
    const user = await this.prismaService.user.findUnique({
      where: { id },
      include: {
        socialLinks: true,
      },
    });

    return user;
  }
  async create(input: CreateUserInput) {
    const { username, email, password } = input;

    const isUsernameExists = await this.prismaService.user.findUnique({
      where: {
        username,
      },
    });

    if (isUsernameExists) {
      throw new ConflictException("Это имя пользователя уже занято");
    }

    const isEmailExists = await this.prismaService.user.findUnique({
      where: {
        email,
      },
    });

    if (isEmailExists) {
      throw new ConflictException("Эта почта уже занята");
    }

    const user = await this.prismaService.user.create({
      data: {
        username,
        email,
        password: await hash(password),
        displayName: username,
      },
    });

    await this.verificationService.sendVerificationToken(user);
    return true;
  }

  async changeEmail(user: User, input: ChangeEmailInput) {
    const { email } = input;

    const isEmailExists = await this.prismaService.user.findUnique({
      where: {
        email,
      },
    });

    if (isEmailExists) {
      throw new ConflictException("Эта почта уже занята");
    }

    await this.prismaService.user.update({
      where: { id: user.id },
      data: {
        email,
        isVerified: false,
      },
    });

    await this.verificationService.sendVerificationToken(user);
    return true;
  }

  async changePassword(user: User, input: ChangePasswordInput) {
    const { oldPassword, newPassword } = input;
    const isValidPassword = await verify(user.password, oldPassword);

    if (!isValidPassword) {
      throw new UnauthorizedException("Неверный пароль");
    }

    await this.prismaService.user.update({
      where: { id: user.id },
      data: {
        password: await hash(newPassword),
      },
    });
    return true;
  }
}
