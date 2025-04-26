import { Category, ChatMessage } from "@/prisma/generated";
import { Field, ID, ObjectType } from "@nestjs/graphql";
import { StreamModel } from "../../stream/models/stream.model";
import { UserModel } from "../../auth/account/models/user.model";

@ObjectType()
export class ChatMessageModel implements ChatMessage {
  @Field(() => ID)
  public id: string;

  @Field(() => String)
  public text: string;

  @Field(() => StreamModel)
  public stream: StreamModel;

  @Field(() => String)
  public streamId: string;

  @Field(() => UserModel)
  public user: UserModel;

  @Field(() => String)
  public userId: string;

  @Field(() => Date)
  public createdAt: Date;

  @Field(() => Date)
  public updatedAt: Date;
}
