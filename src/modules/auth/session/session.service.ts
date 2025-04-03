import { PrismaService } from "@/src/core/prisma/prisma.service";
import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { LoginInput } from "./inputs/login.input";
import { verify } from "argon2";
import { type Request } from "express";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class SessionService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly configService: ConfigService
  ) {}

  async login(req: Request, input: LoginInput) {
    const { login, password } = input;
    const user = await this.prismaService.user.findFirst({
      where: {
        OR: [{ username: { equals: login } }, { email: { equals: login } }],
      },
    });
    if (!user) {
      throw new NotFoundException("Пользователь не найден");
    }

    const isValidPassword = await verify(user.password, password);
    if (!isValidPassword) {
      throw new UnauthorizedException("Неверный пароль");
    }

    return new Promise((resolve, reject) => {
      req.session.createdAt = new Date();
      req.session.userId = user.id;

      req.session.save((err) => {
        if (err) {
          return reject(
            new InternalServerErrorException("Не удалось сохранить сессию")
          );
        }
        resolve(user);
      });
    });
  }

  async logout(req: Request) {
    return new Promise((resolve, reject) => {
      req.session.destroy((err) => {
        if (err) {
          return reject(
            new InternalServerErrorException("Не удалось завершить сессию")
          );
        }
        req.res.clearCookie(
          this.configService.getOrThrow<string>("SESSION_NAME")
        );
        resolve(true);
      });
    });
  }
}
