"use client";
import { getChartTWo } from "@/api/dashboard";
import { Languages, TRANSLATIONS } from "@/translations";
import { useQuery } from "@tanstack/react-query";
import { ApexOptions } from "apexcharts";
import React, { useState } from "react";
import ReactApexChart from "react-apexcharts";
const lang = window.localStorage.getItem("lang") || Languages.EN;

const ChartTwo: React.FC = () => {
  // fetch
  const { data, isLoading, isError } = useQuery<any>({
    queryKey: ["getChartTwo"],
    queryFn: () => getChartTWo(),
  });

  if (isLoading) {
    return <div>loading...</div>;
  }

  if (isError) {
    return <div>Something went wrong!</div>;
  }
  // End fetch
  const series = [
    {
      name: "Sales",
      data: data.totalAmounts,
    },
  ];

  const options: ApexOptions = {
    colors: ["#5750F1"],
    chart: {
      fontFamily: "Satoshi, sans-serif",
      type: "bar",
      height: 335,
      stacked: true,
      toolbar: {
        show: false,
      },
      zoom: {
        enabled: false,
      },
    },

    responsive: [
      {
        breakpoint: 1536,
        options: {
          plotOptions: {
            bar: {
              borderRadius: 3,
              columnWidth: "25%",
            },
          },
        },
      },
    ],
    plotOptions: {
      bar: {
        horizontal: false,
        borderRadius: 3,
        columnWidth: "25%",
        borderRadiusApplication: "end",
        borderRadiusWhenStacked: "last",
      },
    },
    dataLabels: {
      enabled: false,
    },

    grid: {
      strokeDashArray: 5,
      xaxis: {
        lines: {
          show: false,
        },
      },
      yaxis: {
        lines: {
          show: true,
        },
      },
    },

    xaxis: {
      categories: data.days,
    },
    legend: {
      position: "top",
      horizontalAlign: "left",
      fontFamily: "Satoshi",
      fontWeight: 500,
      fontSize: "14px",

      markers: {
        radius: 99,
        width: 16,
        height: 16,
        strokeWidth: 10,
        strokeColor: "transparent",
      },
    },
    fill: {
      opacity: 1,
    },
  };

  return (
    <div className="col-span-12 rounded-[10px] bg-white px-7.5 pt-7.5 shadow-1 dark:bg-gray-dark dark:shadow-card">
      <div className="mb-4 justify-between gap-4 sm:flex">
        <div>
          <h4 className="text-body-2xlg text-dark dark:text-white">
            {lang === Languages.KH
              ? TRANSLATIONS[Languages.KH].sale_this_month
              : TRANSLATIONS[Languages.EN].sale_this_month}
          </h4>
        </div>
      </div>

      <div>
        <div id="chartTwo" className="-ml-3.5">
          <ReactApexChart
            options={options}
            series={series}
            type="bar"
            height={370}
          />
        </div>
      </div>
    </div>
  );
};

export default ChartTwo;
