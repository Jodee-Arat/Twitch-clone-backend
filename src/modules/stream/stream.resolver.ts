import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { StreamService } from "./stream.service";
import { StreamModel } from "./models/stream.model";
import { FiltersInput } from "./inputs/filters.input";
import { Authorized } from "@/src/shared/decorators/authorized.decorator";
import { User } from "@/prisma/generated";
import { ChangeStreamInfoInput } from "./inputs/change-stream-info.input";
import { Authorization } from "@/src/shared/decorators/auth.decorator";
import { Upload } from "graphql-upload";
import { GraphQLUpload } from "graphql-upload";
import { FileValidationPipe } from "@/src/shared/pipes/file-validation.pipe";
import { GenerateStreamTokenModel } from "./models/generate-token.model";
import { GenerateStreamTokenInput } from "./inputs/generate-stream-token.input";
@Resolver("Stream")
export class StreamResolver {
  constructor(private readonly streamService: StreamService) {}

  @Query(() => [StreamModel], { name: "findAllStreams" })
  async findAll(@Args("filters") input: FiltersInput) {
    return this.streamService.findAll(input);
  }
  @Query(() => [StreamModel], { name: "findRandomStreams" })
  async findRandom() {
    return this.streamService.findRandom();
  }

  @Authorization()
  @Mutation(() => Boolean, { name: "changeInfoStream" })
  async changeInfo(
    @Authorized() user: User,
    @Args("data") input: ChangeStreamInfoInput
  ) {
    return this.streamService.changeInfo(user, input);
  }
  @Authorization()
  @Mutation(() => Boolean, { name: "changeThumbnailStream" })
  async changeThumbnail(
    @Authorized() user: User,
    @Args("thumbnail", { type: () => GraphQLUpload }, FileValidationPipe)
    thumbnail: Upload
  ) {
    return this.streamService.changeInfo(user, thumbnail);
  }

  @Authorization()
  @Mutation(() => Boolean, { name: "removeThumbnailStream" })
  async removeThumbnail(@Authorized() user: User) {
    return this.streamService.removeThumbnail(user);
  }

  @Mutation(() => GenerateStreamTokenModel, { name: "generateStreamToken" })
  async generateToken(@Args("data") input: GenerateStreamTokenInput) {
    return this.streamService.generateToken(input);
  }
}
