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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowDown3, SearchNormal1 } from "iconsax-react";

import { Separator } from "@/components/ui/separator";
import { IUsersTableCollums } from "@/interfaces/IUsersTableCollums";
import { ValidateLoggedUserIsAdmin } from "@/utils/userValidations";
import { ActionsSections } from "./actions-section/actions-sections";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function DataTable<TData extends IUsersTableCollums, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [userIsAdmin, setUserIsAdmin] = useState<boolean>(false);
  const [typeFilter, setTypeFilter] = useState<string>("todos");

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const table = useReactTable<IUsersTableCollums>({
    data,
    columns: columns as ColumnDef<IUsersTableCollums, any>[],
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
    },
  });
  const { pageIndex, pageSize } = table.getState().pagination;
  const currentPageRows = table.getPaginationRowModel().rows; // Linhas da página atual
  const totalRows = data.length; // Total de linhas
  const currentPageIndex = table.getState().pagination.pageIndex; // Índice da página atual
  const rowsPerPage = table.getState().pagination.pageSize; // Linhas por página
  const pageCount = Math.ceil(data.length / pageSize); // Total de páginas

  // Calcular intervalo de linhas
  const startRow = currentPageIndex * rowsPerPage + 1;
  const endRow = Math.min(startRow + currentPageRows.length - 1, totalRows);

  useEffect(() => {
    const validateUser = async () => {
      const result = await ValidateLoggedUserIsAdmin();
      setUserIsAdmin(result);
    };

    validateUser();
  }, []);

  return (
    <div className="flex flex-col p-2 w-full h-full bg-table-background">
      <section className="actions-section">
        <ActionsSections userIsAdmin={userIsAdmin} />
      </section>
      <section className="filters-section w-full">
        <Separator className="bg-[#233255] opacity-10" />
        <div className="top-filters flex items-center w-full h-[50px] gap-4 my-2">
          <span className="flex items-center w-full h-full bg-table-foreground text-table-accent_opacity rounded-md">
            <SearchNormal1
              size="22"
              variant="Broken"
              color="#7FBDE4"
              className="absolute ml-3 cursor-text pointer-events-none"
            />
            <Input
              placeholder="Filtrar por nome..."
              className="w-full font-Inter font-normal text-base h-full rounded-md border border-border"
              value={
                (table.getColumn("nome")?.getFilterValue() as string) ?? ""
              }
              onChange={(event) =>
                table.getColumn("nome")?.setFilterValue(event.target.value)
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
        </div>
        <Separator className="bg-[#233255] opacity-10" />
        <div className="bottom-filters flex">
          <Button
            variant="ghost"
            className={`relative flex items-center font-Inter hover:!font-bold uppercase px-3 py-6 ${
              typeFilter === "todos" ? "font-bold" : "font-medium"
            }`}
            onClick={() => {
              setTypeFilter("todos");
              table.getColumn("tipo")?.setFilterValue("");
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
              typeFilter === "Aluno" ? "font-bold" : "font-medium"
            }`}
            onClick={() => {
              setTypeFilter("Aluno");
              table.getColumn("tipo")?.setFilterValue("Aluno");
            }}
          >
            <span className="text-foreground_80 text-base">Alunos</span>
            <span
              className={`text-xs  py-[2px] px-1 ${
                typeFilter === "Aluno"
                  ? "text-[#F6AD2B] text-opacity-60 bg-[#F6AD2B] bg-opacity-15"
                  : "text-foreground_50 bg-background_2"
              }`}
            >
              {data.filter((row) => row.tipo === "Aluno").length}
            </span>
            {typeFilter === "Aluno" && (
              <Separator className="absolute !h-[3px] bg-[#F6AD2B] opacity-50 rounded-full bottom-0" />
            )}
          </Button>
          <Button
            variant="ghost"
            className={`relative flex items-center font-Inter hover:!font-bold uppercase px-3 py-6 ${
              typeFilter === "Professor" ? "font-bold" : "font-medium"
            }`}
            onClick={() => {
              setTypeFilter("Professor");
              table.getColumn("tipo")?.setFilterValue("Professor");
            }}
          >
            <span className="text-foreground_80 text-base">Docentes</span>
            <span
              className={`text-xs  py-[2px] px-1 ${
                typeFilter === "Professor"
                  ? "text-[#F6AD2B] text-opacity-60 bg-[#F6AD2B] bg-opacity-15"
                  : "text-foreground_50 bg-background_2"
              }`}
            >
              {data.filter((row) => row.tipo === "Professor").length}
            </span>
            {typeFilter === "Professor" && (
              <Separator className="absolute !h-[3px] bg-[#F6AD2B] opacity-50 rounded-full bottom-0" />
            )}
          </Button>
          <Button
            variant="ghost"
            className={`relative flex items-center font-Inter hover:!font-bold uppercase px-3 py-6 ${
              typeFilter === "Administrador" ? "font-bold" : "font-medium"
            }`}
            onClick={() => {
              setTypeFilter("Administrador");
              table.getColumn("tipo")?.setFilterValue("Administrador");
            }}
          >
            <span className="text-foreground_80 text-base">
              Administradores
            </span>
            <span
              className={`text-xs  py-[2px] px-1 ${
                typeFilter === "Administrador"
                  ? "text-[#F6AD2B] text-opacity-60 bg-[#F6AD2B] bg-opacity-15"
                  : "text-foreground_50 bg-background_2"
              }`}
            >
              {data.filter((row) => row.tipo === "Administrador").length}
            </span>
            {typeFilter === "Administrador" && (
              <Separator className="absolute !h-[3px] bg-[#F6AD2B] opacity-50 rounded-full bottom-0" />
            )}
          </Button>
        </div>
      </section>
      <section className="results-section bg-table-foreground w-full px-2 py-4">
        <span className="text-table-accent font-Inter text-sm font-medium opacity-50">
          Mostrando {startRow} - {endRow} de{" "}
          {table.getFilteredRowModel().rows.length} usuários
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
                        {header.id !== "tipo" && (
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
                  className="text-table-accent_opacity font-Inter text-sm font-normal h-[50px]"
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
        <div className="flex items-center justify-end space-x-2 py-4 text-black gap-4 bg-table-foreground px-4">
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
      </section>
    </div>
  );
}
