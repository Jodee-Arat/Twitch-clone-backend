import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { TransactionService } from "./transaction.service";
import { TransactionModel } from "./models/transaction.model";
import { Authorization } from "@/src/shared/decorators/auth.decorator";
import { Authorized } from "@/src/shared/decorators/authorized.decorator";
import { User } from "@/generated";
import { makePaymentModel } from "./models/make-payment.model";

@Resolver("Transaction")
export class TransactionResolver {
  constructor(private readonly transactionService: TransactionService) {}

  @Authorization()
  @Query(() => [TransactionModel], { name: "findMyTransaction" })
  async findMyTransaction(@Authorized() user: User) {
    return this.transactionService.findMyTransaction(user);
  }

  @Authorization()
  @Mutation(() => makePaymentModel, { name: "makePayment" })
  async makePayment(@Authorized() user: User, @Args("planId") planId: string) {
    return this.transactionService.makePayment(user, planId);
  }
}
