import { Navigate } from "react-router-dom";
export default function ProtectedRoute({ children, user }) {
  return user ? <Navigate to="/" /> : children;
}
