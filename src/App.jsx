import { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import RouteProtector from "./components/organisms/RouteProtector";
import Overview from "./pages/Overview";
import Settings from "./pages/Settings";
import Register from "./pages/Register";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";

export default function App() {
  const darkMode = useSelector((state) => state.theme.darkMode);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  return (
    <Routes>
      <Route path="*" element={<Navigate to="/404" />} />
      <Route path="/" element={<Navigate to="/overview" />} />
      <Route
        path="/overview"
        element={
          <RouteProtector>
            <Overview />
          </RouteProtector>
        }
      />
      <Route
        path="/settings"
        element={
          <RouteProtector>
            <Settings />
          </RouteProtector>
        }
      />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/404" element={<NotFound />} />
    </Routes>
  );
}
