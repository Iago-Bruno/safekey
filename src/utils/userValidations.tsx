import { IUserType } from "@/interfaces/IUser";
import { UsersTypeService } from "@/services/users-type-service";

const loggedUser: IUserType = JSON.parse(
  localStorage.getItem("access_user") || "null"
);

const getUsersType = async () => {
  try {
    const response = await UsersTypeService.getUsersTypes();

    if (response.status === 200) {
      return response.data;
    }
  } catch (error) {
    console.error(error);
  }
};

export const ValidateLoggedUserIsAdmin = async (
  UsersTypes?: any
): Promise<boolean> => {
  const types = UsersTypes ?? (await getUsersType());
  return loggedUser.type.id === types[0].id;
};

export const ValidateLoggedUserIsProfessor = async (
  UsersTypes?: any
): Promise<boolean> => {
  const types = UsersTypes ?? (await getUsersType());
  return loggedUser.type.id === types[1].id;
};

export const ValidateLoggedUserIsAluno = async (
  UsersTypes?: any
): Promise<boolean> => {
  const types = UsersTypes ?? (await getUsersType());
  return loggedUser.type.id === types[2].id;
};
