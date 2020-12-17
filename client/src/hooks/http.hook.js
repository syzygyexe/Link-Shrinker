import { useState, useCallback } from "react";

export const useHttp = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  // Using callback in order to prevent recursion.
  const request = useCallback(
    async (url, method = "GET", body = null, headers = {}) => {
      setLoading(true);
      try {
        // When we receive body, node automatically converts it into a string. Therefore,
        // we need to convert it into JSON format. Otherwise, we will get [object Object].
        // Also, whenever we are working with JSON, we need to define the Content-Type.
        if (body) {
          body = JSON.stringify(body);
          headers["Content-Type"] = "application/json";
        }

        // fetch() takes url as a first parameter and options as a second parameter
        const response = await fetch(url, {
          method,
          body,
          headers,
        });
        // parse our response
        const data = await response.json();

        if (!response.ok) {
          // if there is an issue with the response, provide a data.message error.
          // If there is no data.message error, provide a default text
          throw new Error(data.message || "Something went wrong");
        }

        setLoading(false);
        // Succesfull scenario
        return data;
      } catch (e) {
        setLoading(false);
        setError(e.message);
        throw e;
      }
    },
    []
  );

  // Function to clear errors. Wrapping clearError in useCallback in order to pass a dependendancy
  // inside of our AuthPage useEffect.
  const clearError = useCallback(() => setError(null), []);

  return { loading, request, error, clearError };
};
