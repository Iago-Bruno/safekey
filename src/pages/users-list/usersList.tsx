import { UsersTableColumns } from "./table/users_table_columns";
import { UsersDataTable } from "./table/users_data_table";
import { useUsersContext } from "./context/users-context";

export const UsersList = () => {
  const { usersList } = useUsersContext();

  return (
    <div className="w-full h-full mr-4">
      <UsersDataTable columns={UsersTableColumns} data={usersList} />
    </div>
  );
};
