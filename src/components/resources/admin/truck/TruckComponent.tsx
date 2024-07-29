"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { message, Modal, notification, Popconfirm, Select } from "antd";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { FaRegEdit } from "react-icons/fa";
import { FaRegTrashCan, FaRegEye } from "react-icons/fa6";
import {
  LuArrowLeft,
  LuArrowRight,
  LuPlusCircle,
  LuSearch,
  LuUsers2,
} from "react-icons/lu";
import Skeleton from "../../components/Skeleton";
import Link from "next/link";
import { SubmitHandler, useForm } from "react-hook-form";
import {
  createTruck,
  deleteTruck,
  getAllTruckAssistants,
  getAllTruckDrivers,
  getAllTruckFuels,
  getAllTruckOwnershipTypes,
  getAllTrucks,
  getAllTruckSizes,
  getAllWarehouses,
  ResponseAll,
  Truck,
  updateTruck,
} from "@/api/truck";
import { TbUsers } from "react-icons/tb";
import { findAllOfficerControll } from "@/api/zone";

const TruckComponent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedPage = Number(searchParams.get("page")) || 1;
  const selectedLimit = Number(searchParams.get("limit")) || 10;
  const selectedQuery = searchParams.get("query") || "";
  const [page, setPage] = useState(selectedPage);
  const [limit, setLimit] = useState(selectedLimit);
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState(selectedQuery);
  const [status, setStatus] = useState("");
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
  const handleEdit = (item: Truck) => {
    reset();
    setValue("licensePlate", item.licensePlate);
    setValue("functioning", item.functioning);
    setValue("model", item.model);
    setValue("manufacturer", item.manufacturer);
    setValue("truckSizeId", item.truckSizeId);
    setValue("zoneId", item.zoneId);
    setValue("warehouseId", item.warehouseId);
    setValue("fuelId", item.fuelId);
    // setValue("driver", item.driver);
    // setValue("assistant", item.assistant);
    setValue("truckOwnershipTypeId", item.truckOwnershipTypeId);
    showModal();
    setUpdateId(item.id);
  };
  const { mutateAsync: createMutaion, isPending: isPendingCreate } =
    useMutation({
      mutationFn: createTruck,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["zones"] });
        // message.success("Truck created successfully");
        openNotification("Created Truck", "Truck Createdd successfully");
        handleCancel();
      },
      onError: (error: any) => {
        message.error(error);
      },
    });
  const { mutateAsync: updateMutate, isPending: isPendingUpdate } = useMutation(
    {
      mutationFn: updateTruck,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["zones"] });
        // message.success("Truck updated successfully");
        openNotification("Update Truck", "Truck Updated successfully");
        handleCancel();
      },
      onError: (error: any) => {
        message.error(error);
      },
    },
  );
  const onSubmit: SubmitHandler<Truck> = async (data) => {
    const truckData: Truck = {
      id: updateId,
      licensePlate: data.licensePlate,
      functioning: data.functioning,
      model: data.model,
      manufacturer: data.manufacturer,
      truckSizeId: data.truckSizeId,
      zoneId: data.zoneId,
      warehouseId: data.warehouseId,
      fuelId: data.fuelId,
      // driver:  data.driver,
      // assistant:  data.assistant,
      truckOwnershipTypeId: data.truckOwnershipTypeId,
    };
    if (updateId) {
      await updateMutate(truckData);
    } else {
      await createMutaion(truckData);
    }
  };
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setValue,
  } = useForm<Truck>();
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
      mutationFn: deleteTruck,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["zones"] });
        // message.success("Truck deleted successfully");
        openNotification("Delete Truck", "Truck Deleted successfully");
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
    queryKey: ["zones", page, limit, status, query],
    queryFn: () => getAllTrucks(page, limit, status, query),
  });

  const {
    data: officerControllsData,
    isLoading: isLoadingofficerControlls,
    isError: isErrorfficerControlls,
  } = useQuery<any>({
    queryKey: ["officerControlls"],
    queryFn: findAllOfficerControll,
  });

  const {
    data: getAllTruckSizesData,
    isLoading: isLoadinggetAllTruckSizes,
    isError: isErrorgetAllTruckSizes,
  } = useQuery({
    queryKey: ["getAllTruckSizes"],
    queryFn: getAllTruckSizes,
  });
  const {
    data: getAllTruckOwnershipTypesData,
    isLoading: isLoadingfindAllTruckOwnershipTypes,
    isError: isErrorfindAllTruckOwnershipTypes,
  } = useQuery({
    queryKey: ["findAllTruckOwnershipTypes"],
    queryFn: getAllTruckOwnershipTypes,
  });
  const {
    data: getAllWarehousesData,
    isLoading: isLoadinggetAllWarehouses,
    isError: isErrorgetAllWarehouses,
  } = useQuery({
    queryKey: ["getAllWarehouses"],
    queryFn: getAllWarehouses,
  });
  const {
    data: getAllTruckFuelsData,
    isLoading: isLoadinggetAllTruckFuels,
    isError: isErrorgetAllTruckFuels,
  } = useQuery({
    queryKey: ["getAllTruckFuels"],
    queryFn: getAllTruckFuels,
  });
  const {
    data: getAllTruckDriversData,
    isLoading: isLoadinggetAllTruckDrivers,
    isError: isErrorgetAllTruckDrivers,
  } = useQuery({
    queryKey: ["getAllTruckDrivers"],
    queryFn: getAllTruckDrivers,
  });
  const {
    data: getAllTruckAssistantsData,
    isLoading: isLoadinggetAllTruckAssistants,
    isError: isErrorgetAllTruckAssistants,
  } = useQuery({
    queryKey: ["getAllTruckAssistants"],
    queryFn: getAllTruckAssistants,
  });

  useEffect(() => {
    setPage(selectedPage);
    setLimit(selectedLimit);
  }, [selectedPage, selectedLimit]);

  if (
    isLoading ||
    isLoadingofficerControlls ||
    isLoadingfindAllTruckOwnershipTypes ||
    isLoadinggetAllTruckAssistants ||
    isLoadinggetAllTruckDrivers ||
    isLoadinggetAllTruckFuels ||
    isLoadinggetAllTruckSizes ||
    isLoadinggetAllWarehouses
  ) {
    return <Skeleton />;
  }
  if (
    isError ||
    isErrorfficerControlls ||
    isErrorfindAllTruckOwnershipTypes ||
    isErrorgetAllTruckAssistants ||
    isErrorgetAllTruckDrivers ||
    isErrorgetAllTruckFuels ||
    isErrorgetAllTruckSizes ||
    isErrorgetAllWarehouses
  ) {
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
      router.push("truck");
    }
  };
  const handleChangeSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearch(value);
    if (value.trim() === "") {
      setQuery("");
      router.push("truck");
    }
  };
  // end fectch

  return (
    <section className="container mx-auto px-1">
      {contextHolder}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-x-3">
            <h2 className="text-lg font-medium text-gray-800 dark:text-white">
              Truck
            </h2>
            <span className="rounded-full bg-blue-100 px-3 py-1 text-xs text-blue-600 dark:bg-gray-800 dark:text-blue-400">
              {data?.totalCount} Trucks
            </span>
          </div>
        </div>
        <div className="flex items-center gap-x-3">
          <button
            onClick={showModal}
            className="flex shrink-0 items-center justify-center gap-x-2 rounded-md bg-primary px-5 py-2 text-sm tracking-wide text-white transition-colors duration-200 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-500"
          >
            <LuPlusCircle size={20} />
            <span>Add Truck</span>
          </button>
        </div>
      </div>
      <div className="mt-3 md:flex md:items-center md:justify-between">
        <div className="inline-flex divide-x overflow-hidden rounded-sm border bg-white dark:divide-gray-700 dark:border-gray-700 dark:bg-gray-900 rtl:flex-row-reverse">
          <button
            onClick={() => setStatus("")}
            className={`${status === "" ? "text-primary " : "text-black "}rounded-sm px-5 py-2 text-xs font-medium transition-colors duration-200 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 sm:text-sm`}
          >
            VIEW ALL
          </button>
          <button
            onClick={() => setStatus("AVAILABLE")}
            className={`${status === "AVAILABLE" ? "text-primary " : "text-black "}rounded-sm px-5 py-2 text-xs font-medium transition-colors duration-200 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 sm:text-sm`}
          >
            AVAILABLE
          </button>
          <button
            onClick={() => setStatus("IN_USE")}
            className={`${status === "IN_USE" ? "text-primary " : "text-black "}rounded-sm px-5 py-2 text-xs font-medium transition-colors duration-200 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 sm:text-sm`}
          >
            IN_USE
          </button>
          <button
            onClick={() => setStatus("MAINTENANCE")}
            className={`${status === "MAINTENANCE" ? "text-primary " : "text-black "}rounded-sm px-5 py-2 text-xs font-medium transition-colors duration-200 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 sm:text-sm`}
          >
            MAINTENANCE
          </button>
        </div>
        <div className="relative mt-4 flex items-center md:mt-0">
          <span className="absolute ms-4">
            <LuSearch size={20} />
          </span>
          <input
            onChange={handleChangeSearch}
            value={search ? search : query}
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
                      License Plate
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3 text-left text-sm font-normal text-gray-500 dark:text-gray-400 rtl:text-right"
                    >
                      Model
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3 text-left text-sm font-normal text-gray-500 dark:text-gray-400 rtl:text-right"
                    >
                      Manufacturer
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3 text-left text-sm font-normal text-gray-500 dark:text-gray-400 rtl:text-right"
                    >
                      Functioning
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3 text-left text-sm font-normal text-gray-500 dark:text-gray-400 rtl:text-right"
                    >
                      Truck
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3 text-left text-sm font-normal text-gray-500 dark:text-gray-400 rtl:text-right"
                    >
                      Warehouse
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3 text-left text-sm font-normal text-gray-500 dark:text-gray-400 rtl:text-right"
                    >
                      Ownership
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
                      Fuel
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
                          {item.licensePlate}
                        </h4>
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-sm">
                        <h4 className="text-black dark:text-gray-200">
                          {item.model}
                        </h4>
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-sm">
                        <h4 className="text-black dark:text-gray-200">
                          {item.manufacturer}
                        </h4>
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-sm">
                        <h4 className="text-black dark:text-gray-200">
                          {item.functioning}
                        </h4>
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-sm">
                        <h4 className="text-black dark:text-gray-200">
                          {item.zone?.code}
                        </h4>
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-sm">
                        <h4 className="text-black dark:text-gray-200">
                          {item.warehouse?.name}
                        </h4>
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-sm">
                        <h4 className="text-black dark:text-gray-200">
                          {item.truckOwnershipType?.name}
                        </h4>
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-sm">
                        <h4 className="text-black dark:text-gray-200">
                          {item.truckSize?.name}
                        </h4>
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-sm">
                        <h4 className="text-black dark:text-gray-200">
                          {item.fuel?.name}
                        </h4>
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-sm">
                        <h4 className="text-black dark:text-gray-200">
                          {item.status}
                        </h4>
                      </td>

                      <td className="whitespace-nowrap px-4 py-3 text-sm">
                        <h4 className="flex text-black dark:text-gray-200">
                          <TbUsers
                            size={18}
                            className="mx-1 cursor-pointer"
                            title="view driver and assistant"
                          />
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
            licensePlate<span className="text-red">*</span>
          </div>
          <input
            {...register("licensePlate", { required: true })}
            type="text"
            placeholder="licensePlate"
            className=" w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3  text-dark outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-2 "
          />
          {errors.licensePlate && (
            <span className="text-sm text-red-800">
              Please input valid licensePlate.
            </span>
          )}
          <div className="mt-2 text-slate-600">
            functioning<span className="text-red">*</span>
          </div>
          <input
            {...register("functioning", { required: true })}
            type="text"
            placeholder="functioning"
            className=" w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3  text-dark outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-2 "
          />
          {errors.functioning && (
            <span className="text-sm text-red-800">
              Please input valid functioning.
            </span>
          )}
          <div className="mt-2 text-slate-600">
            model<span className="text-red">*</span>
          </div>
          <input
            {...register("model", { required: true })}
            type="text"
            placeholder="model"
            className=" w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3  text-dark outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-2 "
          />
          {errors.model && (
            <span className="text-sm text-red-800">
              Please input valid model.
            </span>
          )}
          <div className="mt-2 text-slate-600">
            manufacturer<span className="text-red">*</span>
          </div>
          <input
            {...register("manufacturer", { required: true })}
            type="text"
            placeholder="manufacturer"
            className=" w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3  text-dark outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-2 "
          />
          {errors.manufacturer && (
            <span className="text-sm text-red-800">
              Please input valid manufacturer.
            </span>
          )}
          <div className="mt-2 text-slate-600">
            truckSizeId<span className="text-red">*</span>
          </div>
          <select
            {...register("truckSizeId", { required: true })}
            id="truckSizeId"
            name="truckSizeId"
            className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3  text-dark outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-2"
          >
            <option value="" className="hidden">
              Select Officer Controll
            </option>
            {getAllTruckSizesData?.map((item: any) => (
              <option
                key={item?.id}
                value={`${item?.value}`}
              >{`${item?.label}`}</option>
            ))}
          </select>
          {errors.truckSizeId && (
            <span className="text-sm text-red-800">Please select.</span>
          )}
          <div className="mt-2 text-slate-600">
            zoneId<span className="text-red">*</span>
          </div>
          <select
            {...register("zoneId", { required: true })}
            id="zoneId"
            name="zoneId"
            className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3  text-dark outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-2"
          >
            <option value="" className="hidden">
              Select zoneId
            </option>
            {getAllTruckSizesData?.map((item: any) => (
              <option
                key={item?.id}
                value={`${item?.value}`}
              >{`${item?.label}`}</option>
            ))}
          </select>
          {errors.zoneId && (
            <span className="text-sm text-red-800">Please select.</span>
          )}
          <div className="mt-2 text-slate-600">
            warehouseId<span className="text-red">*</span>
          </div>
          <select
            {...register("warehouseId", { required: true })}
            id="warehouseId"
            name="warehouseId"
            className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3  text-dark outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-2"
          >
            <option value="" className="hidden">
              Select warehouseId
            </option>
            {getAllWarehousesData?.map((item: any) => (
              <option
                key={item?.id}
                value={`${item?.value}`}
              >{`${item?.label}`}</option>
            ))}
          </select>
          {errors.warehouseId && (
            <span className="text-sm text-red-800">Please select.</span>
          )}
          <div className="mt-2 text-slate-600">
            fuelId<span className="text-red">*</span>
          </div>
          <select
            {...register("fuelId", { required: true })}
            id="fuelId"
            name="fuelId"
            className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3  text-dark outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-2"
          >
            <option value="" className="hidden">
              Select fuelId
            </option>
            {getAllTruckFuelsData?.map((item: any) => (
              <option
                key={item?.id}
                value={`${item?.value}`}
              >{`${item?.label}`}</option>
            ))}
          </select>
          {errors.fuelId && (
            <span className="text-sm text-red-800">Please select.</span>
          )}
          <div className="mt-2 text-slate-600">
            truckOwnershipTypeId<span className="text-red">*</span>
          </div>
          <select
            {...register("truckOwnershipTypeId", { required: true })}
            id="truckOwnershipTypeId"
            name="truckOwnershipTypeId"
            className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3  text-dark outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-2"
          >
            <option value="" className="hidden">
              Select truckOwnershipTypeId
            </option>
            {getAllTruckOwnershipTypesData?.map((item: any) => (
              <option
                key={item?.id}
                value={`${item?.value}`}
              >{`${item?.label}`}</option>
            ))}
          </select>
          {errors.truckOwnershipTypeId && (
            <span className="text-sm text-red-800">Please select.</span>
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

export default TruckComponent;
