import React, { useEffect, useState } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  getKeyValue,
} from "@heroui/react";
import { fetchParkingSpots } from "../../api/parking";

import type { ParkingSpot } from "../../types/parkingSpot";
import { formatErrorMessage } from "../../utils/formatErrorMessage";

interface Spot {
  id: string;
  location: string;
}

interface ParkingListProps {
  onSelectSpot: (spot: Spot) => void;
}

const columns = [
  { key: "id", label: "Парковочное место" },
  { key: "location", label: "Адрес" },
];

const ParkingList: React.FC<ParkingListProps> = ({ onSelectSpot }) => {
  const [parkingSpots, setParkingSpots] = useState<ParkingSpot[]>([]);
  const [, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getParkingSpots()
  }, []);

  const getParkingSpots = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await fetchParkingSpots();

      if ("statusCode" in result) {
        setError(formatErrorMessage(result))
      } else {
        setParkingSpots(result);
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Произошла неизвестная ошибка");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleCellClick = (id: string, location: string) => {
    onSelectSpot({ id, location })
  }

  return (
    <>
      <div className="bg-[#1A2A47] p-3 rounded-t-xl w-full max-w-md mx-auto">
        <div className="text-2xl font-bold text-white text-start">PARKING</div>
      </div>
      <div className="max-w-md mx-auto bg-white rounded-b-lg shadow p-2 sm:p-6">

        <h2 className=" text-sm text-start font-bold text-gray-900 mb-4 sm:text-xl">Список парковочных мест</h2>

        <Table aria-label="Parking"
          isHeaderSticky
          classNames={{
            base: "w-full max-h-80 font-bold overflow-hidden",
            table: "min-w-[150px]",
            th: "px-2 py-1 text-xs sm:text-base sm:py-1 sm:px-6",
            td: "px-1 py-2 text-xs sm:text-base sm:py-1 sm:px-4",
          }}>
          <TableHeader>
            {columns.map((column) => (
              <TableColumn key={column.key}>
                {column.label}
              </TableColumn>
            ))}
          </TableHeader>
          <TableBody
            emptyContent={error ? `${error}` : "Loading data"}
            items={parkingSpots}>
            {parkingSpots.map((spot) => (
              <TableRow key={spot.id} className="hover:bg-gray-100 cursor-pointer">
                {(columnKey) =>

                  <TableCell className="text-gray-600 text-base font-bold "
                    onClick={() => handleCellClick(spot.id, spot.location)}>
                    {getKeyValue(spot, columnKey)}
                  </TableCell>}
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <div className="text-gray-700 bg-white text-lg mt-4 font-semibold text-start">
          Всего мест: {parkingSpots.length}
        </div>
      </div>
    </>
  );
};

export default ParkingList;
