import EachRouteComponent from "@/components/resources/admin/eachRoute/EachRouteComponent";
import React from "react";

const page = ({ params }: any) => {
  return (
    <main>
      <EachRouteComponent id={params.routeId} />
    </main>
  );
};

export default page;
