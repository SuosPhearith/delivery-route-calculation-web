import { useRouter } from "next/router";
import React from "react";

interface AssignPageProps {
  params: {
    driverId: number;
  };
}
const page: React.FC<AssignPageProps> = ({ params }) => {
  return <p>Post: {params.driverId}</p>;
};

export default page;
