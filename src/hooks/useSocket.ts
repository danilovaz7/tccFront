import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_API_URL; // ⚠️ VITE_API_URL, não vite_api_url

export function useSocket(): Socket | null {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    if (!SOCKET_URL) {
      console.error("⚠️ VITE_API_URL não está definida!");
      return;
    }
    const s = io(SOCKET_URL, {
      withCredentials: true,
      transports: ["websocket", "polling"],
    });
    setSocket(s);
    return () => { s.disconnect(); };
  }, []);

  return socket;
}
