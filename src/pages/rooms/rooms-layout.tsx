import { RoomsProvider } from "./context/rooms-context";
import { Rooms } from "./rooms";

export const RoomsLayout = () => {
  return (
    <RoomsProvider>
      <Rooms />
    </RoomsProvider>
  );
};
