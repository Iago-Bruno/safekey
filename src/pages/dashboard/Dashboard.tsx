import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "iconsax-react";
import { AlertCircle } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@radix-ui/react-accordion";

export const Dashboard = () => {
  const assignments = [
    {
      title: "Basic Design",
      description: "Introduction to Graphics Design",
      startDate: "25ᵗʰ March 2022",
      dueDate: "8ᵗʰ April 2022",
      submitted: 32,
      notSubmitted: 18,
    },
    {
      title: "Basic Design",
      description: "Introduction to Graphics Design",
      startDate: "25ᵗʰ March 2022",
      dueDate: "8ᵗʰ April 2022",
      submitted: 32,
      notSubmitted: 18,
    },
    {
      title: "Basic Design",
      description: "Introduction to Graphics Design",
      startDate: "25ᵗʰ March 2022",
      dueDate: "8ᵗʰ April 2022",
      submitted: 32,
      notSubmitted: 18,
    },
    {
      title: "Basic Design",
      description: "Introduction to Graphics Design",
      startDate: "25ᵗʰ March 2022",
      dueDate: "8ᵗʰ April 2022",
      submitted: 32,
      notSubmitted: 18,
    },
  ];

  return (
    <div className="w-full">
      <section className="section-reservations w-full">
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-1">
            <AccordionTrigger className="font-Inter font-semibold text-base text-foreground_80">
              Suas reservas
            </AccordionTrigger>
            <AccordionContent>
              <Carousel
                opts={{
                  align: "center",
                }}
                className="w-full"
              >
                <CarouselContent>
                  {assignments.map((assignment, index) => (
                    <CarouselItem
                      key={index}
                      className="md:basis-1/2 lg:basis-1/3"
                    >
                      <div className="p-1">
                        <Card className="shadow-md rounded-xl p-4" key={index}>
                          <CardContent>
                            <h3 className="text-lg font-bold text-gray-800">
                              {assignment.title}
                            </h3>
                            <p className="text-sm text-gray-600">
                              {assignment.description}
                            </p>
                            <div className="flex items-center gap-2 text-gray-500 mt-2">
                              <Calendar className="w-4 h-4" />
                              <span>{assignment.startDate}</span>
                            </div>
                            <div className="flex items-center gap-2 text-red-500 mt-1">
                              <AlertCircle className="w-4 h-4" />
                              <span className="font-semibold">
                                {assignment.dueDate}
                              </span>
                            </div>
                            <div className="flex justify-between mt-4">
                              <Badge className="bg-blue-500 text-white px-3 py-1 rounded-full">
                                {assignment.submitted} Submitted
                              </Badge>
                              <Badge className="bg-yellow-500 text-white px-3 py-1 rounded-full">
                                {assignment.notSubmitted} Not Submitted
                              </Badge>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>

                <div className="flex gap-4 mt-8">
                  <CarouselPrevious className="static" />
                  <CarouselNext className="static" />
                </div>
              </Carousel>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>

      {/* <div className="container w-full h-full px-40 py-28 flex flex-col">
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
    </div> */}
    </div>
  );
};
