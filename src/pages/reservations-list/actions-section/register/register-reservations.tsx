import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useReservationsContext } from "../../context/reservations-context";
import { AuthUtils } from "@/utils/authUtils";
import { Button } from "@/components/ui/button";
import { UsersTypeEnum } from "@/interfaces/Enums/UsersTypeEnum";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { CloseCircle, CloseSquare } from "iconsax-react";
import { CommonLoading } from "@/components/loading/CommonLoading";
import { useEffect, useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ReservationService } from "@/services/reservation-service";
import { ToastAction } from "@/components/ui/toast";
import { useToast } from "@/hooks/use-toast";

const scheduleSchema = z
  .object({
    id: z.number().optional(),
    date: z
      .string({ required_error: "Data é obrigatória" })
      .min(1, "Data da Reserva não pode ser vazio")
      .refine(
        (val) => {
          // Faz o parsing da data para considerar o fuso horário local
          const [year, month, day] = val.split("-").map(Number);
          const selectedDate = new Date(year, month - 1, day);
          const today = new Date();
          const todayDate = new Date(
            today.getFullYear(),
            today.getMonth(),
            today.getDate()
          );
          return selectedDate >= todayDate;
        },
        { message: "A data não pode ser anterior ao dia atual" }
      ),
    startTime: z
      .string({ required_error: "Horário de início é obrigatório" })
      .min(1, "Horário de início não pode ser vazio"),
    endTime: z
      .string({ required_error: "Horário de fim é obrigatório" })
      .min(1, "Horário de fim não pode ser vazio"),
    reason: z
      .string({ required_error: "Motivo da Reserva é obrigatório" })
      .min(10, "Motivo da Reserva tem que ter pelo menos 10 caractéres"),
    commentary: z.string().optional(),
    room: z
      .string({ required_error: "Sala da Reserva é obrigatório!" })
      .min(1, { message: "Sala da Reserva não pode ser vazia" }),
    responsible: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    const { date, startTime, endTime } = data;
    const userType = AuthUtils.getLoggedUserType();

    // Se o usuário for "Aluno", o responsável deve ser obrigatório
    if (
      userType === "Aluno" &&
      (!data.responsible || data.responsible.trim() === "")
    ) {
      ctx.addIssue({
        code: "custom",
        message: "Responsável é obrigatório",
        path: ["responsible"],
      });
    }

    // Se algum campo estiver ausente, as validações de required já tratarão isso.
    if (!date || !startTime || !endTime) return;

    const [year, month, day] = date.split("-").map(Number);
    const selectedDate = new Date(year, month - 1, day);

    // Cria data de hoje sem considerar o horário
    const hoje = new Date();
    const hojeSemHora = new Date(
      hoje.getFullYear(),
      hoje.getMonth(),
      hoje.getDate()
    );
    const isToday = selectedDate.toDateString() === hojeSemHora.toDateString();

    // Converte os horários (formato "HH:mm") em objetos Date usando a data selecionada
    const [startHour, startMinute] = startTime.split(":").map(Number);
    const [endHour, endMinute] = endTime.split(":").map(Number);

    const startDateTime = new Date(selectedDate);
    startDateTime.setHours(startHour, startMinute, 0, 0);

    const endDateTime = new Date(selectedDate);
    endDateTime.setHours(endHour, endMinute, 0, 0);

    // Se a data for hoje, os horários devem ser posteriores ao horário atual
    if (isToday) {
      const agora = new Date();
      if (startDateTime <= agora) {
        ctx.addIssue({
          code: "custom",
          message: "Horário de início deve ser posterior ao horário atual.",
          path: ["startTime"],
        });
      }
      if (endDateTime <= agora) {
        ctx.addIssue({
          code: "custom",
          message: "Horário de fim deve ser posterior ao horário atual.",
          path: ["endTime"],
        });
      }
    }

    // O horário de início deve ser estritamente anterior ao de fim
    if (startDateTime >= endDateTime) {
      ctx.addIssue({
        code: "custom",
        message: "Horário de início deve ser anterior ao horário de fim.",
        path: ["startTime"],
      });
    }
  });

const FormSchema = z
  .object({
    reservations: z.array(scheduleSchema),
  })
  .superRefine((data, ctx) => {
    const reservations = data.reservations;

    for (let i = 0; i < reservations.length; i++) {
      const { date, startTime, endTime, room } = reservations[i];

      for (let j = i + 1; j < reservations.length; j++) {
        const other = reservations[j];

        if (room === other.room && date === other.date) {
          // Converter horários para minutos totais do dia
          const [startHour, startMinute] = startTime.split(":").map(Number);
          const [endHour, endMinute] = endTime.split(":").map(Number);
          const [otherStartHour, otherStartMinute] = other.startTime
            .split(":")
            .map(Number);
          const [otherEndHour, otherEndMinute] = other.endTime
            .split(":")
            .map(Number);

          const startTotal = startHour * 60 + startMinute;
          const endTotal = endHour * 60 + endMinute;
          const otherStartTotal = otherStartHour * 60 + otherStartMinute;
          const otherEndTotal = otherEndHour * 60 + otherEndMinute;

          // Verifica se os horários se sobrepõem
          if (
            (startTotal < otherEndTotal && endTotal > otherStartTotal) ||
            (otherStartTotal < endTotal && otherEndTotal > startTotal)
          ) {
            const message =
              "Conflito de horário! Esta sala já está reservada nesse período.";

            // Adiciona erro no horário de início
            ctx.addIssue({
              code: "custom",
              message,
              path: [`reservations.${i}.startTime`],
            });

            ctx.addIssue({
              code: "custom",
              message,
              path: [`reservations.${j}.startTime`],
            });

            // Adiciona erro na sala para exibir abaixo do Select também
            ctx.addIssue({
              code: "custom",
              message,
              path: [`reservations.${i}.room`],
            });

            ctx.addIssue({
              code: "custom",
              message,
              path: [`reservations.${j}.room`],
            });
          }
        }
      }
    }
  });

export const RegisterReservations = () => {
  const { toast } = useToast();
  const {
    handleGetReservations,
    setIsEdit,
    isEdit,
    openAddDialog,
    setOpenAddDialog,
    selectedReservations,
    roomsList,
    usersList,
  } = useReservationsContext();
  const [loadingSubmit, setLoadingSubmit] = useState<boolean>(false);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      reservations: [
        {
          date: new Date().toISOString().split("T")[0],
          endTime: "23:59",
          startTime: "22:00",
          reason: "Reserva feita apenas para testes | 1",
          commentary: "Somente um comentário extra",
          room: "1",
        },
        {
          date: new Date().toISOString().split("T")[0],
          endTime: "22:00",
          startTime: "20:00",
          reason: "Reserva feita apenas para testes | 2",
          room: "1",
        },
      ],
    },
  });
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "reservations",
  });

  const handleClose = (e?: any) => {
    e?.preventDefault();

    form.reset({
      reservations: [
        {
          date: "",
          endTime: "",
          startTime: "",
          reason: "",
          room: "",
        },
      ],
    });
    setIsEdit(false);
    setOpenAddDialog(false);
  };

  const handleDialogClose = (isOpen: boolean) => {
    if (!isOpen) {
      handleClose();
    }
    setOpenAddDialog(isOpen);
  };

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setLoadingSubmit(true);

    try {
      const requests = data.reservations.map(async (reservation) => {
        const formatedReservation = {
          date_schedulling: reservation.date,
          start_time: reservation.startTime,
          end_time: reservation.endTime,
          reason: reservation.reason,
          responsible_id: reservation.responsible || null,
          commentary: reservation.commentary,
          room_id: reservation.room,
          user_id: AuthUtils.getAccessUser()?.id,
        };

        try {
          return isEdit
            ? await ReservationService.updateReservationById(
                reservation.id,
                formatedReservation
              )
            : await ReservationService.createReservation(formatedReservation);
        } catch (error: any) {
          // Caso haja erro na API
          return { error: true, response: error.response };
        }
      });

      const responses = await Promise.all(requests);

      const successResponses = responses.filter(
        (response) =>
          "status" in response &&
          (response.status === 201 || response.status === 200)
      );

      const duplicateErrors = responses.filter(
        (response) =>
          "error" in response &&
          response.response?.status === 400 &&
          Array.isArray(response.response?.data?.detail) &&
          response.response?.data?.detail.some((msg: string) =>
            msg.includes("A sala já está reservada para o mesmo dia e horário.")
          )
      );

      if (duplicateErrors.length > 0) {
        toast({
          variant: "destructive",
          title: `Falha ao ${
            isEdit ? "editar" : "cadastrar"
          }: Dados duplicados`,
          description:
            "Já existe uma reserva idêntica cadastrada. Altere os dados e tente novamente.",
          action: (
            <ToastAction
              className="bg-transparent border-0 p-0 hover:bg-transparent"
              altText="Close"
            >
              <CloseCircle size="24" color="#ffffff" variant="Broken" />
            </ToastAction>
          ),
        });
      } else if (successResponses.length === responses.length) {
        toast({
          variant: "success",
          title: `${
            !isEdit
              ? "Novas reservas foram cadastradas"
              : "Reservas atualizadas"
          } com sucesso!`,
          action: (
            <ToastAction
              className="bg-transparent border-0 p-0 hover:bg-transparent"
              altText="Close"
            >
              <CloseCircle size="24" color="#ffffff" variant="Broken" />
            </ToastAction>
          ),
        });

        setOpenAddDialog(false);
      } else {
        toast({
          variant: "destructive",
          title: "Erro ao salvar as reservas",
          description:
            "Algumas reservas não puderam ser processadas. Verifique os dados e tente novamente.",
          action: (
            <ToastAction
              className="bg-transparent border-0 p-0 hover:bg-transparent"
              altText="Close"
            >
              <CloseCircle size="24" color="#ffffff" variant="Broken" />
            </ToastAction>
          ),
        });
      }
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Erro inesperado",
        description:
          "Ocorreu um erro ao processar a solicitação. Tente novamente mais tarde.",
        action: (
          <ToastAction
            className="bg-transparent border-0 p-0 hover:bg-transparent"
            altText="Close"
          >
            <CloseCircle size="24" color="#ffffff" variant="Broken" />
          </ToastAction>
        ),
      });
    } finally {
      setLoadingSubmit(false);
      handleGetReservations();
    }
  }

  useEffect(() => {
    if (isEdit) {
      const formatedSelectedReservations = {
        reservations: selectedReservations.map((selectedReservation) => ({
          id: selectedReservation.id,
          date: new Date(selectedReservation.date_schedulling)
            .toISOString()
            .split("T")[0],
          endTime: selectedReservation.end_time,
          startTime: selectedReservation.start_time,
          reason: selectedReservation.reason,
          commentary: selectedReservation.commentary,
          room: selectedReservation.room.id.toString(),
        })),
      };

      form.reset(formatedSelectedReservations);
    }
  }, [isEdit]);

  return (
    <Dialog open={openAddDialog} onOpenChange={handleDialogClose}>
      <DialogTrigger type="button">
        <Button variant={"terciary"}>CRIAR UMA RESERVA</Button>
      </DialogTrigger>

      <DialogContent
        aria-describedby={undefined}
        forceMount
        className="max-w-screen-lg px-8 py-12 max-h-[80vh] overflow-auto"
      >
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <DialogHeader className="flex flex-row justify-between items-center w-full">
              <DialogTitle>
                <Label className="font-KumbhSans font-semibold text-3xl text-foreground_100">
                  Criar novas reservas
                </Label>
              </DialogTitle>
              <div>
                <Button
                  className="hover:bg-foreground_50 bg-foreground_80 text-foreground"
                  type="button"
                  onClick={() =>
                    append({
                      date: "",
                      startTime: "",
                      endTime: "",
                      reason: "",
                      room: "",
                    })
                  }
                >
                  Adicionar nova reserva à lista
                </Button>
              </div>
            </DialogHeader>

            <section className="dialog-body flex flex-col gap-6">
              {fields.length === 0 && (
                <div className="flex justify-center items-center mt-12 mb-8">
                  <Label className="font-KumbhSans font-semibold text-xl text-foreground_100">
                    Clique no botão "Adicionar nova reserva à lista" para gerar
                    os campos de cadastro
                  </Label>
                </div>
              )}
              {fields.map((field, index) => (
                <div key={field.id} className="space-y-4">
                  <Separator className="bg-foreground_50 w-full mt-8" />

                  <section className="w-full flex justify-end">
                    <Button
                      variant={"ghost"}
                      className="justify-end"
                      type="button"
                      onClick={() => remove(index)}
                    >
                      Remover reserva da lista
                      <CloseSquare />
                    </Button>
                  </section>

                  {AuthUtils.verifyLoggedUserIsAluno() && (
                    <section className="section-select-responsible grid grid-flow-col grid-rows-1 gap-8">
                      <FormField
                        control={form.control}
                        name={`reservations.${index}.responsible`}
                        render={({ field, fieldState }) => (
                          <FormItem>
                            <FormLabel className="font-KumbhSans font-medium text-sm text-foreground_90">
                              Usuário Responsável
                            </FormLabel>
                            <Select
                              defaultValue={field.value}
                              onValueChange={field.onChange}
                            >
                              <FormControl className="border-gray_100 h-[42px] text-foreground_80">
                                <SelectTrigger>
                                  <SelectValue placeholder="Selecione um usuário" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {usersList.map((user) => {
                                  if (
                                    user.type.type.replace(/"/g, "") !==
                                    UsersTypeEnum.Aluno
                                  ) {
                                    return (
                                      <SelectItem
                                        key={user.id}
                                        value={user.id.toString()}
                                        className="cursor-pointer"
                                      >
                                        {user.name}
                                      </SelectItem>
                                    );
                                  }
                                })}
                              </SelectContent>
                            </Select>
                            {fieldState.error ? (
                              <FormMessage />
                            ) : (
                              <FormDescription className="font-KumbhSans font-medium text-sm text-foreground_50">
                                Defina qual usuário é responsável pelo uso da
                                sala
                              </FormDescription>
                            )}
                          </FormItem>
                        )}
                      />
                    </section>
                  )}

                  <section className="section-inputs grid grid-flow-col grid-rows-1 gap-8">
                    <FormField
                      control={form.control}
                      name={`reservations.${index}.date`}
                      render={({ field }) => (
                        <FormItem className="w-full !max-w-[476px]">
                          <FormLabel className="font-KumbhSans font-medium text-sm text-foreground_90">
                            Data da Reserva
                          </FormLabel>
                          <FormControl className="w-full h-[42px] border-gray_100">
                            <Input
                              type="date"
                              className="w-full"
                              {...field}
                              min={new Date().toISOString().split("T")[0]}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`reservations.${index}.startTime`}
                      render={({ field }) => (
                        <FormItem className="w-full !max-w-[476px]">
                          <FormLabel className="font-KumbhSans font-medium text-sm text-foreground_90">
                            Horário de Início
                          </FormLabel>
                          <FormControl className="w-full h-[42px] border-gray_100">
                            <Input type="time" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`reservations.${index}.endTime`}
                      render={({ field }) => (
                        <FormItem className="w-full !max-w-[476px]">
                          <FormLabel className="font-KumbhSans font-medium text-sm text-foreground_90">
                            Horário de Termino
                          </FormLabel>
                          <FormControl className="w-full h-[42px] border-gray_100">
                            <Input type="time" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </section>

                  <section className="section-select-room grid grid-flow-col grid-rows-1 gap-8">
                    <FormField
                      control={form.control}
                      name={`reservations.${index}.room`}
                      render={({ field, fieldState }) => (
                        <FormItem>
                          <FormLabel className="font-KumbhSans font-medium text-sm text-foreground_90">
                            Sala para reserva
                          </FormLabel>
                          <Select
                            defaultValue={field.value}
                            onValueChange={field.onChange}
                          >
                            <FormControl className="border-gray_100 h-[42px] text-foreground_80">
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione uma sala" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {roomsList.map((room) => (
                                <SelectItem
                                  key={room.id}
                                  value={room.id.toString()}
                                  className="cursor-pointer"
                                >
                                  {room.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          {fieldState.error ? (
                            <FormMessage />
                          ) : (
                            <FormDescription className="font-KumbhSans font-medium text-sm text-foreground_50">
                              Defina qual sala será reservada
                            </FormDescription>
                          )}
                        </FormItem>
                      )}
                    />
                  </section>

                  <section className="section-textAreas grid grid-flow-col grid-rows-1 gap-8">
                    <FormField
                      control={form.control}
                      name={`reservations.${index}.reason`}
                      render={({ field }) => (
                        <FormItem className="w-full !max-w-[476px]">
                          <FormLabel className="font-KumbhSans font-medium text-sm text-foreground_90">
                            Motivo da reserva
                          </FormLabel>
                          <FormControl className="w-full h-[42px] border-gray_100">
                            <Textarea
                              placeholder="Informe o motivo de estar reservando esta sala"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`reservations.${index}.commentary`}
                      render={({ field }) => (
                        <FormItem className="w-full !max-w-[476px]">
                          <FormLabel className="font-KumbhSans font-medium text-sm text-foreground_90">
                            Comentários Extras (Opcional)
                          </FormLabel>
                          <FormControl className="w-full h-[42px] border-gray_100">
                            <Textarea
                              placeholder="Informe um comentário extras sobre esta reserva"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </section>
                </div>
              ))}
            </section>

            <DialogFooter className="w-full justify-start mt-6 gap-4">
              <Button variant={"ghost"} onClick={handleClose}>
                Cancelar
              </Button>
              <Button
                variant="primary"
                type="submit"
                disabled={fields.length === 0}
              >
                {loadingSubmit ? (
                  <CommonLoading size="6" color="#fff" />
                ) : (
                  `${!isEdit ? "Adicionar novas" : "Atualizar"} reservas`
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
