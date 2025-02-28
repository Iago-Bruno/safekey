import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "iconsax-react";
import { AlertCircle } from "lucide-react";
import { useRoomsContext } from "./context/rooms-context";
import { RoomsDataTable } from "./table/data-table";
import { RoomsColumns } from "./table/table-columns";

export type LabsType = {
  id: number;
  nome: string;
  status: "Disponivel" | "Ocupado";
};

const assignments = [
  {
    title: "Basic Design",
    description: "Introduction to Graphics Design",
    startDate: "25ᵗʰ March 2022",
    dueDate: "8ᵗʰ April 2022",
    submitted: 32,
    notSubmitted: 18,
  },
];

export const Rooms = () => {
  const { tableRoomsList } = useRoomsContext();

  return (
    <div className="">
      <section className="table-section h-full bg-foreground px-4">
        <RoomsDataTable data={tableRoomsList} columns={RoomsColumns} />
      </section>

      <div className="mt-96">
        {assignments.map((assignment, index) => (
          <Card className="shadow-md rounded-xl p-4" key={index}>
            <CardContent>
              <h3 className="text-lg font-bold text-gray-800">
                {assignment.title}
              </h3>
              <p className="text-sm text-gray-600">{assignment.description}</p>
              <div className="flex items-center gap-2 text-gray-500 mt-2">
                <Calendar className="w-4 h-4" />
                <span>{assignment.startDate}</span>
              </div>
              <div className="flex items-center gap-2 text-red-500 mt-1">
                <AlertCircle className="w-4 h-4" />
                <span className="font-semibold">{assignment.dueDate}</span>
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
        ))}
      </div>
    </div>
  );
};
