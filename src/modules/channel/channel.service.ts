import { PrismaService } from "@/src/core/prisma/prisma.service";
import { Injectable, NotFoundException } from "@nestjs/common";

@Injectable()
export class ChannelService {
  constructor(private readonly prismaService: PrismaService) {}

  async findRecommendedChannels() {
    const channels = await this.prismaService.user.findMany({
      where: {
        isDeactivated: false,
      },
      orderBy: {
        following: {
          _count: "desc",
        },
      },
      include: {
        streams: true,
      },
      take: 7,
    });

    return channels;
  }

  async findByUsername(username: string) {
    const channel = await this.prismaService.user.findUnique({
      where: {
        isDeactivated: false,
        username,
      },
      include: {
        socialLinks: {
          orderBy: {
            position: "asc",
          },
        },
        streams: {
          include: {
            category: true,
          },
        },
        following: true,
      },
    });

    if (!channel) {
      throw new NotFoundException("Канал не найден");
    }

    return channel;
  }

  async findFollowersCountByChannel(channelId: string) {
    const channel = await this.prismaService.user.findUnique({
      where: {
        id: channelId,
      },
    });
    if (!channel) {
      throw new NotFoundException("Канал не найден");
    }

    const followersCount = await this.prismaService.follow.count({
      where: {
        followingId: channelId,
      },
    });

    return followersCount;
  }

  async findSponsorsByChannel(channelId: string) {
    const channel = await this.prismaService.user.findUnique({
      where: {
        id: channelId,
        isDeactivated: false,
      },
    });

    if (!channel) {
      throw new NotFoundException("Канал не найден");
    }
    const sponsors = await this.prismaService.sponsorshipSubscription.findMany({
      where: {
        channelId: channel.id,
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        plan: true,
        user: true,
        channel: true,
      },
    });
    return sponsors;
  }
}
