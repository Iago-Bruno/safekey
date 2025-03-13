import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { Label } from "@/components/ui/label";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CloseCircle, CloseSquare } from "iconsax-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ToastAction } from "@/components/ui/toast";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";
import { CommonLoading } from "@/components/loading/CommonLoading";
import { RoomsService } from "@/services/rooms-service";
import { useRoomsContext } from "../../context/rooms-context";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { AuthUtils } from "@/utils/authUtils";
import { UsersTypeEnum } from "@/interfaces/Enums/UsersTypeEnum";

const FormSchema = z.object({
  rooms: z.array(
    z.object({
      id: z.number().optional(),
      name: z
        .string({ required_error: "Nome da sala é obrigatório!" })
        .min(2, {
          message: "Nome da sala tem que pelo menos 2 caracteres!",
        })
        .max(30, {
          message: "Nome da sala sala deve ter no máximo 30 caracteres!",
        }),
      block: z
        .string({ required_error: "Bloco/Edifício é obrigatório!" })
        .min(2, {
          message: "Bloco/Edifício tem que pelo menos 2 caracteres!",
        })
        .max(10, {
          message: "Bloco/Edifício deve ter no máximo 10 caracteres!",
        }),
      floor: z
        .string({ required_error: "Andar é obrigatório!" })
        .min(2, {
          message: "Andar tem que pelo menos 2 caracteres!",
        })
        .max(10, {
          message: "Andar deve ter no máximo 10 caracteres!",
        }),
      type: z
        .string({ required_error: "Tipo de sala é obrigatório!" })
        .min(2, {
          message: "Tipo de sala tem que pelo menos 2 caracteres!",
        })
        .max(15, {
          message: "Tipo de sala deve ter no máximo 15 caracteres!",
        }),
    })
  ),
});

export const RegisterRooms = () => {
  const { toast } = useToast();
  const {
    handleGetRooms,
    setIsEdit,
    isEdit,
    openAddDialog,
    setOpenAddDialog,
    selectedRooms,
  } = useRoomsContext();
  const [loadingSubmit, setLoadingSubmit] = useState<boolean>(false);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      rooms: [
        {
          name: "Sala de Reunião 1",
          block: "Bloco A",
          floor: "1° Andar",
          type: "Sala de Reunião",
        },
        {
          name: "Auditório de TSI",
          block: "Bloco B",
          floor: "1° Andar",
          type: "Auditório",
        },
      ],
    },
    mode: "onChange",
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "rooms",
  });

  const handleClose = (e?: any) => {
    e?.preventDefault();

    form.reset({
      rooms: [
        {
          name: "",
          block: "",
          floor: "",
          type: "",
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
      const response = !isEdit
        ? await RoomsService.createListRooms(data.rooms)
        : await RoomsService.updateListRooms(data.rooms);

      if (response.status === 201 || response.status === 200) {
        toast({
          variant: "success",
          title: `${
            !isEdit ? "Novas salas foram cadastrados" : "Sala atualizados"
          } com sucesso!`,
          action: (
            <ToastAction
              className="bg-transparent border-0 p-0 hover:bg-transparent"
              altText="Goto schedule to undo"
            >
              <CloseCircle size="24" color="#ffffff" variant="Broken" />
            </ToastAction>
          ),
        });

        setOpenAddDialog(false);
      } else {
        toast({
          variant: "destructive",
          title: `Opps! Houve um erro ao tentar ${
            !isEdit ? "cadastrar" : "atualizar"
          } a(s) sala(s).`,
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
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingSubmit(false);
      handleGetRooms();
    }
  }

  useEffect(() => {
    if (isEdit) {
      const formatedSelectedRooms = {
        rooms: selectedRooms.map((selectedRoom) => ({
          id: selectedRoom.id,
          name: selectedRoom.name,
          type: selectedRoom.type,
          block: selectedRoom.block,
          floor: selectedRoom.floor,
        })),
      };

      form.reset(formatedSelectedRooms);
    }
  }, [isEdit]);

  return (
    <Dialog open={openAddDialog} onOpenChange={handleDialogClose}>
      <TooltipProvider disableHoverableContent={true}>
        <Tooltip>
          <TooltipTrigger>
            <DialogTrigger
              type="button"
              className={`${
                !AuthUtils.verifyLoggedUserIsAdmin() && "!cursor-not-allowed"
              }`}
            >
              <Button
                variant={"terciary"}
                disabled={!AuthUtils.verifyLoggedUserIsAdmin()}
              >
                CRIAR NOVAS SALAS
              </Button>
            </DialogTrigger>
          </TooltipTrigger>
          {!AuthUtils.verifyLoggedUserIsAdmin() && (
            <TooltipContent>
              <p>
                Somente {UsersTypeEnum.Administrador} podem cadastrar alunos
              </p>
            </TooltipContent>
          )}
        </Tooltip>
      </TooltipProvider>

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
                  {isEdit
                    ? "Atualizar/Adicionar salas"
                    : "Adicionar novas salas"}
                </Label>
              </DialogTitle>
              <div>
                <Button
                  className="hover:bg-foreground_50 bg-foreground_80 text-foreground"
                  type="button"
                  onClick={() =>
                    append({ name: "", block: "", floor: "", type: "" })
                  }
                >
                  Adicionar nova sala à lista
                </Button>
              </div>
            </DialogHeader>

            <section className="dialog-body flex flex-col gap-6">
              {fields.length === 0 && (
                <div className="flex justify-center items-center mt-12 mb-8">
                  <Label className="font-KumbhSans font-semibold text-xl text-foreground_100">
                    Clique no botão "Adicionar novo sala à lista" para gerar os
                    campos de cadastro
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
                      Remover sala da lista
                      <CloseSquare />
                    </Button>
                  </section>
                  <section className="section-inputs grid grid-flow-col grid-rows-2 gap-8">
                    <FormField
                      control={form.control}
                      name={`rooms.${index}.name`}
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormLabel className="font-KumbhSans font-medium text-sm text-foreground_90">
                            Nome da Sala
                          </FormLabel>
                          <FormControl className="h-[42px] border-gray_100 text-foreground_80">
                            <Input
                              placeholder="Insira o nome da sala de aula"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`rooms.${index}.block`}
                      render={({ field, fieldState }) => (
                        <FormItem className="w-full">
                          <FormLabel className="font-KumbhSans font-medium text-sm text-foreground_90">
                            Bloco
                          </FormLabel>
                          <FormControl className="w-full h-[42px] border-gray_100">
                            <Input
                              placeholder="Insira o bloco da sala de aula"
                              {...field}
                            />
                          </FormControl>
                          {fieldState.error ? (
                            <FormMessage />
                          ) : (
                            <FormDescription className="font-KumbhSans font-medium text-sm text-foreground_50">
                              Bloco/Edifício da sala de aula
                            </FormDescription>
                          )}
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`rooms.${index}.floor`}
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormLabel className="font-KumbhSans font-medium text-sm text-foreground_90">
                            Andar/piso
                          </FormLabel>
                          <FormControl className="w-full h-[42px] border-gray_100">
                            <Input
                              placeholder="Insira andar/piso da sala de aula"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`rooms.${index}.type`}
                      render={({ field, fieldState }) => (
                        <FormItem className="w-full">
                          <FormLabel className="font-KumbhSans font-medium text-sm text-foreground_90">
                            Tipo da sala
                          </FormLabel>
                          <FormControl className="h-[42px] border-gray_100">
                            <Input
                              placeholder="Insira o tipo da sala de aula"
                              {...field}
                            />
                          </FormControl>
                          {fieldState.error ? (
                            <FormMessage />
                          ) : (
                            <FormDescription className="font-KumbhSans font-medium text-sm text-foreground_50">
                              ex: Laboratório, Sala de Reunião, Auditório
                            </FormDescription>
                          )}
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
                  `${!isEdit ? "Adicionar novas" : "Atualizar"} salas`
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
