import { useNavigate, useOutletContext } from "react-router-dom";
import { UserOutLetContext } from "../register-layout";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Eye, EyeSlash } from "iconsax-react";

export const Step3 = () => {
  const { formData, showPassword, setShowPassword, setProgressLength } =
    useOutletContext<UserOutLetContext>();
  const navigate = useNavigate();

  async function submitData() {
    setProgressLength(100);
    navigate("/dashboard");
  }

  return (
    <div className="z-10 flex flex-col items-center justify-center gap-16">
      <section>
        <Label className="font-KumbhSans font-semibold text-4xl text-white">
          Confirme os dados de acesso
        </Label>
      </section>
      <section className="bg-white w-[512px] h-[auto] min-h-[382px] rounded-2xl flex flex-col items-center justify-center px-28 py-8">
        <div className="w-full space-y-4">
          <div className="space-y-1">
            <Label>Matricula</Label>
            <Input
              type="text"
              placeholder="Insira a matricula do usuário"
              value={formData.matricula}
              disabled
            />
          </div>

          <div className="space-y-1">
            <Label>Nome</Label>
            <Input
              type="text"
              placeholder={`Insira o nome do ${
                formData.is_admin ? "Administrador" : "Professor"
              }`}
              value={formData.name}
              disabled
            />
          </div>

          <div className="space-y-1">
            <Label>Email</Label>
            <Input
              type="text"
              placeholder={`Insira o email do ${
                formData.is_admin ? "Administrador" : "Professor"
              }`}
              value={formData.email}
              disabled
            />
          </div>

          <div className="space-y-1">
            <div className="relative">
              <Label>Senha</Label>
              <Input
                type="text"
                placeholder={`Insira a senha do ${
                  formData.is_admin ? "Administrador" : "Professor"
                }`}
                value={formData.password}
                disabled
              />

              <Button
                type="button"
                variant={"ghost"}
                className="absolute right-2 bottom-[-2px] p-0 text-gray-600"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <Eye /> : <EyeSlash />}
              </Button>
            </div>
          </div>

          <div className="space-y-1">
            <Label>Tipo de acesso</Label>
            <Input
              type="text"
              placeholder="Selecione o tipo de usuário"
              value={formData.is_admin ? "Administrador" : "Professor"}
              disabled
            />
          </div>

          <div className="flex gap-6">
            <Button
              variant={"outline"}
              onClick={() => {
                navigate("/register/2");
              }}
              className="w-full"
            >
              Anterior
            </Button>
            <Button variant={"primary"} onClick={submitData} className="w-full">
              Finalizar
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};
