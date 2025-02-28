import { Button } from "@/components/ui/button";
import { IRoomsTableCollums } from "@/interfaces/IRoomsTableCollums";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowSwapVertical } from "iconsax-react";

export const RoomsColumns: ColumnDef<IRoomsTableCollums>[] = [
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
    accessorKey: "bloco",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="w-full p-0 justify-between"
        >
          BLOCO
          <ArrowSwapVertical size="20" />
        </Button>
      );
    },
  },
  {
    accessorKey: "andar",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="w-full p-0 justify-between"
        >
          ANDAR
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
  {
    accessorKey: "disponibilidade",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="w-full p-0 justify-between"
        >
          DISPONIBILIDADE
          <ArrowSwapVertical size="20" />
        </Button>
      );
    },
  },
];
