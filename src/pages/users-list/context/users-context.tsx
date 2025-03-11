import { IUsers } from "@/interfaces/IUser";
import { IUserType } from "@/interfaces/IUserType";
import { UsersService } from "@/services/users-service";
import { UsersTypeService } from "@/services/users-type-service";
import { createContext, useContext, useEffect, useMemo, useState } from "react";

interface IUsersContext {
  usersList: IUsers[];
  setUsersList: React.Dispatch<React.SetStateAction<IUsers[]>>;
  loading: boolean;
  selectedUsers: IUsers[];
  setSelectedUsers: React.Dispatch<React.SetStateAction<IUsers[]>>;
  usersType: IUserType[];
  setUsersType: React.Dispatch<React.SetStateAction<IUserType[]>>;
  openAddDialog: boolean;
  setOpenAddDialog: React.Dispatch<React.SetStateAction<boolean>>;
  isEdit: boolean;
  setIsEdit: React.Dispatch<React.SetStateAction<boolean>>;

  handleGetUsers: () => void;
  handleGetUsersType: () => void;
}

const UsersContext = createContext<IUsersContext | null>(null);

export const UsersProvider = ({ children }: any) => {
  const [usersList, setUsersList] = useState<IUsers[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<IUsers[]>([]);
  const [usersType, setUsersType] = useState<IUserType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [openAddDialog, setOpenAddDialog] = useState<boolean>(false);
  const [isEdit, setIsEdit] = useState<boolean>(false);

  const handleGetUsers = async () => {
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
  };

  const handleGetUsersType = async () => {
    try {
      const response = await UsersTypeService.getUsersTypes();

      if (response.status === 200) {
        setUsersType(response.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    handleGetUsers();
  }, []);

  const contextValue = useMemo(
    () => ({
      usersList,
      setUsersList,
      loading,
      selectedUsers,
      setSelectedUsers,
      handleGetUsers,
      handleGetUsersType,
      usersType,
      setUsersType,
      openAddDialog,
      setOpenAddDialog,
      isEdit,
      setIsEdit,
    }),
    [
      usersList,
      setUsersList,
      loading,
      selectedUsers,
      setSelectedUsers,
      handleGetUsers,
      handleGetUsersType,
      usersType,
      setUsersType,
      openAddDialog,
      setOpenAddDialog,
      isEdit,
      setIsEdit,
    ]
  );

  return (
    <UsersContext.Provider value={contextValue}>
      {children}
    </UsersContext.Provider>
  );
};

export const useUsersContext = () => {
  const context = useContext(UsersContext);

  if (!context) {
    throw new Error(
      "useUsersContext deve ser usado dentro da tag UsersProvider"
    );
  }

  return context;
};
