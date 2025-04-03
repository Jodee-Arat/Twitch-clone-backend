import { Args, Context, Mutation, Resolver } from "@nestjs/graphql";
import { SessionService } from "./session.service";
import { UserModel } from "../account/models/user.model";
import { type GqlContext } from "@/src/shared/types/gql-context.types";
import { LoginInput } from "./inputs/login.input";

@Resolver("Session")
export class SessionResolver {
  constructor(private readonly sessionService: SessionService) {}

  @Mutation(() => UserModel, { name: "loginUser" })
  async login(@Context() { req }: GqlContext, @Args("data") input: LoginInput) {
    return await this.sessionService.login(req, input);
  }
  @Mutation(() => Boolean, { name: "logoutUser" })
  async logout(@Context() { req }: GqlContext) {
    return await this.sessionService.logout(req);
  }
}
