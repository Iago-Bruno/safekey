import { http } from "../../http";

export const DecisionsService = {
  async approve(id: string | undefined) {
    return await http.get(`reservations/${id}/approve/`);
  },

  async reject(id: string | undefined) {
    return await http.get(`reservations/${id}/reject/`);
  },
};
