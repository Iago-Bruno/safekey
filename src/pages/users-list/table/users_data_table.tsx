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
import { UsersActions } from "../actions-section/UsersActions";
import { OutletContextType } from "@/pages/layout";
import { useOutletContext } from "react-router-dom";
import { UsersInfoTab } from "../users-info-tab/users-info-tab";
import { useUsersContext } from "../context/users-context";
import { IUsers } from "@/interfaces/IUser";
import { UsersTypeEnum } from "@/interfaces/Enums/UsersTypeEnum";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function UsersDataTable<TData extends IUsers, TValue>({
  columns,
  data,
}: Readonly<DataTableProps<TData, TValue>>) {
  const {
    usersList,
    selectedUsers,
    setSelectedUsers,
    handleGetUsers,
    setOpenAddDialog,
    setIsEdit,
  } = useUsersContext();
  const { setHeader } = useOutletContext<OutletContextType>();
  const [typeFilter, setTypeFilter] = useState<string>("todos");
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const table = useReactTable<IUsers>({
    data,
    columns: columns as ColumnDef<IUsers, any>[],
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
    if (selectedUsers.length === 0) {
      setHeader(null);
      return;
    }

    setHeader(
      <UsersInfoTab
        selectedUsers={selectedUsers}
        setSelectedUsers={setSelectedUsers}
        handleGetUsers={handleGetUsers}
        setRowSelection={setRowSelection}
        setOpenAddDialog={setOpenAddDialog}
        setIsEdit={setIsEdit}
        setHeader={setHeader}
      />
    );
  }, [selectedUsers]);

  useEffect(() => {
    const selectedRowIds = table
      .getSelectedRowModel()
      .rows.map((row) => row.original.id);

    setSelectedUsers(
      usersList.filter((user) => selectedRowIds.includes(user.id))
    );
  }, [table.getSelectedRowModel().rows, usersList]);

  return (
    <div className="flex flex-col p-2 w-full h-full bg-table-background">
      <section className="actions-section">
        <UsersActions />
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
              placeholder="Filtrar por nome do usuário..."
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
              table.getColumn("type")?.setFilterValue("");
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
              typeFilter === UsersTypeEnum.Aluno ? "font-bold" : "font-medium"
            }`}
            onClick={() => {
              setTypeFilter(UsersTypeEnum.Aluno);
              table.getColumn("type")?.setFilterValue(UsersTypeEnum.Aluno);
            }}
          >
            <span className="text-foreground_80 text-base">Alunos</span>
            <span
              className={`text-xs  py-[2px] px-1 ${
                typeFilter === UsersTypeEnum.Aluno
                  ? "text-[#F6AD2B] text-opacity-60 bg-[#F6AD2B] bg-opacity-15"
                  : "text-foreground_50 bg-background_2"
              }`}
            >
              {
                data.filter((row) => row.type.type === UsersTypeEnum.Aluno)
                  .length
              }
            </span>
            {typeFilter === UsersTypeEnum.Aluno && (
              <Separator className="absolute !h-[3px] bg-[#F6AD2B] opacity-50 rounded-full bottom-0" />
            )}
          </Button>
          <Button
            variant="ghost"
            className={`relative flex items-center font-Inter hover:!font-bold uppercase px-3 py-6 ${
              typeFilter === UsersTypeEnum.Professor
                ? "font-bold"
                : "font-medium"
            }`}
            onClick={() => {
              setTypeFilter(UsersTypeEnum.Professor);
              table.getColumn("type")?.setFilterValue(UsersTypeEnum.Professor);
            }}
          >
            <span className="text-foreground_80 text-base">Professores</span>
            <span
              className={`text-xs  py-[2px] px-1 ${
                typeFilter === UsersTypeEnum.Professor
                  ? "text-[#F6AD2B] text-opacity-60 bg-[#F6AD2B] bg-opacity-15"
                  : "text-foreground_50 bg-background_2"
              }`}
            >
              {
                data.filter((row) => row.type.type === UsersTypeEnum.Professor)
                  .length
              }
            </span>
            {typeFilter === UsersTypeEnum.Professor && (
              <Separator className="absolute !h-[3px] bg-[#F6AD2B] opacity-50 rounded-full bottom-0" />
            )}
          </Button>
          <Button
            variant="ghost"
            className={`relative flex items-center font-Inter hover:!font-bold uppercase px-3 py-6 ${
              typeFilter === UsersTypeEnum.Administrador
                ? "font-bold"
                : "font-medium"
            }`}
            onClick={() => {
              setTypeFilter(UsersTypeEnum.Administrador);
              table
                .getColumn("type")
                ?.setFilterValue(UsersTypeEnum.Administrador);
            }}
          >
            <span className="text-foreground_80 text-base">
              Administradores
            </span>
            <span
              className={`text-xs  py-[2px] px-1 ${
                typeFilter === UsersTypeEnum.Administrador
                  ? "text-[#F6AD2B] text-opacity-60 bg-[#F6AD2B] bg-opacity-15"
                  : "text-foreground_50 bg-background_2"
              }`}
            >
              {
                data.filter(
                  (row) => row.type.type === UsersTypeEnum.Administrador
                ).length
              }
            </span>
            {typeFilter === UsersTypeEnum.Administrador && (
              <Separator className="absolute !h-[3px] bg-[#F6AD2B] opacity-50 rounded-full bottom-0" />
            )}
          </Button>
        </section>
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
