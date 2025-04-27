import { type User } from "@/prisma/generated";
import { SessionMetadata } from "@/src/shared/types/session-metadata.types";

export const MESSAGES = {
  welcome: `<b>Добро пожаловать в TeaStreamClone Bot!</b>\n\n
	<b>TeaStreamClone Bot</b> - это бот, который поможет вам управлять вашим аккаунтом TeaStreamClone прямо из Telegram.\n\n
	Вы можете использовать команды, чтобы:\n\n
	- Получить информацию о вашем аккаунте\n
	- Получить уведомления о новых событиях\n
	- Получить доступ к вашему чату\n\n
	Чтобы начать, используйте команду /start.\n\n
	Если у вас есть вопросы или предложения, не стесняйтесь обращаться к нам через команду /feedback.\n\n`,
  authSuccess: `<b>Вы успешно подключили Telegram к вашему аккаунту!</b>\n\n
	Теперь вы можете управлять своим аккаунтом прямо из Telegram.\n\n`,
  invalidToken: `<b>Невалидный токен</b>\n\n`,
  expiredToken: `<b>Токен истек</b>\n\n
	Получите новый на сайте TeaStreamClone.\n\n`,
  profile: (
    user: User,
    followersCount: number
  ) => `<b>Профиль пользователя</b>\n\n
	<b>Имя:</b> ${user.username}\n
	<b>Почта:</b> ${user.email}\n
	<b>Количество подписчиков:</b> ${followersCount}\n
	<b>О себе:</b> ${user.bio}\n
	<b>Нажмите на кнопку ниже, чтобы перейти к настрйокам профиля.</b>`,
  follows: (user: User) =>
    `<a href="https://teastreamclone.ru/${user.username}">${user.username}</a>\n\n`,
  resetPassword: (token: string, metadata: SessionMetadata) =>
    `<b>🔒 Сброс пароля</b>\n\n` +
    `Вы запросили сброс пароля для вашей учетной записи на платформе <b>TeaStream</b>.\n\n` +
    `Чтобы создать новый пароль, пожалуйста, перейдите по следующей ссылке:\n\n` +
    `<b><a href="https://teastream.ru/account/recovery/${token}">Сбросить пароль</a></b>\n\n` +
    `📅 <b>Дата запроса:</b> ${new Date().toLocaleDateString()} в ${new Date().toLocaleTimeString()}\n\n` +
    `🖥️ <b>Информация о запросе:</b>\n\n` +
    `🌍 <b>Расположение:</b> ${metadata.location.country}, ${metadata.location.city}\n` +
    `📱 <b>Операционная система:</b> ${metadata.device.os}\n` +
    `🌐 <b>Браузер:</b> ${metadata.device.browser}\n` +
    `💻 <b>IP-адрес:</b> ${metadata.ip}\n\n` +
    `Если вы не делали этот запрос, просто проигнорируйте это сообщение.\n\n` +
    `Спасибо за использование <b>TeaStream</b>! 🚀`,
  deactivate: (token: string, metadata: SessionMetadata) =>
    `<b>⚠️ Запрос на деактивацию аккаунта</b>\n\n` +
    `Вы инициировали процесс деактивации вашего аккаунта на платформе <b>Teastream</b>.\n\n` +
    `Для завершения операции, пожалуйста, подтвердите свой запрос, введя следующий код подтверждения:\n\n` +
    `<b>Код подтверждения: ${token}</b>\n\n` +
    `📅 <b>Дата запроса:</b> ${new Date().toLocaleDateString()} в ${new Date().toLocaleTimeString()}\n\n` +
    `🖥️ <b>Информация о запросе:</b>\n\n` +
    `• 🌍 <b>Расположение:</b> ${metadata.location.country}, ${metadata.location.city}\n` +
    `• 📱 <b>Операционная система:</b> ${metadata.device.os}\n` +
    `• 🌐 <b>Браузер:</b> ${metadata.device.browser}\n` +
    `• 💻 <b>IP-адрес:</b> ${metadata.ip}\n\n` +
    `<b>Что произойдет после деактивации?</b>\n\n` +
    `1. Вы автоматически выйдете из системы и потеряете доступ к аккаунту.\n` +
    `2. Если вы не отмените деактивацию в течение 7 дней, ваш аккаунт будет <b>безвозвратно удален</b> со всей вашей информацией, данными и подписками.\n\n` +
    `<b>⏳ Обратите внимание:</b> Если в течение 7 дней вы передумаете, вы можете обратиться в нашу поддержку для восстановления доступа к вашему аккаунту до момента его полного удаления.\n\n` +
    `После удаления аккаунта восстановить его будет невозможно, и все данные будут потеряны без возможности восстановления.\n\n` +
    `Если вы передумали, просто проигнорируйте это сообщение. Ваш аккаунт останется активным.\n\n` +
    `Спасибо, что пользуетесь <b>TeaStream</b>! Мы всегда рады видеть вас на нашей платформе и надеемся, что вы останетесь с нами. 🚀\n\n` +
    `С уважением,\n` +
    `Команда TeaStream`,
  accountDeleted:
    `<b>⚠️ Ваш аккаунт был полностью удалён.</b>\n\n` +
    `Ваш аккаунт был полностью стерт из базы данных Teastream. Все ваши данные и информация были удалены безвозвратно. ❌\n\n` +
    `🔒 Вы больше не будете получать уведомления в Telegram и на почту.\n\n` +
    `Если вы захотите вернуться на платформу, вы можете зарегистрироваться по следующей ссылке:\n` +
    `<b><a href="https://teastream.ru/account/create">Зарегистрироваться на Teastream</a></b>\n\n` +
    `Спасибо, что были с нами! Мы всегда будем рады видеть вас на платформе. 🚀\n\n` +
    `С уважением,\n` +
    `Команда TeaStream`,
  streamStart: (channel: User) =>
    `<b>📡 На канале ${channel.displayName} началась трансляция!</b>\n\n` +
    `Смотрите здесь: <a href="https://teastream.ru/${channel.username}">Перейти к трансляции</a>`,
  newFollowing: (follower: User, followersCount: number) =>
    `<b>У вас новый подписчик!</b>\n\nЭто пользователь <a href="https://teastream.ru/${follower.username}">${follower.displayName}</a>\n\nИтоговое количество подписчиков на вашем канале: ${followersCount}`,
};
// newSponsorship: (plan: SponsorshipPlan, sponsor: User) =>
// 	`<b>🎉 Новое спонсор!</b>\n\n` +
// 	`Вы получили новое спонсорство на план <b>${plan.title}</b>.\n` +
// 	`💰 Сумма: <b>${plan.price} ₽</b>\n` +
// 	`👤 Спонсор: <a href="https://teastream.ru/${sponsor.username}">${sponsor.displayName}</a>\n` +
// 	`📅 Дата оформления: <b>${new Date().toLocaleDateString()} в ${new Date().toLocaleTimeString()}</b>`,
// enableTwoFactor:
// 	`🔐 Обеспечьте свою безопасность!\n\n` +
// 	`Включите двухфакторную аутентификацию в <a href="https://teastream.ru/dashboard/settings">настройках аккаунта</a>.`,
// verifyChannel:
// 	`<b>🎉 Поздравляем! Ваш канал верифицирован</b>\n\n` +
// 	`Мы рады сообщить, что ваш канал теперь верифицирован, и вы получили официальный значок.\n\n` +
// 	`Значок верификации подтверждает подлинность вашего канала и улучшает доверие зрителей.\n\n` +
// 	`Спасибо, что вы с нами и продолжаете развивать свой канал вместе с TeaStream!`
