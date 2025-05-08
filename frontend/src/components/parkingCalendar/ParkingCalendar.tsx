import React, { useEffect, useState } from "react";
import { Calendar } from "@heroui/react";
import { today, getLocalTimeZone, type DateValue } from "@internationalized/date";
import { Button } from "@heroui/react";
import { parseDate } from "@internationalized/date";

import { SlotsPopup } from "./SlotsPopup";


import { fetchParkingSpotBusyDates, type BusyDates } from "../../api/parking";
import { formatErrorMessage } from "../../utils/formatErrorMessage";

interface ParkingCalendarProps {
    spotId: string;
    location:string;
    onBack: () => void;
}

export const ParkingCalendar: React.FC<ParkingCalendarProps> = ({ spotId,location, onBack }) => {
    const [busyDates, setBusyDates] = useState<BusyDates>({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [selectedDate, setSelectedDate] = useState<string | null>(null);

    const now = today(getLocalTimeZone());

    useEffect(() => {
        fetchBusyDates();
    }, [spotId]);

    const fetchBusyDates = async () => {
        setLoading(true);
        setError(null);
        try {
            const result = await fetchParkingSpotBusyDates(spotId);

            if ("statusCode" in result) {
                setError(formatErrorMessage(result))
            }else{
                setBusyDates(result.busyDates || {});
            }
        } catch (error: unknown) {
            if (error instanceof Error) {
                setError(error.message);
            } else {
                setError("Ошибка при бронировании");
            }
        } finally {
            setLoading(false);
        }
    };

    const isDateUnavailable = (date: DateValue) => {
        const dateString = date.toString();
        const busySlots = busyDates[dateString];

        if (!busySlots) return false;

        return busySlots.length >= 12;
    };

    const handleDateSelect = (date: DateValue) => {
        const dateString = date.toString();
        setSelectedDate(dateString);
    };

    const onRefresh = (newSlot: string) => {
        if (selectedDate) {
            setBusyDates(prevBusyDates => {
                const currentSlots = prevBusyDates[selectedDate] || [];

                if (currentSlots.includes(newSlot)) {
                    return prevBusyDates;
                }
                return {
                    ...prevBusyDates,
                    [selectedDate]: [...currentSlots, newSlot],
                };
            });
        }
    };
    return (
        <div className="max-w-md mx-auto p-4 bg-white rounded-xl shadow">
            <div className="flex justify-between items-center ">
                <h2 className="text-xl text-black font-bold">PARKING PRO</h2>
                <Button onPress={onBack} radius="sm">{"< Назад"}</Button>
            </div>
            <div className="text-start text-gray-400 mb-6">
                <span >{location}</span>
            </div>

            <h2 className="text-xl text-black font-bold mb-4">Бронирование места {spotId}</h2>

            {loading && <div className="text-gray-600">Загрузка данных...</div>}
            {error && <div className="text-red-600 mb-4">{error}</div>}

            <Calendar
                aria-label="Выбор даты бронирования"
                minValue={now}
                value={selectedDate ? parseDate(selectedDate.toString()) : null}
                isDateUnavailable={isDateUnavailable}
                onChange={handleDateSelect}
                classNames={{
                    cellButton: [
                        "bg-green-100 text-green-800",
                        "data-[unavailable=true]:bg-red-100 data-[unavailable=true]:text-red-800"
                    ].join(" ")
                }}
            />

            <SlotsPopup
                onClose={() => setSelectedDate(null)}
                selectedDate={selectedDate}
                busyDates={busyDates[selectedDate ?? ""]}
                spotId={spotId}
                onRefresh={onRefresh}
            />

        </div>
    );
};
