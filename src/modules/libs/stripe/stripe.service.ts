import { Inject, Injectable } from "@nestjs/common";
import Stripe from "stripe";
import { StripeOptionsSymbol, TypeStripeOptions } from "./types/Stripe.types";

@Injectable()
export class StripeService extends Stripe {
  constructor(
    @Inject(StripeOptionsSymbol) private readonly options: TypeStripeOptions
  ) {
    super(options.apiKey, options.config);
  }
}
