import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { NotificationService } from "./notification.service";
import { Authorization } from "@/src/shared/decorators/auth.decorator";
import { Authorized } from "@/src/shared/decorators/authorized.decorator";
import { User } from "@/prisma/generated";
import { NotificationModel } from "./models/notification.model";
import { ChangeNotificationSettingsResponse } from "./models/notification-settings.model";
import { ChangeNotificationSettingsInput } from "./inputs/change-notification-settings.input";

@Resolver("Notification")
export class NotificationResolver {
  constructor(private readonly notificationService: NotificationService) {}

  @Authorization()
  @Query(() => Number, { name: "findUnreadNotificationCount" })
  async findUnreadCount(@Authorized() user: User) {
    return this.notificationService.findUnreadCount(user);
  }

  @Authorization()
  @Query(() => [NotificationModel], { name: "findByUserNotifications" })
  async findByUser(@Authorized() user: User) {
    return this.notificationService.findByUser(user);
  }

  @Authorization()
  @Mutation(() => ChangeNotificationSettingsResponse, {
    name: "changeNotificationSettings",
  })
  async changeSettings(
    @Authorized() user: User,
    @Args("data") input: ChangeNotificationSettingsInput
  ) {
    return this.notificationService.changeSettings(user, input);
  }
}
