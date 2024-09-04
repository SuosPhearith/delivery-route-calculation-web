"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import SidebarItem from "@/components/Sidebar/SidebarItem";
import ClickOutside from "@/components/ClickOutside";
import useLocalStorage from "@/hooks/useLocalStorage";
import { BsGrid, BsTruck, BsGear } from "react-icons/bs";
import { FiMapPin } from "react-icons/fi";
import { BsBoxSeam } from "react-icons/bs";
import { GiSteeringWheel } from "react-icons/gi";
import { LiaWarehouseSolid } from "react-icons/lia";
import { PiBuildingOffice } from "react-icons/pi";
import { MdOutlineDirections } from "react-icons/md";
import { Languages, TRANSLATIONS } from "@/translations";

const lang = window.localStorage.getItem("lang") || Languages.EN;

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (arg: boolean) => void;
}

const menuGroups = [
  {
    menuItems: [
      {
        icon: <BsGrid size={20} />,
        label:
          lang === Languages.KH
            ? TRANSLATIONS[Languages.KH].dashboard
            : TRANSLATIONS[Languages.EN].dashboard,
        route: "/admin",
      },
      {
        icon: <FiMapPin size={20} />,
        label:
          lang === Languages.KH
            ? TRANSLATIONS[Languages.KH].route
            : TRANSLATIONS[Languages.EN].route,
        route: "/admin/route",
      },
      {
        icon: <MdOutlineDirections size={20} />,
        label:
          lang === Languages.KH
            ? TRANSLATIONS[Languages.KH].direction
            : TRANSLATIONS[Languages.EN].direction,
        route: "/admin/direction",
      },
      {
        icon: <BsBoxSeam size={20} />,
        label:
          lang === Languages.KH
            ? TRANSLATIONS[Languages.KH].case
            : TRANSLATIONS[Languages.EN].case,
        route: "/admin/case",
      },
      {
        icon: <BsTruck size={20} />,
        label:
          lang === Languages.KH
            ? TRANSLATIONS[Languages.KH].truck
            : TRANSLATIONS[Languages.EN].truck,
        route: "#",
        children: [
          {
            label:
              lang === Languages.KH
                ? TRANSLATIONS[Languages.KH].truck
                : TRANSLATIONS[Languages.EN].truck,
            route: "/admin/truck",
          },
          {
            label:
              lang === Languages.KH
                ? TRANSLATIONS[Languages.KH].fuel
                : TRANSLATIONS[Languages.EN].fuel,
            route: "/admin/fuel",
          },
          {
            label:
              lang === Languages.KH
                ? TRANSLATIONS[Languages.KH].size
                : TRANSLATIONS[Languages.EN].size,
            route: "/admin/size",
          },
          {
            label:
              lang === Languages.KH
                ? TRANSLATIONS[Languages.KH].ownership
                : TRANSLATIONS[Languages.EN].ownership,
            route: "/admin/ownership",
          },
        ],
      },

      {
        icon: <PiBuildingOffice size={20} />,
        label:
          lang === Languages.KH
            ? TRANSLATIONS[Languages.KH].office
            : TRANSLATIONS[Languages.EN].office,
        route: "#",
        children: [
          {
            label:
              lang === Languages.KH
                ? TRANSLATIONS[Languages.KH].office_controll
                : TRANSLATIONS[Languages.EN].office_controll,
            route: "/admin/controll",
          },
          {
            label:
              lang === Languages.KH
                ? TRANSLATIONS[Languages.KH].zone
                : TRANSLATIONS[Languages.EN].zone,
            route: "/admin/zone",
          },
        ],
      },

      {
        icon: <GiSteeringWheel size={20} />,
        label:
          lang === Languages.KH
            ? TRANSLATIONS[Languages.KH].driver
            : TRANSLATIONS[Languages.EN].driver,
        route: "#",
        children: [
          {
            label:
              lang === Languages.KH
                ? TRANSLATIONS[Languages.KH].driver
                : TRANSLATIONS[Languages.EN].driver,
            route: "/admin/driver",
          },
          {
            label:
              lang === Languages.KH
                ? TRANSLATIONS[Languages.KH].assistant
                : TRANSLATIONS[Languages.EN].assistant,
            route: "/admin/assistant",
          },
        ],
      },
      {
        icon: <LiaWarehouseSolid size={20} />,
        label:
          lang === Languages.KH
            ? TRANSLATIONS[Languages.KH].warehouse
            : TRANSLATIONS[Languages.EN].warehouse,
        route: "/admin/warehouse",
      },
    ],
  },
];

const Sidebar = ({ sidebarOpen, setSidebarOpen }: SidebarProps) => {
  const [pageName, setPageName] = useLocalStorage("selectedMenu", "dashboard");

  // lang
  const [language, setLanguage] = useState<Languages>(Languages.EN);

  useEffect(() => {
    const storedLang =
      (localStorage.getItem("lang") as Languages) || Languages.EN;
    setLanguage(storedLang);
  }, []);
  // end lang

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
            <div className="flex dark:hidden">
              <Image
                width={32}
                height={32}
                src={"/images/logo/ofl.png"}
                alt="Logo"
                priority
                className="h-full"
              />
              <div className="ms-3 text-3xl font-bold text-blue-950">D.R.C</div>
            </div>
            <div className="hidden dark:flex">
              <Image
                width={32}
                height={32}
                src={"/images/logo/ofl.png"}
                alt="Logo"
                priority
                className="h-full"
              />
              <div className="ms-3 text-3xl font-bold text-white">D.R.C</div>
            </div>
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
