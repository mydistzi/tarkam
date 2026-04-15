import { type ReactNode, createContext, useContext, useEffect, useMemo, useState } from "react";
import Echo, { type EchoOptions } from "laravel-echo";
import Pusher from "pusher-js";

declare global {
  interface Window {
    Pusher?: typeof Pusher;
  }
}

type SocketContextValue = Echo<"reverb"> | null;

const SocketContext = createContext<SocketContextValue>(null);

interface SocketProviderProps {
  children: ReactNode;
}

const buildReverbConfig = (): EchoOptions<"reverb"> => {
  const key = import.meta.env.VITE_REVERB_APP_KEY?.trim() ?? "";
  const host = import.meta.env.VITE_REVERB_HOST?.trim() ?? "";
  const port = Number(import.meta.env.VITE_REVERB_PORT ?? 6001);
  const scheme = import.meta.env.VITE_REVERB_SCHEME?.trim().toLowerCase() ?? "https";
  const forceTLS = scheme === "https";
  const socketHost = host || window.location.hostname;

  return {
    broadcaster: "reverb",
    key,
    wsHost: socketHost,
    wssHost: socketHost,
    wsPort: port,
    wssPort: port,
    forceTLS,
    enabledTransports: forceTLS ? ["wss"] : ["ws"],
    disableStats: true,
    authEndpoint: "/broadcasting/auth",
  };
};

const SocketProvider = ({ children }: SocketProviderProps) => {
  const [client, setClient] = useState<Echo<"reverb"> | null>(null);

  useEffect(() => {
    const options = buildReverbConfig();

    if (!options.key) {
      console.warn("[SocketProvider] VITE_REVERB_APP_KEY is not configured. Broadcast socket is disabled.");
      return;
    }

    window.Pusher = Pusher;

    const echo = new Echo(options);
    const channel = echo.channel("broadcasts");

    const handleUpdate = (data?: unknown) => {
      window.dispatchEvent(new CustomEvent("tarkam:update", { detail: data }));
    };

    channel.listen("BroadcastChanged", handleUpdate);

    setClient(echo);

    return () => {
      channel.stopListening("BroadcastChanged");
      echo.disconnect();
    };
  }, []);

  const value = useMemo(() => client, [client]);

  return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>;
};

const useSocket = () => {
  return useContext(SocketContext);
};

export { SocketProvider, useSocket };