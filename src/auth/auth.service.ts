import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { ConfigService } from '@nestjs/config';
import { UserRole } from '../users/user.entity';

@Injectable()
export class AuthService {
  private jwtSecret: string;
  private jwtExpiresIn: string | number;
  private jwtRefreshSecret: string;
  private jwtRefreshExpiresIn: string | number;

  constructor(
    private usersService: UsersService,
    private configService: ConfigService,
  ) {
    this.jwtSecret = this.configService.get<string>(
      'JWT_ACCESS_SECRET',
      'default_access_secret',
    );
    this.jwtExpiresIn = this.configService.get<string>(
      'JWT_ACCESS_EXPIRES_IN',
      '15m',
    );
    this.jwtRefreshSecret = this.configService.get<string>(
      'JWT_REFRESH_SECRET',
      'default_refresh_secret',
    );
    this.jwtRefreshExpiresIn = this.configService.get<string>(
      'JWT_REFRESH_EXPIRES_IN',
      '7d',
    );
  }

  async signup(
    email: string,
    password: string,
    role: UserRole = UserRole.USER,
  ) {
    const hashed = await bcrypt.hash(password, 10);
    return this.usersService.createUser(email, hashed, role);
  }

  async signin(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { sub: user.id, email: user.email, role: user.role };

    const accessToken = jwt.sign(
      payload,
      this.jwtSecret as jwt.Secret,
      { expiresIn: this.jwtExpiresIn } as jwt.SignOptions,
    );

    const refreshToken = jwt.sign(
      payload,
      this.jwtRefreshSecret as jwt.Secret,
      { expiresIn: this.jwtRefreshExpiresIn } as jwt.SignOptions,
    );

    return { accessToken, refreshToken };
  }

  async refresh(refreshToken: string) {
    try {
      const payload = jwt.verify(
        refreshToken,
        this.jwtRefreshSecret as jwt.Secret,
      ) as any;

      const newPayload = {
        sub: payload.sub,
        email: payload.email,
        role: payload.role,
      };

      const newAccessToken = jwt.sign(
        newPayload,
        this.jwtSecret as jwt.Secret,
        { expiresIn: this.jwtExpiresIn } as jwt.SignOptions,
      );

      const newRefreshToken = jwt.sign(
        newPayload,
        this.jwtRefreshSecret as jwt.Secret,
        { expiresIn: this.jwtRefreshExpiresIn } as jwt.SignOptions,
      );

      return { accessToken: newAccessToken, refreshToken: newRefreshToken };
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }
}
