import { Link } from "react-router";

const NotFoundPage: React.FC = () => {
  return (
    <main className="flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold text-white mb-2">404</h1>
      <p className="text-lg text-white">😭 Page not found 😭</p>
      <Link to="/">go to main</Link>
    </main>
  );
};

export default NotFoundPage;
