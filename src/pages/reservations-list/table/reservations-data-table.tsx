import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ReservationStatusEnum } from "@/interfaces/Enums/ReservationStatusEnum";
import { IReservations } from "@/interfaces/IReservations";
import { OutletContextType } from "@/pages/layout";
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";
import { ArrowDown3, SearchNormal1 } from "iconsax-react";
import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { useReservationsContext } from "../context/reservations-context";
import { ReservationsInfoTab } from "../reservations-info-tab/reservations-info-tab";
import { ReservationsActions } from "../actions-section/reservations-actions";

interface DataTableRoomsProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function ReservationsDataTable<TData extends IReservations, TValue>({
  columns,
  data,
}: Readonly<DataTableRoomsProps<TData, TValue>>) {
  const {
    reservationsList,
    selectedReservations,
    setSelectedReservations,
    handleGetReservations,
    setIsEdit,
    setOpenAddDialog,
  } = useReservationsContext();
  const { setHeader } = useOutletContext<OutletContextType>();
  const [typeFilter, setTypeFilter] = useState<string>("todos");
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const table = useReactTable<IReservations>({
    data,
    columns: columns as ColumnDef<IReservations, any>[],
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });
  const { pageIndex } = table.getState().pagination;
  const currentPageRows = table.getPaginationRowModel().rows; // Linhas da página atual
  const totalRows = data.length; // Total de linhas
  const currentPageIndex = table.getState().pagination.pageIndex; // Índice da página atual
  const rowsPerPage = table.getState().pagination.pageSize; // Linhas por página
  // const pageCount = Math.ceil(data.length / pageSize); // Total de páginas

  // Calcular intervalo de linhas
  const startRow = currentPageIndex * rowsPerPage + 1;
  const endRow = Math.min(startRow + currentPageRows.length - 1, totalRows);

  useEffect(() => {
    if (selectedReservations.length === 0) {
      setHeader(null);
      return;
    }

    setHeader(
      <ReservationsInfoTab
        selectedReservations={selectedReservations}
        setSelectedReservations={setSelectedReservations}
        handleGetReservations={handleGetReservations}
        setRowSelection={setRowSelection}
        setHeader={setHeader}
        setIsEdit={setIsEdit}
        setOpenAddDialog={setOpenAddDialog}
      />
    );
  }, [selectedReservations]);

  useEffect(() => {
    const selectedRowIds = table
      .getSelectedRowModel()
      .rows.map((row) => row.original.id);

    setSelectedReservations(
      reservationsList.filter((reservation) =>
        selectedRowIds.includes(reservation.id)
      )
    );
  }, [table.getSelectedRowModel().rows, reservationsList]);

  return (
    <div className="flex flex-col p-2 w-full h-full bg-table-background">
      <section className="actions-section">
        <ReservationsActions />
      </section>
      <section className="filters-section w-full">
        <Separator className="bg-[#233255] opacity-10" />
        <section className="top-filters flex items-center w-full h-[50px] gap-4 my-2">
          <span className="flex items-center w-full h-full bg-table-foreground text-table-accent_opacity rounded-md">
            <SearchNormal1
              size="22"
              variant="Broken"
              color="#7FBDE4"
              className="absolute ml-3 cursor-text pointer-events-none"
            />
            <Input
              placeholder="Filtrar por nome de quem reservou..."
              className="w-full font-Inter font-normal text-base h-full rounded-md border border-border"
              value={
                (table.getColumn("user")?.getFilterValue() as string) ?? ""
              }
              onChange={(event) =>
                table.getColumn("user")?.setFilterValue(event.target.value)
              }
              style={{ textIndent: "2.5rem" }}
            />
          </span>
          <DropdownMenu>
            <DropdownMenuTrigger
              asChild
              className="h-full px-4 py-2 bg-table-foreground border border-border"
            >
              <Button
                variant="outline"
                className="flex items-center text-table-accent_opacity font-Inter font-normal text-base"
              >
                <span>Colunas</span>
                <ArrowDown3 size="32" variant="Bold" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize text-table-accent_opacity font-Inter font-normal text-base cursor-pointer"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </section>
        <Separator className="bg-[#233255] opacity-10" />
        <section className="bottom-filters flex">
          <Button
            variant="ghost"
            className={`relative flex items-center font-Inter hover:!font-bold uppercase px-3 py-6 ${
              typeFilter === "todos" ? "font-bold" : "font-medium"
            }`}
            onClick={() => {
              setTypeFilter("todos");
              table.getColumn("status")?.setFilterValue("");
            }}
          >
            <span className="text-foreground_80 text-base">Todas</span>
            <span
              className={`text-xs  py-[2px] px-1 ${
                typeFilter === "todos"
                  ? "text-[#F6AD2B] text-opacity-60 bg-[#F6AD2B] bg-opacity-15"
                  : "text-foreground_50 bg-background_2"
              }`}
            >
              {data.length}
            </span>
            {typeFilter === "todos" && (
              <Separator className="absolute !h-[3px] bg-[#F6AD2B] opacity-50 rounded-full bottom-0" />
            )}
          </Button>
          <Button
            variant="ghost"
            className={`relative flex items-center font-Inter hover:!font-bold uppercase px-3 py-6 ${
              typeFilter === ReservationStatusEnum.Aprovado
                ? "font-bold"
                : "font-medium"
            }`}
            onClick={() => {
              setTypeFilter(ReservationStatusEnum.Aprovado);
              table
                .getColumn("status")
                ?.setFilterValue(ReservationStatusEnum.Aprovado);
            }}
          >
            <span className="text-foreground_80 text-base">Aprovado</span>
            <span
              className={`text-xs  py-[2px] px-1 ${
                typeFilter === ReservationStatusEnum.Aprovado
                  ? "text-[#F6AD2B] text-opacity-60 bg-[#F6AD2B] bg-opacity-15"
                  : "text-foreground_50 bg-background_2"
              }`}
            >
              {
                data.filter(
                  (row) => row.status === ReservationStatusEnum.Aprovado
                ).length
              }
            </span>
            {typeFilter === ReservationStatusEnum.Aprovado && (
              <Separator className="absolute !h-[3px] bg-[#F6AD2B] opacity-50 rounded-full bottom-0" />
            )}
          </Button>
          <Button
            variant="ghost"
            className={`relative flex items-center font-Inter hover:!font-bold uppercase px-3 py-6 ${
              typeFilter === ReservationStatusEnum.Pendente
                ? "font-bold"
                : "font-medium"
            }`}
            onClick={() => {
              setTypeFilter(ReservationStatusEnum.Pendente);
              table
                .getColumn("status")
                ?.setFilterValue(ReservationStatusEnum.Pendente);
            }}
          >
            <span className="text-foreground_80 text-base">Pendente</span>
            <span
              className={`text-xs  py-[2px] px-1 ${
                typeFilter === ReservationStatusEnum.Pendente
                  ? "text-[#F6AD2B] text-opacity-60 bg-[#F6AD2B] bg-opacity-15"
                  : "text-foreground_50 bg-background_2"
              }`}
            >
              {
                data.filter(
                  (row) => row.status === ReservationStatusEnum.Pendente
                ).length
              }
            </span>
            {typeFilter === ReservationStatusEnum.Pendente && (
              <Separator className="absolute !h-[3px] bg-[#F6AD2B] opacity-50 rounded-full bottom-0" />
            )}
          </Button>
          <Button
            variant="ghost"
            className={`relative flex items-center font-Inter hover:!font-bold uppercase px-3 py-6 ${
              typeFilter === ReservationStatusEnum.Recusado
                ? "font-bold"
                : "font-medium"
            }`}
            onClick={() => {
              setTypeFilter(ReservationStatusEnum.Recusado);
              table
                .getColumn("status")
                ?.setFilterValue(ReservationStatusEnum.Recusado);
            }}
          >
            <span className="text-foreground_80 text-base">Recusado</span>
            <span
              className={`text-xs  py-[2px] px-1 ${
                typeFilter === ReservationStatusEnum.Recusado
                  ? "text-[#F6AD2B] text-opacity-60 bg-[#F6AD2B] bg-opacity-15"
                  : "text-foreground_50 bg-background_2"
              }`}
            >
              {
                data.filter(
                  (row) => row.status === ReservationStatusEnum.Recusado
                ).length
              }
            </span>
            {typeFilter === ReservationStatusEnum.Recusado && (
              <Separator className="absolute !h-[3px] bg-[#F6AD2B] opacity-50 rounded-full bottom-0" />
            )}
          </Button>
          <Button
            variant="ghost"
            className={`relative flex items-center font-Inter hover:!font-bold uppercase px-3 py-6 ${
              typeFilter === ReservationStatusEnum.Encerrado
                ? "font-bold"
                : "font-medium"
            }`}
            onClick={() => {
              setTypeFilter(ReservationStatusEnum.Encerrado);
              table
                .getColumn("status")
                ?.setFilterValue(ReservationStatusEnum.Encerrado);
            }}
          >
            <span className="text-foreground_80 text-base">Encerrado</span>
            <span
              className={`text-xs  py-[2px] px-1 ${
                typeFilter === ReservationStatusEnum.Encerrado
                  ? "text-[#F6AD2B] text-opacity-60 bg-[#F6AD2B] bg-opacity-15"
                  : "text-foreground_50 bg-background_2"
              }`}
            >
              {
                data.filter(
                  (row) => row.status === ReservationStatusEnum.Encerrado
                ).length
              }
            </span>
            {typeFilter === ReservationStatusEnum.Encerrado && (
              <Separator className="absolute !h-[3px] bg-[#F6AD2B] opacity-50 rounded-full bottom-0" />
            )}
          </Button>
        </section>
      </section>
      <section className="results-section bg-table-foreground w-full px-2 py-4">
        <span className="text-table-accent font-Inter text-sm font-medium opacity-50">
          Mostrando {startRow} - {endRow} de{" "}
          {table.getFilteredRowModel().rows.length} reservas
        </span>
      </section>
      <section className="table-section h-full bg-foreground">
        <Table className="h-full">
          <TableHeader className="bg-table-background text-table-accent_opacity hover:text-table-accent font-Inter text-base font-medium h-[60px]">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      <div className="flex justify-between items-center h-full space-x-4">
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                        {header.id !== "disponibilidade" && (
                          <Separator
                            orientation="vertical"
                            className="!h-[40%] bg-[#000000] opacity-20"
                          />
                        )}
                      </div>
                    </TableHead>
                  );
                })}
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
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow className="text-table-accent_opacity font-Inter text-base font-medium">
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </section>
      <section className="pagination-section">
        <div className="flex items-center py-4 text-black bg-table-foreground px-4">
          <div className="flex-1 text-sm text-muted-foreground">
            {table.getFilteredSelectedRowModel().rows.length} de{" "}
            {table.getFilteredRowModel().rows.length} linhas(s) selecionadas.
          </div>
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              className="font-KumbhSans font-medium text-sm"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              Anterior
            </Button>
            <div className="flex gap-1 font-Inter font-medium text-sm text-[#233255] text-opacity-40">
              <span className="p-0 text-center font-Inter font-medium text-sm w-[21px] h-[21px] rounded-full bg-[#F6AD2B] bg-opacity-70 text-table-foreground text-opacity-40">
                {pageIndex + 1}
              </span>
            </div>
            <Button
              variant="outline"
              className="font-KumbhSans font-medium text-sm"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Próximo
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
