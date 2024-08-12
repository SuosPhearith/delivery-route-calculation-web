"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Input, message, Modal, notification, Popconfirm } from "antd";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { FaRegEdit } from "react-icons/fa";
import { FaRegTrashCan, FaRegEye } from "react-icons/fa6";
import {
  LuArrowLeft,
  LuArrowRight,
  LuPlusCircle,
  LuSearch,
  LuUploadCloud,
} from "react-icons/lu";
import Link from "next/link";
import { SubmitHandler, useForm } from "react-hook-form";

import { RiMapPinLine } from "react-icons/ri";
import TableSeleton from "../../components/TableSeleton";
import {
  createDRCDate,
  deleteDRCDate,
  DRCDate,
  getAllDRCDate,
  ResponseAll,
} from "@/api/route";

const RouteComponent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedPage = Number(searchParams.get("page")) || 1;
  const selectedLimit = Number(searchParams.get("limit")) || 28;
  const selectedQuery = searchParams.get("query") || "";
  const [page, setPage] = useState(selectedPage);
  const [limit, setLimit] = useState(selectedLimit);
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState(selectedQuery);
  const queryClient = useQueryClient();
  const [api, contextHolder] = notification.useNotification();

  const openNotification = (
    message: string = "Default",
    description: string = "Successfully",
  ) => {
    api.success({
      message,
      description,
      duration: 3,
      placement: "bottomLeft",
    });
  };

  // create or update
  const [updateId, setUpdateId] = useState<number>();
  const { mutateAsync: createMutaion, isPending: isPendingCreate } =
    useMutation({
      mutationFn: createDRCDate,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["drcDates"] });
        // message.success("Officer controll created successfully");
        openNotification("Create Date", "Date Created successfully");
        handleCancel();
      },
      onError: (error: any) => {
        message.error(error);
      },
    });
  const onSubmit: SubmitHandler<DRCDate> = async (data) => {
    const date: DRCDate = {
      date: data.date,
    };
    await createMutaion(date);
  };
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setValue,
  } = useForm<DRCDate>();
  // end create or update

  //modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setUpdateId(NaN);
    setIsModalOpen(false);
    reset();
  };
  // end modal

  const dateConvert = (dateStr: Date) => {
    const date = new Date(dateStr);

    // Extract month, day, and year
    const month = String(date.getUTCMonth() + 1).padStart(2, "0"); // Months are 0-based, so add 1
    const day = String(date.getUTCDate()).padStart(2, "0");
    const year = date.getUTCFullYear();

    // Format as MM/DD/YYYY
    const formattedDate = `${month}/${day}/${year}`;
    return formattedDate;
  };

  // delete
  const { mutateAsync: deleteMutate, isPending: isPendingDelete } = useMutation(
    {
      mutationFn: deleteDRCDate,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["drcDates"] });
        // message.success("Case deleted successfully");
        openNotification("Delete Date", "Date Deleted successfully");
      },
      onError: (error: any) => {
        message.error(error);
      },
    },
  );
  const handleDelete = async (id: number) => {
    await deleteMutate(id);
  };
  // end delete

  //fectch
  const { data, isLoading, isError } = useQuery<ResponseAll>({
    queryKey: ["drcDates", page, limit, query],
    queryFn: () => getAllDRCDate(page, limit, query),
  });

  useEffect(() => {
    setPage(selectedPage);
    setLimit(selectedLimit);
  }, [selectedPage, selectedLimit]);

  // if (isLoading) {
  //   return <Skeleton />;
  // }
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
  const handleChangeSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setQuery(value);
  };
  // end fectch

  return (
    <section className="container mx-auto px-1">
      {contextHolder}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-x-3">
            <h2 className="text-lg font-medium text-gray-800 dark:text-white">
              Date
            </h2>
            <span className="rounded-full bg-blue-100 px-3 py-1 text-xs text-blue-600 dark:bg-gray-800 dark:text-blue-400">
              {data?.totalCount} Dates
            </span>
          </div>
        </div>
        <div
          title="Create"
          className="flex cursor-pointer justify-center rounded-md bg-primary p-1"
        >
          <LuPlusCircle color="white" size={20} onClick={showModal} />
        </div>
      </div>
      <div className=" md:flex md:items-center md:justify-end">
        <div className="flex flex-col">
          <p className="me-1 text-xs">.</p>
          <input
            className="w-[250px] rounded-md border-[1px] border-slate-300 p-1 max-[770px]:w-full"
            type="date"
            onChange={handleChangeSearch}
            value={search ? search : query}
            placeholder="Search"
          />
        </div>
      </div>
      {isLoading ? (
        <div>
          <TableSeleton />
        </div>
      ) : (
        <div className="lg:grid-cols mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
          {data?.data.map((item, index) => (
            <div
              key={item.id}
              className="cursor-pointer rounded-sm border-[1px] border-slate-400 bg-gray-200 p-4 text-black hover:bg-slate-300 dark:bg-gray-800 dark:hover:bg-gray-700"
            >
              <div className="flex items-center">
                <div className="w-1/2 dark:text-white">
                  {dateConvert(item.date)}
                </div>
                <div className="w-1/4">
                  <h4 className="flex items-center text-black dark:text-gray-200">
                    <div className="me-2">{item._count?.Location}</div>
                    <RiMapPinLine className="mb-1" />
                  </h4>
                </div>
                <div className="w-1/4">
                  <h4 className="float-end flex text-black dark:text-gray-200">
                    <Link href={`route/${item.id}`}>
                      <FaRegEye
                        size={18}
                        className="mx-1 cursor-pointer"
                        title="See detail"
                      />
                    </Link>
                    <Popconfirm
                      title="Delete"
                      description="Are you sure to delete?"
                      okText="Yes"
                      cancelText="No"
                      onConfirm={() => handleDelete(item.id || 0)}
                    >
                      <FaRegTrashCan
                        size={18}
                        // color="red"
                        className="mx-1 cursor-pointer text-red "
                        title="Delete item"
                      />
                    </Popconfirm>
                  </h4>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      <div className="mt-6 sm:flex sm:items-center sm:justify-between">
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Page
          <span className="font-medium text-black dark:text-gray-100">
            {page} of {data?.totalPages}
          </span>
        </div>
        <div className="mt-4 flex items-center gap-x-4 sm:mt-0">
          <Link
            href={`?page=${page > 1 ? page - 1 : 1}&limit=${limit}`}
            className="flex w-1/2 items-center justify-center gap-x-2 rounded-md border bg-white px-5 py-2 text-sm capitalize text-black transition-colors duration-200 hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800 sm:w-auto"
          >
            <LuArrowLeft size={20} />
            <span>Previous</span>
          </Link>
          <Link
            href={`?page=${page < (data?.totalPages || 1) ? page + 1 : page}&limit=${limit}`}
            className="flex w-1/2 items-center justify-center gap-x-2 rounded-md border bg-white px-5 py-2 text-sm capitalize text-black transition-colors duration-200 hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800 sm:w-auto"
          >
            <span>Next</span>
            <LuArrowRight size={20} />
          </Link>
          <select
            name="warehouse"
            value={limit}
            onChange={handlePageSizeChange}
            className="flex w-1/2 items-center justify-center gap-x-2 rounded-md border bg-white px-5 py-2 text-sm capitalize text-black transition-colors duration-200 hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800 sm:w-auto"
            id="warehouse"
          >
            <option value="28">28</option>
            <option value="60">60</option>
            <option value="75">75</option>
            <option value="100">100</option>
          </select>
        </div>
      </div>
      <Modal
        title={updateId ? "Update" : "Create"}
        className="font-satoshi"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        maskClosable={false}
        footer
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mt-2 text-slate-600">
            Date<span className="text-red">*</span>
          </div>
          <input
            {...register("date", { required: true })}
            type="date"
            placeholder="Date"
            className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3  text-dark outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-2 "
          />
          {errors.date && (
            <span className="text-sm text-red-800">
              Please input valid date.
            </span>
          )}
          <div className="flex w-full items-center justify-end">
            <div
              onClick={handleCancel}
              className="me-1 mt-5 cursor-pointer rounded-md bg-blue-400 px-4 py-2 text-white"
            >
              Cancel
            </div>
            <button
              type="submit"
              className="me-1 mt-5 rounded-md bg-primary px-4 py-2 text-white"
              disabled={isPendingCreate}
            >
              {isPendingCreate ? "Submiting..." : "Create"}
            </button>
          </div>
        </form>
      </Modal>
    </section>
  );
};

export default RouteComponent;
