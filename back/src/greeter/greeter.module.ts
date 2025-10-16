import { Module } from '@nestjs/common';
import { GreeterUpdate } from './greeter.update';
import { RandomNumberScene } from './scenes/random-number.scene';
import { GreeterWizard } from './wizard/greeter.wizard';
import { PrismaService } from 'src/prisma.service';

@Module({
  providers: [GreeterUpdate, RandomNumberScene, GreeterWizard, PrismaService],
  imports: [],
  exports: [GreeterUpdate, RandomNumberScene, GreeterWizard],
})
export class GreeterModule {}
