import { Navigate } from 'react-router-dom';
import { ReactNode } from 'react';

interface ProtectedRouteProps {
  children: ReactNode;
  dayNumber: number;
}

const startDate = new Date('2025-02-09T00:00:00').getTime();

const ProtectedRoute = ({ children, dayNumber }: ProtectedRouteProps) => {
  const now = new Date();
  const daysPassed = Math.floor((now.getTime() - startDate) / (1000 * 60 * 60 * 24));
  const currentDay = Math.max(0, Math.min(daysPassed + 1, 7));

  if (dayNumber > currentDay || currentDay === 0) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
