import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { RoomStatusEnum } from "@/interfaces/Enums/RoomStatusEnum";
import { RoomStatusKeyEnum } from "@/interfaces/Enums/RoomStatusKeyEnum";
import { IRooms } from "@/interfaces/IRooms";
import { RoomsService } from "@/services/rooms-service";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowSwapVertical } from "iconsax-react";

const handleChangeStatusKey = async (rowValue: IRooms, newStatus: string) => {
  try {
    const data: IRooms = {
      ...rowValue,
      status_key:
        RoomStatusKeyEnum.getOptions().find(
          (status) => status.value === newStatus
        )?.value ?? RoomStatusKeyEnum.Disponivel,
    };

    const response = await RoomsService.updateRoomById(data.id, data);
    console.log(response);
  } catch (error) {
    console.error(error);
  }
};

export const RoomsColumns: ColumnDef<IRooms>[] = [
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
    accessorKey: "block",
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
    accessorKey: "floor",
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
    accessorKey: "type",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="w-full p-0 justify-between"
        >
          TIPO DE SALA
          <ArrowSwapVertical size="20" />
        </Button>
      );
    },
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
          DISPONIBILIDADE
          <ArrowSwapVertical size="20" />
        </Button>
      );
    },
  },
  {
    accessorKey: "status_key",
    header: () => {
      return <div className="uppercase">Status da chave física</div>;
    },
    cell: ({ row }) => {
      const roomStatus = row.original.status;
      const statusKey = row.original.status_key; // Valor atual da linha

      return (
        <Select
          defaultValue={statusKey}
          onValueChange={(newValue) =>
            handleChangeStatusKey(row.original, newValue)
          }
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Selecione um status da chave física" />
          </SelectTrigger>
          <SelectContent>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <SelectItem
                    key={RoomStatusKeyEnum.Disponivel}
                    value={RoomStatusKeyEnum.Disponivel}
                    disabled={
                      roomStatus.replace(/"/g, "") !== RoomStatusEnum.Disponivel
                    }
                  >
                    {RoomStatusKeyEnum.Disponivel}
                  </SelectItem>
                </TooltipTrigger>
                {roomStatus.replace(/"/g, "") !== RoomStatusEnum.Disponivel && (
                  <TooltipContent>
                    <p>
                      O status da chave so pode ser mudado para "Disponivel" se
                      a reserva estiver como "Disponivel"
                    </p>
                  </TooltipContent>
                )}
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <SelectItem
                    key={RoomStatusKeyEnum.Retirada}
                    value={RoomStatusKeyEnum.Retirada}
                    disabled={
                      roomStatus.replace(/"/g, "") !== RoomStatusEnum.Reservada
                    }
                  >
                    {RoomStatusKeyEnum.Retirada}
                  </SelectItem>
                </TooltipTrigger>
                {roomStatus.replace(/"/g, "") !== RoomStatusEnum.Reservada && (
                  <TooltipContent>
                    <p>
                      O status da chave so pode ser mudado para "Disponivel" se
                      a reserva estiver como "Disponivel"
                    </p>
                  </TooltipContent>
                )}
              </Tooltip>
            </TooltipProvider>
          </SelectContent>
        </Select>
      );
    },
  },
];
