import {
    Modal,
    ModalContent,
    ModalBody,
} from "@heroui/react";
import { Button } from "@heroui/react";
import { useState } from "react";

import { createReservation } from "../../api/reservations";

import { formatDate } from "../../utils/formatDate";
import { formatErrorMessage } from "../../utils/formatErrorMessage";


const SLOTS = [
    "08:00 - 09:00",
    "09:00 - 10:00",
    "10:00 - 11:00",
    "11:00 - 12:00",
    "12:00 - 13:00",
    "13:00 - 14:00",
    "14:00 - 15:00",
    "15:00 - 16:00",
    "16:00 - 17:00",
    "17:00 - 18:00",
    "18:00 - 19:00",
    "19:00 - 20:00"
];

interface SlotsPopupProps {
    selectedDate: string | null
    busyDates: string[]
    onClose: () => void
    spotId: string
    onRefresh: (selectedSlot: string) => void;
}


export const SlotsPopup: React.FC<SlotsPopupProps> = ({ selectedDate, busyDates, onClose, spotId, onRefresh }) => {
    const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const getSlotsStatus = () => {
        return SLOTS.map((time) => ({
            time,
            busy: busyDates ? busyDates.includes(time) : false,
        }));
    }

    const closeModalAndClearSlot = () => {
        setSelectedSlot(null);
        onClose();
    }

    const handleCreateReservation = async () => {
        if (!spotId || !selectedDate || !selectedSlot) {
            setError("Выберите место, дату и слот для бронирования");
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const result = await createReservation({ spotId, selectedDate, selectedSlot });

            if ("statusCode" in result) {
                setError(formatErrorMessage(result))
            } else {
                setSelectedSlot(null);
                onRefresh(selectedSlot);
                // closeModalAndClearSlot();
            }
        } catch (error: unknown ) {
            if (error instanceof Error) {
                setError(error.message);
            } else {
                setError("Ошибка при бронировании");
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Modal isOpen={!!selectedDate} onOpenChange={closeModalAndClearSlot} size='md' scrollBehavior="inside">
            <ModalContent >
                <ModalBody>
                    <div className="max-w-xs mx-auto rounded-2xl ">
                        <h2 className="text-xl font-bold text-black text-center mb-4">
                            Доступные слоты на <br />
                            {formatDate(selectedDate)}:
                        </h2>
                        <div className="">
                            {getSlotsStatus().map(({ time, busy }) => (
                                <div
                                    key={time}
                                    className={`flex flex-col gap-1 sm:gap-3 sm:flex-row items-center justify-between px-2 py-1 rounded mb-1 
                            ${busy ? "opacity-60" : "hover:bg-green-50"}`}
                                >

                                    <div className="flex items-center gap-2">
                                        <span>{busy ? '❌' : '✅'}</span>
                                        <span className={`font-semibold ${busy ? "text-gray-400" : "text-black"}`}>
                                            {time}
                                        </span>
                                    </div>

                                    <Button
                                        onPress={() => setSelectedSlot(time)}
                                        color={busy ? 'danger' : 'success'}
                                        disabled={busy}
                                        size="sm"
                                        className={`${busy} ? 'cursor-not-allowed' : 'cursor-pointer' w-full sm:w-1/6`}
                                    >
                                        {busy ? 'Занято' : 'Выбрать'}
                                    </Button>
                                </div>
                            ))}
                        </div>

                        <div className="text-center mb-3 text-black font-semibold">
                            <span>{`${selectedSlot ? "Выбрано: " + selectedSlot : "\u00A0"}`}</span>
                        </div>

                        <Button
                            className={`w-full text-white ${!selectedSlot ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                            color={!selectedSlot ? 'danger' : 'success'}
                            disabled={!selectedSlot}
                            onPress={handleCreateReservation}
                            isLoading={isLoading}
                        >
                            {isLoading ? '': 'Выбрать'}
                        </Button>

                        {error && (
                            <div className="mb-3 text-center text-red-600 font-semibold">
                                {error}
                            </div>
                        )}

                    </div>
                </ModalBody>
            </ModalContent>
        </Modal >
    );
}
