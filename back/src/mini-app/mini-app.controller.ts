import { Controller, Get, Post, Body, Headers, Res } from '@nestjs/common';
import { Response } from 'express';

@Controller('api/mini-app')
export class MiniAppController {
  @Get('user')
  async getUser(@Headers('x-telegram-user') userData: string) {
    try {
      const user = JSON.parse(decodeURIComponent(userData));
      return {
        id: user.id,
        firstName: user.first_name,
        username: user.username,
        photoUrl: user.photo_url,
      };
    } catch (error) {
      return { error: 'Invalid user data' };
    }
  }

  @Get('health')
  healthCheck() {
    return { status: 'ok', timestamp: new Date().toISOString() };
  }
}
