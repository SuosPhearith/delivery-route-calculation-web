import { ResponseAll } from "@/queries/driver";
import React from "react";

const DriverTable: React.FC<ResponseAll> = ({ data }) => {
  return (
    <>
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
        {data.map((item, index) => (
          <tbody
            className="divide-y divide-gray-200 bg-white hover:bg-slate-100 dark:divide-gray-700 dark:bg-gray-900"
            key={item.id}
          >
            <tr>
              <td className="whitespace-nowrap px-4 py-3 text-sm">
                <h4 className="text-black dark:text-gray-200">{index + 1}</h4>
              </td>
              <td className="whitespace-nowrap px-4 py-3 text-sm">
                <h4 className="text-black dark:text-gray-200">{item.name}</h4>
              </td>
              <td className="whitespace-nowrap px-4 py-3 text-sm">
                <h4 className="text-black dark:text-gray-200">{item.email}</h4>
              </td>
              <td className="whitespace-nowrap px-4 py-3 text-sm">
                <h4 className="text-black dark:text-gray-200">{item.status}</h4>
              </td>
            </tr>
            {/* Additional rows here */}
          </tbody>
        ))}
      </table>
    </>
  );
};

export default DriverTable;
