import * as React from "react";
import { NavMain } from "@/components/sidebar/nav-main";
import { NavUser } from "@/components/sidebar/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarRail,
} from "@/components/ui/sidebar";
import { Activity, Buildings, Profile2User } from "iconsax-react";

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
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const loggedUser = JSON.parse(localStorage.getItem("access_user") || "null");

  return (
    <Sidebar variant="floating" collapsible="icon" {...props}>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter className="justify-center">
        <NavUser user={loggedUser} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
