import { ApexOptions } from "apexcharts";
import React, { useState } from "react";
import ReactApexChart from "react-apexcharts";
import { useQuery } from "@tanstack/react-query";
import { Radio, RadioChangeEvent } from "antd";
import { getChartSix } from "@/api/dashboard";
import { Languages, TRANSLATIONS } from "@/translations";
const lang = window.localStorage.getItem("lang") || Languages.EN;

const ChartOne: React.FC = () => {
  // fetch
  const [sort, setSort] = useState<"month" | "year">("month");
  const handleChange = ({ target: { value } }: RadioChangeEvent) => {
    setSort(value);
  };

  const { data, isLoading, isError } = useQuery<any>({
    queryKey: ["getChartSix", sort],
    queryFn: () => getChartSix(sort || "month"),
  });

  if (isLoading) {
    return <div>loading...</div>;
  }

  if (isError) {
    return <div>Something went wrong!</div>;
  }
  // End fetch
  const series = data.series;

  const options: ApexOptions = {
    legend: {
      show: false,
      position: "top",
      horizontalAlign: "left",
    },
    colors: data.colors,
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
            return seriesName; // Display the series name in the tooltip
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

  // end fetch
  console.log(data);
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
            series={series}
            type="area"
            height={310}
          />
        </div>
      </div>
    </div>
  );
};

export default ChartOne;
