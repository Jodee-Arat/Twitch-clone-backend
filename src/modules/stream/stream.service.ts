import { PrismaService } from "@/src/core/prisma/prisma.service";
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { FiltersInput } from "./inputs/filters.input";
import { User, type Prisma } from "@/prisma/generated";
import { ChangeStreamInfoInput } from "./inputs/change-stream-info.input";
import { Upload } from "graphql-upload";
import sharp from "sharp";
import { StorageService } from "../libs/storage/storage.service";
import { GenerateStreamTokenInput } from "./inputs/generate-stream-token.input";
import { ConfigService } from "@nestjs/config";
import { AccessToken } from "livekit-server-sdk";
import { identity } from "rxjs";
@Injectable()
export class StreamService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly storageService: StorageService,
    private readonly configService: ConfigService
  ) {}

  async findAll(input: FiltersInput = {}) {
    const { take, skip, searchTerm } = input;

    const whereClause = searchTerm
      ? this.findBySearchTermFilter(searchTerm)
      : undefined;

    const streams = await this.prismaService.stream.findMany({
      take: take ?? 12,
      skip: skip ?? 0,
      where: {
        user: {
          isDeactivated: false,
        },
        ...whereClause,
      },
      include: {
        user: true,
        category: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return streams;
  }

  async findRandom() {
    const total = await this.prismaService.stream.count({
      where: {
        user: {
          isDeactivated: false,
        },
      },
    });

    const randomIndexes = new Set<number>();
    while (randomIndexes.size < 4) {
      const randomIndex = Math.floor(Math.random() * total);
      randomIndexes.add(randomIndex);
    }
    const streams = await this.prismaService.stream.findMany({
      where: {
        user: {
          isDeactivated: false,
        },
      },
      include: {
        user: true,
        category: true,
      },
      skip: 0,
      take: total,
    });

    return Array.from(randomIndexes).map(index => streams[index]);
  }

  private findBySearchTermFilter(searchTerm: string): Prisma.StreamWhereInput {
    return {
      OR: [
        {
          title: {
            contains: searchTerm,
            mode: "insensitive",
          },
        },
        {
          user: {
            username: {
              contains: searchTerm,
              mode: "insensitive",
            },
          },
        },
      ],
    };
  }

  async changeInfo(user: User, input: ChangeStreamInfoInput) {
    const { title, categoryId } = input;

    await this.prismaService.stream.update({
      where: {
        userId: user.id,
      },
      data: {
        title,
        category: {
          connect: {
            id: categoryId,
          },
        },
      },
    });

    return true;
  }

  async changeThumbnail(user: User, file: Upload) {
    const stream = await this.findByUserId(user);

    if (stream.thumbnailUrl) {
      await this.storageService.remove(stream.thumbnailUrl);
    }

    const chunks: Buffer[] = [];

    for await (const chunk of file.file.createReadStream()) {
      chunks.push(chunk);
    }
    const buffer = Buffer.concat(chunks);

    const fileName = `/channels/${user.username}.webp`;

    if (file.file.filename && file.file.filename.endsWith(".gif")) {
      const processedBuffer = await sharp(buffer, { animated: true })
        .resize(1280, 720)
        .webp()
        .toBuffer();

      await this.storageService.upload(processedBuffer, fileName, "image/webp");
    } else {
      const processedBuffer = await sharp(buffer)
        .resize(1280, 720)
        .webp()
        .toBuffer();

      await this.storageService.upload(processedBuffer, fileName, "image/webp");
    }

    await this.prismaService.stream.update({
      where: { userId: user.id },
      data: { thumbnailUrl: fileName },
    });
    return true;
  }

  async removeThumbnail(user: User) {
    const stream = await this.findByUserId(user);

    if (stream.thumbnailUrl) {
      await this.storageService.remove(stream.thumbnailUrl);
      await this.prismaService.stream.update({
        where: { userId: user.id },
        data: { thumbnailUrl: null },
      });
    } else {
      return;
    }
    return true;
  }
  // берём id юзера не из бд, а из инпута, потому что у нас может быть авторизированный и не авторизированный юзер( с проверкой авторизации на фронте)
  public async generateToken(input: GenerateStreamTokenInput) {
    const { userId, channelId } = input;

    let self: { userId: string; username: string };

    const user = await this.prismaService.user.findUnique({
      where: {
        id: userId,
      },
    });
    const u = await this.prismaService.user.findMany();
    console.log(userId, u);

    if (user) {
      self = {
        userId: user.id,
        username: user.username,
      };
    } else {
      self = {
        userId,
        username: `Зритель ${Math.floor(Math.random() * 100000)}`,
      };
    }

    const channel = await this.prismaService.stream.findUnique({
      where: {
        id: channelId,
      },
    });

    if (!channel) {
      throw new NotFoundException("Канал не найден");
    }

    const isHost = self.userId === channelId;

    const token = new AccessToken(
      this.configService.getOrThrow<string>("LIVEKIT_API_URL"),
      this.configService.getOrThrow<string>("LIVEKIT_API_KEY"),
      {
        identity: isHost ? `host-${self.userId}` : self.userId.toString(),
        name: self.username,
      }
    );

    token.addGrant({
      room: channelId,
      roomJoin: true,
      canPublish: false,
    });

    return { token: token.toJwt() };
  }

  private async findByUserId(user: User) {
    const stream = await this.prismaService.stream.findUnique({
      where: {
        userId: user.id,
      },
    });
    if (!stream) {
      throw new BadRequestException("Стрим не найден");
    }
    return stream;
  }
}
