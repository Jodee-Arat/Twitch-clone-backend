import { Args, Query, Resolver } from "@nestjs/graphql";
import { ChannelService } from "./channel.service";
import { UserModel } from "../auth/account/models/user.model";

@Resolver("Channel")
export class ChannelResolver {
  constructor(private readonly channelService: ChannelService) {}

  @Query(() => [UserModel], { name: "findRecommendedChannels" })
  async findRecommendedChannels() {
    return this.channelService.findRecommendedChannels();
  }

  @Query(() => UserModel, { name: "findByUsername" })
  async findByUsername(@Args("username") username: string) {
    return this.channelService.findByUsername(username);
  }

  @Query(() => Number, { name: "findFollowersCount" })
  async findFollowersCount(@Args("channelId") channelId: string) {
    return this.channelService.findFollowersCountByChannel(channelId);
  }
}
