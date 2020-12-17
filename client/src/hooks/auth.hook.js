import { useState, useCallback, useEffect } from "react";

const storageName = "userData";

export const useAuth = () => {
  const [token, setToken] = useState(null);
  const [ready, setReady] = useState(false);
  const [userId, setUserId] = useState(null);

  // jwtToken is coming from our backend. login is wrapped in useCallback because it is being used
  // as a dependency inside of our useEffect below.
  const login = useCallback((jwtToken, id) => {
    setToken(jwtToken);
    setUserId(id);
    // Local storage - data with no expiration date that will persist after the browser window is closed.
    localStorage.setItem(
      storageName,
      // id and jwtToken which we have received from the server.
      JSON.stringify({ userId: id, token: jwtToken })
    );
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setUserId(null);
    localStorage.removeItem(storageName);
  }, []);

  useEffect(() => {
    // Check localStorage by default. If there is data inside of localStorage, set its value to token and userId.
    const data = JSON.parse(localStorage.getItem(storageName));

    if (data && data.token) {
      login(data.token, data.userId);
    }
    setReady(true);
  }, [login]);

  return { login, logout, token, userId, ready };
};

