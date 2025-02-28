import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { RegisterUser } from "./register/register-user";
import { Button } from "@/components/ui/button";
import { ArrowDown3 } from "iconsax-react";

export const ActionsSections = ({ userIsAdmin }: any) => {
  return (
    <div className="flex justify-end gap-4 py-4">
      <DropdownMenu>
        <DropdownMenuTrigger
          asChild
          className="px-4 py-3 bg-table-foreground rounded-md border border-border"
        >
          <Button
            variant={"ghost"}
            className="rounded-md text-table-accent_opacity font-Inter font-medium text-base"
          >
            EXPORTAR
            <ArrowDown3 size="32" variant="Bold" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem className="gap-2 cursor-pointer">
            CSV
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <RegisterUser userIsAdmin={userIsAdmin} />
    </div>
  );
};
