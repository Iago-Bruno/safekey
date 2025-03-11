import { IReservations } from "@/interfaces/IReservations";
import { IRooms } from "@/interfaces/IRooms";
import { IUsers } from "@/interfaces/IUser";
import { ReservationService } from "@/services/reservation-service";
import { RoomsService } from "@/services/rooms-service";
import { UsersService } from "@/services/users-service";
import { AuthUtils } from "@/utils/authUtils";
import { createContext, useContext, useEffect, useMemo, useState } from "react";

interface IReservationsContext {
  reservationsList: IReservations[];
  setReservationsList: React.Dispatch<React.SetStateAction<IReservations[]>>;
  selectedReservations: IReservations[];
  setSelectedReservations: React.Dispatch<
    React.SetStateAction<IReservations[]>
  >;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  openAddDialog: boolean;
  setOpenAddDialog: React.Dispatch<React.SetStateAction<boolean>>;
  isEdit: boolean;
  setIsEdit: React.Dispatch<React.SetStateAction<boolean>>;
  roomsList: IRooms[];
  usersList: IUsers[];

  handleGetReservations: () => void;
  handleGetRooms: () => void;
  handleGetUsers: () => void;
}

const ReservationsContext = createContext<IReservationsContext | null>(null);

export const ReservationsProvider = ({ children }: any) => {
  const [reservationsList, setReservationsList] = useState<IReservations[]>([]);
  const [roomsList, setRoomsList] = useState<IRooms[]>([]);
  const [usersList, setUsersList] = useState<IUsers[]>([]);
  const [selectedReservations, setSelectedReservations] = useState<
    IReservations[]
  >([]);
  const [openAddDialog, setOpenAddDialog] = useState<boolean>(false);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  const handleGetReservations = async () => {
    try {
      const response = await ReservationService.getAllReservations();

      if (response.status === 200) {
        const responseData = response.data;

        setReservationsList(responseData);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

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

  const handleGetUsers = async () => {
    if (AuthUtils.verifyLoggedUserIsAluno()) {
      try {
        const response = await UsersService.getAllUsers();

        if (response.status === 200) {
          const responseData = response.data;

          setUsersList(responseData);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    handleGetReservations();
    handleGetRooms();
    handleGetUsers();
  }, []);

  const contextValue = useMemo(
    () => ({
      reservationsList,
      setReservationsList,
      loading,
      setLoading,
      handleGetReservations,
      selectedReservations,
      setSelectedReservations,
      openAddDialog,
      setOpenAddDialog,
      isEdit,
      setIsEdit,
      roomsList,
      usersList,
      handleGetUsers,
      handleGetRooms,
    }),
    [
      reservationsList,
      setReservationsList,
      loading,
      setLoading,
      handleGetReservations,
      selectedReservations,
      setSelectedReservations,
      openAddDialog,
      setOpenAddDialog,
      isEdit,
      setIsEdit,
      roomsList,
      usersList,
      handleGetUsers,
      handleGetRooms,
    ]
  );

  return (
    <ReservationsContext.Provider value={contextValue}>
      {children}
    </ReservationsContext.Provider>
  );
};

export const useReservationsContext = () => {
  const context = useContext(ReservationsContext);

  if (!context) {
    throw new Error(
      "useReservationsContext deve ser usado dentro da tag ReservationsProvider"
    );
  }

  return context;
};
