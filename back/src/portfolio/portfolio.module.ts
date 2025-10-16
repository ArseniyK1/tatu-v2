import { Module } from '@nestjs/common';
import { PortfolioService } from './portfolio.service';
import { MinioService } from '../common/minio/minio.service';

@Module({
  providers: [PortfolioService, MinioService],
  exports: [PortfolioService, MinioService],
})
export class PortfolioModule {}
