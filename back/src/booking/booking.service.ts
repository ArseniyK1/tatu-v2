import { Injectable } from '@nestjs/common';
import { BOOKING_WELCOME_MESSAGE } from './static/texts';

interface UserData {
  id: number;
  firstName: string;
  username?: string;
  telegramId: number;
  registeredAt: Date;
}

@Injectable()
export class BookingService {
  private users: UserData[] = [];

  getBookingWelcomeMessage(): string {
    return BOOKING_WELCOME_MESSAGE;
  }

  registerUser(
    telegramId: number,
    firstName: string,
    username?: string,
  ): UserData {
    const userData: UserData = {
      id: this.users.length + 1,
      firstName,
      username,
      telegramId,
      registeredAt: new Date(),
    };

    this.users.push(userData);
    return userData;
  }

  getUserByTelegramId(telegramId: number): UserData | undefined {
    return this.users.find((user) => user.telegramId === telegramId);
  }

  getAllUsers(): UserData[] {
    return this.users;
  }
}
