import { Markup } from "telegraf";

export const BUTTONS = {
  authSuccess: Markup.inlineKeyboard([
    [
      Markup.button.callback("Мои подписки", "follows"),
      Markup.button.callback("Просмотреть профиль", "me"),
    ],
    [Markup.button.url("Перейти на сайт", "https://teastreamclone.ru")],
  ]),
  profile: Markup.inlineKeyboard([
    Markup.button.callback("Мои подписки", "follows"),
    Markup.button.url(
      "Настройки аккаунта",
      "https://teastreamclone.ru/dashboard/settings"
    ),
  ]),
};
