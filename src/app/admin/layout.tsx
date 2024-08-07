"use client";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import apiRole from "@/services/apiRole";
import { Languages } from "@/translations";
import Roles from "@/utils/Roles.enum";
import React, { ReactNode, useEffect } from "react";

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
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
  }, []);
  return <DefaultLayout>{children}</DefaultLayout>;
};

export default Layout;
