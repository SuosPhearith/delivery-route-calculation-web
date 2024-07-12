"use client";
import React from "react";
import {
  LuArrowLeft,
  LuArrowRight,
  LuPlusCircle,
  LuSearch,
  LuUploadCloud,
} from "react-icons/lu";
import AssistantTable from "./AssistantTable";

const data = [
  {
    id: 1,
    name: "alex",
    phone: "555-1234",
    age: 22,
    license: "AB123456",
    status: "pending",
  },
  {
    id: 2,
    name: "beth",
    phone: "555-5678",
    age: 34,
    license: "CD789012",
    status: "pending",
  },
  {
    id: 3,
    name: "carol",
    phone: "555-9101",
    age: 45,
    license: "EF345678",
    status: "inactive",
  },
  {
    id: 4,
    name: "dave",
    phone: "555-1121",
    age: 28,
    license: "GH901234",
    status: "active",
  },
  {
    id: 5,
    name: "eve",
    phone: "555-3141",
    age: 19,
    license: "IJ567890",
    status: "inactive",
  },
  {
    id: 6,
    name: "frank",
    phone: "555-5161",
    age: 33,
    license: "KL123456",
    status: "active",
  },
  {
    id: 7,
    name: "grace",
    phone: "555-7181",
    age: 40,
    license: "MN789012",
    status: "active",
  },
  {
    id: 8,
    name: "henry",
    phone: "555-9202",
    age: 27,
    license: "OP345678",
    status: "active",
  },
  {
    id: 9,
    name: "isla",
    phone: "555-1222",
    age: 30,
    license: "QR901234",
    status: "pending",
  },
  {
    id: 10,
    name: "jack",
    phone: "555-3242",
    age: 25,
    license: "ST567890",
    status: "inactive",
  },
];

const AssistantComponent = () => {
  return (
    <section className="container mx-auto px-1">
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-x-3">
            <h2 className="text-lg font-medium text-gray-800 dark:text-white">
              Assistant
            </h2>
            <span className="rounded-full bg-blue-100 px-3 py-1 text-xs text-blue-600 dark:bg-gray-800 dark:text-blue-400">
              240 Assistants
            </span>
          </div>
        </div>
        <div className=" flex items-center gap-x-3">
          <button className="flex w-1/2 items-center justify-center gap-x-2 rounded-lg border bg-white px-5 py-2 text-sm text-gray-700 transition-colors duration-200 hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800 sm:w-auto">
            <LuUploadCloud size={20} />
            <span>Import</span>
          </button>
          <button className="flex w-1/2 shrink-0 items-center justify-center gap-x-2 rounded-lg bg-primary px-5 py-2 text-sm tracking-wide text-white transition-colors duration-200 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-500 sm:w-auto">
            <LuPlusCircle size={20} />
            <span>Add assistant</span>
          </button>
        </div>
      </div>
      <div className="mt-3 md:flex md:items-center md:justify-between">
        <div className="inline-flex divide-x overflow-hidden rounded-lg border bg-white dark:divide-gray-700 dark:border-gray-700 dark:bg-gray-900 rtl:flex-row-reverse">
          <button className="bg-gray-100 px-5 py-2 text-xs font-medium text-gray-600 transition-colors duration-200 dark:bg-gray-800 dark:text-gray-300 sm:text-sm">
            View all
          </button>
          <button className="px-5 py-2 text-xs font-medium text-gray-600 transition-colors duration-200 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 sm:text-sm">
            Active
          </button>
          <button className="px-5 py-2 text-xs font-medium text-gray-600 transition-colors duration-200 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 sm:text-sm">
            Pending
          </button>
          <button className="px-5 py-2 text-xs font-medium text-gray-600 transition-colors duration-200 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 sm:text-sm">
            Fail
          </button>
        </div>
        <div className="relative mt-4 flex items-center md:mt-0">
          <span className="absolute ms-4">
            <LuSearch size={20} />
          </span>
          <input
            type="text"
            placeholder="Search"
            className="block w-full rounded-lg border border-gray-200 bg-white py-1.5 pl-11 pr-5 text-gray-700 placeholder-gray-400/70 focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:focus:border-blue-300 md:w-80 rtl:pl-5 rtl:pr-11"
          />
        </div>
      </div>
      <div className="mt-3 flex flex-col">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
            <div className="overflow-hidden border border-gray-200 dark:border-gray-700 md:rounded-lg">
              <AssistantTable data={data} />
            </div>
          </div>
        </div>
      </div>
      <div className="mt-6 sm:flex sm:items-center sm:justify-between">
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Page
          <span className="font-medium text-gray-700 dark:text-gray-100">
            1 of 10
          </span>
        </div>
        <div className="mt-4 flex items-center gap-x-4 sm:mt-0">
          <a
            href="#"
            className="flex w-1/2 items-center justify-center gap-x-2 rounded-md border bg-white px-5 py-2 text-sm capitalize text-gray-700 transition-colors duration-200 hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800 sm:w-auto"
          >
            <LuArrowLeft size={20} />
            <span>Previous</span>
          </a>
          <a
            href="#"
            className="flex w-1/2 items-center justify-center gap-x-2 rounded-md border bg-white px-5 py-2 text-sm capitalize text-gray-700 transition-colors duration-200 hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800 sm:w-auto"
          >
            <span>Next</span>
            <LuArrowRight size={20} />
          </a>
          <select
            name="cars"
            className="flex w-1/2 items-center justify-center gap-x-2 rounded-md border bg-white px-5 py-2 text-sm capitalize text-gray-700 transition-colors duration-200 hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800 sm:w-auto"
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

export default AssistantComponent;
