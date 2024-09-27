import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Add,
  CloseCircle,
  DocumentDownload,
  Eye,
  EyeSlash,
  SearchNormal1,
} from "iconsax-react";
import { Label } from "@/components/ui/label";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UsersTypeService } from "@/services/users-type-service";
import { UsersService } from "@/services/users-service";
import { ToastAction } from "@/components/ui/toast";
import { useToast } from "@/hooks/use-toast";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

interface IUsersType {
  id: number;
  name: string;
}

const FormSchema = z.object({
  type: z.string({
    required_error: "Escolha o tipo de acesso do usuário",
  }),
  matricula: z.string({ required_error: "Matricula é obrigatorio!" }).min(7, {
    message: "Nome tem que pelo menos 7 caracteres!",
  }),
  name: z.string({ required_error: "Nome é obrigatorio!" }).min(2, {
    message: "Nome tem que pelo menos 2 caracteres!",
  }),
  email: z
    .string({ required_error: "Email é obrigatorio!" })
    .email({ message: "Email inválido" }),
  password: z
    .string({ required_error: "Senha é obrigatorio!" })
    .min(8, { message: "Senha deve conter mais de 8 caracteres" }),
});

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const { toast } = useToast();
  const loggedUser = JSON.parse(localStorage.getItem("access_user") || "null");
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [usersType, setUsersType] = useState<IUsersType[]>([]);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [openAddDialog, setOpenAddDialog] = useState<boolean>(false);

  const table = useReactTable({
    data,
    columns,
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

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      const response = await UsersService.registerUsers(data);

      if (response.status === 201) {
        toast({
          variant: "success",
          title: "Um novo acesso foi cadastrado com sucesso!",
          action: (
            <ToastAction
              className="bg-transparent border-0 p-0 hover:bg-transparent"
              altText="Goto schedule to undo"
            >
              <CloseCircle size="24" color="#ffffff" variant="Broken" />
            </ToastAction>
          ),
        });

        setOpenAddDialog(false);
        getUsersType();
        return;
      }

      toast({
        variant: "destructive",
        title: "Opps! Houve um erro ao tentar cadastrar o usuário.",
        description: "Por favor tente novamente mais tarde!",
        action: (
          <ToastAction
            className="bg-transparent border-0 p-0 hover:bg-transparent"
            altText="Goto schedule to undo"
          >
            <CloseCircle size="24" color="#ffffff" variant="Broken" />
          </ToastAction>
        ),
      });
    } catch (error) {
      console.error(error);
    }
  }

  const getUsersType = async () => {
    try {
      const response = await UsersTypeService.getUsersType();

      if (response.status === 200) {
        setUsersType(response.data.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getUsersType();
  }, []);

  return (
    <div className="container flex flex-col w-full">
      {loggedUser.user_type_id === 1 && (
        <div className="container flex gap-4 mb-8">
          <Button variant={"ghost"} className="px-4 py-6 rounded-md">
            Export CSV{" "}
            <DocumentDownload size="24" color="#2671B1" className="ml-2" />
          </Button>
          <Dialog open={openAddDialog} onOpenChange={setOpenAddDialog}>
            <DialogTrigger>
              <Button
                type="button"
                variant={"primary"}
                className="px-4 py-6 rounded-md"
              >
                Adicionar usuário <Add size="24" color="#ffffff" />
              </Button>
            </DialogTrigger>
            <DialogContent forceMount className="max-w-screen-lg px-8 py-12">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="">
                  <DialogHeader className="flex flex-row justify-between items-center w-full">
                    <DialogTitle>
                      <Label className="font-KumbhSans font-semibold text-3xl text-gray_400">
                        Adicionar novo acesso
                      </Label>
                    </DialogTitle>
                    <DialogDescription>
                      <FormField
                        control={form.control}
                        name="type"
                        render={({ field }) => (
                          <FormItem className="w-[320px]">
                            <FormLabel className="font-KumbhSans font-medium text-sm text-gray_200">
                              Tipo de acesso
                            </FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl className="border-gray_100 h-[42px]">
                                <SelectTrigger>
                                  <SelectValue placeholder="Selecione o tipo de usuário" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {usersType.map((type) => {
                                  return (
                                    <SelectItem value={type.id.toString()}>
                                      {type.name}
                                    </SelectItem>
                                  );
                                })}
                              </SelectContent>
                            </Select>
                            <FormDescription className="font-KumbhSans font-medium text-sm text-gray_100">
                              Defina qual o tipo de acesso do usuário
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </DialogDescription>
                  </DialogHeader>
                  <section className="dialog-body flex flex-col gap-6">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormLabel className="font-KumbhSans font-medium text-sm text-gray_200">
                            Nome
                          </FormLabel>
                          <FormControl className="w-full h-[42px] border-gray_100">
                            <Input
                              placeholder="Insira o nome do usuário"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="flex gap-6">
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem className="w-full">
                            <FormLabel className="font-KumbhSans font-medium text-sm text-gray_200">
                              Endereço de email
                            </FormLabel>
                            <FormControl className="h-[42px] border-gray_100">
                              <Input
                                placeholder={"Insira o email do usuário"}
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="matricula"
                        render={({ field }) => (
                          <FormItem className="w-full">
                            <FormLabel className="font-KumbhSans font-medium text-sm text-gray_200">
                              Número de matricula
                            </FormLabel>
                            <FormControl className="h-[42px] border-gray_100">
                              <Input
                                placeholder="Insira a matricula do usuário"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem className="w-full">
                            <FormLabel className="font-KumbhSans font-medium text-sm text-gray_200">
                              Senha
                            </FormLabel>
                            <div className="relative">
                              <FormControl className="h-[42px] border-gray_100">
                                <Input
                                  {...field}
                                  placeholder="Insira a senha do usuário"
                                  type={showPassword ? "text" : "password"}
                                />
                              </FormControl>
                              <Button
                                type="button"
                                variant={"ghost"}
                                className="absolute right-2 top-[2px] p-0 text-gray-600"
                                onClick={() => setShowPassword(!showPassword)}
                              >
                                {showPassword ? <Eye /> : <EyeSlash />}
                              </Button>
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </section>
                  <DialogFooter className="w-full justify-start mt-6">
                    <Button
                      variant={"primary"}
                      type="submit"
                      className="rounded-sm"
                    >
                      Adicionar novo acesso
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
      )}
      <div className="container flex items-center w-full gap-8">
        <div className="flex items-center py-4 w-full">
          <SearchNormal1
            size="18"
            color="#FF8A65"
            variant="Broken"
            className="absolute ml-3"
          />
          <Input
            placeholder="Filtrar por nome..."
            value={(table.getColumn("nome")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("nome")?.setFilterValue(event.target.value)
            }
            className="w-full bg-[#FCFAFA] font-KumbhSans font-medium text-sm text-gray_200"
            style={{ textIndent: "1.8rem" }}
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="ml-auto bg-[#FCFAFA] font-KumbhSans font-medium text-sm text-gray_200"
            >
              Colunas
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
                    className="capitalize"
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
      <div className="rounded-md border w-full">
        <Table className="w-full">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
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
              <TableRow>
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
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          className="font-KumbhSans font-medium text-sm"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Anterior
        </Button>
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
  );
}
