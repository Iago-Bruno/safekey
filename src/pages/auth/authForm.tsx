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
import { useLocation, useNavigate } from "react-router-dom";
import { AuthUtils } from "@/utils/authUtils";
import "./authForm.scss";
import { useState } from "react";
import { CommonLoading } from "@/components/loading/CommonLoading";

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
  const location = useLocation();
  const [loading, setLoading] = useState<boolean>(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  async function onSubmit(data: z.infer<typeof formSchema>) {
    setLoading(true);

    try {
      const response = await AuthService.login(data);

      if (response.status === 200) {
        const responseData = response.data;
        const userType = responseData.user.type.type;

        AuthUtils.armazenarToken(responseData.access_token);
        AuthUtils.armazenarRefreshToken(responseData.refresh_token);
        AuthUtils.armazenarAccessUser(responseData.user);
        AuthUtils.armazenarLoggedUserType(userType);

        toast({
          variant: "success",
          title: `Login realizado como um ${userType}!`,
          action: (
            <ToastAction
              className="bg-transparent border-0 p-0 hover:bg-transparent"
              altText="Goto schedule to undo"
            >
              <CloseCircle size="24" color="#ffffff" variant="Broken" />
            </ToastAction>
          ),
        });

        const from = location.state?.from?.pathname || "/dashboard";
        setLoading(false);
        navigate(from, { replace: true });
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
              <Button variant={"default"} type="submit" className="w-full">
                {loading ? <CommonLoading /> : "Entrar"}
              </Button>
            </form>
          </Form>
        </section>
      </div>
    </div>
  );
};
