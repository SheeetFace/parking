import { useState } from "react";
import ParkingList from "../components/parkingList/ParkingList";
import { ParkingCalendar } from "../components/parkingCalendar/ParkingCalendar";

const ParkingBookingPage: React.FC = () => {
  // const [selectedSpotId, setSelectedSpotId] = useState<string | null>(null);
  const [selectedSpotId, setSelectedSpotId] = useState<{id:string,location:string} | null>(null);

  return (
    <main className="flex flex-col">
      <section className="flex-1 flex flex-col items-center justify-center">
        {!selectedSpotId ? (
          <ParkingList onSelectSpot={setSelectedSpotId} />
        ) : (
          <ParkingCalendar
            spotId={selectedSpotId.id}
            location={selectedSpotId.location}
            onBack={() => setSelectedSpotId(null)}
          />
        )}
      </section>
    </main>
  );
};

export default ParkingBookingPage;
