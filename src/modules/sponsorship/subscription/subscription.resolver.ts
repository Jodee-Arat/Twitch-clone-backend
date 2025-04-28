import { Query, Resolver } from "@nestjs/graphql";
import { SubscriptionService } from "./subscription.service";
import { SubscriptionModel } from "./models/subscription.model";
import { Authorization } from "@/src/shared/decorators/auth.decorator";
import { Authorized } from "@/src/shared/decorators/authorized.decorator";
import { User } from "@/generated";

@Resolver("Subscription")
export class SubscriptionResolver {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  @Authorization()
  @Query(() => [SubscriptionModel], { name: "findMySponsors" })
  async findMySponsors(@Authorized() user: User) {
    return this.subscriptionService.findMySponsors(user);
  }
}
