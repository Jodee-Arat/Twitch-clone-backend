import { Stream, type User } from "@/prisma/generated";
import { Field, ID, ObjectType } from "@nestjs/graphql";
import { UserModel } from "../../auth/account/models/user.model";
import { CategoryModel } from "../../category/models/category.model";
import { ChatMessageModel } from "../../chat/models/chat-message.model";

@ObjectType()
export class StreamModel implements Stream {
  @Field(() => ID)
  public id: string;

  @Field(() => String)
  public title: string;

  @Field(() => String, { nullable: true })
  public thumbnailUrl: string;

  @Field(() => String, { nullable: true })
  public ingressId: string;

  @Field(() => Boolean)
  public isChatEnabled: boolean;

  @Field(() => Boolean)
  public isChatFollowersOnly: boolean;

  @Field(() => Boolean)
  public isChatPremiumFollowersOnly: boolean;

  @Field(() => [ChatMessageModel])
  public chatMessages: ChatMessageModel[];

  @Field(() => String, { nullable: true })
  public serverUrl: string;

  @Field(() => String, { nullable: true })
  public streamKey: string;

  @Field(() => Boolean)
  public isLive: boolean;

  @Field(() => UserModel)
  public user: UserModel;

  @Field(() => String)
  public userId: string;

  @Field(() => CategoryModel)
  public category: CategoryModel;

  @Field(() => String)
  categoryId: string;

  @Field(() => Date)
  public createdAt: Date;

  @Field(() => Date)
  public updatedAt: Date;
}
