export class HistoryReservationDto {
  id: string;
  parking_spot_number: string;
  reserved_date: Date;
  reserved_time: string;
  status: 'booked' | 'cancelled';
}
