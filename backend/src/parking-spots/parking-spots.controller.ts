import { Controller, Get, Param } from '@nestjs/common';
import { ParkingSpotsService } from './parking-spots.service';

@Controller('parking-spots')
export class ParkingSpotsController {
  constructor(private readonly parkingSpotsService: ParkingSpotsService) {}

  @Get()
  getAll() {
    return this.parkingSpotsService.getAll();
  }

  @Get(':id/available-times')
  getAvailableTimes(@Param('id') id: string) {
    return this.parkingSpotsService.getAvailableTimes(id);
  }
}
