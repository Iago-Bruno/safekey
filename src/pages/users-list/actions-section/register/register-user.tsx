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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CloseCircle, CloseSquare, Eye, EyeSlash } from "iconsax-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { UsersService } from "@/services/users-service";
import { ToastAction } from "@/components/ui/toast";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";
import { CommonLoading } from "@/components/loading/CommonLoading";
import { useUsersContext } from "../../context/users-context";
import { IUsers } from "@/interfaces/IUser";
import { AuthUtils } from "@/utils/authUtils";
import { UsersTypeEnum } from "@/interfaces/Enums/UsersTypeEnum";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const FormSchema = z.object({
  users: z.array(
    z.object({
      id: z.number().optional(),
      type: z
        .string()
        .min(1, { message: "Escolha o tipo de acesso do usuário" }),
      name: z.string({ required_error: "Nome é obrigatório!" }).min(2, {
        message: "Nome tem que pelo menos 2 caracteres!",
      }),
      email: z
        .string({ required_error: "Email é obrigatório!" })
        .email({ message: "Email inválido" }),
      password: z
        .string({ required_error: "Senha é obrigatória!" })
        .min(8, { message: "Senha deve conter mais de 8 caracteres" }),
    })
  ),
});

export const RegisterUser = () => {
  const {
    handleGetUsers,
    handleGetUsersType,
    usersType,
    openAddDialog,
    setOpenAddDialog,
    selectedUsers,
    isEdit,
    setIsEdit,
    usersList,
  } = useUsersContext();
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [loadingSubmit, setLoadingSubmit] = useState<boolean>(false);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      users: [
        {
          type: "3",
          name: "José Pereira",
          email: "jose.pereira@gmail.com",
          password: "12345678",
        },
        {
          type: "2",
          name: "Carolina Silva",
          email: "carolina.silva@gmail.com",
          password: "12345678",
        },
      ],
    },
    mode: "onChange",
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "users",
  });

  const handleClose = (e?: any) => {
    e?.preventDefault();

    form.reset({
      users: [
        {
          type: "",
          name: "",
          email: "",
          password: "",
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

  const preparePayloadUsers = (formUsers: any[], allUsers: IUsers[]) => {
    return formUsers.map((formUser) => {
      const originalUser = allUsers.find((user) => user.id === formUser.id);

      if (!originalUser) {
        throw new Error(`Usuário com id ${formUser.id} não foi encontrado`);
      }

      return {
        id: formUser.id,
        name: formUser.name,
        email: formUser.email,
        password: formUser.password,
        type: Number(formUser.type),
        avatar: originalUser.avatar,
      };
    });
  };

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setLoadingSubmit(true);

    try {
      const response = !isEdit
        ? await UsersService.createListUsers(data.users)
        : await UsersService.updateListUsers(
            preparePayloadUsers(data.users, usersList)
          );

      if (response.status === 201 || response.status === 200) {
        toast({
          variant: "success",
          title: `${
            !isEdit
              ? "Novos acessos foram cadastrados"
              : "Usuários foram atualizados"
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
          } o(s) usuário(s).`,
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
      handleGetUsers();
    }
  }

  useEffect(() => {
    handleGetUsersType();
  }, []);

  useEffect(() => {
    if (isEdit) {
      const formatedSelectedUsers = {
        users: selectedUsers.map((selectedUser) => ({
          id: selectedUser.id,
          type: selectedUser.type.id.toString(),
          name: selectedUser.name,
          email: selectedUser.email,
          password: selectedUser.password,
        })),
      };

      form.reset(formatedSelectedUsers);
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
              disabled={!AuthUtils.verifyLoggedUserIsAdmin()}
            >
              <Button
                variant={"terciary"}
                disabled={!AuthUtils.verifyLoggedUserIsAdmin()}
              >
                CRIAR NOVO ACESSO
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
        key={isEdit ? "edit" : "create"}
        aria-describedby={undefined}
        forceMount
        className="max-w-screen-lg px-8 py-12 max-h-[80vh] overflow-auto"
      >
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit, (errors) =>
              console.log(errors)
            )}
            className=""
          >
            <DialogHeader className="flex flex-row justify-between items-center w-full">
              <DialogTitle>
                <Label className="font-KumbhSans font-semibold text-3xl text-foreground_100">
                  {isEdit
                    ? "Atualizar/Adicionar acessos"
                    : "Adicionar novos acessos"}
                </Label>
              </DialogTitle>
              <div>
                <Button
                  className="hover:bg-foreground_50 bg-foreground_80 text-foreground"
                  type="button"
                  onClick={() =>
                    append({ type: "", name: "", email: "", password: "" })
                  }
                >
                  Adicionar novo usuário à lista
                </Button>
              </div>
            </DialogHeader>

            <section className="dialog-body flex flex-col gap-6">
              {fields.length === 0 && (
                <div className="flex justify-center items-center mt-12 mb-8">
                  <Label className="font-KumbhSans font-semibold text-xl text-foreground_100">
                    Clique no botão "Adicionar novo usuário à lista" para gerar
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
                      Remover usuário da lista
                      <CloseSquare />
                    </Button>
                  </section>
                  <section className="section-inputs grid grid-flow-col grid-rows-2 gap-8">
                    <FormField
                      control={form.control}
                      name={`users.${index}.type`}
                      render={({ field, fieldState }) => (
                        <FormItem>
                          <FormLabel className="font-KumbhSans font-medium text-sm text-foreground_90">
                            Tipo de acesso
                          </FormLabel>
                          <Select
                            defaultValue={field.value}
                            onValueChange={field.onChange}
                          >
                            <FormControl className="border-gray_100 h-[42px] text-foreground_80">
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione o tipo de usuário" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {usersType.map((type) => (
                                <SelectItem
                                  key={type.id}
                                  value={type.id.toString()}
                                  className="cursor-pointer"
                                >
                                  {type.type}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          {fieldState.error ? (
                            <FormMessage />
                          ) : (
                            <FormDescription className="font-KumbhSans font-medium text-sm text-foreground_50">
                              Defina qual o tipo de acesso do usuário
                            </FormDescription>
                          )}
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`users.${index}.email`}
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormLabel className="font-KumbhSans font-medium text-sm text-foreground_90">
                            Endereço de email
                          </FormLabel>
                          <FormControl className="h-[42px] border-gray_100 text-foreground_80">
                            <Input
                              placeholder={"Insira o email do usuário"}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`users.${index}.name`}
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormLabel className="font-KumbhSans font-medium text-sm text-foreground_90">
                            Nome completo
                          </FormLabel>
                          <FormControl className="w-full h-[42px] border-gray_100">
                            <Input
                              placeholder="Insira o nome do usuário"
                              className="text-foreground_80"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    {!isEdit && (
                      <FormField
                        control={form.control}
                        name={`users.${index}.password`}
                        render={({ field }) => (
                          <FormItem className="w-full">
                            <FormLabel className="font-KumbhSans font-medium text-sm text-foreground_90">
                              Senha
                            </FormLabel>
                            <div className="relative text-foreground_80">
                              <FormControl className="h-[42px] border-gray_100">
                                <Input
                                  {...field}
                                  placeholder="Insira a senha do usuário"
                                  type={showPassword ? "text" : "password"}
                                />
                              </FormControl>
                              <Button
                                type="button"
                                variant={"ghost"}
                                className="absolute right-2 top-[2px] p-0 text-gray-600"
                                onClick={() => setShowPassword(!showPassword)}
                              >
                                {showPassword ? <Eye /> : <EyeSlash />}
                              </Button>
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}
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
                disabled={fields.length === 0 && !isEdit}
              >
                {loadingSubmit ? (
                  <CommonLoading size="6" color="#fff" />
                ) : (
                  `${!isEdit ? "Adicionar novos" : "Atualizar"} acessos`
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
