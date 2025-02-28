import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "./app-sidebar";

export default function SidebarLayout({
  children,
}: Readonly<{
  children?: React.ReactNode;
}>) {
  return (
    <SidebarProvider className="py-4">
      <AppSidebar />
      <main>{children}</main>
    </SidebarProvider>
  );
}
