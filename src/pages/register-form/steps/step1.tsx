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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

const formSchema = z.object({
  matricula: z.string({ required_error: "Matricula é obrigatorio!" }).min(7, {
    message: "Nome tem que pelo menos 7 caracteres!",
  }),
  is_admin: z.boolean({
    required_error: "Selecione o tipo de acesso do usuário!",
  }),
});

export const Step1 = () => {
  const { formData, setFormData, setProgressLength } =
    useOutletContext<UserOutLetContext>();
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      matricula: formData.matricula,
      is_admin: formData.is_admin,
    },
  });

  function onSubmit(data: z.infer<typeof formSchema>) {
    setFormData({ ...formData, ...data });
    setProgressLength(66);
    navigate("/register/2");
  }

  return (
    <div className="z-10 flex flex-col items-center justify-center gap-16">
      <section>
        <Label className="font-KumbhSans font-semibold text-4xl text-white">
          Cadastre uma nova conta de acesso
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
              name="matricula"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormControl>
                    <Input
                      className="w-full h-[42px]"
                      placeholder="Insira a matricula do usuário"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="is_admin"
              render={({ field }) => (
                <FormItem>
                  <Select
                    onValueChange={(value) => field.onChange(value === "true")}
                    defaultValue={field.value ? "true" : "false"}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o tipo de usuário" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="true">Professor</SelectItem>
                      <SelectItem value="false">Administrador</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button variant={"default"} type="submit" className="w-full">
              Próximo
            </Button>
          </form>
        </Form>
      </section>
    </div>
  );
};
