import { type User } from "@/prisma/generated";
import { Field, ID, ObjectType } from "@nestjs/graphql";
import { SocialLinkModel } from "../../profile/models/social-link.model";
import { StreamModel } from "@/src/modules/stream/models/stream.model";
import { ChatMessageModel } from "@/src/modules/chat/models/chat-message.model";
import { FollowModel } from "@/src/modules/follow/models/follow.model";
import { NotificationSettingsModel } from "@/src/modules/notification/models/notification-settings.model";
import { NotificationModel } from "@/src/modules/notification/models/notification.model";

@ObjectType()
export class UserModel implements User {
  @Field(() => ID)
  public id: string;

  @Field(() => String)
  public email: string;

  @Field(() => String)
  public password: string;

  @Field(() => String)
  public username: string;

  @Field(() => String)
  public displayName: string;

  @Field(() => String, { nullable: true })
  public avatar: string;

  @Field(() => String, { nullable: true })
  public bio: string;

  @Field(() => String, { nullable: true })
  public telegramId: string;

  @Field(() => Boolean)
  public isEmailVerified: boolean;

  @Field(() => Boolean)
  public isVerified: boolean;

  @Field(() => Boolean)
  public isTotpEnabled: boolean;

  @Field(() => String, { nullable: true })
  public totpSecret: string;

  @Field(() => Boolean)
  public isDeactivated: boolean;

  @Field(() => Date, { nullable: true })
  public deactivatedAt: Date;

  @Field(() => StreamModel)
  streams: StreamModel;

  @Field(() => [NotificationModel])
  notifications: NotificationModel[];

  @Field(() => NotificationSettingsModel)
  notificationSettings: NotificationSettingsModel;
  // возможно будут ошибки связанные с nullable(было до этого тру)
  @Field(() => [SocialLinkModel])
  socialLinks: SocialLinkModel[];

  @Field(() => [FollowModel])
  followers: FollowModel[];

  @Field(() => [FollowModel])
  following: FollowModel[];

  @Field(() => [ChatMessageModel])
  chatMessages: ChatMessageModel[];

  @Field(() => Date)
  public createdAt: Date;

  @Field(() => Date)
  public updatedAt: Date;
}
