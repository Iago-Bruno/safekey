import { IRooms } from "@/interfaces/IRooms";
import { RoomsService } from "@/services/rooms-service";
import { createContext, useContext, useEffect, useMemo, useState } from "react";

interface IRoomsContext {
  roomsList: IRooms[];
  setRoomsList: React.Dispatch<React.SetStateAction<IRooms[]>>;
  selectedRooms: IRooms[];
  setSelectedRooms: React.Dispatch<React.SetStateAction<IRooms[]>>;
  roomReservationsList: IRoomReservationsList[];
  setRoomReservationsList: React.Dispatch<
    React.SetStateAction<IRoomReservationsList[]>
  >;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  openAddDialog: boolean;
  setOpenAddDialog: React.Dispatch<React.SetStateAction<boolean>>;
  isEdit: boolean;
  setIsEdit: React.Dispatch<React.SetStateAction<boolean>>;

  handleGetRooms: () => void;
}

export interface IRoomReservationsList {
  roomId: number;
  reservations: any[];
}

const RoomsContext = createContext<IRoomsContext | null>(null);

export const RoomsProvider = ({ children }: any) => {
  const [roomsList, setRoomsList] = useState<IRooms[]>([]);
  const [roomReservationsList, setRoomReservationsList] = useState<
    IRoomReservationsList[]
  >([]);
  const [selectedRooms, setSelectedRooms] = useState<IRooms[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [openAddDialog, setOpenAddDialog] = useState<boolean>(false);
  const [isEdit, setIsEdit] = useState<boolean>(false);

  const handleGetRooms = async () => {
    try {
      const response = await RoomsService.getAllRooms();

      if (response.status === 200) {
        const responseData = response.data;

        setRoomsList(responseData);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleGetRooms();
  }, []);

  const contextValue = useMemo(
    () => ({
      roomsList,
      setRoomsList,
      selectedRooms,
      setSelectedRooms,
      loading,
      setLoading,
      handleGetRooms,
      roomReservationsList,
      setRoomReservationsList,
      openAddDialog,
      setOpenAddDialog,
      isEdit,
      setIsEdit,
    }),
    [
      roomsList,
      setRoomsList,
      selectedRooms,
      setSelectedRooms,
      loading,
      setLoading,
      handleGetRooms,
      roomReservationsList,
      setRoomReservationsList,
      openAddDialog,
      setOpenAddDialog,
      isEdit,
      setIsEdit,
    ]
  );

  return (
    <RoomsContext.Provider value={contextValue}>
      {children}
    </RoomsContext.Provider>
  );
};

export const useRoomsContext = () => {
  const context = useContext(RoomsContext);

  if (!context) {
    throw new Error(
      "useRoomsContext deve ser usado dentro da tag RoomsProvider"
    );
  }

  return context;
};
