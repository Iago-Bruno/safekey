import { http } from "../../http";

export const UsersTypeService = {
  async getUsersTypes() {
    return await http.get(`/usersTypes/`);
  },
};
