import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ParkingSpotDto } from './dto/parking-spots.dto';
import { AvailableTimesDto } from './dto/available-times.dto';

@Injectable()
export class ParkingSpotsService {
  constructor(private readonly prismaService: PrismaService) {}

  getAll(): Promise<ParkingSpotDto[]> {
    return this.prismaService.parking_spots.findMany({
      select: { id: true, location: true },
    });
  }

  async getAvailableTimes(parkingSpotId: string): Promise<AvailableTimesDto> {
    const parkingSpot = await this.prismaService.parking_spots.findUnique({
      where: { id: parkingSpotId },
    });

    if (!parkingSpot) {
      throw new NotFoundException(
        `Parking spot with id ${parkingSpotId} not found`,
      );
    }

    const reservations = await this.prismaService.reservations.findMany({
      where: {
        parking_spot_number: parkingSpotId,
        status: 'booked',
      },
      select: {
        reserved_date: true,
        reserved_time: true,
      },
    });

    const busyDates: Record<string, string[]> = {};

    reservations.forEach(({ reserved_date, reserved_time }) => {
      const dateStr = reserved_date.toISOString().slice(0, 10);
      if (!busyDates[dateStr]) {
        busyDates[dateStr] = [];
      }
      busyDates[dateStr].push(reserved_time);
    });

    return { busyDates };
  }
}
