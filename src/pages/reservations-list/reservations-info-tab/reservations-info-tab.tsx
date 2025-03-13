import { CommonLoading } from "@/components/loading/CommonLoading";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
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
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ToastAction } from "@/components/ui/toast";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";
import { IReservations } from "@/interfaces/IReservations";
import { ReservationService } from "@/services/reservation-service";
import { AuthUtils } from "@/utils/authUtils";
import { DateUtils } from "@/utils/dateUtils";
import { CloseCircle } from "iconsax-react";
import { useState } from "react";

interface IReservationsInfoTabProps {
  selectedReservations: IReservations[];
  setSelectedReservations: React.Dispatch<
    React.SetStateAction<IReservations[]>
  >;
  handleGetReservations: () => void;
  setRowSelection: React.Dispatch<React.SetStateAction<{}>>;
  setHeader: (component: React.ReactNode) => void;
  setOpenAddDialog: React.Dispatch<React.SetStateAction<boolean>>;
  setIsEdit: React.Dispatch<React.SetStateAction<boolean>>;
}

export const ReservationsInfoTab = ({
  handleGetReservations,
  selectedReservations,
  setRowSelection,
  setSelectedReservations,
  setHeader,
  setOpenAddDialog,
  setIsEdit,
}: IReservationsInfoTabProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState<boolean>(false);

  const handleValidateCanEditOrDelete = (): boolean => {
    return selectedReservations.some(
      (reservation) => reservation.user.id !== AuthUtils.getAccessUser()?.id
    );
  };

  const handleDeleteReservations = async () => {
    setLoading(true);
    try {
      const response = await ReservationService.deleteListReservations(
        selectedReservations
      );

      if (response.status === 204) {
        toast({
          variant: "success",
          title: "Reservas deletados com sucesso!",
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
    setSelectedReservations([]);
    handleGetReservations();
    setHeader(null);
  };

  const handleClickEdit = () => {
    setIsEdit(true);
    setOpenAddDialog(true);
  };

  return (
    <Card className="section-info-tab w-full bg-foreground mt-8">
      <CardHeader className="bg-foreground_100 rounded-t-lg">
        <CardTitle className="flex items-start justify-between font-KumbhSans font-semibold text-xl text-white">
          Detalhes das reservas
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
        {selectedReservations.map((reservation) => {
          return (
            <Accordion
              key={reservation.id}
              type="single"
              collapsible
              className="w-full"
            >
              <AccordionItem value="item-1">
                <AccordionTrigger>
                  <div className="flex items-center gap-3 font-Inter font-semibold text-base">
                    <Label className="text-foreground_80 font-bold">
                      Reserva de:{" "}
                    </Label>
                    <span className="flex flex-col">
                      <Label className="text-foreground_80">
                        {reservation.user.name}{" "}
                        {reservation.user.id ===
                          AuthUtils.getAccessUser()?.id && "(Eu)"}
                      </Label>
                      <Label className="text-foreground_50">
                        {reservation.user.type.type}
                      </Label>
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="space-y-4">
                  <div className="flex flex-col">
                    <Label className="font-Inter font-medium text-xs text-foreground_80">
                      REF ID
                    </Label>
                    <Label className="font-Inter font-semibold text-base text-foreground_80">
                      {reservation.id}
                    </Label>
                  </div>
                  <div className="flex flex-col">
                    <Label className="font-Inter font-medium text-xs text-foreground_80">
                      DATA DA RESERVA
                    </Label>
                    <Label className="font-Inter font-semibold text-base text-foreground_80">
                      {DateUtils.formatDateToPTBR(reservation.date_schedulling)}
                    </Label>
                  </div>
                  <div className="flex flex-col">
                    <Label className="font-Inter font-medium text-xs text-foreground_80">
                      HORÁRIO DE INÍCIO
                    </Label>
                    <Label className="font-Inter font-semibold text-base text-foreground_80">
                      {DateUtils.formatTimeToHHMM(reservation.start_time)}
                    </Label>
                  </div>
                  <div className="flex flex-col">
                    <Label className="font-Inter font-medium text-xs text-foreground_80">
                      HORÁRIO DE TERMINO
                    </Label>
                    <Label className="font-Inter font-semibold text-base text-foreground_80">
                      {DateUtils.formatTimeToHHMM(reservation.end_time)}
                    </Label>
                  </div>
                  {reservation.responsible && (
                    <div className="flex flex-col">
                      <Label className="font-Inter font-medium text-xs text-foreground_80">
                        RESPONSÁVEL PELA RESERVA
                      </Label>
                      <Label className="font-Inter font-semibold text-base text-foreground_80">
                        {reservation.responsible.name}
                      </Label>
                    </div>
                  )}
                  <div className="flex flex-col">
                    <Label className="font-Inter font-medium text-xs text-foreground_80">
                      MOTIVO DA RESERVA
                    </Label>
                    <Label className="font-Inter font-semibold text-base text-foreground_80">
                      {reservation.reason}
                    </Label>
                  </div>
                  {reservation.commentary && (
                    <div className="flex flex-col">
                      <Label className="font-Inter font-medium text-xs text-foreground_80">
                        COMENTÁRIO EXTRAS
                      </Label>
                      <Label className="font-Inter font-semibold text-base text-foreground_80">
                        {reservation.commentary}
                      </Label>
                    </div>
                  )}
                  <div className="flex flex-col">
                    <Label className="font-Inter font-medium text-xs text-foreground_80">
                      SALA RESERVADA
                    </Label>
                    <Label className="font-Inter font-semibold text-base text-foreground_80">
                      {reservation.room.name} - {reservation.room.block} -{" "}
                      {reservation.room.floor}
                    </Label>
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
                  handleValidateCanEditOrDelete() && "cursor-not-allowed"
                }`}
              >
                <Button
                  variant={"secondary_outline"}
                  type="submit"
                  onClick={handleClickEdit}
                  disabled={handleValidateCanEditOrDelete()}
                >
                  {loading ? <CommonLoading size="6" color="#fff" /> : "EDITAR"}
                </Button>
              </TooltipTrigger>
              {handleValidateCanEditOrDelete() && (
                <TooltipContent>
                  <p>So é possível editar reservas feitas por você mesmo</p>
                </TooltipContent>
              )}
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider disableHoverableContent={true}>
            <Tooltip>
              <TooltipTrigger
                className={`${
                  handleValidateCanEditOrDelete() && "!cursor-not-allowed"
                }`}
              >
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant={"destructive_outline"}
                      disabled={loading || handleValidateCanEditOrDelete()}
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
                        Tem certeza que deseja deletar as reservas selecionados?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        Está ação não poderá ser desfeita. Isto irá deletar
                        permanentimente as reservas do sistema
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>

                      <AlertDialogAction onClick={handleDeleteReservations}>
                        Continuar
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </TooltipTrigger>
              {handleValidateCanEditOrDelete() && (
                <TooltipContent>
                  <p>So é possível deletar reservas feitas por você mesmo</p>
                </TooltipContent>
              )}
            </Tooltip>
          </TooltipProvider>
        </div>
      </CardFooter>
    </Card>
  );
};
