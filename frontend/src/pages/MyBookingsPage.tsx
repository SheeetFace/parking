import BookingTable from "../components/booking/BookingTable";

const MyBookingsPage: React.FC = () => {

    return (
        <main className="flex flex-col">
            <section className="flex-1 flex flex-col items-center justify-center">
                <BookingTable />
            </section>
        </main>
    )
}

export default MyBookingsPage;