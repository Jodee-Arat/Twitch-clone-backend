import {
  $Enums,
  SponsorshipSubscription,
  Transaction,
  TransactionStatus,
} from "@/generated";
import { UserModel } from "@/src/modules/auth/account/models/user.model";
import { Field, ID, ObjectType, registerEnumType } from "@nestjs/graphql";
import { PlanModel } from "../../plan/models/plan.model";

registerEnumType(TransactionStatus, {
  name: "TransactionStatus",
});

@ObjectType()
export class SubscriptionModel implements SponsorshipSubscription {
  @Field(() => ID)
  public id: string;

  @Field(() => Date)
  public expiresAt: Date;

  @Field(() => String)
  public userId: string;

  @Field(() => UserModel)
  public user: UserModel;

  @Field(() => String)
  public planId: string;

  @Field(() => PlanModel)
  public plan: PlanModel;

  @Field(() => String)
  public channelId: string;

  @Field(() => UserModel)
  public channel: UserModel;

  @Field(() => Date)
  public createdAt: Date;

  @Field(() => Date)
  public updatedAt: Date;
}
