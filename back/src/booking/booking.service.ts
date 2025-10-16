import { Injectable } from '@nestjs/common';

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
    return 'Я так рада, что ты решил(а) записаться ко мне на сеанс тату! Пожалуйста, предоставь свои данные (Я узнаю только твое имя в ТГ и ID) чтобы я могла одобрить запись!';
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
