import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { ProfileService } from "./profile.service";
import { Authorized } from "@/src/shared/decorators/authorized.decorator";
import { User } from "@/prisma/generated";
import { GraphQLUpload, Upload } from "graphql-upload";
import { Authorization } from "@/src/shared/decorators/auth.decorator";
import { FileValidationPipe } from "@/src/shared/pipes/file-validation.pipe";
import { ChangeProfileInfoInput } from "./inputs/change-profile-info.input";
import {
  SocialLinkInput,
  SocialLinkOrderInput,
} from "./inputs/social-link.input";
import { SocialLinkModel } from "./models/social-link.model";

@Resolver("Profile")
export class ProfileResolver {
  constructor(private readonly profileService: ProfileService) {}

  @Mutation(() => Boolean, { name: "changeProfileAvatar" })
  @Authorization()
  async changeAvatar(
    @Authorized() user: User,
    // здесь возможно не работает из-за graphqluploadExpress потому что название не такое как на видео, если работать не будет попробовать сделать как он на 5:28:34 (1видео)
    @Args("avatar", { type: () => GraphQLUpload }, FileValidationPipe)
    avatar: Upload
  ) {
    return this.profileService.changeAvatar(user, avatar);
  }

  @Mutation(() => Boolean, { name: "removeProfileAvatar" })
  @Authorization()
  async removeAvatar(@Authorized() user: User) {
    return this.profileService.removeAvatar(user);
  }

  @Mutation(() => Boolean, { name: "changeProfileInfo" })
  @Authorization()
  async changeInfo(
    @Authorized() user: User,
    @Args("data") input: ChangeProfileInfoInput
  ) {
    return this.profileService.changeInfo(user, input);
  }

  @Authorization()
  @Mutation(() => Boolean, { name: "createSocialLink" })
  async createSocialLink(
    @Authorized() user: User,
    @Args("data") input: SocialLinkInput
  ) {
    return this.profileService.createSocialLink(user, input);
  }

  @Authorization()
  @Mutation(() => Boolean, { name: "reorderSocialLink" })
  async reorderSocialLink(
    @Args("list", { type: () => [SocialLinkOrderInput] })
    list: SocialLinkOrderInput[]
  ) {
    return this.profileService.reorderSocialLinks(list);
  }

  @Authorization()
  @Mutation(() => Boolean, { name: "updateSocialLink" })
  async updateSocialLink(
    @Args("id") id: string,
    @Args("data") input: SocialLinkInput
  ) {
    return this.profileService.updateSocialLink(id, input);
  }

  @Authorization()
  @Mutation(() => Boolean, { name: "removeSocialLink" })
  async removeSocialLink(@Args("id") id: string) {
    return this.profileService.removeSocialLink(id);
  }

  @Authorization()
  @Query(() => [SocialLinkModel], { name: "findSocialLinks" })
  async findSocialLinks(@Authorized() user: User) {
    return this.profileService.findSocialLinks(user);
  }
}
