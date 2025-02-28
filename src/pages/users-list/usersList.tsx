import { useEffect, useState } from "react";
import { columns } from "./columns";
import { DataTable } from "./data_table";
import { UsersService } from "@/services/users-service";
import { IUsersTableCollums } from "@/interfaces/IUsersTableCollums";
import { OutletContextType } from "../layout";
import { useOutletContext } from "react-router-dom";

export const UsersList = () => {
  const { setHeader } = useOutletContext<OutletContextType>();
  const [usersList, setUsersList] = useState<IUsersTableCollums[]>([]);

  useEffect(() => {
    const getUsers = async () => {
      try {
        const response = await UsersService.getUsers();

        console.log(response);

        if (response.status === 200) {
          const responseData = response.data;

          // const formatedUsers = responseData.map((user: any) => {
          //   return {
          //     id: user.id,
          //     nome: user.name,
          //     email: user.email,
          //     tipo: user.type.type,
          //   };
          // });

          const formatedUsers = responseData
            .map((user: any) => {
              return {
                id: user.id,
                nome: user.name,
                email: user.email,
                tipo: user.type.type,
              };
            })
            .flatMap((user: any) => new Array(12).fill(user));

          setUsersList(formatedUsers);
        }
      } catch (error) {
        console.error(error);
      }
    };

    getUsers();

    setHeader(
      <h1 className="text-2xl font-bold">
        Novo Header Dinâmico das listagens de usuários
      </h1>
    );

    return () => setHeader(null);
  }, []);

  return (
    <div className="w-full h-full mr-4">
      <DataTable columns={columns} data={usersList} />
    </div>
  );
};
