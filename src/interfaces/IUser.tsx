export type IUserType = {
  id: number;
  name: string;
  password: string;
  email: string;
  type: {
    id: number;
    type: string;
  };
  avatar?: string;
};

export type IUsersType = {
  id: number;
  type: string;
};
