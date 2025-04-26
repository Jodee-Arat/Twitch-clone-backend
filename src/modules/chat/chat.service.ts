import { PrismaService } from "@/src/core/prisma/prisma.service";
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { SendMessageInput } from "./inputs/send-message.input";
import { ChangeChatSettingsInput } from "./inputs/change-chat-settings.input";
import { User } from "@/prisma/generated";

@Injectable()
export class ChatService {
  constructor(private readonly prismaService: PrismaService) {}

  async findMessagesByStreamId(streamId: string) {
    const messages = await this.prismaService.chatMessage.findMany({
      where: {
        streamId,
      },
      include: {
        user: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return messages;
  }

  async sendMessage(userId: string, input: SendMessageInput) {
    const { text, streamId } = input;

    const stream = await this.prismaService.stream.findUnique({
      where: {
        id: streamId,
      },
    });
    if (!stream) {
      throw new NotFoundException("Стрим не найден");
    }

    // if (!stream.isLive){
    // 	throw new BadRequestException('Стрим не в эфире')
    // }
    // Я ДУМАЮ ЭТО НЕ ОЧЕНЬ КРУТО, ВЕДЬ НА ТВИЧЕ МОЖНО ВСЕГДА БЫТЬ В ЧАТЕ

    const message = await this.prismaService.chatMessage.create({
      data: {
        text,
        user: {
          connect: {
            id: userId,
          },
        },
        stream: {
          connect: {
            id: stream.id,
          },
        },
      },
      include: {
        stream: true,
        user: true,
      },
    });
    return message;
  }

  async changeSettings(user: User, input: ChangeChatSettingsInput) {
    const { isChatEnabled, isChatFollowersOnly, isChatPremiumFollowersOnly } =
      input;

    const stream = await this.prismaService.stream.findUnique({
      where: {
        userId: user.id,
      },
    });

    if (!stream) {
      throw new NotFoundException("Стрим не найден");
    }

    await this.prismaService.stream.update({
      where: {
        userId: user.id,
      },
      data: {
        isChatEnabled,
        isChatFollowersOnly,
        isChatPremiumFollowersOnly,
      },
    });
    return true;
  }
}
