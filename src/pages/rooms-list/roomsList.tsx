import { useWebSocket } from "@/utils/webSocketConnect";
import { useRoomsContext } from "./context/rooms-context";
import { RoomsDataTable } from "./table/rooms-data-table";
import { RoomsColumns } from "./table/rooms-table-columns";
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { CloseCircle } from "iconsax-react";

export const RoomsList = () => {
  const { roomsList, handleGetRooms } = useRoomsContext();
  const { toast } = useToast();

  useWebSocket({
    url: import.meta.env.VITE_WEBSOCKET_URL,
    onMessage: (data) => {
      if (data.updated && data.updated === "sala") {
        handleGetRooms();

        toast({
          variant: "success",
          title: `Houve uma mudança de status da sala!`,
          action: (
            <ToastAction
              className="bg-transparent border-0 p-0 hover:bg-transparent"
              altText="Goto schedule to undo"
            >
              <CloseCircle size="24" color="#ffffff" variant="Broken" />
            </ToastAction>
          ),
        });
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
