import { useEffect, useState } from "react";
import { columns, UserType } from "./columns";
import { DataTable } from "./data_table";
import { UsersService } from "@/services/users-service";

export const UsersList = () => {
  const [usersList, setUsersList] = useState<UserType[]>([]);

  useEffect(() => {
    const getUsers = async () => {
      try {
        const response = await UsersService.getUsers();

        if (response.status === 200) {
          const responseData = response.data.data;

          const formatedUsers = responseData.map((user: any) => {
            return {
              id: user.id,
              nome: user.name,
              email: user.email,
              matricula: user.matricula,
              tipo: user.user_type_name,
            };
          });

          setUsersList(formatedUsers);
        }
      } catch (error) {
        console.error(error);
      }
    };

    getUsers();
  }, []);

  return (
    <div className="container w-full h-full px-16 py-8">
      <DataTable columns={columns} data={usersList} />
    </div>
  );
};
