import { useDefaultDataTableContext } from "./DefaultTableContext";

export const DefaultTableResults = () => {
  const { table, startRow, endRow } = useDefaultDataTableContext();

  return (
    <section className="results-section bg-table-foreground w-full px-2 py-4">
      <span className="text-table-accent font-Inter text-sm font-medium opacity-50">
        Mostrando {startRow} - {endRow} de{" "}
        {table.getFilteredRowModel().rows.length} usuários
      </span>
    </section>
  );
};
