import { Link, useLocation } from "react-router-dom";

const Header: React.FC = () => {
  const location = useLocation();

  const userId = localStorage.getItem("userId");

  return (
    <header className="flex py-4 px-1 sm:px-6 w-full justify-center">
      <nav className="flex flex-col gap-3 w-full max-w-xs sm:flex-row sm:gap-3 sm:max-w-none justify-center">
        <Link
          to="/auth"
          className={`px-4 py-2 rounded bg-blue-100 text-blue-700 hover:bg-blue-500 hover:text-white transition text-center w-full  sm:w-48 max-w-xs`}
        >
          Auth page
        </Link>
        <Link
          to={`/bookings/${userId}`}
          className={`px-4 py-2 rounded text-center w-full  sm:w-48 max-w-xs transition hover:bg-blue-500 hover:text-white ${location.pathname.startsWith("/bookings")
              ? "bg-blue-600 text-white"
              : "bg-blue-100 text-blue-700"
            }`}
        >
          Мои бронирования
        </Link>
      </nav>
    </header>
  );
};

export default Header;
