import { IRooms } from "./IRooms";
import { IUsers } from "./IUser";

export type IReservations = {
  id: number;
  date_schedulling: Date;
  start_time: string;
  end_time: string;
  reason: string;
  commentary: string;
  status: string;
  deleted_at: Date | null;
  user: IUsers;
  responsible: IUsers;
  room: IRooms;
};
