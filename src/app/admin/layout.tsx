// "use client";
// import DefaultLayout from "@/components/Layouts/DefaultLaout";
// import apiRole from "@/services/apiRole";
// import { Languages } from "@/translations";
// import Roles from "@/utils/Roles.enum";
// import { usePathname } from "next/navigation";
// import React, { ReactNode, useEffect } from "react";

// interface LayoutProps {
//   children: ReactNode;
// }

// const Layout: React.FC<LayoutProps> = ({ children }) => {
//   const pathname = usePathname();

//   useEffect(() => {
//     // alert(pathname);
//     const validateRole = async () => {
//       const role = await apiRole();
//       if (role !== Roles.ADMIN) {
//         window.location.href = "/auth/signin";
//       }
//     };
//     const defaultLang = localStorage.getItem("lang");
//     if (!defaultLang) {
//       localStorage.setItem("lang", Languages.EN);
//     }
//     validateRole();
//   }, [pathname]);
//   return <DefaultLayout>{children}</DefaultLayout>;
// };

// export default Layout;
"use client";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import apiRole from "@/services/apiRole";
import { Languages } from "@/translations";
import Roles from "@/utils/Roles.enum";
import { usePathname } from "next/navigation";
import React, { ReactNode, useEffect } from "react";

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const pathname = usePathname();

  useEffect(() => {
    const validateRole = async () => {
      const role = await apiRole();
      if (role !== Roles.ADMIN) {
        window.location.href = "/auth/signin";
      }
    };

    const defaultLang = localStorage.getItem("lang");
    if (!defaultLang) {
      localStorage.setItem("lang", Languages.EN);
    }

    validateRole();
  }, [pathname]);

  // Define routes that don't require a layout
  const noLayoutRoutes = ["/admin/direction/[id]", "/admin/route/[id]"];

  const isNoLayoutRoute = noLayoutRoutes.some((route) => {
    const regex = new RegExp(route.replace("[id]", ".*"));
    return regex.test(pathname);
  });

  if (isNoLayoutRoute) {
    return <>{children}</>;
  }

  return <DefaultLayout>{children}</DefaultLayout>;
};

export default Layout;
