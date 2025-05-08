import Header from "./header/Header";
import { Outlet } from "react-router-dom";

const ProtectedLayout: React.FC = () => (
  <div className="flex flex-col min-h-screen min-w-screen">
    <Header />
    <main className="flex-1 flex flex-col items-center justify-center">
      <Outlet />
    </main>
  </div>
);

export default ProtectedLayout;
