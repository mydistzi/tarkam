import { type ReactNode, createContext, useContext, useEffect, useMemo, useState } from "react";
import Echo, { type EchoOptions } from "laravel-echo";
import Pusher from "pusher-js";

declare global {
  interface Window {
    Pusher?: typeof Pusher;
  }
}

type LiveUpdateDetail = {
  resource?: string;
  action?: string;
  id?: string | number | null;
  payload?: unknown;
};

type SocketContextValue = Echo<"reverb"> | null;

type LiveUpdateContextValue = {
  globalTick: number;
  resourceTicks: Record<string, number>;
};

const SocketContext = createContext<SocketContextValue>(null);
const LiveUpdateContext = createContext<LiveUpdateContextValue>({
  globalTick: 0,
  resourceTicks: {},
});

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
  const [globalTick, setGlobalTick] = useState(0);
  const [resourceTicks, setResourceTicks] = useState<Record<string, number>>({});

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

    const handleResourceChanged = (data?: unknown) => {
      console.log("[SocketProvider] Received ResourceChanged event:", data);
      handleUpdate(data);
    };

    channel.listen("BroadcastChanged", handleUpdate);
    channel.listen("ResourceChanged", handleResourceChanged);

    console.log("[SocketProvider] Echo connected to broadcasts channel");
    setClient(echo);

    return () => {
      channel.stopListening("BroadcastChanged");
      channel.stopListening("ResourceChanged");
      echo.disconnect();
    };
  }, []);

  useEffect(() => {
    const handleLiveEvent = (event: Event) => {
      const liveEvent = event as CustomEvent<LiveUpdateDetail>;
      const payload = liveEvent.detail ?? {};
      const resource = typeof payload.resource === "string" ? payload.resource : "";

      console.log("[SocketProvider] Live event received:", { resource, action: payload.action, id: payload.id });

      setGlobalTick((current) => current + 1);
      if (resource) {
        setResourceTicks((current) => ({
          ...current,
          [resource]: (current[resource] ?? 0) + 1,
        }));
      }
    };

    window.addEventListener("tarkam:update", handleLiveEvent);
    return () => {
      window.removeEventListener("tarkam:update", handleLiveEvent);
    };
  }, []);

  const socketValue = useMemo(() => client, [client]);
  const liveUpdateValue = useMemo(
    () => ({ globalTick, resourceTicks }),
    [globalTick, resourceTicks],
  );

  return (
    <SocketContext.Provider value={socketValue}>
      <LiveUpdateContext.Provider value={liveUpdateValue}>
        {children}
      </LiveUpdateContext.Provider>
    </SocketContext.Provider>
  );
};

const useSocket = () => {
  return useContext(SocketContext);
};

const useLiveUpdate = (resource?: string) => {
  const { globalTick, resourceTicks } = useContext(LiveUpdateContext);

  if (!resource) {
    return globalTick;
  }

  return resourceTicks[resource] ?? 0;
};

export { SocketProvider, useSocket, useLiveUpdate };