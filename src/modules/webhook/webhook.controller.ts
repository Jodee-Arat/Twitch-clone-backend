import {
  Body,
  Headers,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UnauthorizedException,
  RawBody,
} from "@nestjs/common";
import { WebhookService } from "./webhook.service";

@Controller("webhook")
export class WebhookController {
  constructor(private readonly webhookService: WebhookService) {}

  @Post("livekit")
  @HttpCode(HttpStatus.OK)
  async receiveWebhookLivekit(
    @Body() body: string,
    @Headers("Authorization") authorization: string
  ) {
    if (!authorization) {
      throw new UnauthorizedException("Отсутсвтвует заголовок авторизации");
    }
    return this.webhookService.receiveWebhookLivekit(body, authorization);
  }

  @Post("stripe")
  @HttpCode(HttpStatus.OK)
  async receiveWebhookStripe(
    @RawBody() rawBody: string,
    @Headers("stripe-signature") sig: string
  ) {
    if (!sig) {
      throw new UnauthorizedException(
        "Отсутсвтвует подпись Stripe в заголовке"
      );
    }

    const event = this.webhookService.constructStripeEvent(rawBody, sig);

    await this.webhookService.receiveWebhookStripe(event);
  }
}
