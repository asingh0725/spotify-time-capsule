import { useEffect, useState } from "react";

export function useSpotifyAuth() {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("accessToken");
    if (stored) setToken(stored);
  }, []);

  return token;
}
