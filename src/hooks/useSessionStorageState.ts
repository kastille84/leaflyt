import { useState, useEffect } from "react";

export function useSessionStorageState(initialState: any, key: any) {
  const [value, setValue] = useState(function () {
    const storedValue = sessionStorage.getItem(key);
    return storedValue ? JSON.parse(storedValue) : initialState;
  });

  useEffect(
    function () {
      sessionStorage.setItem(key, JSON.stringify(value));
    },
    [value, key]
  );

  return [value, setValue];
}
