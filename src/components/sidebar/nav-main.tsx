import { Link, useLocation } from "react-router-dom";
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

interface NavMainProps {
  items: {
    title: string;
    icon: any;
    pathname: string;
  }[];
}

export function NavMain({ items }: NavMainProps) {
  const urlPathname = useLocation().pathname;

  return (
    <SidebarGroup>
      <SidebarMenu className="gap-4">
        {items.map((item, idx) => (
          <SidebarMenuItem
            key={idx}
            className="text-sidebar-primary-foreground text-4xl font-KumbhSans font-semibold flex justify-center"
          >
            <SidebarMenuButton className="h-12" tooltip={item.title} asChild>
              <Link to={item.pathname} className="text-4xl">
                {urlPathname === item.pathname ? (
                  <item.icon
                    className="!w-[30px] !h-[30px]"
                    color="#F6AD2B"
                    variant="Broken"
                  />
                ) : (
                  <item.icon className="!w-[30px] !h-[30px]" variant="Broken" />
                )}
                <span className="text-base">{item.title}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
