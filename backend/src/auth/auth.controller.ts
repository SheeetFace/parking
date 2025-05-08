import {
  Body,
  Res,
  Req,
  Controller,
  Post,
  Get,
  HttpCode,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import type { Response, Request } from 'express';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @HttpCode(201)
  async register(
    @Res({ passthrough: true }) res: Response,
    @Body() dto: RegisterDto,
  ) {
    return this.authService.register(res, dto);
  }

  @Post('login')
  @HttpCode(200)
  async login(
    @Res({ passthrough: true }) res: Response,
    @Body() dto: LoginDto,
  ) {
    return this.authService.login(res, dto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('@me')
  @HttpCode(200)
  me(@Req() req: Request) {
    return req.user;
  }
}
