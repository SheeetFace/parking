import { Routes, Route } from "react-router-dom";
import AuthPage from "../pages/AuthPage";
import ProtectedRoute from "../components/ProtectedRoute";
import ParkingListPage from "../pages/ParkingBookingPage";
import NotFoundPage from "../pages/NotFoundPage";
import ProtectedLayout from "../components/ProtectedLayout";
import MyBookingsPage from "../pages/MyBookingsPage";


export default function AppRoutes() {
    return (
        <Routes>
            <Route path="/auth" element={<AuthPage />} />
            <Route element={<ProtectedRoute />}>
                <Route element={<ProtectedLayout />}>
                    <Route path="/" element={<ParkingListPage />} />
                    <Route path="/bookings/:userId" element={<MyBookingsPage />} />
                </Route>
            </Route>
            <Route path="*" element={<NotFoundPage />} />
        </Routes>
    );
}
