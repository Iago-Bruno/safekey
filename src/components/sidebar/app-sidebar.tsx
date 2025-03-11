import * as React from "react";
import { NavMain } from "@/components/sidebar/navs/nav-main";
import { NavConfig } from "./navs/nav-config";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarRail,
} from "@/components/ui/sidebar";
import { Activity, Buildings, Clipboard, Profile2User } from "iconsax-react";

// This is sample data.
const data = {
  navMain: [
    {
      title: "Dashboard",
      icon: Activity,
      pathname: "/dashboard",
    },
    {
      title: "Usuários",
      icon: Profile2User,
      pathname: "/users",
    },
    {
      title: "Salas",
      icon: Buildings,
      pathname: "/rooms",
    },
    {
      title: "Reservas",
      icon: Clipboard,
      pathname: "/reservations",
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar variant="floating" collapsible="icon" {...props}>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter className="justify-center">
        <NavConfig />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
