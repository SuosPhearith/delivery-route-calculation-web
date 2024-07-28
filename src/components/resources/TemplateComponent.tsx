"use client";
import { message, Popconfirm } from "antd";
import React, { useState } from "react";
import { FaRegEdit } from "react-icons/fa";
import { FaRegTrashCan } from "react-icons/fa6";
import {
  LuArrowLeft,
  LuArrowRight,
  LuPlusCircle,
  LuSearch,
  LuUploadCloud,
} from "react-icons/lu";

const data = [
  {
    id: 1,
    size: "1.5T",
    license_plate: "1A - 4119",
    driver: "Suos Phearith",
    status: "active",
  },
  {
    id: 2,
    size: "2T",
    license_plate: "2B - 5687",
    driver: "Sok Vicheka",
    status: "inactive",
  },
  {
    id: 3,
    size: "3.5T",
    license_plate: "3C - 3241",
    driver: "Chan Dara",
    status: "active",
  },
  {
    id: 4,
    size: "4T",
    license_plate: "4D - 1423",
    driver: "Chea Sophorn",
    status: "active",
  },
  {
    id: 5,
    size: "5T",
    license_plate: "5E - 9756",
    driver: "Ly Sovan",
    status: "inactive",
  },
  {
    id: 6,
    size: "1T",
    license_plate: "6F - 6478",
    driver: "Hem Chanthy",
    status: "active",
  },
  {
    id: 7,
    size: "2.5T",
    license_plate: "7G - 7856",
    driver: "Lim Phanith",
    status: "active",
  },
  {
    id: 8,
    size: "3T",
    license_plate: "8H - 8394",
    driver: "Khem Sokha",
    status: "inactive",
  },
  {
    id: 9,
    size: "4.5T",
    license_plate: "9I - 2736",
    driver: "Phan Nary",
    status: "active",
  },
  {
    id: 10,
    size: "5.5T",
    license_plate: "10J - 4568",
    driver: "Vannak Somaly",
    status: "inactive",
  },
];

const TemplateComponent = () => {
  const [status, setStatus] = useState("");
  return (
    <section className="container mx-auto px-1">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-x-3">
            <h2 className="text-lg font-medium text-gray-800 dark:text-white">
              Case
            </h2>
            <span className="rounded-full bg-blue-100 px-3 py-1 text-xs text-blue-600 dark:bg-gray-800 dark:text-blue-400">
              12 Cases
            </span>
          </div>
        </div>
        <div className="flex items-center gap-x-3">
          <button className="flex shrink-0 items-center justify-center gap-x-2 rounded-md bg-primary px-5 py-2 text-sm tracking-wide text-white transition-colors duration-200 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-500">
            <LuPlusCircle size={20} />
            <span>Add case</span>
          </button>
        </div>
      </div>
      <div className="mt-3 md:flex md:items-center md:justify-between">
        <div className="inline-flex divide-x overflow-hidden rounded-sm border bg-white dark:divide-gray-700 dark:border-gray-700 dark:bg-gray-900 rtl:flex-row-reverse">
          <button
            onClick={() => setStatus("")}
            className={`${status === "" ? "text-primary " : "text-black "}rounded-sm px-5 py-2 text-xs font-medium transition-colors duration-200 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 sm:text-sm`}
          >
            View all
          </button>
          <button
            onClick={() => setStatus("ACTIVE")}
            className={`${status === "ACTIVE" ? "text-primary " : "text-black "}rounded-sm px-5 py-2 text-xs font-medium transition-colors duration-200 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 sm:text-sm`}
          >
            Active
          </button>
          <button
            onClick={() => setStatus("PENDING")}
            className={`${status === "PENDING" ? "text-primary " : "text-black "}rounded-sm px-5 py-2 text-xs font-medium transition-colors duration-200 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 sm:text-sm`}
          >
            Pending
          </button>
          <button
            onClick={() => setStatus("INACTIVE")}
            className={`${status === "INACTIVE" ? "text-primary " : "text-black "}rounded-sm px-5 py-2 text-xs font-medium transition-colors duration-200 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 sm:text-sm`}
          >
            Inactive
          </button>
        </div>
        <div className="relative mt-4 flex items-center md:mt-0">
          <span className="absolute ms-4">
            <LuSearch size={20} />
          </span>
          <input
            type="text"
            placeholder="Search"
            className="block w-full rounded-sm border border-gray-200 bg-white py-1.5 pl-11 pr-5 text-black placeholder-gray-400/70 focus:border-primary focus:outline-none focus:ring-blue-300 focus:ring-opacity-40 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:focus:border-blue-300 md:w-80 rtl:pl-5 rtl:pr-11"
          />
        </div>
      </div>
      <div className="mt-3 flex flex-col">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
            <div className="overflow-hidden border border-gray-200 dark:border-gray-700 md:rounded-sm">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th
                      scope="col"
                      className="px-4 py-3 text-left text-sm font-normal text-gray-500 dark:text-gray-400 rtl:text-right"
                    >
                      <button className="flex items-center gap-x-3 focus:outline-none">
                        NO.
                      </button>
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3 text-left text-sm font-normal text-gray-500 dark:text-gray-400 rtl:text-right"
                    >
                      Size
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3 text-left text-sm font-normal text-gray-500 dark:text-gray-400 rtl:text-right"
                    >
                      License Plate
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3 text-left text-sm font-normal text-gray-500 dark:text-gray-400 rtl:text-right"
                    >
                      Driver
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3 text-left text-sm font-normal text-gray-500 dark:text-gray-400 rtl:text-right"
                    >
                      Status
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3 text-left text-sm font-normal text-gray-500 dark:text-gray-400 rtl:text-right"
                    >
                      Action
                    </th>
                  </tr>
                </thead>
                {data.map((item, index) => (
                  <tbody
                    className="divide-y divide-gray-200 bg-white hover:bg-slate-100 dark:divide-gray-700 dark:bg-gray-900"
                    key={item.id}
                  >
                    <tr>
                      <td className="whitespace-nowrap px-4 py-3 text-sm">
                        <h4 className="text-black dark:text-gray-200">
                          {index + 1}
                        </h4>
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-sm">
                        <h4 className="text-black dark:text-gray-200">
                          {item.size}
                        </h4>
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-sm">
                        <h4 className="text-black dark:text-gray-200">
                          {item.license_plate}
                        </h4>
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-sm">
                        <h4 className="text-black dark:text-gray-200">
                          {item.driver}
                        </h4>
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-sm">
                        <h4 className="text-green-400 dark:text-gray-200">
                          {item.status}
                        </h4>
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-sm">
                        <h4 className="flex text-black dark:text-gray-200">
                          <Popconfirm
                            title="Delete"
                            description="Are you sure to delete?"
                            okText="Yes"
                            cancelText="No"
                            onConfirm={() =>
                              message.success("Deleted successfull")
                            }
                          >
                            <FaRegTrashCan
                              size={18}
                              color="red"
                              className="mx-1 cursor-pointer"
                              title="Delete item"
                            />
                          </Popconfirm>
                          <FaRegEdit
                            size={18}
                            color="blue"
                            className="mx-1 cursor-pointer"
                            title="Edit item"
                            // onClick={() => handleEdit(item)}
                          />
                        </h4>
                      </td>
                    </tr>
                  </tbody>
                ))}
              </table>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-6 sm:flex sm:items-center sm:justify-between">
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Page
          <span className="font-medium text-black dark:text-gray-100">
            1 of 10
          </span>
        </div>
        <div className="mt-4 flex items-center gap-x-4 sm:mt-0">
          <a
            href="#"
            className="flex w-1/2 items-center justify-center gap-x-2 rounded-md border bg-white px-5 py-2 text-sm capitalize text-black transition-colors duration-200 hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800 sm:w-auto"
          >
            <LuArrowLeft size={20} />
            <span>Previous</span>
          </a>
          <a
            href="#"
            className="flex w-1/2 items-center justify-center gap-x-2 rounded-md border bg-white px-5 py-2 text-sm capitalize text-black transition-colors duration-200 hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800 sm:w-auto"
          >
            <span>Next</span>
            <LuArrowRight size={20} />
          </a>
          <select
            name="cars"
            className="flex w-1/2 items-center justify-center gap-x-2 rounded-md border bg-white px-5 py-2 text-sm capitalize text-black transition-colors duration-200 hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800 sm:w-auto"
            id="cars"
          >
            <option value="10">10</option>
            <option value="25">25</option>
            <option value="50">50</option>
            <option value="100">100</option>
          </select>
        </div>
      </div>
    </section>
  );
};

export default TemplateComponent;
