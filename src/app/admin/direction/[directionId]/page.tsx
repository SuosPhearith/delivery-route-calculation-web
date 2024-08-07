"use client";
import EachDirectionComponent from "@/components/resources/admin/direction/EachDirectionComponent";
import React from "react";

const page = ({ params }: any) => {
  return (
    <main>
      <EachDirectionComponent id={params.directionId} />
    </main>
  );
};

export default page;
