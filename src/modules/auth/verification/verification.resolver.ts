import { Args, Context, Mutation, Query, Resolver } from "@nestjs/graphql";
import { VerificationService } from "./verification.service";
import { GqlContext } from "@/src/shared/types/gql-context.types";
import { VerificationInput } from "./inputs/verification.input";
import { UserAgent } from "@/src/shared/decorators/user-agent.decorator";
import { UserModel } from "../account/models/user.model";
import { Authorized } from "@/src/shared/decorators/authorized.decorator";
import { User } from "@/generated";
import { Authorization } from "@/src/shared/decorators/auth.decorator";

@Resolver("Verification")
export class VerificationResolver {
  constructor(private readonly verificationService: VerificationService) {}

  @Mutation(() => UserModel, { name: "verifyAccount" })
  async verify(
    @Context() { req }: GqlContext,
    @Args("data") input: VerificationInput,
    @UserAgent() userAgent: string
  ) {
    return this.verificationService.verify(req, input, userAgent);
  }

  // @Authorization()
  // @Query(() => Boolean, { name: "sendVerificationToken" })
  // async sendVerificationToken(@Authorized() user: User) {
  //   return this.verificationService.sendVerificationToken(user);
  // }
}
