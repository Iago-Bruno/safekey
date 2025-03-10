import { Button } from "@/components/ui/button";
import { IUsersTableCollums } from "@/interfaces/IUsersTableCollums";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowSwapVertical } from "iconsax-react";

export const columns: ColumnDef<IUsersTableCollums>[] = [
  {
    accessorKey: "id",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="w-full p-0 justify-between"
        >
          RED ID
          <ArrowSwapVertical size="20" />
        </Button>
      );
    },
  },
  {
    accessorKey: "nome",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="w-full p-0 justify-between"
        >
          <span>NOME</span>
          <ArrowSwapVertical size="20" />
        </Button>
      );
    },
  },
  {
    accessorKey: "email",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="w-full p-0 justify-between"
        >
          EMAIL
          <ArrowSwapVertical size="20" />
        </Button>
      );
    },
  },
  {
    accessorKey: "tipo",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="w-full p-0 justify-between"
        >
          TIPO DE ACESSO
          <ArrowSwapVertical size="20" />
        </Button>
      );
    },
  },
];
