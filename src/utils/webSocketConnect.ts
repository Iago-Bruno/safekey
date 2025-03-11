import { useEffect, useRef } from "react";

type WebSocketOptions = {
  url: string;
  onMessage: (data: any) => void;
  onOpen?: () => void;
  onError?: (error: Event) => void;
  onClose?: (event: CloseEvent) => void;
  reconnectDelay?: number; // Tempo de reconexão em ms
};

export const useWebSocket = ({
  url,
  onMessage,
  onOpen,
  onError,
  onClose,
  reconnectDelay = 3000,
}: WebSocketOptions) => {
  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (socketRef.current) return; // Evita múltiplas conexões

    const connectWebSocket = () => {
      socketRef.current = new WebSocket(url);

      socketRef.current.onopen = () => {
        console.log("Conectado ao WebSocket");
        if (onOpen) onOpen();
      };

      socketRef.current.onmessage = (event) => {
        const data = JSON.parse(event.data);
        onMessage(data);
      };

      socketRef.current.onerror = (error) => {
        console.error("Erro no WebSocket:", error);
        if (onError) onError(error);
      };

      socketRef.current.onclose = (event) => {
        console.log("WebSocket fechado. Tentando reconectar...", event);
        socketRef.current = null;
        if (onClose) onClose(event);
        setTimeout(connectWebSocket, reconnectDelay);
      };
    };

    connectWebSocket();

    return () => {
      socketRef.current?.close();
    };
  }, [url]);
};
