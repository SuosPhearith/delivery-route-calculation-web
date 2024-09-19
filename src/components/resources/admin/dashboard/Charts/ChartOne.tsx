import { ApexOptions } from "apexcharts";
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Radio, RadioChangeEvent } from "antd";
import { getChartOne } from "@/api/dashboard";
import ReactApexChart from "react-apexcharts";
import { Languages, TRANSLATIONS } from "@/translations";
const lang = window.localStorage.getItem("lang") || Languages.EN;

const ChartOne: React.FC = () => {
  // fetch
  const [sort, setSort] = useState<"month" | "year">("month");
  const handleChange = ({ target: { value } }: RadioChangeEvent) => {
    setSort(value);
  };

  const { data, isLoading, isError } = useQuery<any>({
    queryKey: ["getChartOne", sort],
    queryFn: () => getChartOne(sort || "month"),
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
    colors: ["#5750F1", "#0ABEF9"],
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
          show: false,
        },
      },
      yaxis: {
        lines: {
          show: true,
        },
      },
    },
    dataLabels: {
      enabled: false,
    },
    tooltip: {
      fixed: {
        enabled: !1,
      },
      x: {
        show: !1,
      },
      y: {
        title: {
          formatter: function (e) {
            return "";
          },
        },
      },
      marker: {
        show: !1,
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
  return (
    <div className="col-span-12 rounded-[10px] bg-white px-7.5 pb-6 pt-7.5 shadow-1 dark:bg-gray-dark dark:shadow-card xl:col-span-7">
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

      <div className="flex flex-col gap-2 text-center xsm:flex-row xsm:gap-0">
        <div className="border-stroke dark:border-dark-3 xsm:w-1/2 xsm:border-r">
          <p className="font-medium">
            {lang === Languages.KH
              ? TRANSLATIONS[Languages.KH].highest_amount
              : TRANSLATIONS[Languages.EN].highest_amount}
          </p>
          <h4 className="mt-1 text-xl font-bold text-dark dark:text-white">
            {Math.max(...data.series[0].data)}
          </h4>
        </div>
        <div className="xsm:w-1/2">
          <p className="font-medium">
            {lang === Languages.KH
              ? TRANSLATIONS[Languages.KH].lowest_amount
              : TRANSLATIONS[Languages.EN].lowest_amount}
          </p>
          <h4 className="mt-1 text-xl font-bold text-dark dark:text-white">
            {Math.min(...data.series[0].data)}
          </h4>
        </div>
      </div>
    </div>
  );
};

export default ChartOne;
