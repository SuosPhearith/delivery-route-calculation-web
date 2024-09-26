"use client";
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Radio, RadioChangeEvent } from "antd";
import ReactApexChart from "react-apexcharts";
import { getChartSix } from "@/api/dashboard";
import { Languages, TRANSLATIONS } from "@/translations";
import { ApexOptions } from "apexcharts";
// import dynamic from "next/dynamic";
// const ReactApexChart = dynamic(() => import("react-apexcharts"), {
//   ssr: false,
// });

const lang = window.localStorage.getItem("lang") || Languages.EN;

const ChartOne: React.FC = () => {
  const [sort, setSort] = useState<"month" | "year">("month");

  const handleChange = ({ target: { value } }: RadioChangeEvent) => {
    setSort(value);
  };

  const { data, isLoading, isError } = useQuery<any>({
    queryKey: ["getChartSix", sort],
    queryFn: () => getChartSix(sort || "month"),
    refetchOnWindowFocus: false,
  });

  if (isLoading) {
    return <div>loading...</div>;
  }

  if (isError) {
    return <div>Something went wrong!</div>;
  }

  // Predefined color palette with fixed colors
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

  // Generate the colors based on the series length
  const colors = generateColors(data.series.length);

  // Define chart options
  const options: ApexOptions = {
    legend: {
      show: false,
      position: "top",
      horizontalAlign: "left",
    },
    colors: colors, // Apply generated colors
    chart: {
      fontFamily: "Satoshi, sans-serif",
      height: 310,
      type: "area",
      toolbar: {
        show: false,
      },
    },
    fill: {
      gradient: {
        opacityFrom: 0.55,
        opacityTo: 0,
      },
    },
    responsive: [
      {
        breakpoint: 1024,
        options: {
          chart: {
            height: 300,
          },
        },
      },
      {
        breakpoint: 1366,
        options: {
          chart: {
            height: 320,
          },
        },
      },
    ],
    stroke: {
      curve: "smooth",
    },
    markers: {
      size: 0,
    },
    grid: {
      strokeDashArray: 5,
      xaxis: {
        lines: {
          show: true,
        },
      },
      yaxis: {
        lines: {
          show: true,
        },
      },
    },
    dataLabels: {
      enabled: true,
    },
    tooltip: {
      fixed: {
        enabled: false,
      },
      x: {
        show: false,
      },
      y: {
        title: {
          formatter: function (seriesName) {
            return seriesName;
          },
        },
      },
      marker: {
        show: true,
      },
    },
    xaxis: {
      type: "category",
      categories: data.categories,
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    yaxis: {
      title: {
        style: {
          fontSize: "0px",
        },
      },
    },
  };

  return (
    <div className="col-span-12 rounded-[10px] bg-white px-7.5 pt-7.5 shadow-1 dark:bg-gray-dark dark:shadow-card">
      <div className="mb-3.5 flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h4 className="text-body-2xlg text-dark dark:text-white">
            {lang === Languages.KH
              ? TRANSLATIONS[Languages.KH].sale_overview
              : TRANSLATIONS[Languages.EN].sale_overview}
          </h4>
        </div>
        <div className="flex items-center gap-2.5">
          <p className="font-medium uppercase text-dark dark:text-dark-6">
            {lang === Languages.KH
              ? TRANSLATIONS[Languages.KH].short_by
              : TRANSLATIONS[Languages.EN].short_by}
            :
          </p>
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
      <div>
        <div className="-ml-4 -mr-5">
          <ReactApexChart
            options={options}
            series={data.series}
            type="area"
            height={310}
          />
        </div>
      </div>
    </div>
  );
};

export default ChartOne;
