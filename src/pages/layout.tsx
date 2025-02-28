import SidebarLayout from "@/components/sidebar/sidebar-layout";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronsUpDown } from "lucide-react";
import React, { useState } from "react";
import { Outlet } from "react-router-dom";

export interface OutletContextType {
  setHeader: (component: React.ReactNode) => void;
}

export const Layout = () => {
  const [headerComponent, setHeaderComponent] = useState<React.ReactNode>(null);
  const [isOpen, setIsOpen] = React.useState(false);

  const outletContext: OutletContextType = { setHeader: setHeaderComponent };

  return (
    <div className="layout-page w-screen h-screen flex bg-background">
      <section className="main-section w-full h-full flex">
        <section className="flex flex-col w-full h-full p-4 bg-foreground border border-l border-[#7FBDE4] border-opacity-30">
          <section className="header-section">
            <header className="flex items-center border border-red-100 h-14 mb-8">
              <h1 className="text-black">SafeKey Logo</h1>
            </header>
          </section>
          <section className="body-section flex justify-start h-full gap-4">
            <SidebarLayout />
            <section className="outlet-section w-full">
              <Outlet context={outletContext} />
            </section>
          </section>
        </section>
        <section className="rigth-section max-w-[360px] h-full bg-background flex flex-col items-end">
          <section className="nav-user w-[340px] h-[90px]">
            <Collapsible
              open={isOpen}
              onOpenChange={setIsOpen}
              className="w-full h-full bg-foreground rounded-bl-[24px] shadow-[-4px_4px_10px_rgba(0,0,0,0.05)]"
            >
              <CollapsibleTrigger asChild>
                <div className="flex items-center justify-between space-x-4 px-4">
                  <h4 className="text-sm font-semibold">Dados do Usuario</h4>
                  <Button variant="ghost" size="sm" className="w-9 p-0">
                    <ChevronsUpDown className="h-4 w-4" />
                    <span className="sr-only">Toggle</span>
                  </Button>
                </div>
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-2">
                <div className="rounded-md border px-4 py-3 font-mono text-sm">
                  @radix-ui/colors
                </div>
                <div className="rounded-md border px-4 py-3 font-mono text-sm">
                  @stitches/react
                </div>
              </CollapsibleContent>
            </Collapsible>
          </section>

          <section className="outlet-context-section w-full px-[30px] mt-4">
            {headerComponent}
          </section>
        </section>
      </section>
    </div>
  );
};
