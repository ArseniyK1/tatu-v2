import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  auth(text: string): string {
    return `Auth: ${text}`;
  }
}
