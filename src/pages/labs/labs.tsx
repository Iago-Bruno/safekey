import { DataTableLabs } from "./data_table";
import { useEffect, useState } from "react";
import { LabsService } from "@/services/labs-service";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowDown2, CloseCircle } from "iconsax-react";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";

export type LabsType = {
  id: number;
  nome: string;
  status: "Disponivel" | "Ocupado";
};

export const Labs = () => {
  const [labsData, setLabsData] = useState<LabsType[]>([]);

  const columnsLabs: ColumnDef<LabsType>[] = [
    {
      accessorKey: "name",
      header: "Nome",
    },
    {
      accessorKey: "status",
      enableResizing: true,
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Status
            <ArrowDown2 size="20" color="#FF8A65" className="ml-1" />
          </Button>
        );
      },
    },
    {
      id: "actions",
      header: "Ações",
      cell: ({ row }) => {
        const lab = row.original;
        const { toast } = useToast();
        const [labState, setLabState] = useState<string>(lab.status);

        const changeLabStatus = async (lab: LabsType) => {
          try {
            const data = {
              id: lab.id,
              status: lab.status === "Disponivel" ? 2 : 1,
            };

            const response = await LabsService.changeLabStatus(data);

            if (response.status === 200) {
              toast({
                variant: "success",
                title: `Sinta-se livre para ${
                  labState === "Disponivel" ? "pegar" : "devolver"
                } a chave do laboratório`,
                action: (
                  <ToastAction
                    className="bg-transparent border-0 p-0 hover:bg-transparent"
                    altText="Goto schedule to undo"
                  >
                    <CloseCircle size="24" color="#ffffff" variant="Broken" />
                  </ToastAction>
                ),
              });
              getLabs();
              return;
            }

            toast({
              variant: "destructive",
              title: "Opps! Houve um erro ao tentar cadastrar o usuário.",
              description: "Por favor tente novamente mais tarde!",
              action: (
                <ToastAction
                  className="bg-transparent border-0 p-0 hover:bg-transparent"
                  altText="Goto schedule to undo"
                >
                  <CloseCircle size="24" color="#ffffff" variant="Broken" />
                </ToastAction>
              ),
            });
          } catch (error) {
            console.error(error);
          }
        };

        return (
          <Dialog>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0" type="button">
                  <span className="sr-only">Abrir menu</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Ações</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DialogTrigger type="button" className="w-full text-start">
                  <DropdownMenuItem
                    disabled={lab.status === "Ocupado"}
                    onClick={() => setLabState(lab.status)}
                  >
                    Pegar chave
                  </DropdownMenuItem>
                </DialogTrigger>
                <DialogTrigger type="button" className="w-full text-start">
                  <DropdownMenuItem
                    disabled={lab.status === "Disponivel"}
                    onClick={() => setLabState(lab.status)}
                  >
                    Devolver chave
                  </DropdownMenuItem>
                </DialogTrigger>
              </DropdownMenuContent>
            </DropdownMenu>

            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  Deseja {labState === "Disponivel" ? "pegar" : "devolver"} a
                  chave?
                </DialogTitle>
              </DialogHeader>
              <DialogFooter>
                <Button type="submit" onClick={() => changeLabStatus(lab)}>
                  Confirmar
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        );
      },
    },
  ];

  const getLabs = async () => {
    try {
      const response = await LabsService.getLabs();

      if (response.status === 200) {
        setLabsData(response.data.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getLabs();
  }, []);

  return (
    <div className="container w-full h-full px-16 py-8">
      <DataTableLabs columns={columnsLabs} data={labsData} />
    </div>
  );
};
