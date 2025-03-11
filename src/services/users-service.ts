import { http } from "../../http";

export const UsersService = {
  async getAllUsers() {
    return await http.get(`/users/`);
  },

  async getUserById(id: number) {
    return await http.get(`/users/${id}/`);
  },

  async createUser(data: any) {
    return await http.post(`/users/`, data);
  },

  async createListUsers(data: any) {
    return await http.post(`/users/listUsers/`, data);
  },

  async updateUserById(id: number) {
    return await http.patch(`/users/${id}/`);
  },

  async updateListUsers(data: any) {
    return await http.patch(`/users/listUsers/`, data);
  },

  async deleteUserById(id: number) {
    return await http.delete(`/users/${id}/`);
  },

  async deleteListUsers(data: any) {
    return await http.delete(`/users/listUsers/`, { data: data });
  },
};
