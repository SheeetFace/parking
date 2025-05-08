import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';

import { hash, verify } from 'argon2';
import { ConfigService } from '@nestjs/config';

import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { isDev } from 'src/utils/is-dev.utils';
import { parseTTL } from 'src/utils/parseTTL.utils';
import type { Request, Response } from 'express';
import type { users } from '@prisma/client';

@Injectable()
export class AuthService {
  private readonly JWT_ACCESS_TOKEN_TTL: string;
  private readonly JWT_REFRESH_TOKEN_TTL: string;
  private readonly COOKIE_DOMAIN: string;

  constructor(
    private readonly prismaService: PrismaService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {
    this.JWT_ACCESS_TOKEN_TTL = configService.getOrThrow(
      'JWT_ACCESS_TOKEN_TTL',
    );
    this.JWT_REFRESH_TOKEN_TTL = configService.getOrThrow(
      'JWT_REFRESH_TOKEN_TTL',
    );
    this.COOKIE_DOMAIN = configService.getOrThrow('COOKIE_DOMAIN');
  }

  async register(res: Response, dto: RegisterDto) {
    const { email, password } = dto;

    const existUser = await this.prismaService.users.findUnique({
      where: {
        email,
      },
    });

    if (existUser) {
      throw new ConflictException(' This user already exists');
    }

    const user = await this.prismaService.users.create({
      data: {
        email,
        password: await hash(password),
      },
    });

    return this.auth(res, user.id);
  }

  async login(res: Response, dto: LoginDto) {
    const { email, password } = dto;

    const user = await this.prismaService.users.findUnique({
      where: {
        email,
      },
      select: {
        id: true,
        password: true,
      },
    });

    if (!user) {
      throw new NotFoundException('This user does not exist');
    }

    const isValidPassword = await verify(user.password, password);

    if (!isValidPassword) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.auth(res, user.id);
  }

  async validate(id: string): Promise<users> {
    const user = await this.prismaService.users.findUnique({
      where: {
        id,
      },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid token');
    }

    return user;
  }

  private auth(res: Response, id: string) {
    const { accessToken, refreshToken } = this.generateTokens(id);

    const expiresInMs = parseTTL(this.JWT_REFRESH_TOKEN_TTL);
    const expires = new Date(Date.now() + expiresInMs);

    this.setCookie(res, refreshToken, expires);

    // return { accessToken };
    return { accessToken, userId: id };
  }

  private generateTokens(id: string): {
    accessToken: string;
    refreshToken: string;
  } {
    const accessToken = this.jwtService.sign(
      { id },
      {
        expiresIn: this.JWT_ACCESS_TOKEN_TTL,
      },
    );

    const refreshToken = this.jwtService.sign(
      { id },
      {
        expiresIn: this.JWT_REFRESH_TOKEN_TTL,
      },
    );

    return {
      accessToken,
      refreshToken,
    };
  }

  private setCookie(res: Response, value: string, expires: Date) {
    res.cookie('refreshToken', value, {
      httpOnly: true,
      domain: this.COOKIE_DOMAIN,
      expires,
      secure: !isDev(this.configService),
      sameSite: !isDev(this.configService) ? 'none' : 'lax',
    });
  }
}
