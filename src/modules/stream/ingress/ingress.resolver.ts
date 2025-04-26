import { Args, Mutation, Resolver } from "@nestjs/graphql";
import { IngressService } from "./ingress.service";
import { Authorization } from "@/src/shared/decorators/auth.decorator";
import { Authorized } from "@/src/shared/decorators/authorized.decorator";
import { User } from "@/prisma/generated";
import { type IngressInput } from "livekit-server-sdk";

@Resolver("Ingress")
export class IngressResolver {
  constructor(private readonly ingressService: IngressService) {}

  @Authorization()
  @Mutation(() => Boolean, { name: "createIngress" })
  async create(
    @Authorized() user: User,
    @Args("ingressType") ingressType: IngressInput
  ) {
    return this.ingressService.create(user, ingressType);
  }
}
