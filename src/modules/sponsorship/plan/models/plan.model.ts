import { SponsorshipPlan } from "@/generated";
import { UserModel } from "@/src/modules/auth/account/models/user.model";
import { Field, ID, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class PlanModel implements SponsorshipPlan {
  @Field(() => ID)
  public id: string;

  @Field(() => String)
  public title: string;

  @Field(() => String, { nullable: true })
  public description: string;

  @Field(() => Number)
  public price: number;

  @Field(() => String)
  public stripeProductId: string;

  @Field(() => String)
  public stripePlanId: string;

  @Field(() => String)
  public channelId: string;

  @Field(() => UserModel)
  public channel: UserModel;

  @Field(() => Date)
  public createdAt: Date;

  @Field(() => Date)
  public updatedAt: Date;
}
