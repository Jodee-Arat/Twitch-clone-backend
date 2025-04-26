import { Field, ObjectType } from "@nestjs/graphql";
import { UserModel } from "../../auth/account/models/user.model";
import { NotificationSettings } from "@/prisma/generated";

@ObjectType()
export class NotificationSettingsModel implements NotificationSettings {
  @Field(() => String)
  id: string;

  @Field(() => Boolean)
  telegramNotifications: boolean;

  @Field(() => Boolean)
  siteNotifications: boolean;

  @Field(() => UserModel)
  user: UserModel;

  @Field(() => String)
  userId: string;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;
}

@ObjectType()
export class ChangeNotificationSettingsResponse {
  @Field(() => NotificationSettingsModel)
  notificationSettings: NotificationSettingsModel;

  @Field(() => String, { nullable: true })
  telegramAuthToken?: string;
}
