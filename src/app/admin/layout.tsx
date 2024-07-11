import DefaultLayout from "@/components/Layouts/DefaultLaout";
import React, { ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return <DefaultLayout>{children}</DefaultLayout>;
};

export default Layout;
