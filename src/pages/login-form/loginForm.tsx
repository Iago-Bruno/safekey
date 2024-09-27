import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AuthService } from "@/services/auth-service";
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { CloseCircle } from "iconsax-react";
import { useNavigate } from "react-router-dom";

import "./loginForm.scss";
import { UsersTypeService } from "@/services/users-type-service";

const formSchema = z.object({
  email: z
    .string({ required_error: "Email é obrigatorio!" })
    .email({ message: "Email inválido" }),
  password: z
    .string({ required_error: "Senha é obrigatorio!" })
    .min(8, { message: "Senha deve conter mais de 8 caracteres" }),
});

export const LoginForm = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  async function onSubmit(data: z.infer<typeof formSchema>) {
    try {
      const response = await AuthService.login(data);

      if (response.status === 200) {
        const responseUserData = response.data.user;
        localStorage.setItem("access_user", JSON.stringify(responseUserData));

        const responseUserTypes = await UsersTypeService.getUsersType();
        const responseUserTypesData = responseUserTypes.data.data;

        if (responseUserTypes.status === 200) {
          toast({
            variant: "success",
            title: `Login realizado como um ${
              responseUserTypesData.find(
                (type: any) => type.id == responseUserData.user_type_id
              ).name
            }!`,
            action: (
              <ToastAction
                className="bg-transparent border-0 p-0 hover:bg-transparent"
                altText="Goto schedule to undo"
              >
                <CloseCircle size="24" color="#ffffff" variant="Broken" />
              </ToastAction>
            ),
          });

          navigate("/dashboard");
        }
      }
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className="login-form w-screen h-screen flex flex-col bg-gray_5 items-center justify-center">
      <span className="background-header absolute top-0 z-0 w-screen h-[42%] bg-blue_2" />
      <div className="z-10 flex flex-col items-center justify-center gap-16">
        <section>
          <Label className="font-KumbhSans font-semibold text-4xl text-white">
            Bem vindo, Entre com sua conta
          </Label>
        </section>
        <section className="bg-white w-[512px] h-[382px] rounded-2xl flex flex-col items-center justify-center px-32">
          <Label className="font-Inter font-medium text-base leading-6 text-[#667085] text-center mb-5">
            Insira os dados de acesso para entrar no sistema
          </Label>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="w-full space-y-[14px]"
            >
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormControl>
                      <Input
                        className="w-full h-[42px]"
                        placeholder="Email"
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
                    <FormControl>
                      <Input
                        className="w-full h-[42px]"
                        placeholder="Senha"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button variant={"primary"} type="submit" className="w-full">
                Entrar
              </Button>
            </form>
          </Form>
        </section>
      </div>
    </div>
  );
};
