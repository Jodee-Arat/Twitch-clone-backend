import { SocialLink, type User } from "@/prisma/generated";
import { Field, ID, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class SocialLinkModel implements SocialLink {
  @Field(() => ID)
  public id: string;

  @Field(() => String)
  public userId: string;

  @Field(() => String)
  public title: string;

  @Field(() => String)
  public url: string;

  @Field(() => Number)
  public position: number;

  @Field(() => Date)
  public createdAt: Date;

  @Field(() => Date)
  public updatedAt: Date;
}
