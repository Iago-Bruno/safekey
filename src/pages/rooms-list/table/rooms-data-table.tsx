import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
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
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowDown3, SearchNormal1 } from "iconsax-react";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { RoomsActions } from "../actions-section/RoomsActions";
import { useRoomsContext } from "../context/rooms-context";
import { OutletContextType } from "@/pages/layout";
import { useOutletContext } from "react-router-dom";
import { RoomsInfoTab } from "../rooms-info-tab/rooms-info-tab";
import { IRooms } from "@/interfaces/IRooms";
import { RoomStatusEnum } from "@/interfaces/Enums/RoomStatusEnum";

interface DataTableRoomsProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function RoomsDataTable<TData extends IRooms, TValue>({
  columns,
  data,
}: Readonly<DataTableRoomsProps<TData, TValue>>) {
  const {
    roomsList,
    selectedRooms,
    setSelectedRooms,
    handleGetRooms,
    roomReservationsList,
    setRoomReservationsList,
    setIsEdit,
    setOpenAddDialog,
  } = useRoomsContext();
  const { setHeader } = useOutletContext<OutletContextType>();
  const [typeFilter, setTypeFilter] = useState<string>("todos");
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const table = useReactTable<IRooms>({
    data,
    columns: columns as ColumnDef<IRooms, any>[],
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
    if (selectedRooms.length === 0) {
      setHeader(null);
      return;
    }

    setHeader(
      <RoomsInfoTab
        selectedRooms={selectedRooms}
        setSelectedRooms={setSelectedRooms}
        handleGetRooms={handleGetRooms}
        setRowSelection={setRowSelection}
        roomReservationsList={roomReservationsList}
        setRoomReservationsList={setRoomReservationsList}
        setHeader={setHeader}
        setIsEdit={setIsEdit}
        setOpenAddDialog={setOpenAddDialog}
      />
    );
  }, [selectedRooms, roomReservationsList]);

  useEffect(() => {
    const selectedRowIds = table
      .getSelectedRowModel()
      .rows.map((row) => row.original.id);

    setSelectedRooms(
      roomsList.filter((room) => selectedRowIds.includes(room.id))
    );
    setRoomReservationsList(
      roomReservationsList.filter((roomReserv) =>
        selectedRowIds.includes(roomReserv.roomId)
      )
    );
  }, [table.getSelectedRowModel().rows, roomsList]);

  return (
    <div className="flex flex-col p-2 w-full h-full bg-table-background">
      <section className="actions-section">
        <RoomsActions />
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
              placeholder="Filtrar por nome da sala..."
              className="w-full font-Inter font-normal text-base h-full rounded-md border border-border"
              value={
                (table.getColumn("name")?.getFilterValue() as string) ?? ""
              }
              onChange={(event) =>
                table.getColumn("name")?.setFilterValue(event.target.value)
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
            <span className="text-foreground_80 text-base">Todos</span>
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
              typeFilter === RoomStatusEnum.Disponivel
                ? "font-bold"
                : "font-medium"
            }`}
            onClick={() => {
              setTypeFilter(RoomStatusEnum.Disponivel);
              table
                .getColumn("status")
                ?.setFilterValue(RoomStatusEnum.Disponivel);
            }}
          >
            <span className="text-foreground_80 text-base">Disponível</span>
            <span
              className={`text-xs  py-[2px] px-1 ${
                typeFilter === RoomStatusEnum.Disponivel
                  ? "text-[#F6AD2B] text-opacity-60 bg-[#F6AD2B] bg-opacity-15"
                  : "text-foreground_50 bg-background_2"
              }`}
            >
              {
                data.filter((row) => row.status === RoomStatusEnum.Disponivel)
                  .length
              }
            </span>
            {typeFilter === RoomStatusEnum.Disponivel && (
              <Separator className="absolute !h-[3px] bg-[#F6AD2B] opacity-50 rounded-full bottom-0" />
            )}
          </Button>
          <Button
            variant="ghost"
            className={`relative flex items-center font-Inter hover:!font-bold uppercase px-3 py-6 ${
              typeFilter === RoomStatusEnum.Reservada
                ? "font-bold"
                : "font-medium"
            }`}
            onClick={() => {
              setTypeFilter(RoomStatusEnum.Reservada);
              table
                .getColumn("status")
                ?.setFilterValue(RoomStatusEnum.Reservada);
            }}
          >
            <span className="text-foreground_80 text-base">Reservado</span>
            <span
              className={`text-xs  py-[2px] px-1 ${
                typeFilter === RoomStatusEnum.Reservada
                  ? "text-[#F6AD2B] text-opacity-60 bg-[#F6AD2B] bg-opacity-15"
                  : "text-foreground_50 bg-background_2"
              }`}
            >
              {
                data.filter((row) => row.status === RoomStatusEnum.Reservada)
                  .length
              }
            </span>
            {typeFilter === RoomStatusEnum.Reservada && (
              <Separator className="absolute !h-[3px] bg-[#F6AD2B] opacity-50 rounded-full bottom-0" />
            )}
          </Button>
          <Button
            variant="ghost"
            className={`relative flex items-center font-Inter hover:!font-bold uppercase px-3 py-6 ${
              typeFilter === RoomStatusEnum.Ocupado
                ? "font-bold"
                : "font-medium"
            }`}
            onClick={() => {
              setTypeFilter(RoomStatusEnum.Ocupado);
              table.getColumn("status")?.setFilterValue(RoomStatusEnum.Ocupado);
            }}
          >
            <span className="text-foreground_80 text-base">Ocupado</span>
            <span
              className={`text-xs  py-[2px] px-1 ${
                typeFilter === RoomStatusEnum.Ocupado
                  ? "text-[#F6AD2B] text-opacity-60 bg-[#F6AD2B] bg-opacity-15"
                  : "text-foreground_50 bg-background_2"
              }`}
            >
              {
                data.filter((row) => row.status === RoomStatusEnum.Ocupado)
                  .length
              }
            </span>
            {typeFilter === RoomStatusEnum.Ocupado && (
              <Separator className="absolute !h-[3px] bg-[#F6AD2B] opacity-50 rounded-full bottom-0" />
            )}
          </Button>
        </section>
      </section>
      <section className="results-section bg-table-foreground w-full px-2 py-4">
        <span className="text-table-accent font-Inter text-sm font-medium opacity-50">
          Mostrando {startRow} - {endRow} de{" "}
          {table.getFilteredRowModel().rows.length} salas
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
