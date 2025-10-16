import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  getMainMenuMessage(): string {
    return 'Привет! Меня зовут Дарья и я тату-мастер! Жду твою запись)';
  }
}
