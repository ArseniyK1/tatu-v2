import { Module } from '@nestjs/common';
import { BookingService } from './booking.service';
import { BookingScene } from './scenes/booking.scene';

@Module({
  providers: [BookingService, BookingScene],
  exports: [BookingService],
})
export class BookingModule {}
