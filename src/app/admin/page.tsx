import dynamic from "next/dynamic";
import React, { Suspense } from "react";

// Dynamically import Map component with no SSR
const DashboardComponent = dynamic(
  () => import("../../components/resources/admin/dashboard/DashboardComponent"),
  {
    ssr: false, // This disables server-side rendering for the component
  },
);

const Page = () => {
  return (
    <main>
      <Suspense fallback={<div>Loading...</div>}>
        <DashboardComponent />
      </Suspense>
    </main>
  );
};

export default Page;
