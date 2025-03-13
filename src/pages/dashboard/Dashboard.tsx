import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Status, TimerStart } from "iconsax-react";
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
import { Label } from "@/components/ui/label";
import { AuthUtils } from "@/utils/authUtils";
import StarIcon from "../../assets/icons/starIcon.png";
import ChevronRight from "../../assets/icons/chevron-right.png";
import { useEffect, useState } from "react";
import { ReservationService } from "@/services/reservation-service";
import { IReservations } from "@/interfaces/IReservations";
import { DateUtils } from "@/utils/dateUtils";
import { CommonLoading } from "@/components/loading/CommonLoading";

export const Dashboard = () => {
  const loggedUser = AuthUtils.getAccessUser();
  const [reservationsList, setReservationsList] = useState<IReservations[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [expanded, setExpanded] = useState<string | undefined>("item-1");

  const handleAccordionChange = (value: string) => {
    setExpanded(value === expanded ? undefined : value);
  };

  useEffect(() => {
    const handleGetReservations = async () => {
      try {
        if (loggedUser?.id) {
          const response = await ReservationService.getAllUsersReservations(
            loggedUser?.id
          );

          if (response.status === 200) {
            const responseData = response.data;

            setReservationsList(responseData);
          }
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    handleGetReservations();
  }, []);

  return (
    <div className="w-full h-full mr-4 ml-4 mt-12">
      <section className="sectin-greetings">
        <div className="flex flex-col gap-4">
          <span className="flex gap-4 items-center">
            <Label className="font-Poppins text-5xl font-bold text-foreground_90">
              Seja bem-vindo
            </Label>
            <img
              className="w-[40px] h-[40px]"
              src={StarIcon}
              alt="Ícone estrela"
            />
          </span>
          <Label className="font-Poppins text-4xl font-bold text-foreground_60">
            {loggedUser?.name}
          </Label>
        </div>
      </section>

      <section className="section-reservations w-full mt-12">
        <Accordion
          type="single"
          collapsible
          value={expanded}
          onValueChange={handleAccordionChange}
        >
          <AccordionItem value="item-1">
            <AccordionTrigger className="flex font-Poppins font-semibold text-xl text-foreground_80 gap-4">
              Suas reservas{" "}
              <img
                className={`${expanded ? "rotate-90" : ""} transition-all`}
                src={ChevronRight}
                alt="ícone"
              />
            </AccordionTrigger>
            <AccordionContent className="mt-4">
              <Carousel
                opts={{
                  align: "center",
                }}
                className="w-full"
              >
                {loading ? (
                  <CommonLoading />
                ) : (
                  <CarouselContent>
                    {reservationsList.map((reservations) => (
                      <CarouselItem
                        key={reservations.id}
                        className="md:basis-1/2 lg:basis-1/3"
                      >
                        <div className="">
                          <Card
                            className="shadow-md rounded-xl p-2"
                            key={reservations.id}
                          >
                            <CardContent className="p-2">
                              <Label className="font-Poppins text-base font-bold text-foreground_80">
                                {reservations.room.name}
                              </Label>

                              <div className="flex items-center gap-1">
                                <Label className="font-Poppins text-sm font-bold text-foreground_60">
                                  Motivo:{" "}
                                </Label>
                                <Label className="font-Poppins text-sm font-medium text-foreground_60">
                                  {reservations.reason}
                                </Label>
                              </div>

                              <div className="flex items-center justify-between mt-6 font-Inter font-medium text-base">
                                <div className="flex items-center gap-2 text-[#657088]">
                                  <Calendar className="w-6 h-6" />
                                  <span>
                                    {DateUtils.formatDateToPTBR(
                                      reservations.date_schedulling
                                    )}
                                  </span>
                                </div>

                                <div className="flex items-center gap-2 mt-1 text-[#f62b2bc7]">
                                  <TimerStart className="w-6 h-6" />
                                  <Label className="font-semibold">
                                    {DateUtils.formatTimeToHHMM(
                                      reservations.start_time
                                    )}
                                    {" - "}
                                    {DateUtils.formatTimeToHHMM(
                                      reservations.end_time
                                    )}
                                  </Label>
                                </div>
                              </div>

                              <div className="flex items-center gap-2 mt-6 font-Inter font-medium text-base text-[#657088]">
                                <Status />
                                {reservations.status}
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                )}

                <div className="flex gap-4 mt-8">
                  <CarouselPrevious className="static" />
                  <CarouselNext className="static" />
                </div>
              </Carousel>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>
    </div>
  );
};
