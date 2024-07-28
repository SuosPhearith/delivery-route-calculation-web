"use client";
import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { LuArrowLeft, LuArrowRight, LuSearch } from "react-icons/lu";
import { useRouter, useSearchParams } from "next/navigation";
import Skeleton from "../../components/Skeleton";
import Link from "next/link";
import { getAllAssistant, Status } from "@/queries/assistant";

const AssistantComponent = () => {
  // fetch
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedPage = Number(searchParams.get("page")) || 1;
  const selectedLimit = Number(searchParams.get("limit")) || 10;
  const [page, setPage] = useState(selectedPage);
  const [limit, setLimit] = useState(selectedLimit);
  const [status, setStatus] = useState<Status | "">("");
  const [query, setQuery] = useState("");
  const [search, setSearch] = useState("");
  const { data, isError, isLoading } = useQuery({
    queryKey: ["drivers", page, limit, status, query],
    queryFn: () => getAllAssistant(page, limit, status, query),
  });
  useEffect(() => {
    setPage(selectedPage);
    setLimit(selectedLimit);
  }, [selectedPage, selectedLimit]);
  if (isLoading) {
    return <Skeleton />;
  }
  if (isError) {
    return <div>Something happened</div>;
  }
  const handlePageSizeChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    const newSize = Number(event.target.value);
    setLimit(newSize);
    router.push(`?page=1&limit=${newSize}`);
  };
  const handleSearch = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      setQuery(search);
    }
  };
  const handleChangeSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearch(value);
    if (value.trim() === "") {
      setQuery("");
    }
  };
  return (
    <section className="container mx-auto px-1">
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-x-3">
            <h2 className="text-lg font-medium text-gray-800 dark:text-white">
              Assistant
            </h2>
            <span className="rounded-full bg-blue-100 px-3 py-1 text-xs text-blue-600 dark:bg-gray-800 dark:text-blue-400">
              {data?.totalCount} Assistants
            </span>
          </div>
        </div>
        <div className=" flex items-center gap-x-3"></div>
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
            onChange={handleChangeSearch}
            value={search}
            onKeyDown={handleSearch}
            type="text"
            placeholder="Search"
            className="block w-full rounded-lg border border-gray-200 bg-white py-1.5 pl-11 pr-5 text-gray-700 placeholder-gray-400/70 focus:border-primary focus:outline-none focus:ring-blue-300 focus:ring-opacity-40 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:focus:border-blue-300 md:w-80 rtl:pl-5 rtl:pr-11"
          />
          {/* <button onClick={() => handleSearch()}>Search</button> */}
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
                      Name
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3 text-left text-sm font-normal text-gray-500 dark:text-gray-400 rtl:text-right"
                    >
                      Email
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3 text-left text-sm font-normal text-gray-500 dark:text-gray-400 rtl:text-right"
                    >
                      Status
                    </th>
                  </tr>
                </thead>
                {data?.data.map((item, index) => (
                  <tbody
                    className="divide-y divide-gray-200 bg-white hover:bg-slate-100 dark:divide-gray-700 dark:bg-gray-900"
                    key={item.id}
                  >
                    <tr>
                      <td className="whitespace-nowrap px-4 py-3 text-sm">
                        <h4 className="text-black dark:text-gray-200">
                          {(page - 1) * limit + index + 1}
                        </h4>
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-sm">
                        <h4 className="text-black dark:text-gray-200">
                          {item.name}
                        </h4>
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-sm">
                        <h4 className="text-black dark:text-gray-200">
                          {item.email}
                        </h4>
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-sm">
                        <h4 className="text-black dark:text-gray-200">
                          {item.status}
                        </h4>
                      </td>
                    </tr>
                    {/* Additional rows here */}
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
          <span className="font-medium text-gray-700 dark:text-gray-100">
            {page} of {data?.totalPages}
          </span>
        </div>
        <div className="mt-4 flex items-center gap-x-4 sm:mt-0">
          <Link
            href={`?page=${page > 1 ? page - 1 : 1}&limit=${limit}`}
            className="flex w-1/2 items-center justify-center gap-x-2 rounded-md border bg-white px-5 py-2 text-sm capitalize text-gray-700 transition-colors duration-200 hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800 sm:w-auto"
          >
            <LuArrowLeft size={20} />
            <span>Previous</span>
          </Link>
          <Link
            href={`?page=${page < (data?.totalPages || 1) ? page + 1 : page}&limit=${limit}`}
            className="flex w-1/2 items-center justify-center gap-x-2 rounded-md border bg-white px-5 py-2 text-sm capitalize text-gray-700 transition-colors duration-200 hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800 sm:w-auto"
          >
            <span>Next</span>
            <LuArrowRight size={20} />
          </Link>
          <select
            name="cars"
            value={limit}
            onChange={handlePageSizeChange}
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
