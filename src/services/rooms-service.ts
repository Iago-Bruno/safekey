import { http } from "../../http";

export const RoomsService = {
  async getAllRooms() {
    return await http.get(`/rooms/`);
  },

  async getRoomById(id: number) {
    return await http.get(`/rooms/${id}/`);
  },

  async createRoom(data: any) {
    return await http.post(`/rooms/`, data);
  },

  async createListRooms(data: any) {
    return await http.post(`/rooms/listRooms/`, data);
  },

  async updateRoomById(id: number, data: any) {
    return await http.patch(`/rooms/${id}/`, data);
  },

  async updateListRooms(data: any) {
    return await http.patch(`/rooms/listRooms/`, data);
  },

  async deleteRoomById(id: number) {
    return await http.delete(`/rooms/${id}/`);
  },

  async deleteListRooms(data: any) {
    return await http.delete(`/rooms/listRooms/`, { data: data });
  },

  async changeLabStatus(data: any) {
    return await http.put(`/labs`, data);
  },
};
