import { Notification, NotificationType } from "@/prisma/generated";
import { Field, ObjectType, registerEnumType } from "@nestjs/graphql";

registerEnumType(NotificationType, { name: "NotificationType" });

@ObjectType()
export class NotificationModel implements Notification {
  @Field(() => String)
  id: string;

  @Field(() => String)
  message: string;

  @Field(() => NotificationType)
  type: NotificationType;

  @Field(() => String, { nullable: true })
  userId: string;

  @Field(() => Boolean)
  isRead: boolean;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;
}
