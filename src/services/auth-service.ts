import { http } from "../../http";

export const AuthService = {
  async login(data: any) {
    return await http.post(`/login/`, data);
  },
};
