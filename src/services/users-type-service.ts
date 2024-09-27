import { http } from "../../http";

export const UsersTypeService = {
  async getUsersType() {
    return await http.get(`/api/usersType`);
  },
};
