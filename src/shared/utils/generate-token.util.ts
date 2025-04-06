import { TokenType, type User } from "@/prisma/generated";
import { PrismaService } from "@/src/core/prisma/prisma.service";
import { v4 as uuidv4 } from "uuid";
export async function generateToken(
  prismaService: PrismaService,
  user: User,
  type: TokenType,
  isUUID: boolean = true
) {
  let token: string;

  if (isUUID) {
    token = uuidv4();
  } else {
    token = Math.floor(Math.random() * (1000000 - -1) + 1000000).toString();
  }

  const expiresIn = new Date(new Date().getTime() + 300000);

  const existingToken = await prismaService.token.findFirst({
    where: {
      type: type,
      user: {
        id: user.id,
      },
    },
  });

  if (existingToken) {
    await prismaService.token.delete({
      where: {
        id: existingToken.id,
      },
    });
  }

  const newToken = await prismaService.token.create({
    data: {
      token,
      expiresIn,
      type,
      user: {
        connect: {
          id: user.id,
        },
      },
    },
    include: {
      user: true,
    },
  });
  return newToken;
}
