import { PrismaService } from "@/src/core/prisma/prisma.service";
import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { StripeService } from "../../libs/stripe/Stripe.service";
import { type User } from "@/generated";
import { CreatePlanInput } from "./inputs/create-plan.input";
import { ForbiddenError } from "@nestjs/apollo";

@Injectable()
export class PlanService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly stripeService: StripeService
  ) {}

  async findMyPlans(user: User) {
    const plans = await this.prismaService.sponsorshipPlan.findMany({
      where: {
        channelId: user.id,
      },
    });
    console.log(plans);

    return plans;
  }

  async create(user: User, input: CreatePlanInput) {
    const { title, description, price } = input;

    const channel = await this.prismaService.user.findUnique({
      where: {
        id: user.id,
      },
    });

    if (!channel.isVerified) {
      throw new ForbiddenException(
        "Создание планов доступно только верифицированным каналам"
      );
    }

    const stripePlan = await this.stripeService.plans.create({
      amount: Math.round(price * 100),
      currency: "rub",
      interval: "month",
      product: {
        name: title,
      },
    });

    await this.prismaService.sponsorshipPlan.create({
      data: {
        title,
        description,
        price,
        stripeProductId: stripePlan.product.toString(),
        stripePlanId: stripePlan.id,
        channel: {
          connect: {
            id: user.id,
          },
        },
      },
    });
    return true;
  }

  async remove(planId: string) {
    const plan = await this.prismaService.sponsorshipPlan.findUnique({
      where: {
        id: planId,
      },
    });
    if (!plan) {
      throw new NotFoundException("План не найден");
    }
    await this.stripeService.plans.del(plan.stripePlanId);
    await this.stripeService.products.del(plan.stripeProductId);

    await this.prismaService.sponsorshipPlan.delete({
      where: {
        id: planId,
      },
    });
    return true;
  }
}
