import logo from "@/assets/icons/vite.svg";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";
import { Button } from "../ui/button";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ChemicalGlass, Home2, Logout, Profile2User } from "iconsax-react";

export const Sidebar = () => {
  const locationPathname = useLocation().pathname;
  const navigate = useNavigate();

  const logOutUser = () => {
    localStorage.removeItem("access_user");
    navigate("/");
  };

  return (
    <div className="sidebar w-[240px] h-full bg-blue_1">
      <div className="flex flex-col items-center py-8">
        <section className="flex flex-col items-center justify-center gap-6">
          <img src={logo} className="w-[65px] h-[65px]" alt="Logo" />
          <Label className="font-KumbhSans font-semibold text-sm text-white">
            Safelab IFPB
          </Label>
        </section>
        <Separator className="bg-[#BDBDBD] mt-10 mb-4" />
        <section className="w-full px-4">
          <ul className="flex flex-col gap-2">
            <Link to={"/dashboard"}>
              <li className="">
                <Button
                  variant={
                    locationPathname === "/dashboard"
                      ? "secondary_300_active"
                      : "secondary_300"
                  }
                >
                  <Home2 size="20" color="#ffffff" variant="Broken" />
                  Dashboard
                </Button>
              </li>
            </Link>
            <Link to={"/users"}>
              <li className="">
                <Button
                  variant={
                    locationPathname === "/users"
                      ? "secondary_300_active"
                      : "secondary_300"
                  }
                >
                  <Profile2User size="20" color="#ffffff" variant="Broken" />
                  Usuários
                </Button>
              </li>
            </Link>
            <Link to={"/labs"}>
              <li className="">
                <Button
                  variant={
                    locationPathname === "/labs"
                      ? "secondary_300_active"
                      : "secondary_300"
                  }
                >
                  <ChemicalGlass size="20" color="#ffffff" variant="Broken" />
                  Laboratórios
                </Button>
              </li>
            </Link>
          </ul>
        </section>
        <Separator className="bg-[#BDBDBD] mt-10 mb-4" />
        <section className="w-full px-4">
          <Button
            className="w-full"
            variant={"destructive_logout"}
            onClick={() => logOutUser()}
          >
            <Logout size="20" color="#ffffff" variant="Broken" />
            Log out
          </Button>
        </section>
      </div>
    </div>
  );
};
