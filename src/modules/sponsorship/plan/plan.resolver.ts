import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { PlanService } from "./plan.service";
import { PlanModel } from "./models/plan.model";
import { Authorization } from "@/src/shared/decorators/auth.decorator";
import { Authorized } from "@/src/shared/decorators/authorized.decorator";
import { User } from "@/generated";
import { CreatePlanInput } from "./inputs/create-plan.input";

@Resolver("Plan")
export class PlanResolver {
  constructor(private readonly planService: PlanService) {}

  @Authorization()
  @Query(() => [PlanModel], { name: "findMySponsorshipPlans" })
  async findMyPlans(@Authorized() user: User) {
    return this.planService.findMyPlans(user);
  }

  @Authorization()
  @Mutation(() => Boolean, { name: "createSponsorshipPlan" })
  async createPlan(
    @Authorized() user: User,
    @Args("data") input: CreatePlanInput
  ) {
    return this.planService.create(user, input);
  }

  @Authorization()
  @Mutation(() => Boolean, { name: "removeSponsorshipPlan" })
  async removePlan(@Args("planId") planId: string) {
    return this.planService.remove(planId);
  }
}
