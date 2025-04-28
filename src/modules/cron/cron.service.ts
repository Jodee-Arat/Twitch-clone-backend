import { PrismaService } from "@/src/core/prisma/prisma.service";
import { Injectable } from "@nestjs/common";
import { MailService } from "../libs/mail/mail.service";
import { Cron, CronExpression } from "@nestjs/schedule";
import { StorageService } from "../libs/storage/storage.service";
import { TelegramService } from "../libs/telegram/telegram.service";
import { NotificationService } from "../notification/notification.service";

@Injectable()
export class CronService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly mailService: MailService,
    private readonly storageService: StorageService,
    private readonly telegramService: TelegramService,
    private readonly notificationService: NotificationService
  ) {}

  // @Cron("*/10 * * * * *")
  @Cron(CronExpression.EVERY_DAY_AT_1AM)
  async deleteDeactivatedAccounts() {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    // sevenDaysAgo.setSeconds(sevenDaysAgo.getSeconds() - 5);
    const deactivatedAccounts = await this.prismaService.user.findMany({
      where: {
        isDeactivated: true,
        deactivatedAt: {
          lte: sevenDaysAgo,
        },
      },
      include: {
        notificationSettings: true,
        streams: true,
      },
    });
    for (const user of deactivatedAccounts) {
      await this.mailService.sendAccountDeletion(user.email);

      if (user.notificationSettings.telegramNotifications && user.telegramId) {
        await this.telegramService.sendAccountDeletion(user.telegramId);
      }

      if (user.avatar) {
        this.storageService.remove(user.avatar);
      }
      if (user.streams.thumbnailUrl) {
        this.storageService.remove(user.streams.thumbnailUrl);
      }
    }

    await this.prismaService.user.deleteMany({
      where: {
        isDeactivated: true,
        deactivatedAt: {
          lte: sevenDaysAgo,
        },
      },
    });
  }

  @Cron("0 0 */4 * *")
  async notifyUserEnableTwoFactor() {
    const users = await this.prismaService.user.findMany({
      where: {
        isDeactivated: false,
        isTotpEnabled: false,
      },
      include: {
        notificationSettings: true,
      },
    });

    for (const user of users) {
      await this.mailService.sendEnableTwoFactor(user.email);

      if (user.notificationSettings.siteNotifications) {
        await this.notificationService.createEnableTwoFactor(user.id);
      }

      if (user.notificationSettings.telegramNotifications && user.telegramId) {
        await this.telegramService.sendEnableTwoFactor(user.telegramId);
      }
    }
  }
  @Cron(CronExpression.EVERY_DAY_AT_1AM)
  async verifyChannels() {
    const users = await this.prismaService.user.findMany({
      include: {
        notificationSettings: true,
      },
    });
    for (const user of users) {
      const followersCount = await this.prismaService.follow.count({
        where: {
          followingId: user.id,
        },
      });

      if (followersCount > 10 && !user.isVerified) {
        await this.prismaService.user.update({
          where: {
            id: user.id,
          },
          data: {
            isVerified: true,
          },
        });

        await this.mailService.sendVerifyChannel(user.email);

        if (user.notificationSettings.siteNotifications) {
          await this.notificationService.createVerifyChannel(user.id);
        }

        if (
          user.notificationSettings.telegramNotifications &&
          user.telegramId
        ) {
          await this.telegramService.sendVerifyChannel(user.telegramId);
        }
      }
    }
  }

  @Cron(CronExpression.EVERY_DAY_AT_1AM)
  async deleteAllNotifications() {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    await this.prismaService.notification.deleteMany({
      where: {
        createdAt: {
          lte: sevenDaysAgo,
        },
      },
    });
  }
}
