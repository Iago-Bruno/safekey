import { CommonLoading } from "@/components/loading/CommonLoading";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ToastAction } from "@/components/ui/toast";
import { useToast } from "@/hooks/use-toast";
import { ReservationStatusEnum } from "@/interfaces/Enums/ReservationStatusEnum";
import { IRooms } from "@/interfaces/IRooms";
import { IUsers } from "@/interfaces/IUser";
import { DecisionsService } from "@/services/decision-service";
import { ReservationService } from "@/services/reservation-service";
import { RoomsService } from "@/services/rooms-service";
import { UsersService } from "@/services/users-service";
import {
  AlignBottom,
  Building,
  Calendar,
  ClipboardText,
  Clock,
  CloseCircle,
} from "iconsax-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export interface ICompleteReservationType {
  id: 13;
  date_schedulling: Date;
  start_time: string;
  end_time: string;
  reason: string;
  commentary: string;
  status: ReservationStatusEnum;
  deleted_at: Date | null;
  user: IUsers;
  responsible: IUsers;
  room: IRooms;
}

export const TemplateDecision = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { toast } = useToast();
  const [completedReservation, setCompletedReservation] =
    useState<ICompleteReservationType>();
  const [loading, setLoading] = useState<boolean>(true);

  const handleApprove = async () => {
    try {
      const response = await DecisionsService.approve(id);

      if (response.status === 200) {
        toast({
          variant: "success",
          title: `A reserva da sala foi aprovada!`,
          description: `A sala ${completedReservation?.room.name} foi reservada pelo aluno ${completedReservation?.user.name}`,
          action: (
            <ToastAction
              className="bg-transparent border-0 p-0 hover:bg-transparent"
              altText="Goto schedule to undo"
            >
              <CloseCircle size="24" color="#ffffff" variant="Broken" />
            </ToastAction>
          ),
        });
      }
    } catch (error) {
      console.error(error);
    } finally {
      window.location.reload();
    }
  };

  const handleReject = async () => {
    try {
      const response = await DecisionsService.reject(id);

      if (response.status === 200) {
        toast({
          variant: "success",
          title: `A reserva da sala foi rejeitada!`,
          description: `O pedido da reserva da sala ${completedReservation?.room.name} feito pelo aluno ${completedReservation?.user.name} foi recusado`,
          action: (
            <ToastAction
              className="bg-transparent border-0 p-0 hover:bg-transparent"
              altText="Goto schedule to undo"
            >
              <CloseCircle size="24" color="#ffffff" variant="Broken" />
            </ToastAction>
          ),
        });
      }
    } catch (error) {
      console.error(error);
    } finally {
      window.location.reload();
    }
  };

  const formatCompleteDate = (date?: Date): string => {
    if (!date) return "Data inválida";

    return date.toLocaleDateString("pt-BR", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const formatTimeBRT = (timeStr: string | undefined): string => {
    if (!timeStr) return "Horário inválido";

    const [hours, minutes] = timeStr.split(":").map(Number);

    // Cria um objeto Date no fuso horário brasileiro
    const date = new Date();
    date.setHours(hours, minutes, 0);

    // Formata para "HH:mm" no fuso BRT
    return `${date.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    })} BRT`;
  };

  const formatTime = (timeStr: string | undefined): string => {
    if (!timeStr) return "Horário inválido";

    const [hours, minutes] = timeStr.split(":").map(Number);

    // Cria um objeto Date no fuso horário brasileiro
    const date = new Date();
    date.setHours(hours, minutes, 0);

    // Formata para "HH:mm"
    return `${date.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    })}`;
  };

  useEffect(() => {
    const getReservationData = async () => {
      try {
        const responseReservation = await ReservationService.getReservationById(
          id
        );
        const responseAluno = await UsersService.getUserById(
          responseReservation.data.user
        );
        const responseRoom = await RoomsService.getRoomById(
          responseReservation.data.room
        );

        if (
          responseReservation.status === 200 &&
          responseAluno.status === 200 &&
          responseRoom.status === 200
        ) {
          setCompletedReservation({
            ...responseReservation.data,
            user: { ...responseAluno.data },
            room: { ...responseRoom.data },
          });
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    getReservationData();
  }, []);

  return (
    <div className="login-form w-screen h-screen flex flex-col bg-gray_5 items-center justify-center">
      <span className="background-header absolute top-0 z-0 w-screen h-[42%] bg-blue_2" />
      <div className="z-10 flex flex-col items-center justify-center gap-16">
        <section className="flex flex-col text-center gap-4">
          <Label className="font-KumbhSans font-semibold text-4xl text-white">
            Solicitação de reserva
          </Label>
          {completedReservation?.status !== ReservationStatusEnum.Pendente ? (
            <Label className="font-KumbhSans font-bold text-2xl text-white">
              Esta reserva já foi processada! <br />
              Você pode fechar está tela ou voltar ao dashboard
            </Label>
          ) : (
            <Label className="font-KumbhSans font-semibold text-xl text-white">
              Você foi solicitado para confirmar uma reserva
            </Label>
          )}
        </section>

        <section className="details-section bg-white w-[512px] min-h-[382px] rounded-2xl gap-4 shadow-md">
          {loading ? (
            <CommonLoading />
          ) : (
            <div className="w-full flex flex-col py-4 px-4">
              <section className="section-avatar flex flex-col px-4 mb-4 gap-2">
                <Label className="font-Inter font-medium text-sm text-foreground_80">
                  Responsável pela Reserva
                </Label>
                <div className="flex items-center gap-3">
                  <Avatar className="w-12 h-12 border border-black">
                    <AvatarImage
                      src={completedReservation?.user.avatar}
                      alt="@shadcn"
                    />
                    <AvatarFallback>
                      {completedReservation?.user.name
                        .split(" ")
                        .map((palavra) => palavra[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="h-full flex flex-col justify-center">
                    <h1 className="m-0 p-0 font-Inter font-normal text-base text-foreground_90">
                      {completedReservation?.user.name}
                    </h1>
                    <h1 className="m-0 p-0 font-Inter font-normal text-xs text-foreground_80">
                      {completedReservation?.user.type.type}
                    </h1>
                  </div>
                </div>
              </section>

              <Separator className="bg-foreground_100" />

              <section className="section-reservation-details px-4 my-4 flex flex-col gap-2">
                <Label className="font-Inter font-medium text-sm text-foreground_80">
                  Detalhes da Reserva
                </Label>
                <Card className="w-full h-full">
                  <CardContent className="pb-2 px-0">
                    <section className="room-section flex flex-col px-2 gap-2 py-2">
                      <div className="flex justify-between items-center px-2">
                        <div className="flex items-center gap-2">
                          <span className="w-[36px] h-[36px] flex items-center justify-center bg-white rounded-lg shadow-lg">
                            <AlignBottom
                              variant="Broken"
                              size="24"
                              color="#233255"
                            />
                          </span>
                          <Label className="font-Inter font-medium text-sm text-foreground_00">
                            Sala
                          </Label>
                        </div>
                        <div>
                          <Label className="font-Inter font-medium text-sm text-foreground_90">
                            {completedReservation?.room.block +
                              ", " +
                              completedReservation?.room.floor +
                              ", " +
                              completedReservation?.room.name}
                          </Label>
                        </div>
                      </div>
                      <Separator className="bg-foreground_100" />
                    </section>

                    <section className="room-section flex flex-col px-2 gap-2 py-2">
                      <div className="flex justify-between items-center px-2">
                        <div className="flex items-center gap-2">
                          <span className="w-[36px] h-[36px] flex items-center justify-center bg-white rounded-lg shadow-lg">
                            <Building
                              variant="Broken"
                              size="24"
                              color="#233255"
                            />
                          </span>
                          <Label className="font-Inter font-medium text-sm text-foreground_00">
                            Tipo de sala
                          </Label>
                        </div>
                        <div>
                          <Label className="font-Inter font-medium text-sm text-foreground_90">
                            {completedReservation?.room.type}
                          </Label>
                        </div>
                      </div>
                      <Separator className="bg-foreground_100" />
                    </section>

                    <section className="date-section flex flex-col px-2 gap-2 py-2">
                      <div className="flex justify-between items-center px-2">
                        <div className="flex items-center gap-2">
                          <span className="w-[36px] h-[36px] flex items-center justify-center bg-white rounded-lg shadow-lg">
                            <Calendar
                              variant="Broken"
                              size="24"
                              color="#233255"
                            />
                          </span>
                          <Label className="font-Inter font-medium text-sm text-foreground_00">
                            Dia e Data
                          </Label>
                        </div>
                        <div>
                          <Label className="font-Inter font-medium text-sm text-foreground_90">
                            {formatCompleteDate(
                              new Date(
                                completedReservation?.date_schedulling
                                  ? completedReservation.date_schedulling
                                  : ""
                              )
                            )}
                          </Label>
                        </div>
                      </div>
                      <Separator className="bg-foreground_100" />
                    </section>

                    <section className="time-section flex flex-col px-2 gap-2 py-2">
                      <div className="flex justify-between items-center px-2">
                        <div className="flex items-center gap-2">
                          <span className="w-[36px] h-[36px] flex items-center justify-center bg-white rounded-lg shadow-lg">
                            <Clock variant="Broken" size="24" color="#233255" />
                          </span>
                          <Label className="font-Inter font-medium text-sm text-foreground_00">
                            Horário início - fim
                          </Label>
                        </div>
                        <div>
                          <Label className="font-Inter font-medium text-sm text-foreground_90">
                            {formatTime(completedReservation?.start_time) +
                              " - " +
                              formatTimeBRT(completedReservation?.end_time)}
                          </Label>
                        </div>
                      </div>
                      <Separator className="bg-foreground_100" />
                    </section>

                    <section className="time-section flex flex-col px-2 gap-2 py-2">
                      <div className="flex justify-between items-center px-2">
                        <div className="flex items-center gap-2">
                          <span className="w-[36px] h-[36px] flex items-center justify-center bg-white rounded-lg shadow-lg">
                            <ClipboardText
                              variant="Broken"
                              size="24"
                              color="#233255"
                            />
                          </span>
                          <Label className="font-Inter font-medium text-sm text-foreground_00">
                            Motivo da reserva
                          </Label>
                        </div>
                        <div>
                          <Label className="font-Inter font-medium text-sm text-foreground_90">
                            {completedReservation?.reason}
                          </Label>
                        </div>
                      </div>
                    </section>
                  </CardContent>
                </Card>
              </section>

              <section className="buttons-section flex justify-between mt-4">
                {completedReservation?.status !==
                ReservationStatusEnum.Pendente ? (
                  <>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant={"default"}
                          type="submit"
                          className="w-[40%]"
                        >
                          Recusar
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            Você tem certeza que deseja recusar a reserva?
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            Esta ação não poderá ser desfeita. A reserva do
                            aluno será marcado como recusado e ele será
                            notificado.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction
                            className="bg-yellow-400 text-white flex items-center justify-center hover:bg-yellow-500"
                            onClick={handleReject}
                          >
                            Continuar
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant={"primary"}
                          type="submit"
                          className="w-[40%]"
                        >
                          Aceitar
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            Você tem certeza que deseja aceitar a reserva?
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            Esta ação não poderá ser desfeita. A reserva do
                            aluno será aceito e ele será notificado.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction
                            className="bg-yellow-400 text-white flex items-center justify-center hover:bg-yellow-500"
                            onClick={handleApprove}
                          >
                            Continuar
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </>
                ) : (
                  <Button
                    variant={"default"}
                    type="submit"
                    className="w-full"
                    onClick={() => navigate(`/dashboard`)}
                  >
                    Voltar ao Dashboard
                  </Button>
                )}
              </section>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};
