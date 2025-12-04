import { useState } from "react";

export function useError() {
  const [error, setError] = useState<string | null>(null);

  function reportError(msg: string) {
    console.error(msg);
    setError(msg);
  }

  function clearError() {
    setError(null);
  }

  return { error, reportError, clearError };
}
