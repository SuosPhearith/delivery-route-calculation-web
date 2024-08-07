"use client";
import {
  getEachDirection,
  Route,
  sumOfLatFromAllDirections,
} from "@/api/eachDirection";
import { useQuery } from "@tanstack/react-query";
import React, { useState, useEffect } from "react";
import { FaListUl, FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import Skeleton from "../../components/Skeleton";
import dynamic from "next/dynamic";
import { MdAltRoute } from "react-icons/md";
import Link from "next/link";
import { Drawer } from "antd";
import { FiUsers } from "react-icons/fi";

// Dynamically import Map component with no SSR
const Map = dynamic(() => import("../Map"), {
  ssr: false,
});

interface DirectionProps {
  id: number;
}

const colors = [
  "#FF5733",
  "#33FF57",
  "#3357FF",
  "#FF33A6",
  "#FF8C33",
  "#8C33FF",
  "#33FFF6",
  "#FF3367",
  "#F6FF33",
  "#33FF8C",
];

const EachDirectionComponent: React.FC<DirectionProps> = ({ id }) => {
  const { data, isLoading, isError } = useQuery<Route[]>({
    queryKey: ["eachDirections", id],
    queryFn: () => getEachDirection(id),
  });

  const [visibleGroups, setVisibleGroups] = useState<number[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<Route | null>(null);

  useEffect(() => {
    if (data) {
      setVisibleGroups(data.map((_, index) => index));
    }
  }, [data]);

  const handleEyeClick = (index: number) => {
    setVisibleGroups((prevVisibleGroups) =>
      prevVisibleGroups.includes(index)
        ? prevVisibleGroups.filter((i) => i !== index)
        : [...prevVisibleGroups, index],
    );
  };

  const handleShowAllClick = () => {
    setVisibleGroups(data ? data.map((_, index) => index) : []);
  };

  const handleHideAllClick = () => {
    setVisibleGroups([]);
  };

  const handleDrawerOpen = (group: Route) => {
    setSelectedGroup(group);
    setIsDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setIsDrawerOpen(false);
    setSelectedGroup(null);
  };

  const markerGroups = data?.map((group) =>
    group.directions.map((direction) => ({
      position: [direction.lat, direction.long],
      popupText: direction.name,
    })),
  );

  if (isLoading) {
    return <Skeleton />;
  }

  if (isError) {
    return <div>Something happened</div>;
  }

  if (!data) {
    return <div>No data available</div>;
  }

  const visibleMarkerGroups: any = markerGroups?.filter((_, index) =>
    visibleGroups.includes(index),
  );

  return (
    <section className="container mx-auto px-1">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-x-3">
            <h2 className="text-lg font-medium text-gray-800 dark:text-white">
              Directions
            </h2>
            <span className="rounded-full bg-blue-100 px-3 py-1 text-xs text-blue-600 dark:bg-gray-800 dark:text-blue-400">
              {sumOfLatFromAllDirections(data)} Directions
            </span>
            <span className="rounded-full bg-blue-100 px-3 py-1 text-xs text-blue-600 dark:bg-gray-800 dark:text-blue-400">
              {data.length} Routes
            </span>
          </div>
        </div>
        <div className="flex gap-x-2">
          <div
            title="Show All"
            className="flex cursor-pointer justify-center rounded-md bg-primary p-1"
            onClick={handleShowAllClick}
          >
            <FaRegEye color="white" size={20} />
          </div>
          <div
            title="Hide All"
            className="flex cursor-pointer justify-center rounded-md bg-primary p-1"
            onClick={handleHideAllClick}
          >
            <FaRegEyeSlash color="white" size={20} />
          </div>
        </div>
      </div>
      {/* <div className="mt-2 flex justify-between max-[700px]:flex-col">
        <div className="h-[80vh] w-1/5 overflow-auto p-1 pe-3  max-[700px]:flex max-[700px]:h-[200px] max-[700px]:w-full max-[700px]:overflow-y-auto">
          {data.map((item, index) => (
            <div
              key={item.route}
              className="mx-auto mb-2 max-w-sm overflow-hidden bg-white shadow max-[700px]:w-[300px] sm:rounded-md"
            >
              <div className="">
                <div className="px-2 py-2 sm:px-3">
                  <div className="flex items-center justify-between">
                    <h3 className="flex items-center text-lg font-medium leading-6 text-gray-900">
                      <span className="me-1">
                        <MdAltRoute size={20} />
                      </span>{" "}
                      {item.route}
                    </h3>
                    <FaListUl
                      size={18}
                      className="cursor-pointer text-green-700"
                      onClick={() => handleDrawerOpen(item)}
                    />
                  </div>
                  <div className="mt-2 flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-500">
                      Total direction:
                      <span className="ms-1 text-green-600">
                        {item.directions.length}
                      </span>
                    </p>
                    {visibleGroups.includes(index) ? (
                      <FaRegEye
                        color="blue"
                        size={20}
                        className="cursor-pointer"
                        onClick={() => handleEyeClick(index)}
                      />
                    ) : (
                      <FaRegEyeSlash
                        color="blue"
                        size={20}
                        className="cursor-pointer"
                        onClick={() => handleEyeClick(index)}
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="w-4/5 p-1 max-[700px]:h-[700px] max-[700px]:w-full">
          <Map markerGroups={visibleMarkerGroups || []} colors={colors} />
        </div>
      </div> */}
      <div className="mt-2 flex justify-between max-[700px]:flex-col">
        <div className="h-[80vh] w-1/5  overflow-y-auto p-1 pe-3 max-[700px]:flex max-[700px]:h-[100px] max-[700px]:w-full max-[700px]:overflow-x-auto max-[700px]:overflow-y-hidden">
          {data.map((item, index) => (
            <div
              key={item.route}
              className="mx-auto mb-2 max-w-sm overflow-hidden bg-white shadow max-[700px]:m-1 max-[700px]:w-[300px] max-[700px]:min-w-[200px] sm:rounded-md"
            >
              <div className="">
                <div className="px-2 py-2 sm:px-3">
                  <div className="flex items-center justify-between">
                    <h3 className="flex items-center text-lg font-medium leading-6 text-gray-900">
                      <span className="me-1">
                        <MdAltRoute size={20} />
                      </span>{" "}
                      {item.route}
                    </h3>
                    <FaListUl
                      size={18}
                      className="cursor-pointer text-green-700"
                      onClick={() => handleDrawerOpen(item)}
                    />
                  </div>
                  <div className="mt-2 flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-500">
                      Total direction:
                      <span className="ms-1 text-green-600">
                        {item.directions.length}
                      </span>
                    </p>
                    {visibleGroups.includes(index) ? (
                      <FaRegEye
                        color="blue"
                        size={20}
                        className="cursor-pointer"
                        onClick={() => handleEyeClick(index)}
                      />
                    ) : (
                      <FaRegEyeSlash
                        color="blue"
                        size={20}
                        className="cursor-pointer"
                        onClick={() => handleEyeClick(index)}
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="w-4/5 p-1 max-[700px]:h-[700px] max-[700px]:w-full">
          <Map markerGroups={visibleMarkerGroups || []} colors={colors} />
        </div>
      </div>

      <Drawer
        title="Route Detail"
        onClose={handleDrawerClose}
        open={isDrawerOpen}
      >
        {selectedGroup && (
          <div className="">
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-gray-800">
                Route: {selectedGroup.route}
              </h3>
              <p className="text-gray-600">
                Total Directions: {selectedGroup.directions.length}
              </p>
            </div>
            <div>
              {selectedGroup.directions.map((item) => (
                <div key={item.id} className="mb-4 rounded-lg bg-gray-100 p-2">
                  <p className="text-gray-800">
                    <span className="font-medium">Name:</span> {item.name}
                  </p>
                  <p className="text-gray-800">
                    <span className="font-medium">Status:</span> {item.status}
                  </p>
                  <p className="text-gray-800">
                    <span className="font-medium">Type:</span> {item.type}
                  </p>
                  <p className="text-gray-800">
                    <span className="font-medium">Latitude:</span> {item.lat}
                  </p>
                  <p className="text-gray-800">
                    <span className="font-medium">Longitude:</span> {item.long}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </Drawer>
    </section>
  );
};

export default EachDirectionComponent;
