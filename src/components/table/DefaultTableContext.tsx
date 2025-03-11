import { createContext, ReactNode, useContext, useMemo, useState } from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";

export interface IDefaultDataTableContextValue<TData> {
  table: ReturnType<typeof useReactTable<TData>>;
  totalCollums: number;
  pageIndex: number;
  startRow: number;
  endRow: number;
  totalRows: number;
  typeFilter: string;
  setTypeFilter: React.Dispatch<React.SetStateAction<string>>;
}

interface IDefaultDataTableProviderProps<TData, TValue> {
  children: ReactNode;
  data: TData[];
  columns: ColumnDef<TData, TValue>[];
}

const DefaultDataTableContext =
  createContext<IDefaultDataTableContextValue<any> | null>(null);

export function DefaultDataTableProvider<TData, TValue>({
  children,
  data,
  columns,
}: Readonly<IDefaultDataTableProviderProps<TData, TValue>>) {
  const [typeFilter, setTypeFilter] = useState<string>("todos");
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  const table = useReactTable<TData>({
    data,
    columns,
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

  // Dados para exibição de paginação
  const { pageIndex } = table.getState().pagination;
  const currentPageRows = table.getPaginationRowModel().rows;
  const totalCollums = columns.length;
  const totalRows = data.length;
  const currentPageIndex = table.getState().pagination.pageIndex;
  const rowsPerPage = table.getState().pagination.pageSize;
  const startRow = currentPageIndex * rowsPerPage + 1;
  const endRow = Math.min(startRow + currentPageRows.length - 1, totalRows);

  const contextValue = useMemo(
    () => ({
      table,
      totalCollums,
      pageIndex,
      startRow,
      endRow,
      totalRows,
      typeFilter,
      setTypeFilter,
    }),
    [
      table,
      totalCollums,
      pageIndex,
      startRow,
      endRow,
      totalRows,
      typeFilter,
      setTypeFilter,
    ]
  );

  return (
    <DefaultDataTableContext.Provider value={contextValue}>
      {children}
    </DefaultDataTableContext.Provider>
  );
}

export function useDefaultDataTableContext<
  TData
>(): IDefaultDataTableContextValue<TData> {
  const context = useContext(DefaultDataTableContext);
  if (!context) {
    throw new Error(
      "useDataTableContext must be used within a DataTableProvider"
    );
  }
  // Realizamos o cast para o tipo esperado
  return context as IDefaultDataTableContextValue<TData>;
}
