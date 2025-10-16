import {
  Ctx,
  Message,
  On,
  Scene,
  SceneEnter,
  SceneLeave,
  Action,
} from 'nestjs-telegraf';
import { Markup } from 'telegraf';
import { BookingService } from '../booking.service';
import { BOOKING_SCENE_ID } from '../../constants/app.constants';
import { Context } from '../../interfaces/context.interface';

@Scene(BOOKING_SCENE_ID)
export class BookingScene {
  constructor(private readonly bookingService: BookingService) {}

  @SceneEnter()
  async onSceneEnter(@Ctx() ctx: Context): Promise<void> {
    // Удаляем предыдущее сообщение бота
    if (ctx.callbackQuery && 'message' in ctx.callbackQuery) {
      try {
        await ctx.deleteMessage();
      } catch (error) {
        // Игнорируем ошибки удаления (например, если сообщение уже удалено)
      }
    }

    const message = this.bookingService.getBookingWelcomeMessage();
    const keyboard = Markup.inlineKeyboard([
      [Markup.button.callback('Я согласен', 'consent_given')],
      [Markup.button.callback('На главную', 'main_menu')],
    ]);

    await ctx.reply(message, keyboard);
  }

  @Action('consent_given')
  async onConsentGiven(@Ctx() ctx: Context): Promise<void> {
    await ctx.answerCbQuery();

    // Удаляем предыдущее сообщение
    try {
      await ctx.deleteMessage();
    } catch (error) {
      // Игнорируем ошибки удаления
    }

    // Устанавливаем флаг, что пользователь дал согласие
    ctx.scene.session.consentGiven = true;

    await ctx.reply(
      'Отлично! Теперь отправьте любое сообщение, чтобы завершить регистрацию.',
    );
  }

  @On('text')
  async onUserData(
    @Ctx() ctx: Context,
    @Message() msg: { text: string },
  ): Promise<void> {
    // Проверяем, что пользователь дал согласие
    if (!ctx.scene.session.consentGiven) {
      await ctx.reply('Пожалуйста, сначала нажмите кнопку "Я согласен"');
      return;
    }

    const user = ctx.from;
    if (!user) {
      await ctx.reply('Ошибка получения данных пользователя');
      return;
    }

    // Удаляем сообщение пользователя
    try {
      await ctx.deleteMessage();
    } catch (error) {
      // Игнорируем ошибки удаления
    }

    // Регистрируем пользователя
    const userData = this.bookingService.registerUser(
      user.id,
      user.first_name || 'Unknown',
      user.username,
    );

    await ctx.scene.leave();

    const message = `Вы успешно авторизовались! Добро пожаловать, ${userData.firstName}!`;
    const keyboard = Markup.inlineKeyboard([
      [Markup.button.callback('На главную', 'main_menu')],
    ]);

    await ctx.reply(message, keyboard);
  }

  @SceneLeave()
  async onSceneLeave(@Ctx() ctx: Context): Promise<void> {
    // Можно добавить логику при выходе из сцены
  }
}
