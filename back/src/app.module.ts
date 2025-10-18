import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TelegrafModule } from 'nestjs-telegraf';
import { TatuBotName } from './constants/app.constants';
import { AuthModule } from './auth/auth.module';
import { MiniAppModule } from './mini-app/mini-app.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '..', '..', 'front', 'dist'),
      serveRoot: '/mini-app',
    }),
    TelegrafModule.forRootAsync({
      botName: TatuBotName,
      useFactory: () => ({
        token: process.env.TATU_BOT_TOKEN,
        include: [],
      }),
    }),
    AuthModule,
    MiniAppModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
