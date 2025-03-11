import { ArrowDown3, SearchNormal1 } from "iconsax-react";
import { Separator } from "../ui/separator";
import { Input } from "../ui/input";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { useDefaultDataTableContext } from "./DefaultTableContext";
import { useEffect, useState } from "react";

export interface IDefaultTableFilters {
  searchColumnKey: string;
  searchPlaceholder?: string;
  defaultTypeColumnKey: string;
  typeFilterOptions: { label: string; value: string }[];
}

export const DefaultTableFilters = ({
  searchColumnKey,
  searchPlaceholder = "Filtrar...",
  defaultTypeColumnKey,
  typeFilterOptions,
}: IDefaultTableFilters) => {
  const { table, totalRows, typeFilter, setTypeFilter } =
    useDefaultDataTableContext();
  const initialFilter =
    (table.getColumn(searchColumnKey)?.getFilterValue() as string) ?? "";
  const [searchValue, setSearchValue] = useState<string>(initialFilter);

  useEffect(() => {
    const current =
      (table.getColumn(searchColumnKey)?.getFilterValue() as string) ?? "";
    if (current !== searchValue) {
      setSearchValue(current);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [table.getColumn(searchColumnKey)?.getFilterValue()]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    setSearchValue(newValue);
    table.getColumn(searchColumnKey)?.setFilterValue(newValue);
  };

  return (
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
            placeholder={searchPlaceholder}
            className="w-full font-Inter font-normal text-base h-full rounded-md border border-border"
            value={searchValue}
            onChange={handleChange}
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
        {/* Botão "Todos" */}
        <Button
          variant="ghost"
          className={`relative flex items-center font-Inter hover:!font-bold uppercase px-3 py-6 ${
            typeFilter === "todos" ? "font-bold" : "font-medium"
          }`}
          onClick={() => {
            setTypeFilter("todos");
            table.getColumn(defaultTypeColumnKey)?.setFilterValue("");
          }}
        >
          <span className="text-foreground_80 text-base">Todos</span>
          <span
            className={`text-xs py-[2px] px-1 ${
              typeFilter === "todos"
                ? "text-[#F6AD2B] text-opacity-60 bg-[#F6AD2B] bg-opacity-15"
                : "text-foreground_50 bg-background_2"
            }`}
          >
            {totalRows}
          </span>
          {typeFilter === "todos" && (
            <Separator className="absolute !h-[3px] bg-[#F6AD2B] opacity-50 rounded-full bottom-0" />
          )}
        </Button>

        {/* Botões para cada opção de filtro de tipo */}
        {typeFilterOptions.map((option) => {
          const count = (table.options.data as any[]).filter((row) => {
            const columnData = (row as any)[defaultTypeColumnKey];

            // Verifica se columnData é um objeto e possui a propriedade 'type'
            if (
              typeof columnData === "object" &&
              columnData !== null &&
              "type" in columnData
            ) {
              return columnData.type === option.value;
            }

            // Se columnData não for um objeto, compara diretamente
            return columnData === option.value;
          }).length;
          return (
            <Button
              key={option.value}
              variant="ghost"
              className={`relative flex items-center font-Inter hover:!font-bold uppercase px-3 py-6 ${
                typeFilter === option.value ? "font-bold" : "font-medium"
              }`}
              onClick={() => {
                setTypeFilter(option.value);
                table
                  .getColumn(defaultTypeColumnKey)
                  ?.setFilterValue(option.value);
              }}
            >
              <span className="text-foreground_80 text-base">
                {option.label}
              </span>
              <span
                className={`text-xs py-[2px] px-1 ${
                  typeFilter === option.value
                    ? "text-[#F6AD2B] text-opacity-60 bg-[#F6AD2B] bg-opacity-15"
                    : "text-foreground_50 bg-background_2"
                }`}
              >
                {count}
              </span>
              {typeFilter === option.value && (
                <Separator className="absolute !h-[3px] bg-[#F6AD2B] opacity-50 rounded-full bottom-0" />
              )}
            </Button>
          );
        })}
      </section>
    </section>
  );
};
