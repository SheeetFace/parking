import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { HistoryReservationDto } from './dto/history-reservation.dto';

@Injectable()
export class ReservationsService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createReservationDto: CreateReservationDto, userId: string) {
    const exists = await this.prismaService.reservations.findFirst({
      where: {
        parking_spot_number: createReservationDto.parking_spot_number,
        reserved_date: new Date(createReservationDto.reserved_date),
        reserved_time: createReservationDto.reserved_time,
        status: 'booked',
      },
    });

    if (exists) {
      throw new BadRequestException('This slot is already taken!');
    }

    const reservation = await this.prismaService.reservations.create({
      data: {
        ...createReservationDto,
        user_id: userId,
        status: 'booked',
        reserved_date: new Date(createReservationDto.reserved_date),
      },
      select: {
        parking_spot_number: true,
        reserved_date: true,
        reserved_time: true,
        status: true,
      },
    });

    return {
      success: true,
      reservation,
    };
  }

  async findByUser(user_id: string): Promise<HistoryReservationDto[]> {
    const reservations = await this.prismaService.reservations.findMany({
      where: { user_id },
      orderBy: { reserved_date: 'desc' },
      select: {
        id: true,
        parking_spot_number: true,
        reserved_date: true,
        reserved_time: true,
        status: true,
      },
    });
    return reservations;
  }

  async cancel(reservation_id: string, user_id: string) {
    const reservation = await this.prismaService.reservations.findUnique({
      where: { id: reservation_id },
    });

    if (!reservation) {
      throw new NotFoundException('Reservations not found');
    }

    if (reservation.user_id !== user_id) {
      throw new ForbiddenException(
        'You do not have access to this reservation',
      );
    }

    const now = new Date();
    if (new Date(reservation.reserved_date) < now) {
      throw new BadRequestException('You cannot cancel a past reservation');
    }

    const cancelled = await this.prismaService.reservations.update({
      where: { id: reservation_id },
      data: { status: 'cancelled' },
      select: {
        id: true,
        parking_spot_number: true,
        reserved_date: true,
        reserved_time: true,
        status: true,
      },
    });

    return {
      success: true,
      reservation: cancelled,
    };
  }
}
