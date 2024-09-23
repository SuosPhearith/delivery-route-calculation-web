"use client";
import React, { Suspense } from "react";
import dynamic from "next/dynamic";
const DataStatsOne = dynamic(() => import("./DataStats/DataStatsOne"), {
  ssr: false,
});
const ChartOne = dynamic(() => import("./Charts/ChartOne"), {
  ssr: false,
});
const ChartTwo = dynamic(() => import("./Charts/ChartTwo"), {
  ssr: false,
});
const ChartThree = dynamic(() => import("./Charts/ChartThree"), {
  ssr: false,
});
const ChartSix = dynamic(() => import("./Charts/ChartSix"), {
  ssr: false,
});

const DashboardComponent: React.FC = () => {
  return (
    <>
      <DataStatsOne />
      {/* <Suspense fallback={<div>Loading</div>}>
      </Suspense> */}
      <div className="mt-7 grid grid-cols-12 gap-4 md:gap-6 2xl:gap-7.5">
        <ChartOne />
        {/* <Suspense fallback={<div>Loading</div>}>
        </Suspense> */}
        <Suspense fallback={<div>Loading</div>}>
          <ChartThree />
        </Suspense>
        <ChartTwo />
        {/* <Suspense fallback={<div>Loading</div>}>
        </Suspense> */}
        <Suspense fallback={<div>Loading</div>}>
          <ChartSix />
        </Suspense>
      </div>
    </>
  );
};

export default DashboardComponent;
