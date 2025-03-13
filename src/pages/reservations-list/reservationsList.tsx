import { useWebSocket } from "@/utils/webSocketConnect";
import { useReservationsContext } from "./context/reservations-context";
import { ReservationsColumns } from "./table/reservations-table-columns";
import { ReservationsDataTable } from "./table/reservations-data-table";
import { ToastAction } from "@/components/ui/toast";
import { CloseCircle } from "iconsax-react";
import { useToast } from "@/hooks/use-toast";

export const ReservationList = () => {
  const { reservationsList, handleGetReservations } = useReservationsContext();
  const { toast } = useToast();

  useWebSocket({
    url: import.meta.env.VITE_WEBSOCKET_URL,
    onMessage: (data) => {
      if (data.updated && data.updated === "reserva") {
        handleGetReservations();
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
        <ReservationsDataTable
          data={reservationsList}
          columns={ReservationsColumns}
        />
      </section>
    </div>
  );
};
