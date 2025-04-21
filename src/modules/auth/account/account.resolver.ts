import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { AccountService } from "./account.service";
import { UserModel } from "./models/user.model";
import { CreateUserInput } from "./inputs/create-user.input";
import { Authorized } from "@/src/shared/decorators/authorized.decorator";
import { Authorization } from "@/src/shared/decorators/auth.decorator";
import { ChangeEmailInput } from "./inputs/change-email.input";
import { type User } from "@/prisma/generated";
import { ChangePasswordInput } from "./inputs/change-passwors.input";

@Resolver("Account")
export class AccountResolver {
  constructor(private readonly accountService: AccountService) {}

  @Authorization()
  @Query(() => UserModel, { name: "findProfile" })
  async me(@Authorized("id") id: string) {
    return this.accountService.me(id);
  }

  @Mutation(() => Boolean, { name: "createUser" })
  async create(@Args("data") input: CreateUserInput) {
    return this.accountService.create(input);
  }
  @Authorization()
  @Mutation(() => Boolean, { name: "changeEmail" })
  async changeEmail(
    @Args("data") input: ChangeEmailInput,
    @Authorized() user: User
  ) {
    return this.accountService.changeEmail(user, input);
  }
  @Authorization()
  @Mutation(() => Boolean, { name: "changePassword" })
  async changePassword(
    @Args("data") input: ChangePasswordInput,
    @Authorized() user: User
  ) {
    return this.accountService.changePassword(user, input);
  }
}
