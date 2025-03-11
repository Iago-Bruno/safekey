import { ReservationsProvider } from "./context/reservations-context";
import { ReservationList } from "./reservationsList";

export const ReservationsLayout = () => {
  return (
    <ReservationsProvider>
      <ReservationList />
    </ReservationsProvider>
  );
};
