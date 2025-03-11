import { ReactNode } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { DefaultDataTableProvider } from "./DefaultTableContext";
import { DefaultTablePagination } from "./DefaultTablePagination";
import { DefaultTable } from "./DefaultTable";
import { DefaultTableResults } from "./DefaultTableResults";
import {
  DefaultTableFilters,
  IDefaultTableFilters,
} from "./DefaultTableFIlters";

interface DefaultTableView extends IDefaultTableFilters {
  columns: ColumnDef<any, any>[];
  data: any[];
  children?: ReactNode;
}

export const DefaultTableView = ({
  columns,
  data,
  children,
  searchColumnKey,
  searchPlaceholder,
  defaultTypeColumnKey,
  typeFilterOptions,
}: DefaultTableView) => {
  return (
    <DefaultDataTableProvider data={data} columns={columns}>
      <div className="flex flex-col p-2 w-full h-full bg-table-background">
        {children && <>{children}</>}

        <DefaultTableFilters
          searchColumnKey={searchColumnKey}
          searchPlaceholder={searchPlaceholder}
          defaultTypeColumnKey={defaultTypeColumnKey}
          typeFilterOptions={typeFilterOptions}
        />

        <DefaultTableResults />

        <DefaultTable />

        <DefaultTablePagination />
      </div>
    </DefaultDataTableProvider>
  );
};
