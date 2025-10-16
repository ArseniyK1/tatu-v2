import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TelegrafModule } from 'nestjs-telegraf';
import { TatuBotName } from './constants/app.constants';
import { sessionMiddleware } from './middleware/session.middleware';
import { AuthModule } from './auth/auth.module';
import { BookingModule } from './booking/booking.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TelegrafModule.forRootAsync({
      botName: TatuBotName,
      useFactory: () => ({
        token: process.env.TATU_BOT_TOKEN,
        middlewares: [sessionMiddleware],
        include: [],
      }),
    }),
    AuthModule,
    BookingModule,
    // GreeterModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
