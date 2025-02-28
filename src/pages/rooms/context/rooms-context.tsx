import { IRoomsType } from "@/interfaces/IRooms";
import { IRoomsTableCollums } from "@/interfaces/IRoomsTableCollums";
import { RoomsService } from "@/services/rooms-service";
import { createContext, useContext, useEffect, useState } from "react";

interface IRoomsContext {
  roomsList: IRoomsType[];
  setRoomsList: React.Dispatch<React.SetStateAction<IRoomsType[]>>;
  tableRoomsList: IRoomsTableCollums[];
}

const RoomsContext = createContext<IRoomsContext | null>(null);

export const RoomsProvider = ({ children }: any) => {
  const [roomsList, setRoomsList] = useState<IRoomsType[]>([]);
  const [tableRoomsList, setTableRoomsList] = useState<IRoomsTableCollums[]>(
    []
  );

  useEffect(() => {
    const getRooms = async () => {
      try {
        const response = await RoomsService.getRooms();

        if (response.status === 200) {
          const responseData = response.data;
          setRoomsList(responseData);

          const formatedUsers = responseData
            .map((room: any) => {
              return {
                id: room.id,
                nome: room.name,
                bloco: room.block,
                andar: room.floor,
                tipo: room.type,
                disponibilidade: room.status,
              };
            })
            .flatMap((user: any) => new Array(1).fill(user));

          setTableRoomsList(formatedUsers);
        }
      } catch (error) {
        console.error(error);
      }
    };

    getRooms();
  }, []);
  return (
    <RoomsContext.Provider value={{ roomsList, setRoomsList, tableRoomsList }}>
      {children}
    </RoomsContext.Provider>
  );
};

export const useRoomsContext = () => {
  const context = useContext(RoomsContext);

  if (!context) {
    throw new Error(
      "useRoomsContext deve ser usado dentro da tag NegotiationProvider"
    );
  }

  return context;
};
