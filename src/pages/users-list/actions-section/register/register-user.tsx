import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
import { CloseCircle, Eye, EyeSlash } from "iconsax-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { UsersTypeService } from "@/services/users-type-service";
import { UsersService } from "@/services/users-service";
import { ToastAction } from "@/components/ui/toast";
import { useToast } from "@/hooks/use-toast";
import { IUsersType } from "@/interfaces/IUser";

const FormSchema = z.object({
  type: z.string({
    required_error: "Escolha o tipo de acesso do usuário",
  }),
  name: z.string({ required_error: "Nome é obrigatorio!" }).min(2, {
    message: "Nome tem que pelo menos 2 caracteres!",
  }),
  email: z
    .string({ required_error: "Email é obrigatorio!" })
    .email({ message: "Email inválido" }),
  password: z
    .string({ required_error: "Senha é obrigatorio!" })
    .min(8, { message: "Senha deve conter mais de 8 caracteres" }),
});

export const RegisterUser = ({ userIsAdmin }: any) => {
  const { toast } = useToast();
  const [openAddDialog, setOpenAddDialog] = useState<boolean>(false);
  const [usersType, setUsersType] = useState<IUsersType[]>([]);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      const response = await UsersService.registerUsers(data);

      if (response.status === 201) {
        toast({
          variant: "success",
          title: "Um novo acesso foi cadastrado com sucesso!",
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
  }

  useEffect(() => {
    const getUsersType = async () => {
      try {
        const response = await UsersTypeService.getUsersTypes();

        if (response.status === 200) {
          setUsersType(response.data);
        }
      } catch (error) {
        console.error(error);
      }
    };

    getUsersType();
  }, []);

  return (
    <Dialog open={openAddDialog} onOpenChange={setOpenAddDialog}>
      <DialogTrigger
        disabled={!userIsAdmin}
        type="button"
        className="flex items-center hover:bg-foreground_50 bg-foreground_80 text-foreground font-Inter font-semibold text-base px-4 py-3 rounded-md border border-border_2 cursor-pointer max-h-[36px] transition-colors duration-150 ease-in-out"
      >
        CRIAR NOVO ACESSO
      </DialogTrigger>

      <DialogContent
        aria-describedby={undefined}
        forceMount
        className="max-w-screen-lg px-8 py-12"
      >
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="">
            <DialogHeader className="flex flex-row justify-between items-center w-full">
              <DialogTitle>
                <Label className="font-KumbhSans font-semibold text-3xl text-foreground_100">
                  Adicionar novo acesso
                </Label>
              </DialogTitle>
              <div>
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem className="w-[320px]">
                      <FormLabel className="font-KumbhSans font-medium text-sm text-foreground_90">
                        Tipo de acesso
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl className="border-gray_100 h-[42px] text-foreground_80">
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o tipo de usuário" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {usersType.map((type) => {
                            return (
                              <SelectItem
                                key={type.id}
                                value={type.id.toString()}
                                className="cursor-pointer text-foreground_80 hover:bg-background hover:text-foreground_90"
                              >
                                {type.type}
                              </SelectItem>
                            );
                          })}
                        </SelectContent>
                      </Select>
                      <FormDescription className="font-KumbhSans font-medium text-sm text-foreground_50">
                        Defina qual o tipo de acesso do usuário
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </DialogHeader>
            <section className="dialog-body flex flex-col gap-6">
              <FormField
                control={form.control}
                name="name"
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
              <div className="flex gap-6">
                <FormField
                  control={form.control}
                  name="email"
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
                  name="password"
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
              </div>
            </section>
            <DialogFooter className="w-full justify-start mt-6">
              <Button variant={"default"} type="submit" className="rounded-sm">
                Adicionar novo acesso
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
