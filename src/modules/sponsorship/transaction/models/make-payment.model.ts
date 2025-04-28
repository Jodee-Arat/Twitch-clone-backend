import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class makePaymentModel {
  @Field(() => String)
  public url: string;
}
