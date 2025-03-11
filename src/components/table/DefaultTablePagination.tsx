import { Button } from "../ui/button";
import { useDefaultDataTableContext } from "./DefaultTableContext";

export const DefaultTablePagination = () => {
  const { table, pageIndex } = useDefaultDataTableContext();

  return (
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
  );
};
