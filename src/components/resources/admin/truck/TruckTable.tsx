import React from "react";

type tableType = {
  data: truckType[];
};

type truckType = {
  id: number;
  size: string;
  license_plate: string;
  driver: string;
  status: string;
};

const TruckTable: React.FC<tableType> = ({ data }) => {
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
                <h4 className="text-gray-700 dark:text-gray-200">
                  {index + 1}
                </h4>
              </td>
              <td className="whitespace-nowrap px-4 py-3 text-sm">
                <h4 className="text-gray-700 dark:text-gray-200">
                  {item.size}
                </h4>
              </td>
              <td className="whitespace-nowrap px-4 py-3 text-sm">
                <h4 className="text-gray-700 dark:text-gray-200">
                  {item.license_plate}
                </h4>
              </td>
              <td className="whitespace-nowrap px-4 py-3 text-sm">
                <h4 className="text-gray-700 dark:text-gray-200">
                  {item.driver}
                </h4>
              </td>
              <td className="whitespace-nowrap px-4 py-3 text-sm">
                <h4 className="text-green-400 dark:text-gray-200">
                  {item.status}
                </h4>
              </td>
              <td className="whitespace-nowrap px-4 py-3 text-sm">
                <h4 className="text-gray-700 dark:text-gray-200">action</h4>
              </td>
            </tr>
          </tbody>
        ))}
      </table>
    </>
  );
};

export default TruckTable;
