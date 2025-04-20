import { ReactNode, useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";

// This is a simplified auth guard. In a real app, you would likely
// have a more robust authentication system with tokens or session management.
interface AuthGuardProps {
  children: ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const location = useLocation();

  useEffect(() => {
    // Check if user is authenticated
    // For a real app, validate JWT or session
    const checkAuth = () => {
      const hasAuth = localStorage.getItem("isAuthenticated") === "true";
      setIsAuthenticated(hasAuth);
    };

    checkAuth();
  }, []);

  if (isAuthenticated === null) {
    // Still checking authentication status
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}
