import { ReactNode } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useLogoutMutation } from "../api/authApi";
import { ArrowRightStartOnRectangleIcon } from "@heroicons/react/24/outline";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const navigate = useNavigate();
  const [logout] = useLogoutMutation();

  const handleLogout = async () => {
    try {
      await logout().unwrap();
      navigate("/login");
    } catch (error) {
      console.error("Failed to logout", error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-indigo-600 text-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold">
            DevTinder
          </Link>
          <nav className="flex space-x-4">
            <Link
              to="/feed"
              className="px-3 py-2 hover:bg-indigo-700 rounded-md"
            >
              Feed
            </Link>
            <Link
              to="/connections"
              className="px-3 py-2 hover:bg-indigo-700 rounded-md"
            >
              Connections
            </Link>
            <Link
              to="/requests"
              className="px-3 py-2 hover:bg-indigo-700 rounded-md"
            >
              Requests
            </Link>
            <Link
              to="/profile"
              className="px-3 py-2 hover:bg-indigo-700 rounded-md"
            >
              Profile
            </Link>
            <button
              onClick={handleLogout}
              className="cursor-pointer px-3 py-2 rounded-md flex items-center gap-1 transition-all duration-400 ease-in-out hover:bg-red-600"
            >
              Logout
              <ArrowRightStartOnRectangleIcon className="h-5 w-5 " />
            </button>
          </nav>
        </div>
      </header>
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 py-6 sm:px-6 lg:px-8">
        {children}
      </main>
      <footer className="bg-gray-100 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-500">
          <p>DevTinder &copy; {new Date().getFullYear()}</p>
        </div>
      </footer>
    </div>
  );
}
