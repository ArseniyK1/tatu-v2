import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  getMainMessage(): string {
    return 'Привет!\n\nНажми, пожалуйста, кнопку мини приложения, чтобы узнать больше!';
  }
}
