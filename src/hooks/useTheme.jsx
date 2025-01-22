import { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import themeSlice from "@/store/slices/theme";

export default function useTheme() {
  const darkMode = useSelector((state) => state.theme.darkMode);
  const dispatch = useDispatch();

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  const toggleTheme = useCallback(() => {
    dispatch(themeSlice.actions.toggleMode());
  }, [dispatch]);

  return { darkMode, toggleTheme };
}
