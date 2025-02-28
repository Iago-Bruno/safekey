import { http } from "../../http";

export const RoomsService = {
  async getRooms() {
    return await http.get(`/rooms/`);
  },

  async changeLabStatus(data: any) {
    return await http.put(`/api/labs`, data);
  },
};
