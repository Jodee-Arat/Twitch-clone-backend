import { TypeStripeOptions } from "@/src/modules/libs/stripe/types/Stripe.types";
import { ConfigService } from "@nestjs/config";

export function getStripeConfig(
  configService: ConfigService
): TypeStripeOptions {
  return {
    apiKey: configService.get<string>("STRIPE_SECRET_KEY"),
    config: {
      apiVersion: "2025-03-31.basil",
    },
  };
}
