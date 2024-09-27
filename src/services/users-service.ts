import { http } from "../../http";

export const UsersService = {
  async getUsers() {
    return await http.get(`/api/users`);
  },

  async registerUsers(data: any) {
    return await http.post(`/api/register`, data);
  },
};
