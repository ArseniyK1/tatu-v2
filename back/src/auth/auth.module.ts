import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthUpdate } from './auth.update';

@Module({
  providers: [AuthService, AuthUpdate],
})
export class AuthModule {}
