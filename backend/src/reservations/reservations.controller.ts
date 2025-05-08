import {
  Controller,
  Get,
  Delete,
  Post,
  Body,
  Req,
  HttpCode,
  UseGuards,
  Param,
  ForbiddenException,
} from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { AuthGuard } from '@nestjs/passport';

import { CreateReservationDto } from './dto/create-reservation.dto';

@Controller('reservations')
export class ReservationsController {
  constructor(private readonly reservationsService: ReservationsService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  @HttpCode(201)
  create(@Body() dto: CreateReservationDto, @Req() req) {
    return this.reservationsService.create(dto, req.user.id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':user_id')
  async findByUser(@Param('user_id') user_id: string, @Req() req) {
    if (req.user.id !== user_id) {
      throw new ForbiddenException('No access to other peoples reservations!');
    }
    return this.reservationsService.findByUser(user_id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':reservation_id')
  async cancel(@Param('reservation_id') reservation_id: string, @Req() req) {
    return this.reservationsService.cancel(reservation_id, req.user.id);
  }
}
