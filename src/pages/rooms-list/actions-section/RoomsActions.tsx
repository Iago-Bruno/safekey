import { Button } from "@/components/ui/button";
import {
  ArrowDown3,
  DocumentCode2,
  DocumentFilter,
  DocumentSketch,
  DocumentText,
} from "iconsax-react";
import {
  exportToCSV,
  exportToDOCX,
  exportToPDF,
  exportToXLSX,
} from "@/utils/exportRoomsFiles";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRoomsContext } from "../context/rooms-context";
import { RegisterRooms } from "./register/register-rooms";

export const RoomsActions = () => {
  const { roomsList } = useRoomsContext();

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
            onClick={() => exportToPDF(roomsList)}
          >
            <DocumentSketch />
            PDF
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="gap-2 cursor-pointer"
            onClick={() => exportToXLSX(roomsList)}
          >
            <DocumentFilter />
            XLSX
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="gap-2 cursor-pointer"
            onClick={() => exportToDOCX(roomsList)}
          >
            <DocumentText />
            DOCX
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="gap-2 cursor-pointer"
            onClick={() => exportToCSV(roomsList)}
          >
            <DocumentCode2 />
            CSV
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <RegisterRooms />
    </div>
  );
};
