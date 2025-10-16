import { UseFilters, UseGuards, UseInterceptors } from '@nestjs/common';
import {
  Help,
  InjectBot,
  On,
  Message,
  Start,
  Update,
  Command,
  Ctx,
  Action,
} from 'nestjs-telegraf';
import { Telegraf, Markup } from 'telegraf';
import { AuthService } from './auth.service';
import { PortfolioService } from '../portfolio/portfolio.service';
import { TatuBotName } from '../constants/app.constants';
import { Context } from '../interfaces/context.interface';
import { ReverseTextPipe } from '../common/pipes/reverse-text.pipes';
import { ResponseTimeInterceptor } from '../common/interceptors/response-time.interceptor';
import { AdminGuard } from '../common/guards/admin.guard';
import { TelegrafExceptionFilter } from '../common/filters/telegraf-exception.filter';
import { BOOKING_SCENE_ID } from '../constants/app.constants';

@Update()
@UseInterceptors(ResponseTimeInterceptor)
@UseFilters(TelegrafExceptionFilter)
export class AuthUpdate {
  constructor(
    @InjectBot(TatuBotName)
    private readonly bot: Telegraf<Context>,
    private readonly authService: AuthService,
    private readonly portfolioService: PortfolioService,
  ) {}

  @Start()
  async onStart(@Ctx() ctx: Context): Promise<void> {
    // Удаляем предыдущие сообщения бота в этом чате (опционально)
    // Это поможет избежать накопления сообщений при повторном /start

    const message = this.authService.getMainMenuMessage();
    const keyboard = Markup.inlineKeyboard([
      [Markup.button.callback('Портфолио', 'portfolio')],
      [Markup.button.callback('Записаться', 'booking')],
    ]);

    await ctx.reply(message, keyboard);
  }

  @Action('portfolio')
  async onPortfolio(@Ctx() ctx: Context): Promise<void> {
    await ctx.answerCbQuery();

    // Удаляем предыдущее сообщение
    try {
      await ctx.deleteMessage();
    } catch (error) {
      // Игнорируем ошибки удаления
    }

    const message = this.portfolioService.getPortfolioMessage();
    const keyboard = Markup.inlineKeyboard([
      [Markup.button.callback('На главную', 'main_menu')],
    ]);
    await ctx.reply(message, keyboard);
  }

  @Action('main_menu')
  async onMainMenu(@Ctx() ctx: Context): Promise<void> {
    await ctx.answerCbQuery();

    // Удаляем предыдущее сообщение
    try {
      await ctx.deleteMessage();
    } catch (error) {
      // Игнорируем ошибки удаления
    }

    const message = this.authService.getMainMenuMessage();
    const keyboard = Markup.inlineKeyboard([
      [Markup.button.callback('Портфолио', 'portfolio')],
      [Markup.button.callback('Записаться', 'booking')],
    ]);
    await ctx.reply(message, keyboard);
  }

  @Action('booking')
  async onBooking(@Ctx() ctx: Context): Promise<void> {
    await ctx.answerCbQuery();

    // Удаляем предыдущее сообщение
    try {
      await ctx.deleteMessage();
    } catch (error) {
      // Игнорируем ошибки удаления
    }

    await ctx.scene.enter(BOOKING_SCENE_ID);
  }

  @Help()
  async onHelp(): Promise<string> {
    return 'Используйте кнопки для навигации';
  }

  @Command('admin')
  @UseGuards(AdminGuard)
  onAdminCommand(): string {
    return 'Админ панель';
  }
}
