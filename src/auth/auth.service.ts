import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';


@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
  ) {}

  async signIn(
  ): Promise<{ access_token: string }> {
    const payload = { sub: 'frase_secreta'};
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}