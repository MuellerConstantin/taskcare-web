import api from "./index";

export const generateToken = (username, password) => {
  return api.post("/auth/token", {
    username,
    password,
  });
};
