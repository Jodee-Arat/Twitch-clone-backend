import { Field, InputType } from "@nestjs/graphql";
import { IsNumber, IsOptional, IsString } from "class-validator";

@InputType()
export class FiltersInput {
  @Field(() => Number, { nullable: true })
  @IsNumber()
  @IsOptional()
  take?: number; // сколько берём

  @Field(() => Number, { nullable: true })
  @IsNumber()
  @IsOptional()
  skip?: number; // сколько пропускаем

  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  searchTerm?: string; // строка поиска
}
