import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  exportToCSV,
  exportToDOCX,
  exportToPDF,
  exportToXLSX,
} from "@/utils/exportReservationsFiles";
import {
  ArrowDown3,
  DocumentCode2,
  DocumentFilter,
  DocumentSketch,
  DocumentText,
} from "iconsax-react";
import { useReservationsContext } from "../context/reservations-context";
import { RegisterReservations } from "./register/register-reservations";

export const ReservationsActions = () => {
  const { reservationsList } = useReservationsContext();

  return (
    <div className="flex justify-end gap-4 py-4">
      <DropdownMenu>
        <DropdownMenuTrigger
          asChild
          className="px-4 py-3 bg-table-foreground rounded-md border border-border"
        >
          <Button
            variant={"ghost"}
            className="rounded-md text-table-accent_opacity font-Inter font-medium text-base"
          >
            EXPORTAR
            <ArrowDown3 size="32" variant="Bold" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="center"
          className="w-36 text-table-accent_opacity font-Inter font-medium text-base "
        >
          <DropdownMenuItem
            className="gap-2 cursor-pointer"
            onClick={() => exportToPDF(reservationsList)}
          >
            <DocumentSketch />
            PDF
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="gap-2 cursor-pointer"
            onClick={() => exportToXLSX(reservationsList)}
          >
            <DocumentFilter />
            XLSX
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="gap-2 cursor-pointer"
            onClick={() => exportToDOCX(reservationsList)}
          >
            <DocumentText />
            DOCX
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="gap-2 cursor-pointer"
            onClick={() => exportToCSV(reservationsList)}
          >
            <DocumentCode2 />
            CSV
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <RegisterReservations />
    </div>
  );
};
