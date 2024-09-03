"use client";
import React, { useState, useEffect } from "react";
import { Button, DatePicker } from "antd";
import { CiExport } from "react-icons/ci";
import { useQuery } from "@tanstack/react-query";
import { getDashboard } from "@/api/dashboard";
import { FaArrowDownLong, FaArrowUpLong } from "react-icons/fa6";
import { BsBox } from "react-icons/bs";
import { PiPercent } from "react-icons/pi";
import { Languages, TRANSLATIONS } from "@/translations";
const lang = window.localStorage.getItem("lang") || Languages.EN;

const DataStatsOne: React.FC = () => {
  const { RangePicker } = DatePicker;

  // State for date range and data stats list
  const [rangeDate, setRangDate] = useState<any[] | null>();
  const [dataStatsList, setDataStatsList] = useState<any[]>([]);

  // Fetch data
  const { data, isLoading, isError } = useQuery<any>({
    queryKey: ["dataStatsOne", rangeDate],
    queryFn: () => getDashboard(rangeDate || null),
  });

  // Update dataStatsList based on the API response
  useEffect(() => {
    if (data) {
      const transformedData = [
        {
          icon: <PiPercent size={20} color="white" />,
          color: "#3FD97F",
          title:
            lang === Languages.KH
              ? TRANSLATIONS[Languages.KH].total_sale
              : TRANSLATIONS[Languages.EN].total_sale,
          value: data.totalAmount.amount,
          growthRate: parseFloat(data.totalAmount.growthRate).toFixed(2),
        },
        ...data.eachCaseInformation.map((item: any) => ({
          icon: <PiPercent size={20} color="white" />,
          color: "#FF9C55", // You can customize color based on the case type or other logic
          title: item.caseSizeName,
          value: item.totalAmount,
          growthRate: parseFloat(item.growthRate).toFixed(2),
        })),
      ];
      setDataStatsList(transformedData);
    }
  }, [data]);

  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (isError) {
    return <div>Something went wrong!</div>;
  }

  // Handle date range change
  const selectDateChange = (date: any[] | null) => {
    setRangDate(date);
  };

  return (
    <>
      <div className="mb-3 flex w-full items-center justify-between">
        <RangePicker
          onChange={(e) => selectDateChange(e || null)}
          className=" input-me dark:bg-gray-dark"
        />
        {/* <Button icon={<CiExport size={20} color="blue" />} type="primary" /> */}
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5">
        {dataStatsList.map((item, index) => (
          <div
            key={index}
            className="rounded-[10px] bg-white p-3 shadow-1 dark:bg-gray-dark"
          >
            <div className="flex items-center justify-between">
              <div className="mb-1.5 flex items-center text-heading-6 font-bold text-dark dark:text-white">
                <span>{item.value}</span>
                <span className="ms-1">
                  <BsBox size={18} />
                </span>
              </div>
              <div
                className="flex h-10.5 w-10.5 items-center justify-center rounded-full "
                style={{ backgroundColor: item.color }}
              >
                {item.icon}
              </div>
            </div>

            <div className="mt-2 flex items-end justify-between">
              <div>
                <span className="text-body-sm font-medium">{item.title}</span>
              </div>

              <span
                className={`flex items-center gap-1.5 text-body-sm font-medium ${
                  item.growthRate > 0 ? "text-green" : "text-red"
                }`}
              >
                {item.growthRate}%
                {item.growthRate > 0 ? <FaArrowUpLong /> : <FaArrowDownLong />}
              </span>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default DataStatsOne;
