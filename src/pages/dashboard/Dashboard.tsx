import { Label } from "@/components/ui/label";
import { Key, UserAdd } from "iconsax-react";

export const Dashboard = () => {
  return (
    <div className="container w-full h-full px-40 py-28 flex flex-col">
      <section className="flex flex-col gap-4">
        <Label className="font-KumbhSans text-4xl font-semibold text-gray_400">
          Bem vindo ao dashboard, SafeLab IFPB
        </Label>
        <Label className="font-KumbhSans text-2xl font-semibold text-gray_400 ml-16">
          Abaixo estão as funcionalides que o sistema possui
        </Label>
      </section>
      <section className="space-y-8 ml-16 mt-8">
        <div className="flex gap-4 max-w-[600px]">
          <span className="w-[36px] h-[36px] p-2 bg-[#EFF3FA] rounded-[8px] flex justify-center items-center">
            <UserAdd size="24" color="#13296A" variant="Broken" className="" />
          </span>
          <div className="flex flex-col gap-2">
            <Label className="font-KumbhSans text-2xl font-medium text-gray_400">
              Adicionar outros acessos ao sistema
            </Label>
            <Label className="font-KumbhSans text-sm font-normal leading-[133%] text-gray_400">
              O sistema tem a funcionalidade de adicionar outros usuários que
              podem ter acesso ao sistema. Usuário como: Administradores,
              Professores e Alunos
            </Label>
          </div>
        </div>
        <div className="flex gap-4 max-w-[600px]">
          <span className="w-[36px] h-[36px] p-2 bg-[#EFF3FA] rounded-[8px] flex justify-center items-center">
            <Key size="24" color="#13296A" variant="Broken" />
          </span>
          <div className="flex flex-col gap-2">
            <Label className="font-KumbhSans text-2xl font-medium text-gray_400">
              Gerenciamento de acesso às chaves dos laboratórios
            </Label>
            <Label className="font-KumbhSans text-sm font-normal leading-[133%] text-gray_400">
              O sistema tem a funcionalidade de poder atualizar os status dos
              laboratórios ('Disponivel' ou 'Ocupado') podendo mudar entre os
              dois status ao pegar ou devolver uma chave na instituição
            </Label>
          </div>
        </div>
      </section>
    </div>
  );
};
