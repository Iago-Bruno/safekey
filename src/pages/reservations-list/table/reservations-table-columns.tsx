import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { IReservations } from "@/interfaces/IReservations";
import { IUsers } from "@/interfaces/IUser";
import { DateUtils } from "@/utils/dateUtils";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowSwapVertical } from "iconsax-react";

export const ReservationsColumns: ColumnDef<IReservations>[] = [
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
  },
  {
    accessorKey: "date_schedulling",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="w-full p-0 justify-between"
        >
          DATA DA RESERVA
          <ArrowSwapVertical size="20" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const date = row.original.date_schedulling;
      return DateUtils.formatDateToPTBR(date);
    },
  },
  {
    accessorKey: "start_time",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="w-full p-0 justify-between"
        >
          HORÁRIO DE INÍCIO
          <ArrowSwapVertical size="20" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const start_time = row.original.start_time;

      return DateUtils.formatTimeToHHMM(start_time);
    },
  },
  {
    accessorKey: "end_time",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="w-full p-0 justify-between"
        >
          HORÁRIO DE TERMINO
          <ArrowSwapVertical size="20" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const end_time = row.original.end_time;

      return DateUtils.formatTimeToHHMM(end_time);
    },
  },
  {
    accessorKey: "user",
    filterFn: (row, columnId, filterValue) => {
      const user = row.getValue(columnId) as IUsers;
      // Garante que user e user.name existam e faz a comparação
      return user?.name.toLowerCase().includes(filterValue.toLowerCase());
    },
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="w-full p-0 justify-between"
        >
          RESERVADO POR
          <ArrowSwapVertical size="20" />
        </Button>
      );
    },
    cell: ({ row }) => row.original.user.name,
  },
  {
    accessorKey: "status",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="w-full p-0 justify-between"
        >
          STATUS
          <ArrowSwapVertical size="20" />
        </Button>
      );
    },
  },
];
