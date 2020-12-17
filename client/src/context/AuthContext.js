import { createContext } from "react";

// Empty function which is doing nothing.
function noop() {}

// Creating context in order to store user and share it among the whole application.
export const AuthContext = createContext({
  token: null,
  userId: null,
  login: noop,
  logout: noop,
  isAuthenticated: false,
});
