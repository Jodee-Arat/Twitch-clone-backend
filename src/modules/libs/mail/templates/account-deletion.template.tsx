import { type SessionMetadata } from "@/src/shared/types/session-metadata.types";
import * as React from "react";
import {
  Body,
  Head,
  Heading,
  Link,
  Preview,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";
import { Html } from "@react-email/html";

export function AccountDeletionTemplate() {
  return (
    <Html>
      <Head />
      <Preview>Аккаунт удалён</Preview>
      <Tailwind>
        <Body className="max-w-2xl mx-auto p-6 bg-slate-50">
          <Section className="text-center mb-8">
            <Heading className="text-3xl text-black font-bold">
              Ваш аккаунт полностью удалён
            </Heading>
            <Text className="text-base text-black">
              Ваш аккаунт полностью стёрт из базы данных TeaStream. Все ваши
              данные безвозвратно удалены и не могут быть восстановлены.
            </Text>
          </Section>
          <Section className="bg-gray-100 rounded-lg p-6 text-center mb-6">
            <Text className="text-black">
              Вы больше не будете получать уведомления в Telegram и на почту.
            </Text>
          </Section>

          <Section className="text-center mt-8">
            <Text className="text-gray-600">
              Если у вас есть вопросы или вы столкнулись с трудностями, не
              стесняйтесь обращаться в нашу службу поддержки по адресу{" "}
              <Link
                href="mailto:dema-61.bizml.ru"
                className="text-[#18b9ae] underline"
              >
                dema-61.bizml.ru
              </Link>
            </Text>
          </Section>
        </Body>
      </Tailwind>
    </Html>
  );
}
