import { useCallback } from "react";

// materialize function
export const useMessage = () => {
  // Use callback in order to prevent recursion.
  return useCallback((text) => {
    if (window.M && text) {
      // toast method is taken from the materialize librabry.
      // This method is responsible fro showing different messages.
      // In our case errors on the right hand side.
      window.M.toast({ html: text });
    }
  }, []);
};
