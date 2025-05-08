import React, { useEffect, useState } from "react";
import {
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
    getKeyValue,
    Button,
} from "@heroui/react";

import { fetchReservationHistory } from "../../api/reservations";
import { useParams } from "react-router-dom";

import { cancelReservation } from "../../api/reservations";

import type { ReservationHistoryItem } from "../../api/reservations";
import { formatErrorMessage } from "../../utils/formatErrorMessage";

const columns = [
    { key: "parking_spot_number", label: "Место" },
    { key: "reserved_date", label: "Дата" },
    { key: "reserved_time", label: "Время" },
    { key: "status", label: "Статус" },
    { key: "actions", label: "Действие" },
];

const formatDate = (iso: string) => {
    return new Date(iso).toLocaleDateString("by-BY");
}


const statusLabel = (status: string) =>
    status === "booked"
        ? <span className="text-green-600 font-semibold">Booked</span>
        : <span className="text-gray-400">Canceled</span>;

const BookingTable: React.FC = () => {
    const [rows, setRows] = useState<ReservationHistoryItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const { userId } = useParams<{ userId: string }>();

    useEffect(() => {
        if (!userId) {
            setError("He удалось определить пользователя");
            setLoading(false);
            return;
        }
        fetchReservationHistory(userId)
            .then((data) => {
                if ("statusCode" in data) {
                    setError(formatErrorMessage(data))
                } else {
                    setRows(
                        data.map((r) => ({
                            ...r,
                            reserved_date: formatDate(r.reserved_date)
                        }))
                    );
                }
            })
            .catch(() => setError("Ошибка загрузки"))
            .finally(() => setLoading(false));
    }, []);

    const handleCancel = async (id: string) => {
        setLoading(true)
        const result = await cancelReservation(id)

        if ("statusCode" in result) {
            setError(formatErrorMessage(result))
        } else {
            setRows(prevRows =>
                prevRows.map(row =>
                    row.id === id ? { ...row, status: "cancelled" } : row
                )
            );
        }
        setLoading(false)
    }

    return (
        <div className="max-w-2xl text-black mx-auto p-1 sm:p-5 bg-white rounded-xl shadow">
            <h2 className="text-2xl font-bold mb-4">Мои бронирования</h2>
            {error && (
                <div className="mb-4 text-red-600 text-center font-semibold">{error}</div>
            )}
            <div className="overflow-x-auto overflow-auto">
                <Table
                    aria-label="История бронирований"
                    isHeaderSticky
                    classNames={{
                        base: "w-full max-h-80 font-bold overflow-hidden",
                        table: "min-w-[150px]",
                        th: "px-2 py-1 text-xs sm:text-base sm:py-1 sm:px-6",
                        td: "px-1 py-2 text-xs sm:text-base sm:py-1 sm:px-4",
                    }}
                >
                    <TableHeader>
                        {columns.map((column) => (
                            <TableColumn key={column.key}>{column.label}</TableColumn>

                        ))}
                    </TableHeader>

                    <TableBody emptyContent={loading ? "Загрузка..." : "Нет бронирований"} items={rows}>
                        {rows.map((row) => (
                            <TableRow key={row.id}>
                                {(columnKey) => {
                                    if (columnKey === "status") {
                                        return <TableCell>{statusLabel(row.status)}</TableCell>;
                                    }
                                    if (columnKey === "actions") {
                                        return (
                                            <TableCell>
                                                <Button
                                                    className={`w-full ${row.status === "booked" && !loading ? "cursor-pointer" : "cursor-not-allowed"
                                                        }`}
                                                    size="sm"
                                                    color={row.status === "booked" ? "danger" : "default"}
                                                    disabled={row.status !== "booked" || loading}
                                                    onPress={() => handleCancel(row.id)}
                                                    isLoading={loading}
                                                >
                                                    {!loading && (row.status === "booked" ? "Отменить" : "Отменено")}
                                                </Button>

                                            </TableCell>
                                        );
                                    }
                                    return <TableCell>{getKeyValue(row, columnKey)}</TableCell>;
                                }}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
            <span>Кол-во {rows.length ?? 0}</span>
        </div>
    );
};

export default BookingTable;
