// "use client";
import Loader from "@/components/common/Loader";
import apiRole from "@/services/apiRole";
import Roles from "@/utils/Roles.enum";
import { redirect, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const Page = () => {
  // const router = useRouter();
  // useEffect(() => {
  //   const getRole = async () => {
  //     const role = await apiRole();
  //     if (role === Roles.ADMIN) {
  //       router.push("/admin");
  //     }
  //   };
  //   getRole();
  // }, [router]);

  // return <Loader />;
  return redirect("/admin");
};

export default Page;
