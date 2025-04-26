import { Field, InputType } from "@nestjs/graphql";
import { IsNotEmpty, IsString, IsUUID } from "class-validator";

@InputType()
export class SendMessageInput {
  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  text: string;

  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  @IsUUID(4)
  streamId: string;
}
