import DashboardComponent from "@/components/resources/admin/dashboard/DashboardComponent";
import React, { Suspense } from "react";

const Page = () => {
  return (
    <main>
      <Suspense fallback={"Pending..."}>
        <DashboardComponent />
      </Suspense>
    </main>
  );
};

export default Page;
