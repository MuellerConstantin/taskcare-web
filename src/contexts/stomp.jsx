import {
  useContext,
  createContext,
  useEffect,
  useState,
  useMemo,
  useRef,
} from "react";
import { Client } from "@stomp/stompjs";
import { generateTicket } from "../api/auth";

const StompContext = createContext();

export function StompProvider({ url, children }) {
  const [connecting, setConnecting] = useState(false);
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState(null);
  const clientRef = useRef(null);

  const stomp = useMemo(
    () => ({ connecting, connected, error, client: clientRef.current }),
    [connecting, connected, error]
  );

  useEffect(() => {
    if (url) {
      (async () => {
        setConnected(false);
        setConnecting(true);

        const ticketRes = await generateTicket();

        // eslint-disable-next-line no-underscore-dangle
        const _client = new Client({
          brokerURL: `${url}?ticket=${encodeURIComponent(
            ticketRes.data.ticket
          )}`,
          reconnectDelay: 5000,
          heartbeatIncoming: 4000,
          heartbeatOutgoing: 4000,
        });

        clientRef.current = _client;

        _client.onConnect = () => {
          setTimeout(() => {
            setConnecting(false);
            setConnected(true);
          }, 2000);
        };

        _client.onDisconnect = () => {
          setConnecting(false);
          setConnected(false);
        };

        _client.onStompError = (frame) => {
          setConnecting(false);
          setConnected(false);
          // eslint-disable-next-line no-console
          console.error(frame.body);
          setError(frame.body);
        };

        _client.activate();
      })();
    }

    return () => {
      clientRef.current?.forceDisconnect();
    };
  }, [url]);

  return (
    <StompContext.Provider value={stomp}>{children}</StompContext.Provider>
  );
}

export const useStomp = () => {
  const context = useContext(StompContext);

  if (!context) {
    throw new Error(
      "useStomp() may be used only in the context of a <StompProvider> component"
    );
  }

  return context;
};
