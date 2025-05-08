import { getAuthHeaders } from "../utils/getAuthHeaders";
import type { ErrorResponse } from "../types/api/errorResponse";

const BASE_URL = import.meta.env.VITE_API_URL + "reservations";

interface ReservationRequest {
    spotId: string
    selectedDate: string
    selectedSlot: string
}

interface ReservationResponse {
    success: boolean,
    reservation: {
        parking_spot_number: string,
        reserved_date: Date,
        reserved_time: string,
        status: "booked"
    }
}

export interface ReservationHistoryItem {
    id: string;
    parking_spot_number: string;
    reserved_date: string;
    reserved_time: string;
    status: string;
}



export async function createReservation(
    data: ReservationRequest
): Promise<ReservationResponse | ErrorResponse> {
    const body = {
        parking_spot_number: data.spotId,
        reserved_date: data.selectedDate,
        reserved_time: data.selectedSlot
    }
    const response = await fetch(BASE_URL, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(body),

    });
    const json = await response.json();
    if (!response.ok) {
        console.error(json)
    }
    return json;
}

export async function fetchReservationHistory(
    userId: string
): Promise<ReservationHistoryItem[] | ErrorResponse> {
    const response = await fetch(`${BASE_URL}/${userId}`, {
        headers: getAuthHeaders(),
    });
    const json = await response.json();
    if (!response.ok) {
        console.error(json)
    }
    return json;
}

export async function cancelReservation(
    reservationId: string
): Promise<{ success: boolean } | ErrorResponse> {
    const response = await fetch(`${BASE_URL}/${reservationId}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
    });
    const json = await response.json();
    if (!response.ok) {
        console.error(json)
    }
    return json;
}
