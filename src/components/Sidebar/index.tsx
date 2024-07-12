"use client";

import React from "react";
import Image from "next/image";
import SidebarItem from "@/components/Sidebar/SidebarItem";
import ClickOutside from "@/components/ClickOutside";
import useLocalStorage from "@/hooks/useLocalStorage";
import {
  BsGrid,
  BsTruck,
  BsPerson,
  BsPersonGear,
  BsGear,
} from "react-icons/bs";
import { VscAccount } from "react-icons/vsc";
import { FaRoute } from "react-icons/fa6";
import { BsBoxSeam } from "react-icons/bs";

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (arg: boolean) => void;
}

const menuGroups = [
  {
    menuItems: [
      {
        icon: <BsGrid size={20} />,
        label: "Dashboard",
        route: "/admin",
      },
      {
        icon: <FaRoute size={20} />,
        label: "Route",
        route: "/admin/route",
      },
      {
        icon: <BsTruck size={20} />,
        label: "Truck",
        route: "#",
        children: [
          { label: "Truck", route: "/admin/truck" },
          { label: "Fuel", route: "/admin/fuel" },
          { label: "Size", route: "/admin/size" },
        ],
      },
      {
        icon: <BsBoxSeam size={20} />,
        label: "Case",
        route: "/admin/case",
      },
      {
        icon: <BsPerson size={20} />,
        label: "Driver",
        route: "#",
        children: [
          { label: "Driver", route: "/admin/driver" },
          { label: "Assistant", route: "/admin/assistant" },
          { label: "License", route: "/admin/license" },
        ],
      },
      {
        icon: <BsPersonGear size={20} />,
        label: "User",
        route: "/admin/user",
      },
      {
        icon: <BsGear size={20} />,
        label: "System",
        route: "/admin/system",
      },
      {
        icon: <VscAccount size={20} />,
        label: "Profile",
        route: "#",
        children: [
          { label: "Information", route: "/admin/profile/information" },
          { label: "Setting", route: "/admin/profile/setting" },
          { label: "Session", route: "/admin/profile/session" },
        ],
      },
    ],
  },
];

const Sidebar = ({ sidebarOpen, setSidebarOpen }: SidebarProps) => {
  const [pageName, setPageName] = useLocalStorage("selectedMenu", "dashboard");

  return (
    <ClickOutside onClick={() => setSidebarOpen(false)}>
      <aside
        className={`text-md absolute left-0 top-0 z-9999 flex h-screen w-[14rem] flex-col overflow-y-hidden border-r border-stroke bg-white dark:border-stroke-dark dark:bg-gray-dark lg:static lg:translate-x-0 ${
          sidebarOpen
            ? "translate-x-0 duration-300 ease-linear"
            : "-translate-x-full"
        }`}
      >
        {/* <!-- SIDEBAR HEADER --> */}
        <div className="flex items-center justify-between gap-2 px-6 py-5.5 lg:py-6.5 xl:py-10">
          <div>
            <Image
              width={176}
              height={32}
              src={"/images/logo/logo-dark.svg"}
              alt="Logo"
              priority
              className="dark:hidden"
              style={{ width: "auto", height: "auto" }}
            />
            <Image
              width={176}
              height={32}
              src={"/images/logo/logo.svg"}
              alt="Logo"
              priority
              className="hidden dark:block"
              style={{ width: "auto", height: "auto" }}
            />
          </div>

          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="block lg:hidden"
          >
            <svg
              className="fill-current"
              width="20"
              height="18"
              viewBox="0 0 20 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M19 8.175H2.98748L9.36248 1.6875C9.69998 1.35 9.69998 0.825 9.36248 0.4875C9.02498 0.15 8.49998 0.15 8.16248 0.4875L0.399976 8.3625C0.0624756 8.7 0.0624756 9.225 0.399976 9.5625L8.16248 17.4375C8.31248 17.5875 8.53748 17.7 8.76248 17.7C8.98748 17.7 9.17498 17.625 9.36248 17.475C9.69998 17.1375 9.69998 16.6125 9.36248 16.275L3.02498 9.8625H19C19.45 9.8625 19.825 9.4875 19.825 9.0375C19.825 8.55 19.45 8.175 19 8.175Z"
                fill=""
              />
            </svg>
          </button>
        </div>
        {/* <!-- SIDEBAR HEADER --> */}

        <div className="no-scrollbar flex flex-col overflow-y-auto duration-300 ease-linear">
          {/* <!-- Sidebar Menu --> */}
          <nav className="mt-1 px-4 lg:px-1">
            {menuGroups.map((group, groupIndex) => (
              <div key={groupIndex}>
                <ul className="mb-6 flex flex-col gap-1">
                  {group.menuItems.map((menuItem, menuIndex) => (
                    <SidebarItem
                      key={menuIndex}
                      item={menuItem}
                      pageName={pageName}
                      setPageName={setPageName}
                    />
                  ))}
                </ul>
              </div>
            ))}
          </nav>
          {/* <!-- Sidebar Menu --> */}
        </div>
      </aside>
    </ClickOutside>
  );
};

export default Sidebar;
