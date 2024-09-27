import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowDown2 } from "iconsax-react";

export type UserType = {
  id: number;
  nome: string;
  email: string;
  matricula: string;
  tipo: "Admin" | "Professor" | "Aluno";
};

export const columns: ColumnDef<UserType>[] = [
  {
    accessorKey: "nome",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Nome
          <ArrowDown2 size="20" color="#FF8A65" className="ml-1" />
        </Button>
      );
    },
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "matricula",
    header: "Matricula",
  },
  {
    accessorKey: "tipo",
    header: "Tipo",
  },
];
