import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TelegrafModule } from 'nestjs-telegraf';
import { GreeterBotName } from './app.constants';
import { sessionMiddleware } from './middleware/session.middleware';
import { AuthModule } from './auth/auth.module';
import { GreeterModule } from './greeter/greeter.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    // TelegrafModule.forRoot({
    //   token: process.env.ECHO_BOT_TOKEN,
    //   include: [],
    // }),
    TelegrafModule.forRootAsync({
      botName: GreeterBotName,
      useFactory: () => ({
        token: process.env.TATU_BOT_TOKEN,
        middlewares: [sessionMiddleware],
        include: [],
      }),
    }),
    // AuthModule,
    GreeterModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
