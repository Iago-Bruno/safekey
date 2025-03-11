import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { AuthConstants } from "@/utils/authConstants";
import { Logout, Setting2 } from "iconsax-react";
import { useNavigate } from "react-router-dom";

export const NavConfig = () => {
  const navigate = useNavigate();
  const { isMobile } = useSidebar();

  const handleLogOut = () => {
    localStorage.removeItem(AuthConstants.ACCESS_TOKEN);
    localStorage.removeItem(AuthConstants.ACCESS_USER);
    localStorage.removeItem(AuthConstants.LOGGED_USER_TYPE);
    navigate("/");
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent group-data-[collapsible=icon]:ms-3 text-sidebar-accent-foreground"
              tooltip={"Configurações"}
            >
              <Setting2 className="!w-[30px] !h-[30px]" variant="Broken" />
              <span className="font-KumbhSans font-semibold text-base">
                Configurações
              </span>
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            {/* <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Switch
                  id="theme-mode"
                  checked={isChecked}
                  onClick={onClickSwitch}
                />
                <Label htmlFor="theme-mode">Tema claro</Label>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator /> */}
            <DropdownMenuItem
              className="gap-2 cursor-pointer"
              onClick={handleLogOut}
            >
              <Logout />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
};
