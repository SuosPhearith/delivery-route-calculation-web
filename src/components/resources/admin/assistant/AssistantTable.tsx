import { Image } from "antd";
import React from "react";

type tableType = {
  data: driverType[];
};

type driverType = {
  id: number;
  name: string;
  phone: string;
  age: number;
  license: string;
  status: string;
};

const AssistantTable: React.FC<tableType> = ({ data }) => {
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
              Profile
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
              Phone
            </th>
            <th
              scope="col"
              className="px-4 py-3 text-left text-sm font-normal text-gray-500 dark:text-gray-400 rtl:text-right"
            >
              Age
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
              <td className="whitespace-nowrap px-4 py-1 text-sm">
                <h4 className="text-gray-700 dark:text-gray-200">
                  {index + 1}
                </h4>
              </td>
              <td className="whitespace-nowrap px-4 py-1 text-sm">
                <div className="h-[3rem] w-[3rem] rounded-full bg-slate-300">
                  <Image
                    className="h-full w-full rounded-full object-cover"
                    src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
                    alt="img"
                  />
                </div>
              </td>
              <td className="whitespace-nowrap px-4 py-1 text-sm">
                <h4 className="text-gray-700 dark:text-gray-200">
                  {item.name}
                </h4>
              </td>
              <td className="whitespace-nowrap px-4 py-1 text-sm">
                <h4 className="text-gray-700 dark:text-gray-200">
                  {item.phone}
                </h4>
              </td>
              <td className="whitespace-nowrap px-4 py-1 text-sm">
                <h4 className="text-gray-700 dark:text-gray-200">{item.age}</h4>
              </td>
              <td className="whitespace-nowrap px-4 py-1 text-sm">
                <h4 className="text-gray-700 dark:text-gray-200">
                  {item.status}
                </h4>
              </td>
              <td className="whitespace-nowrap px-4 py-1 text-sm">
                <h4 className="text-gray-700 dark:text-gray-200">action</h4>
              </td>
            </tr>
            {/* Additional rows here */}
          </tbody>
        ))}
      </table>
    </>
  );
};

export default AssistantTable;
