import { useWebSocket } from "@/utils/webSocketConnect";
import { useReservationsContext } from "./context/reservations-context";
import { ReservationsColumns } from "./table/reservations-table-columns";
import { ReservationsDataTable } from "./table/reservations-data-table";

export const ReservationList = () => {
  const { reservationsList, handleGetReservations } = useReservationsContext();

  useWebSocket({
    url: import.meta.env.VITE_WEBSOCKET_URL,
    onMessage: (data) => {
      if (data.updated && data.updated === "reserva") {
        handleGetReservations();
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
