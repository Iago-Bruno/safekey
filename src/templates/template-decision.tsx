import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ReservationStatusEnum } from "@/interfaces/Enums/ReservationStatusEnum";
import { DecisionsService } from "@/services/decision-service";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export const TemplateDecision = () => {
  const { id } = useParams();
  const [reservation, setReservation] = useState<any>({});

  const handleApprove = async () => {
    try {
      const response = await DecisionsService.approve(id);

      if (response.status === 200) {
        alert("A reserva foi aprovada!");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleReject = async () => {
    try {
      const response = await DecisionsService.reject(id);

      if (response.status === 200) {
        alert("A reserva foi rejeitada!");
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const getReservationData = async () => {
      try {
        const response = await DecisionsService.getReservation(id);

        if (response.status === 200) {
          setReservation(response.data);
        }
      } catch (error) {
        console.error(error);
      }
    };

    getReservationData();
  }, []);

  return (
    <div className="login-form w-screen h-screen flex flex-col bg-gray_5 items-center justify-center">
      <span className="background-header absolute top-0 z-0 w-screen h-[42%] bg-blue_2" />
      <div className="z-10 flex flex-col items-center justify-center gap-16">
        <section>
          <Label className="font-KumbhSans font-semibold text-4xl text-white">
            Solicitação de aprovação de reserva
          </Label>
        </section>
        <section className="flex bg-white w-[512px] h-[382px] rounded-2xl items-center justify-center px-32 gap-4">
          {reservation.status === ReservationStatusEnum.Pendente ? (
            <>
              <Button
                variant={"default"}
                type="submit"
                className="w-full"
                onClick={handleApprove}
              >
                Aceitar
              </Button>
              <Button
                variant={"destructive"}
                type="submit"
                className="w-full"
                onClick={handleReject}
              >
                Recusar
              </Button>
            </>
          ) : (
            <h1>Essa reserva já foi processada</h1>
          )}
        </section>
      </div>
    </div>
  );
};
