import { Sidebar } from "@/components/sidebar/sidebar";
import { Outlet } from "react-router-dom";

export const Layout = () => {
  return (
    <div className="layout-page w-screen h-screen flex">
      <section className="sidebar-section">
        <Sidebar />
      </section>
      <section className="w-full">
        <Outlet />
      </section>
    </div>
  );
};
