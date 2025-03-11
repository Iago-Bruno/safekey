import { Label } from "@/components/ui/label";
import { IRooms } from "@/interfaces/IRooms";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { CommonLoading } from "@/components/loading/CommonLoading";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { CloseCircle } from "iconsax-react";
import { RoomsService } from "@/services/rooms-service";
import { ToastAction } from "@/components/ui/toast";
import { useToast } from "@/hooks/use-toast";
import { ReservationService } from "@/services/reservation-service";
import { IRoomReservationsList } from "../context/rooms-context";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { AuthUtils } from "@/utils/authUtils";
import { UsersTypeEnum } from "@/interfaces/Enums/UsersTypeEnum";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface IRoomsInfoTabProps {
  selectedRooms: IRooms[];
  setSelectedRooms: React.Dispatch<React.SetStateAction<IRooms[]>>;
  roomReservationsList: IRoomReservationsList[];
  setRoomReservationsList: React.Dispatch<
    React.SetStateAction<IRoomReservationsList[]>
  >;
  handleGetRooms: () => void;
  setRowSelection: React.Dispatch<React.SetStateAction<{}>>;
  setHeader: (component: React.ReactNode) => void;
  setOpenAddDialog: React.Dispatch<React.SetStateAction<boolean>>;
  setIsEdit: React.Dispatch<React.SetStateAction<boolean>>;
}

export const RoomsInfoTab = ({
  handleGetRooms,
  selectedRooms,
  roomReservationsList,
  setRoomReservationsList,
  setRowSelection,
  setSelectedRooms,
  setHeader,
  setOpenAddDialog,
  setIsEdit,
}: IRoomsInfoTabProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState<boolean>(false);

  const handleDeleteRooms = async () => {
    setLoading(true);
    try {
      const response = await RoomsService.deleteListRooms(selectedRooms);

      if (response.status === 204) {
        toast({
          variant: "success",
          title: "Salas deletados com sucesso!",
          action: (
            <ToastAction
              className="bg-transparent border-0 p-0 hover:bg-transparent"
              altText="Goto schedule to undo"
            >
              <CloseCircle size="24" color="#ffffff" variant="Broken" />
            </ToastAction>
          ),
        });

        handleCleanInfoTab();
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCleanInfoTab = () => {
    setRowSelection({});
    setSelectedRooms([]);
    handleGetRooms();
    setHeader(null);
  };

  const handleClickEdit = () => {
    setIsEdit(true);
    setOpenAddDialog(true);
  };

  const handleGetReservationsRoom = async (roomId: number) => {
    try {
      const response = await ReservationService.getAllRoomsReservations(roomId);

      if (response.status === 200) {
        setRoomReservationsList((prevState) => [
          ...prevState,
          { roomId: roomId, reservations: response.data },
        ]);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleShowRoomReservationDetails = () => {
    alert("Indo pra tela de reservas...");
  };

  return (
    <Card className="section-info-tab w-full bg-foreground mt-8">
      <CardHeader className="bg-foreground_100 rounded-t-lg">
        <CardTitle className="flex items-start justify-between font-KumbhSans font-semibold text-xl text-white">
          Detalhes das salas
          <Button
            variant={"icon"}
            size={"icon"}
            onClick={handleCleanInfoTab}
            className="mt-2"
          >
            <CloseCircle />
          </Button>
        </CardTitle>
      </CardHeader>

      <Separator />

      <CardContent>
        {selectedRooms.map((room) => {
          return (
            <Accordion
              key={room.id}
              type="single"
              collapsible
              className="w-full"
            >
              <AccordionItem value="item-1">
                <AccordionTrigger
                  onClick={() => handleGetReservationsRoom(room.id)}
                >
                  <div className="flex items-center gap-3 font-Inter font-semibold text-base text-foreground_80">
                    <Label>{room.name}</Label>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="space-y-4">
                  <div className="flex flex-col">
                    <Label className="font-Inter font-medium text-xs text-foreground_80">
                      REF ID
                    </Label>
                    <Label className="font-Inter font-semibold text-base text-foreground_80">
                      {room.id}
                    </Label>
                  </div>
                  <div className="flex flex-col">
                    <Label className="font-Inter font-medium text-xs text-foreground_80">
                      BLOCO
                    </Label>
                    <Label className="font-Inter font-semibold text-base text-foreground_80">
                      {room.block}
                    </Label>
                  </div>
                  <div className="flex flex-col">
                    <Label className="font-Inter font-medium text-xs text-foreground_80">
                      ANDAR
                    </Label>
                    <Label className="font-Inter font-semibold text-base text-foreground_80">
                      {room.floor}
                    </Label>
                  </div>
                  <div className="flex flex-col">
                    <Label className="font-Inter font-medium text-xs text-foreground_80">
                      TIPO DE SALA
                    </Label>
                    <Label className="font-Inter font-semibold text-base text-foreground_80">
                      {room.type}
                    </Label>
                  </div>
                  <div className="flex flex-col">
                    <Label className="font-Inter font-medium text-xs text-foreground_80">
                      DISPONIBILIDADE
                    </Label>
                    <Label className="font-Inter font-semibold text-base text-foreground_80">
                      {room.status}
                    </Label>
                  </div>
                  <div className="flex flex-col items-start gap-2">
                    <Label className="font-Inter font-medium text-xs text-foreground_80">
                      Há{" "}
                      {
                        roomReservationsList.find(
                          (roomReserv) => roomReserv.roomId === room.id
                        )?.reservations.length
                      }{" "}
                      reservas vinculadas à esta sala
                    </Label>
                    <Button
                      variant={"ghost"}
                      onClick={handleShowRoomReservationDetails}
                      className="font-Inter font-semibold text-base text-foreground_80"
                    >
                      Ver detalhes
                    </Button>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          );
        })}
      </CardContent>

      <CardFooter>
        <div className="w-full flex items-center justify-between">
          <TooltipProvider disableHoverableContent={true}>
            <Tooltip>
              <TooltipTrigger
                className={`${
                  !AuthUtils.verifyLoggedUserIsAdmin() && "cursor-not-allowed"
                }`}
              >
                <Button
                  variant={"secondary_outline"}
                  type="submit"
                  onClick={handleClickEdit}
                  disabled={!AuthUtils.verifyLoggedUserIsAdmin()}
                >
                  {loading ? <CommonLoading size="6" color="#fff" /> : "EDITAR"}
                </Button>
              </TooltipTrigger>
              {!AuthUtils.verifyLoggedUserIsAdmin() && (
                <TooltipContent>
                  <p>
                    Somente {UsersTypeEnum.Administrador} podem editar alunos
                  </p>
                </TooltipContent>
              )}
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider disableHoverableContent={true}>
            <Tooltip>
              <TooltipTrigger
                className={`${
                  !AuthUtils.verifyLoggedUserIsAdmin() && "!cursor-not-allowed"
                }`}
              >
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant={"destructive_outline"}
                      disabled={loading || !AuthUtils.verifyLoggedUserIsAdmin()}
                    >
                      {loading ? (
                        <CommonLoading size="6" color="#fff" />
                      ) : (
                        "DELETAR"
                      )}
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Tem certeza que deseja deletar as salas selecionados?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        Está ação não poderá ser desfeita. Isto irá deletar
                        permanentimente a conta das salas do sistema
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction onClick={handleDeleteRooms}>
                        Continuar
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </TooltipTrigger>
              {!AuthUtils.verifyLoggedUserIsAdmin() && (
                <TooltipContent>
                  <p>
                    Somente {UsersTypeEnum.Administrador} podem deletar alunos
                  </p>
                </TooltipContent>
              )}
            </Tooltip>
          </TooltipProvider>
        </div>
      </CardFooter>
    </Card>
  );
};
