import { UseFilters, UseInterceptors } from '@nestjs/common';
import {
  Help,
  InjectBot,
  On,
  Message,
  Start,
  Update,
  Ctx,
} from 'nestjs-telegraf';
import { Telegraf, Markup } from 'telegraf';
import { AuthService } from './auth.service';
import { TatuBotName } from '../constants/app.constants';
import { Context } from '../interfaces/context.interface';
import { ResponseTimeInterceptor } from '../common/interceptors/response-time.interceptor';
import { TelegrafExceptionFilter } from '../common/filters/telegraf-exception.filter';

@Update()
@UseInterceptors(ResponseTimeInterceptor)
@UseFilters(TelegrafExceptionFilter)
export class AuthUpdate {
  constructor(
    @InjectBot(TatuBotName)
    private readonly bot: Telegraf<Context>,
    private readonly authService: AuthService,
  ) {}

  @Start()
  async onStart(@Ctx() ctx: Context): Promise<void> {
    await this.sendMainMessage(ctx);
  }

  @On('text')
  async onAnyMessage(@Ctx() ctx: Context): Promise<void> {
    await this.sendMainMessage(ctx);
  }

  private async sendMainMessage(@Ctx() ctx: Context): Promise<void> {
    const message =
      'Привет!\n\nНажми, пожалуйста, кнопку мини приложения, чтобы узнать больше!';
    const keyboard = Markup.inlineKeyboard([
      [Markup.button.webApp('🎨 Mini App', 'https://dazsza.ru/')],
    ]);

    await ctx.reply(message, keyboard);
  }

  @Help()
  async onHelp(): Promise<string> {
    return 'Используйте кнопку Mini App для навигации';
  }
}
