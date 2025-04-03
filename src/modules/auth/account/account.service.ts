import { PrismaService } from "@/src/core/prisma/prisma.service";
import { ConflictException, Injectable } from "@nestjs/common";
import { CreateUserInput } from "./inputs/create-user.input";
import { hash } from "argon2";

@Injectable()
export class AccountService {
  constructor(private readonly prismaService: PrismaService) {}

  async me(id: string) {
    const user = await this.prismaService.user.findUnique({
      where: { id },
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

    await this.prismaService.user.create({
      data: {
        username,
        email,
        password: await hash(password),
        displayName: username,
      },
    });
    return true;
  }
}
