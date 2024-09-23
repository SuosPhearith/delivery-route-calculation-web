"use client";
import { ApexOptions } from "apexcharts";
import React, { useState } from "react";
import ReactApexChart from "react-apexcharts";
import { Radio, RadioChangeEvent } from "antd";
import { ChartItem, getChartThree } from "@/api/dashboard";
import { useQuery } from "@tanstack/react-query";
import { Languages, TRANSLATIONS } from "@/translations";
// import dynamic from "next/dynamic";
// const ReactApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });
const lang = window.localStorage.getItem("lang") || Languages.EN;

const ChartThree: React.FC = () => {
  const [sort, setSort] = useState<"month" | "year">("month");

  // Handle sort change between "month" and "year"
  const handleChange = ({ target: { value } }: RadioChangeEvent) => {
    setSort(value);
  };

  // Fetch chart data from the backend
  const { data, isLoading, isError } = useQuery<ChartItem[]>({
    queryKey: ["getChartThree", sort],
    queryFn: () => getChartThree(sort || "month"),
    refetchOnWindowFocus: false,
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Something went wrong!</div>;
  }

  // Predefined color palette with fixed colors (you can modify this palette)
  const colorPalette = [
    "#FF5733",
    "#33FF57",
    "#3357FF",
    "#FF33A1",
    "#FF9633",
    "#33FFF1",
    "#FF3333",
    "#33FFAA",
    "#AA33FF",
    "#FFAA33",
    "#33AAFF",
    "#FF5733",
    "#33FF57",
    "#3357FF",
    "#FF33A1",
    "#FF9633",
    "#33FFF1",
    "#FF3333",
    "#33FFAA",
    "#AA33FF",
    "#FFAA33",
    "#33AAFF",
    "#FF5733",
    "#33FF57",
    "#3357FF",
    "#FF33A1",
    "#FF9633",
    "#33FFF1",
    "#FF3333",
    "#33FFAA",
    "#AA33FF",
    "#FFAA33",
    "#33AAFF",
    "#FF5733",
    "#33FF57",
    "#3357FF",
    "#FF33A1",
    "#FF9633",
    "#33FFF1",
    "#FF3333",
    "#33FFAA",
    "#AA33FF",
    "#FFAA33",
    "#33AAFF",
    "#FF5733",
    "#33FF57",
    "#3357FF",
    "#FF33A1",
    "#FF9633",
    "#33FFF1",
    "#FF3333",
    "#33FFAA",
    "#AA33FF",
    "#FFAA33",
    "#33AAFF",
    "#FF5733",
    "#33FF57",
    "#3357FF",
    "#FF33A1",
    "#FF9633",
    "#33FFF1",
    "#FF3333",
    "#33FFAA",
    "#AA33FF",
    "#FFAA33",
    "#33AAFF",
    "#FF5733",
    "#33FF57",
    "#3357FF",
    "#FF33A1",
    "#FF9633",
    "#33FFF1",
    "#FF3333",
    "#33FFAA",
    "#AA33FF",
    "#FFAA33",
    "#33AAFF",
    "#FF5733",
    "#33FF57",
    "#3357FF",
    "#FF33A1",
    "#FF9633",
    "#33FFF1",
    "#FF3333",
    "#33FFAA",
    "#AA33FF",
    "#FFAA33",
    "#33AAFF",
    "#FF5733",
    "#33FF57",
    "#3357FF",
    "#FF33A1",
    "#FF9633",
    "#33FFF1",
    "#FF3333",
    "#33FFAA",
    "#AA33FF",
    "#FFAA33",
  ];

  // Function to get the necessary number of colors from the fixed palette
  const generateColors = (numColors: number) => {
    return colorPalette.slice(0, numColors);
  };

  // Generate the colors based on the number of data series
  const colors = generateColors(Array.isArray(data) ? data.length : 1);

  // Ensure valid data exists
  const validData = Array.isArray(data) ? data.filter((item) => item) : [];

  // Map the series and labels for the chart
  const series = validData?.map((item) => item.amount || 0);
  const labels = validData?.map((item) => item.name || "");

  // Define ApexCharts options
  const options: ApexOptions = {
    chart: {
      fontFamily: "Satoshi, sans-serif",
      type: "donut",
    },
    colors: colors, // Use the colors from the predefined palette
    labels: labels,
    legend: {
      show: false,
      position: "bottom",
    },
    plotOptions: {
      pie: {
        donut: {
          size: "80%",
          background: "transparent",
          labels: {
            show: true,
            total: {
              show: true,
              showAlways: true,
              label:
                lang === Languages.KH
                  ? TRANSLATIONS[Languages.KH].case
                  : TRANSLATIONS[Languages.EN].case,
              fontSize: "16px",
              fontWeight: "400",
            },
            value: {
              show: true,
              fontSize: "28px",
              fontWeight: "bold",
            },
          },
        },
      },
    },
    dataLabels: {
      enabled: false,
    },
    responsive: [
      {
        breakpoint: 2600,
        options: {
          chart: {
            width: 415,
          },
        },
      },
      {
        breakpoint: 640,
        options: {
          chart: {
            width: 200,
          },
        },
      },
    ],
  };

  return (
    <div className="col-span-12 rounded-[10px] bg-white px-7.5 pb-7 pt-7.5 shadow-1 dark:bg-gray-dark dark:shadow-card xl:col-span-5">
      <div className="mb-9 justify-between gap-4 sm:flex">
        <div>
          <h4 className="text-body-2xlg text-dark dark:text-white">
            {lang === Languages.KH
              ? TRANSLATIONS[Languages.KH].case_overview
              : TRANSLATIONS[Languages.EN].case_overview}
          </h4>
        </div>
        <div>
          <Radio.Group
            value={sort}
            onChange={handleChange}
            defaultValue={"month"}
          >
            <Radio.Button
              value="month"
              className="dark:bg-gray-dark dark:!text-white"
            >
              {lang === Languages.KH
                ? TRANSLATIONS[Languages.KH].month
                : TRANSLATIONS[Languages.EN].month}
            </Radio.Button>
            <Radio.Button
              value="year"
              className="dark:bg-gray-dark dark:!text-white"
            >
              {lang === Languages.KH
                ? TRANSLATIONS[Languages.KH].year
                : TRANSLATIONS[Languages.EN].year}
            </Radio.Button>
          </Radio.Group>
        </div>
      </div>

      <div className="mb-8">
        <div className="mx-auto flex justify-center">
          <ReactApexChart options={options} series={series} type="donut" />
        </div>
      </div>

      <div className="mx-auto w-full max-w-[350px]">
        <div className="-mx-7.5 flex flex-wrap items-center justify-center gap-y-2.5">
          {data?.map((item, index) => (
            <div className="w-full px-7.5 sm:w-1/2" key={item.caseSizeId}>
              <div className="flex w-full items-center">
                <span
                  className="mr-2 block h-3 w-full max-w-3 rounded-full"
                  style={{ backgroundColor: colors[index] }} // Apply frontend colors
                ></span>
                <p className="flex w-full justify-between text-body-sm font-medium text-dark dark:text-dark-6">
                  <span> {item.name} </span>
                  <span> {item.amount} </span>
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChartThree;
