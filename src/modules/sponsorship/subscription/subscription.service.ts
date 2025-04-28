import { User } from "@/generated";
import { PrismaService } from "@/src/core/prisma/prisma.service";
import { Injectable } from "@nestjs/common";
import { channel } from "diagnostics_channel";

@Injectable()
export class SubscriptionService {
  constructor(private readonly prismaService: PrismaService) {}

  async findMySponsors(user: User) {
    const sponsors = await this.prismaService.sponsorshipSubscription.findMany({
      where: {
        channelId: user.id,
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
