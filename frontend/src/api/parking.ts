import type { ErrorResponse } from "../types/api/errorResponse";
import type { ParkingSpot } from "../types/parkingSpot";

export interface BusyDates {
  [date: string]: string[]
}

const BASE_URL = import.meta.env.VITE_API_URL + "parking-spots";

export async function fetchParkingSpots(): Promise<ParkingSpot[] | ErrorResponse> {
    const response = await fetch(BASE_URL);
    const data = await response.json();

    if (!response.ok) {
      console.error(data)
    }
    return data;
}


export async function fetchParkingSpotBusyDates(
  spotId: string
): Promise<{ busyDates: BusyDates } | ErrorResponse> {
  const response = await fetch(`${BASE_URL}/${spotId}/available-times`);
  const data = await response.json();

  if (!response.ok) {
    console.error(data)
  }
  return data;
}