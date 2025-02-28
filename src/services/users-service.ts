import { http } from "../../http";

export const UsersService = {
  async getUsers() {
    return await http.get(`/users/`);
  },

  async registerUsers(data: any) {
    return await http.post(`/users/`, data);
  },

  async getUsersType() {
    return await http.get(`/api/usersType`);
  },
};
