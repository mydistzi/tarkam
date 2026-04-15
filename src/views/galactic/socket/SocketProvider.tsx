import { type ReactNode, createContext, useContext, useEffect, useMemo, useState } from "react";
import { io, type Socket } from "socket.io-client";

type SocketContextValue = Socket | null;

const SocketContext = createContext<SocketContextValue>(null);

interface SocketProviderProps {
  children: ReactNode;
}

const getSocketUrl = () => {
  return (
    import.meta.env.VITE_SOCKET_URL?.trim() ||
    `${window.location.origin}`
  );
};

const SocketProvider = ({ children }: SocketProviderProps) => {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const url = getSocketUrl();
    const client = io(url, {
      path: "/socket.io",
      transports: ["polling", "websocket"],
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      autoConnect: true,
      withCredentials: true,
    });

    const handleUpdate = (data?: unknown) => {
      window.dispatchEvent(new CustomEvent("tarkam:update", { detail: data }));
    };

    const handleRefresh = () => {
      window.location.reload();
    };

    client.on("connect", () => {
      window.dispatchEvent(new CustomEvent("tarkam:socket-connect", { detail: { connected: true } }));
    });

    client.on("disconnect", () => {
      window.dispatchEvent(new CustomEvent("tarkam:socket-disconnect"));
    });

    client.on("refresh", handleRefresh);
    client.on("update", handleUpdate);
    client.on("data:update", handleUpdate);
    client.on("record:update", handleUpdate);

    client.on("connect_error", (error) => {
      console.warn("[SocketProvider] connect_error", error);
    });

    setSocket(client);

    return () => {
      client.off("connect");
      client.off("disconnect");
      client.off("refresh", handleRefresh);
      client.off("update", handleUpdate);
      client.off("data:update", handleUpdate);
      client.off("record:update", handleUpdate);
      client.off("connect_error");
      client.close();
    };
  }, []);

  const value = useMemo(() => socket, [socket]);

  return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>;
};

const useSocket = () => {
  return useContext(SocketContext);
};

export { SocketProvider, useSocket };
