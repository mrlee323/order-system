import { useState, useEffect } from "react";

interface UseOnlineStatusReturn {
  isOnline: boolean;
  lastOnlineTime: Date | null;
  reconnectAttempts: number;
  isReconnecting: boolean;
}

export function useOnlineStatus(): UseOnlineStatusReturn {
  const [isOnline, setIsOnline] = useState(() => {
    if (typeof window === "undefined") return true;
    return navigator.onLine;
  });

  const [lastOnlineTime, setLastOnlineTime] = useState<Date | null>(null);
  const [reconnectAttempts, setReconnectAttempts] = useState(0);
  const [isReconnecting, setIsReconnecting] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setLastOnlineTime(new Date());
      setReconnectAttempts(0);
      setIsReconnecting(false);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setIsReconnecting(false);
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return {
    isOnline,
    lastOnlineTime,
    reconnectAttempts,
    isReconnecting,
  };
}
