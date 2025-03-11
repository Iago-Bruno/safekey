import { UsersProvider } from "./context/users-context";
import { UsersList } from "./usersList";

export const UsersLayout = () => {
  return (
    <UsersProvider>
      <UsersList />
    </UsersProvider>
  );
};
