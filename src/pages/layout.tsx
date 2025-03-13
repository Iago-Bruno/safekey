import React, { useState } from "react";
import SidebarLayout from "@/components/sidebar/sidebar-layout";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { IUsers } from "@/interfaces/IUser";
import { Outlet } from "react-router-dom";
import safekeyLogo from "../assets/icons/logo.png";
import { AuthUtils } from "@/utils/authUtils";
export interface OutletContextType {
  setHeader: (component: React.ReactNode) => void;
}

export const Layout = () => {
  const loggedUser: IUsers | null = AuthUtils.getAccessUser();

  const [headerComponent, setHeaderComponent] = useState<React.ReactNode>(null);

  const outletContext: OutletContextType = { setHeader: setHeaderComponent };

  return (
    <div className="layout-page w-screen h-screen flex bg-background">
      <section className="main-section w-full h-full flex">
        <section className="flex flex-col w-full h-full p-4 bg-foreground border border-l border-[#7FBDE4] border-opacity-30">
          <section className="header-section">
            <header className="flex items-center h-14 mb-8">
              <img
                src={safekeyLogo}
                alt="SafeKey - Logo"
                className="w-36 h-16"
              />
            </header>
          </section>
          <section className="body-section flex justify-start h-full gap-4">
            <SidebarLayout />
            <section className="outlet-section w-full">
              <Outlet context={outletContext} />
            </section>
          </section>
        </section>
        <section className="rigth-section max-w-[360px] h-full bg-background flex flex-col items-end ml-5 gap-4">
          <section className="nav-user w-full min-w-[340px] min-h-[90px] bg-foreground rounded-bl-[24px] shadow-[-4px_4px_10px_rgba(0,0,0,0.05)] px-8">
            <div className="w-full h-full flex items-center">
              <div className="flex items-center gap-3">
                <Avatar className="w-12 h-12">
                  <AvatarImage src={loggedUser?.avatar} alt="@shadcn" />
                  <AvatarFallback>
                    {loggedUser?.name
                      .split(" ")
                      .map((palavra) => palavra[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="h-full flex flex-col justify-center">
                  <h1 className="m-0 p-0 font-Inter font-normal text-sm text-foreground_90">
                    {loggedUser?.name}
                  </h1>
                  <h1 className="m-0 p-0 font-Inter font-normal text-xs text-foreground_80">
                    {loggedUser?.type.type}
                  </h1>
                </div>
              </div>
            </div>
          </section>

          <section className="outlet-context-section w-full pr-5">
            {headerComponent}
          </section>
        </section>
      </section>
    </div>
  );
};
