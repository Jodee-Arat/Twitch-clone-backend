import { Args, Query, Resolver } from "@nestjs/graphql";
import { ChannelService } from "./channel.service";
import { UserModel } from "../auth/account/models/user.model";
import { SubscriptionModel } from "../sponsorship/subscription/models/subscription.model";

@Resolver("Channel")
export class ChannelResolver {
  constructor(private readonly channelService: ChannelService) {}

  @Query(() => [UserModel], { name: "findRecommendedChannels" })
  async findRecommendedChannels() {
    return this.channelService.findRecommendedChannels();
  }

  @Query(() => UserModel, { name: "findChannelByUsername" })
  async findChannelByUsername(@Args("username") username: string) {
    return this.channelService.findChannelByUsername(username);
  }

  @Query(() => Number, { name: "findFollowersCount" })
  async findFollowersCount(@Args("channelId") channelId: string) {
    return this.channelService.findFollowersCountByChannel(channelId);
  }

  @Query(() => [SubscriptionModel], { name: "findSponsorsByChannel" })
  async findSponsorsByChannel(@Args("channelId") channelId: string) {
    return this.channelService.findSponsorsByChannel(channelId);
  }
}
