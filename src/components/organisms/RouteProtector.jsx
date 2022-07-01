import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function RouteProtector({ children }) {
  const principal = useSelector((state) => state.auth.principal);
  return principal ? children : <Navigate to="/login" />;
}
