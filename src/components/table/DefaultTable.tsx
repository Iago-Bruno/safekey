import { flexRender } from "@tanstack/react-table";
import { Separator } from "../ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { useDefaultDataTableContext } from "./DefaultTableContext";

export const DefaultTable = () => {
  const { table, totalCollums } = useDefaultDataTableContext();

  return (
    <section className="table-section h-full bg-foreground">
      <Table className="h-full">
        <TableHeader className="bg-table-background text-table-accent_opacity hover:text-table-accent font-Inter text-base font-medium h-[60px]">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  <div className="flex justify-between items-center h-full space-x-4">
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                    {header.id !== "tipo" && (
                      <Separator
                        orientation="vertical"
                        className="!h-[40%] bg-[#000000] opacity-20"
                      />
                    )}
                  </div>
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody className="bg-table-foreground h-full">
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
                className="text-table-accent_opacity font-Inter text-sm font-normal h-[50px] cursor-pointer"
                onClick={() => row.toggleSelected()}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow className="text-table-accent_opacity font-Inter text-base font-medium">
              <TableCell colSpan={totalCollums} className="h-24 text-center">
                Sem dados registrados
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </section>
  );
};
