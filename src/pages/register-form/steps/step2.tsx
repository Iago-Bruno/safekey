import { useNavigate, useOutletContext } from "react-router-dom";
import { UserOutLetContext } from "../register-layout";
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
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Eye, EyeSlash } from "iconsax-react";

const formSchema = z.object({
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

export const Step2 = () => {
  const {
    formData,
    setFormData,
    showPassword,
    setShowPassword,
    setProgressLength,
  } = useOutletContext<UserOutLetContext>();
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: formData.name,
      email: formData.email,
      password: formData.password,
    },
  });

  function onSubmit(data: z.infer<typeof formSchema>) {
    setFormData({ ...formData, ...data });
    setProgressLength(66);
    navigate("/register/3");
  }

  return (
    <div className="z-10 flex flex-col items-center justify-center gap-16">
      <section>
        <Label className="font-KumbhSans font-semibold text-4xl text-white">
          Insira os dados do perfil do acesso
        </Label>
      </section>
      <section className="bg-white w-[512px] min-h-[382px] rounded-2xl flex flex-col items-center justify-center px-28 py-8">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full space-y-4"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormControl>
                    <Input
                      className="w-full h-[42px]"
                      placeholder={`Insira o nome do ${
                        formData.is_admin ? "Administrador" : "Professor"
                      }`}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      className="w-full h-[42px]"
                      placeholder={`Insira o email do ${
                        formData.is_admin ? "Administrador" : "Professor"
                      }`}
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
                <FormItem>
                  <div className="relative">
                    <FormControl>
                      <Input
                        {...field}
                        className="w-full h-[42px]"
                        placeholder={`Insira a senha do ${
                          formData.is_admin ? "Administrador" : "Professor"
                        }`}
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
            <div className="flex gap-6">
              <Button
                variant={"outline"}
                onClick={() => {
                  navigate("/register/1");
                }}
                className="w-full"
              >
                Anterior
              </Button>
              <Button variant={"primary"} type="submit" className="w-full">
                Próximo
              </Button>
            </div>
          </form>
        </Form>
      </section>
    </div>
  );
};
