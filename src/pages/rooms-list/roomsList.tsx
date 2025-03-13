import { useWebSocket } from "@/utils/webSocketConnect";
import { useRoomsContext } from "./context/rooms-context";
import { RoomsDataTable } from "./table/rooms-data-table";
import { RoomsColumns } from "./table/rooms-table-columns";

export const RoomsList = () => {
  const { roomsList, handleGetRooms } = useRoomsContext();

  useWebSocket({
    url: import.meta.env.VITE_WEBSOCKET_URL,
    onMessage: (data) => {
      if (data.updated && data.updated === "sala") {
        handleGetRooms();
      }
    },
    onError: (error) => console.error("Erro no WebSocket:", error),
    onClose: (event) => console.log("WebSocket desconectado", event),
  });

  return (
    <div className="w-full h-full mr-4">
      <section className="table-section h-full bg-foreground px-4">
        <RoomsDataTable data={roomsList} columns={RoomsColumns} />
      </section>
    </div>
  );
};
