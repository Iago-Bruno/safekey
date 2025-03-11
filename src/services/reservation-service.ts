import { http } from "../../http";

export const ReservationService = {
  async getAllReservations() {
    return await http.get(`/reservations/`);
  },

  async getReservationById(id: string | undefined) {
    return await http.get(`reservations/${id}/`);
  },

  async createReservation(data: any) {
    return await http.post(`/reservations/`, data);
  },

  async createListReservations(data: any) {
    return await http.post(`/reservations/listReservations/`, data);
  },

  async updateReservationById(id: number | undefined, data: any) {
    return await http.patch(`/reservations/${id}/`, data);
  },

  async updateListReservations(data: any) {
    return await http.patch(`/reservations/listReservations/`, data);
  },

  async deleteReservationById(id: number) {
    return await http.delete(`/reservations/${id}/`);
  },

  async deleteListReservations(data: any) {
    return await http.delete(`/reservations/listReservations/`, { data: data });
  },

  async getAllRoomsReservations(roomId: number) {
    return await http.get(`/reservations/${roomId}/roomReservations/`);
  },

  async getAllUsersReservations(userId: number) {
    return await http.get(`/reservations/${userId}/userReservations/`);
  },
};
