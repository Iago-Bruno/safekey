import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { IUsers } from "@/interfaces/IUser";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowSwapVertical } from "iconsax-react";

const fuzzyFilter = (
  row: { getValue: (columnId: string) => any },
  columnId: string,
  filterValue: string
): boolean => {
  const rowValue = row.getValue(columnId);
  return String(rowValue).toLowerCase().includes(filterValue.toLowerCase());
};

export const UsersTableColumns: ColumnDef<IUsers>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => {
          table.toggleAllRowsSelected(!!value);
        }}
        aria-label="Selecionar todos"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value: any) => row.toggleSelected(!!value)}
        aria-label="Selecionar linha"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
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
    filterFn: fuzzyFilter,
  },
  {
    accessorKey: "name",
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
    accessorFn: (row) => {
      // Verifica se "row.type" é um objeto e possui a propriedade "type"
      if (
        typeof row.type === "object" &&
        row.type !== null &&
        "type" in row.type
      ) {
        return row.type.type;
      }
      // Se "row.type" não for um objeto, retorna o próprio valor
      return row.type;
    },
    accessorKey: "type",
    id: "type",
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
