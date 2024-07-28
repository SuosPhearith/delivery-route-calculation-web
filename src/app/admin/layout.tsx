"use client";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import apiRole from "@/services/apiRole";
import Roles from "@/utils/Roles.enum";
import React, { ReactNode, useEffect } from "react";

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  // useEffect(() => {
  //   const validateRole = async () => {
  //     const roleId = await apiRole();
  //     if (roleId !== Roles.admin) {
  //       window.location.href = "/auth/signin";
  //     }
  //   };
  //   validateRole();
  // }, []);
  return <DefaultLayout>{children}</DefaultLayout>;
};

export default Layout;
