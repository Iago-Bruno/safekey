import { http } from "../../http";

export const LabsService = {
  async getLabs() {
    return await http.get(`/api/labs`);
  },

  async changeLabStatus(data: any) {
    return await http.put(`/api/labs`, data);
  },
};
