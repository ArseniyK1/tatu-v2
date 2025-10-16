import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthUpdate } from './auth.update';
import { PortfolioModule } from '../portfolio/portfolio.module';

@Module({
  imports: [PortfolioModule],
  providers: [AuthService, AuthUpdate],
})
export class AuthModule {}
