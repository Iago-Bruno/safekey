import { IUserType } from "./IUserType";

export interface IUsers {
  id: number;
  name: string;
  password: string;
  email: string;
  type: IUserType;
  avatar?: string;
}
