import { RoomsProvider } from "./context/rooms-context";
import { RoomsList } from "./roomsList";

export const RoomsLayout = () => {
  return (
    <RoomsProvider>
      <RoomsList />
    </RoomsProvider>
  );
};
