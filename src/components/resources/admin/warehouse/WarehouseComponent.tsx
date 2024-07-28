"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createWarehouse,
  deleteWarehouse,
  getAllWarehouse,
  ResponseAll,
  updateWarehouse,
  Warehouse,
} from "@/queries/warehouse";
import { message, Modal, Popconfirm } from "antd";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { FaRegEdit } from "react-icons/fa";
import { FaRegTrashCan, FaRegEye } from "react-icons/fa6";
import {
  LuArrowLeft,
  LuArrowRight,
  LuPlusCircle,
  LuSearch,
  LuUploadCloud,
} from "react-icons/lu";
import Skeleton from "../../components/Skeleton";
import Link from "next/link";
import { SubmitHandler, useForm } from "react-hook-form";

const WarehouseComponent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedPage = Number(searchParams.get("page")) || 1;
  const selectedLimit = Number(searchParams.get("limit")) || 10;
  const [page, setPage] = useState(selectedPage);
  const [limit, setLimit] = useState(selectedLimit);
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState("");
  const queryClient = useQueryClient();

  // create or update
  const [updateId, setUpdateId] = useState<number>();
  const handleEdit = (item: Warehouse) => {
    setValue("name", item.name);
    setValue("lat", item.lat);
    setValue("long", item.long);
    setValue("information", item.information);
    showModal();
    setUpdateId(item.id);
  };
  const { mutateAsync: createMutaion, isPending: isPendingCreate } =
    useMutation({
      mutationFn: createWarehouse,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["warehouses"] });
        message.success("Case created successfully");
        handleCancel();
      },
      onError: (error: any) => {
        message.error(error);
      },
    });
  const { mutateAsync: updateMutate, isPending: isPendingUpdate } = useMutation(
    {
      mutationFn: updateWarehouse,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["warehouses"] });
        message.success("Warehouse updated successfully");
        handleCancel();
      },
      onError: (error: any) => {
        message.error(error);
      },
    },
  );
  const onSubmit: SubmitHandler<Warehouse> = async (data) => {
    if (updateId) {
      const warehouseData: Warehouse = {
        id: updateId,
        name: data.name,
        lat: data.lat,
        long: data.long,
        information: data.information,
      };

      await updateMutate(warehouseData);
    } else {
      const warehouseData: Warehouse = {
        name: data.name,
        lat: data.lat,
        long: data.long,
        information: data.information,
      };

      await createMutaion(warehouseData);
    }
  };
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setValue,
  } = useForm<Warehouse>();
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
    reset();
    setUpdateId(NaN);
    setIsModalOpen(false);
  };
  // end modal

  // delete
  const { mutateAsync: deleteMutate, isPending: isPendingDelete } = useMutation(
    {
      mutationFn: deleteWarehouse,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["warehouses"] });
        message.success("Case deleted successfully");
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
    queryKey: ["warehouses", page, limit, query],
    queryFn: () => getAllWarehouse(page, limit, query),
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
  // end fectch

  return (
    <section className="container mx-auto px-1">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-x-3">
            <h2 className="text-lg font-medium text-gray-800 dark:text-white">
              Warehouse
            </h2>
            <span className="rounded-full bg-blue-100 px-3 py-1 text-xs text-blue-600 dark:bg-gray-800 dark:text-blue-400">
              {data?.totalCount} Warehouses
            </span>
          </div>
        </div>
        <div className="flex items-center gap-x-3">
          <button
            onClick={showModal}
            className="flex shrink-0 items-center justify-center gap-x-2 rounded-md bg-primary px-5 py-2 text-sm tracking-wide text-white transition-colors duration-200 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-500"
          >
            <LuPlusCircle size={20} />
            <span>Add Warehouse</span>
          </button>
        </div>
      </div>
      <div className="mt-3 md:flex md:items-center md:justify-end">
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
                      Name
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3 text-left text-sm font-normal text-gray-500 dark:text-gray-400 rtl:text-right"
                    >
                      Latitude
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3 text-left text-sm font-normal text-gray-500 dark:text-gray-400 rtl:text-right"
                    >
                      longitude
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3 text-left text-sm font-normal text-gray-500 dark:text-gray-400 rtl:text-right"
                    >
                      Information
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3 text-left text-sm font-normal text-gray-500 dark:text-gray-400 rtl:text-right"
                    >
                      Action
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
                          {item.lat}
                        </h4>
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-sm">
                        <h4 className="text-black dark:text-gray-200">
                          {item.long}
                        </h4>
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-sm">
                        <h4 className="... w-[300px] truncate text-black dark:text-gray-200">
                          {item.information}
                        </h4>
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-sm">
                        <h4 className="flex text-black dark:text-gray-200">
                          <FaRegEdit
                            size={18}
                            color="blue"
                            className="mx-1 cursor-pointer"
                            title="Edit item"
                            onClick={() => handleEdit(item)}
                          />
                          <Popconfirm
                            title="Delete"
                            description="Are you sure to delete?"
                            okText="Yes"
                            cancelText="No"
                            onConfirm={() => handleDelete(item.id || 0)}
                          >
                            <FaRegTrashCan
                              size={18}
                              color="red"
                              className="mx-1 cursor-pointer"
                              title="Delete item"
                            />
                          </Popconfirm>
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
            <option value="10">10</option>
            <option value="25">25</option>
            <option value="50">50</option>
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
        closable={false}
        footer
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mt-2 text-slate-600">
            Name<span className="text-red">*</span>
          </div>
          <input
            {...register("name", { required: true, minLength: 3 })}
            type="text"
            placeholder="Name"
            className=" w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3  text-dark outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-2 "
          />
          {errors.name && (
            <span className="text-sm text-red-800">
              Please input valid name.
            </span>
          )}
          <div className="mt-2 text-slate-600">
            Latitude<span className="text-red">*</span>
          </div>
          <input
            {...register("lat", {
              pattern: {
                value: /^([-+]?[0-8]?[0-9](?:\.\d+)?|90(?:\.0+)?)$/,
                message: "Latitude must be between -90 and 90",
              },
              required: "Latitude is required",
            })}
            type="text"
            placeholder="Latitude"
            className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3  text-dark outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-2 "
          />
          {errors.lat && (
            <span className="text-sm text-red-800">
              Please input valid Latitude.
            </span>
          )}
          <div className="mt-2 text-slate-600">
            Longitude<span className="text-red">*</span>
          </div>
          <input
            {...register("long", {
              pattern: {
                value:
                  /^([-+]?(?:1[0-7][0-9]|[0-9]?[0-9])(?:\.\d+)?|180(?:\.0+)?)$/,
                message: "Latitude must be between -90 and 90",
              },
              required: "Latitude is required",
            })}
            type="text"
            placeholder="Longitude"
            className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3  text-dark outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-2 "
          />
          {errors.long && (
            <span className="text-sm text-red-800">
              Please input valid longitude.
            </span>
          )}
          <div className="mt-2 text-slate-600">
            Information<span className="text-red">*</span>
          </div>
          <input
            {...register("information", { required: true })}
            type="text"
            placeholder="Information"
            className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3  text-dark outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-2 "
          />
          {errors.information && (
            <span className="text-sm text-red-800">
              Please input valid information.
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
              {isPendingCreate
                ? "Submiting..."
                : updateId
                  ? "Update"
                  : "Create"}
            </button>
          </div>
        </form>
      </Modal>
    </section>
  );
};

export default WarehouseComponent;
