"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Drawer,
  Input,
  message,
  Modal,
  notification,
  Popconfirm,
  Select,
  SelectProps,
} from "antd";
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
import { Controller, SubmitHandler, useForm } from "react-hook-form";
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
  getAllZones,
  ResponseAll,
  Truck,
  updateTruck,
} from "@/api/truck";
import { TbUser, TbUsers } from "react-icons/tb";
import { findAllOfficerControll } from "@/api/zone";
import { GrPowerReset } from "react-icons/gr";
import TableSeleton from "../../components/TableSeleton";
import { FiUsers } from "react-icons/fi";
import { GoDot } from "react-icons/go";

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
  const [truckSizeId, setTruckSizeId] = useState("");
  const [zoneId, setzoneId] = useState("");
  const [fuelId, setfuelId] = useState("");
  const [warehouseId, setwarehouseId] = useState("");
  const [truckOwnershipTypeId, settruckOwnershipTypeId] = useState("");
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
    setValue(
      "TruckDriver",
      item.TruckDriver?.map((item) => item.driver.id),
    );
    setValue(
      "TruckAssistant",
      item.TruckAssistant?.map((item) => item.assistant.id),
    );
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
      TruckDriver: data.TruckDriver,
      TruckAssistant: data.TruckAssistant,
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
    control,
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

  // drawer
  const [driverData, setDriverData] = useState<any[]>([]);
  const [assistantData, setAssistantData] = useState<any[]>([]);
  const [open, setOpen] = useState(false);

  const showDrawer = (TruckDriver: any, TruckAssistant: any) => {
    setDriverData(TruckDriver);
    setAssistantData(TruckAssistant);
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };
  // end drawer

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
    queryKey: [
      "zones",
      page,
      limit,
      status,
      query,
      truckSizeId,
      zoneId,
      fuelId,
      warehouseId,
      truckOwnershipTypeId,
    ],
    queryFn: () =>
      getAllTrucks(
        page,
        limit,
        status,
        query,
        truckSizeId,
        zoneId,
        fuelId,
        warehouseId,
        truckOwnershipTypeId,
      ),
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
  const {
    data: getAllZonesData,
    isLoading: isLoadinggetAllZones,
    isError: isErrorgetAllZones,
  } = useQuery({
    queryKey: ["getAllZones"],
    queryFn: getAllZones,
  });

  useEffect(() => {
    setPage(selectedPage);
    setLimit(selectedLimit);
  }, [selectedPage, selectedLimit]);

  if (
    // isLoading ||
    isLoadinggetAllZones ||
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
    // isError ||
    isErrorgetAllZones ||
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

  const resetFilter = () => {
    setStatus("");
    setTruckSizeId("");
    setzoneId("");
    setfuelId("");
    setwarehouseId("");
    settruckOwnershipTypeId("");
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
            <span className="rounded-full bg-blue-100 px-3 py-1 text-xs text-primary dark:bg-gray-800 dark:text-blue-400">
              {data?.totalCount} Trucks
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
      <div className="md:flex md:flex-wrap md:items-center md:justify-between">
        <div className="flex flex-col ">
          <p className="me-1 text-xs">Status:</p>
          <Select
            showSearch
            className="select-me w-[150px] max-[770px]:w-full"
            defaultValue=""
            value={status}
            optionFilterProp="label"
            onChange={(value) => setStatus(value)}
            options={[
              {
                value: "",
                label: "All",
              },
              {
                value: "AVAILABLE",
                label: "AVAILABLE",
              },
              {
                value: "IN_USE",
                label: "IN_USE",
              },
              {
                value: "MAINTENANCE",
                label: "MAINTENANCE",
              },
            ]}
          />
        </div>
        <div className="flex flex-col ">
          <p className="me-1 text-xs">Size:</p>
          <Select
            showSearch
            className="select-me w-[100px] max-[770px]:w-full"
            // style={{ width: 100 }}
            defaultValue=""
            value={truckSizeId}
            optionFilterProp="label"
            onChange={(value) => setTruckSizeId(value)}
            options={[{ value: "", label: "All" }, ...getAllTruckSizesData]}
          />
        </div>
        <div className="flex flex-col ">
          <p className="me-1 text-xs">Zone:</p>
          <Select
            showSearch
            className="select-me w-[200px] max-[770px]:w-full"
            // style={{ width: 200 }}
            defaultValue=""
            value={zoneId}
            optionFilterProp="label"
            onChange={(value) => setzoneId(value)}
            options={[{ value: "", label: "All" }, ...getAllZonesData]}
          />
        </div>
        <div className="flex flex-col ">
          <p className="me-1 text-xs">Fuel:</p>
          <Select
            showSearch
            className="select-me w-[150px] max-[770px]:w-full"
            // style={{ width: 150 }}
            defaultValue=""
            value={fuelId}
            optionFilterProp="label"
            onChange={(value) => setfuelId(value)}
            options={[{ value: "", label: "All" }, ...getAllTruckFuelsData]}
          />
        </div>
        <div className="flex flex-col ">
          <p className="me-1 text-xs">Warehouse:</p>
          <Select
            showSearch
            className="select-me w-[150px] max-[770px]:w-full"
            // style={{ width: 150 }}
            defaultValue=""
            value={warehouseId}
            optionFilterProp="label"
            onChange={(value) => setwarehouseId(value)}
            options={[{ value: "", label: "All" }, ...getAllWarehousesData]}
          />
        </div>
        <div className="flex flex-col ">
          <p className="me-1 text-xs">Ownership:</p>
          <Select
            showSearch
            className="select-me w-[150px] max-[770px]:w-full"
            // style={{ width: 150 }}
            defaultValue=""
            value={truckOwnershipTypeId}
            optionFilterProp="label"
            onChange={(value) => settruckOwnershipTypeId(value)}
            options={[
              { value: "", label: "All" },
              ...getAllTruckOwnershipTypesData,
            ]}
          />
        </div>
        <div className="flex flex-col ">
          <p className="me-1 text-xs">Reset:</p>
          <div
            title="Reset filter"
            onClick={resetFilter}
            className="flex cursor-pointer justify-center rounded-md bg-primary p-1"
          >
            <GrPowerReset color="white" size={20} />
          </div>
        </div>
        <div className="flex flex-col">
          <p className="me-1 text-xs">.</p>
          <Input
            className="input-me w-[250px] dark:bg-gray-dark max-[770px]:w-full"
            prefix={<LuSearch />}
            onChange={handleChangeSearch}
            value={search ? search : query}
            onKeyDown={handleSearch}
            type="text"
            placeholder="Search"
          />
        </div>
      </div>
      {isLoading ? (
        <div>
          <TableSeleton />
        </div>
      ) : (
        <div className="mt-3 flex flex-col">
          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
              <div className="overflow-hidden border border-gray-200 dark:border-gray-700 md:rounded-md">
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
                        Zone
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
                          <h4
                            onClick={() => setQuery(item.licensePlate)}
                            className="cursor-pointer text-yellow-600 dark:text-gray-200"
                          >
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
                          <Link
                            href={`/admin/zone?query=${item.zone?.code}`}
                            className="text-black dark:text-gray-200"
                          >
                            <span className="text-blue-700 hover:underline">
                              {item.zone?.code}
                            </span>
                          </Link>
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-sm">
                          <Link
                            href={`/admin/warehouse?query=${item.warehouse?.name}`}
                            className="text-black dark:text-gray-200"
                          >
                            <span className="text-green-800 hover:underline">
                              {item.warehouse?.name}
                            </span>
                          </Link>
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
                          <h4
                            className={` dark:text-gray-200 ${item.status === "AVAILABLE" ? "text-primary" : item.status === "IN_USE" ? "text-yellow-700" : item.status === "MAINTENANCE" ? "text-red" : ""}`}
                          >
                            {item.status}
                          </h4>
                        </td>

                        <td className="whitespace-nowrap px-4 py-3 text-sm">
                          <h4 className="flex text-black dark:text-gray-200">
                            <TbUsers
                              onClick={() =>
                                showDrawer(
                                  item.TruckDriver,
                                  item.TruckAssistant,
                                )
                              }
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
        style={{ top: 20 }}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        width={1000}
        maskClosable={false}
        footer
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex w-full justify-between">
            <div className="w-[49%]">
              <div className="mt-2 text-slate-600">
                License Plate<span className="text-red">*</span>
              </div>
              <Controller
                name="licensePlate"
                control={control}
                rules={{ required: "This field is required" }}
                render={({ field }) => (
                  <Input
                    size="large"
                    type="text"
                    {...field}
                    placeholder="License Plate"
                  />
                )}
              />
              {errors.licensePlate && (
                <span className="text-sm text-red-800">
                  Please input valid License Plate.
                </span>
              )}
              <div className="mt-2 text-slate-600">
                Functioning<span className="text-red">*</span>
              </div>
              <Controller
                name="functioning"
                control={control}
                rules={{ required: "This field is required" }}
                render={({ field }) => (
                  <Input
                    size="large"
                    type="text"
                    {...field}
                    placeholder="Functioning"
                  />
                )}
              />
              {errors.functioning && (
                <span className="text-sm text-red-800">
                  Please input valid Functioning.
                </span>
              )}
            </div>
            <div className="w-[49%]">
              <div className="mt-2 text-slate-600">
                Model<span className="text-red">*</span>
              </div>
              <Controller
                name="model"
                control={control}
                rules={{ required: "This field is required" }}
                render={({ field }) => (
                  <Input
                    size="large"
                    type="text"
                    {...field}
                    placeholder="Model"
                  />
                )}
              />
              {errors.model && (
                <span className="text-sm text-red-800">
                  Please input valid Model.
                </span>
              )}
              <div className="mt-2 text-slate-600">
                Manufacturer<span className="text-red">*</span>
              </div>
              <Controller
                name="manufacturer"
                control={control}
                rules={{ required: "This field is required" }}
                render={({ field }) => (
                  <Input
                    size="large"
                    type="text"
                    {...field}
                    placeholder="Manufacturer"
                  />
                )}
              />
              {errors.manufacturer && (
                <span className="text-sm text-red-800">
                  Please input valid Manufacturer.
                </span>
              )}
            </div>
          </div>
          <div className="w-full justify-between"></div>
          <div className="flex w-full justify-between">
            <div className="w-[49%]">
              <div className="mt-2 text-slate-600">
                Zone<span className="text-red">*</span>
              </div>
              <Controller
                name="zoneId"
                control={control}
                rules={{ required: "This field is required" }}
                render={({ field }) => (
                  <Select
                    {...field}
                    size="large"
                    style={{ width: "100%" }}
                    placeholder="Please select"
                    onChange={(value) => field.onChange(value)} // Ensure onChange event is handled
                    options={getAllZonesData}
                    showSearch
                    filterOption={(input, option: any) =>
                      option.label.toLowerCase().includes(input.toLowerCase())
                    }
                  />
                )}
              />
              {errors.zoneId && (
                <span className="text-sm text-red-800">Please select.</span>
              )}
              <div className="mt-2 text-slate-600">
                Warehouse<span className="text-red">*</span>
              </div>
              <Controller
                name="warehouseId"
                control={control}
                rules={{ required: "This field is required" }}
                render={({ field }) => (
                  <Select
                    {...field}
                    size="large"
                    style={{ width: "100%" }}
                    placeholder="Please select"
                    onChange={(value) => field.onChange(value)} // Ensure onChange event is handled
                    options={getAllWarehousesData}
                    showSearch
                    filterOption={(input, option: any) =>
                      option.label.toLowerCase().includes(input.toLowerCase())
                    }
                  />
                )}
              />
              {errors.warehouseId && (
                <span className="text-sm text-red-800">Please select.</span>
              )}
            </div>
            <div className="w-[49%]">
              <div className="mt-2 text-slate-600">
                Fuel<span className="text-red">*</span>
              </div>
              <Controller
                name="fuelId"
                control={control}
                rules={{ required: "This field is required" }}
                render={({ field }) => (
                  <Select
                    {...field}
                    size="large"
                    style={{ width: "100%" }}
                    placeholder="Please select"
                    onChange={(value) => field.onChange(value)} // Ensure onChange event is handled
                    options={getAllTruckFuelsData}
                    showSearch
                    filterOption={(input, option: any) =>
                      option.label.toLowerCase().includes(input.toLowerCase())
                    }
                  />
                )}
              />
              {errors.fuelId && (
                <span className="text-sm text-red-800">Please select.</span>
              )}
              <div className="mt-2 text-slate-600">
                Ownership<span className="text-red">*</span>
              </div>
              <Controller
                name="truckOwnershipTypeId"
                control={control}
                rules={{ required: "This field is required" }}
                render={({ field }) => (
                  <Select
                    {...field}
                    size="large"
                    style={{ width: "100%" }}
                    placeholder="Please select"
                    onChange={(value) => field.onChange(value)} // Ensure onChange event is handled
                    options={getAllTruckOwnershipTypesData}
                    showSearch
                    filterOption={(input, option: any) =>
                      option.label.toLowerCase().includes(input.toLowerCase())
                    }
                  />
                )}
              />
              {errors.truckOwnershipTypeId && (
                <span className="text-sm text-red-800">Please select.</span>
              )}
            </div>
          </div>
          <div className="w-full">
            <div className="mt-2 text-slate-600">
              Size<span className="text-red">*</span>
            </div>
            <Controller
              name="truckSizeId"
              control={control}
              rules={{ required: "This field is required" }}
              render={({ field }) => (
                <Select
                  {...field}
                  size="large"
                  style={{ width: "100%" }}
                  placeholder="Please select"
                  onChange={(value) => field.onChange(value)} // Ensure onChange event is handled
                  options={getAllTruckSizesData}
                  showSearch
                  filterOption={(input, option: any) =>
                    option.label.toLowerCase().includes(input.toLowerCase())
                  }
                />
              )}
            />
            {errors.truckSizeId && (
              <span className="text-sm text-red-800">Please select.</span>
            )}
            <div className="mt-2 text-slate-600">
              Drivers<span className="text-red">*</span>
            </div>
            <Controller
              name="TruckDriver"
              control={control}
              rules={{ required: "This field is required" }}
              render={({ field }) => (
                <Select
                  {...field}
                  size="large"
                  mode="multiple"
                  style={{ width: "100%" }}
                  placeholder="Please select"
                  options={getAllTruckDriversData}
                  showSearch
                  filterOption={(input, option: any) =>
                    option.label.toLowerCase().includes(input.toLowerCase())
                  }
                />
              )}
            />
            {errors.TruckDriver && (
              <span className="text-sm text-red-800">Please select.</span>
            )}
            <div className="mt-2 text-slate-600">
              Assistants<span className="text-red">*</span>
            </div>
            <Controller
              name="TruckAssistant"
              control={control}
              rules={{ required: "This field is required" }}
              render={({ field }) => (
                <Select
                  {...field}
                  size="large"
                  mode="multiple"
                  style={{ width: "100%" }}
                  placeholder="Please select"
                  options={getAllTruckAssistantsData}
                  showSearch
                  filterOption={(input, option: any) =>
                    option.label.toLowerCase().includes(input.toLowerCase())
                  }
                />
              )}
            />
            {errors.TruckAssistant && (
              <span className="text-sm text-red-800">Please select.</span>
            )}
          </div>

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
      <Drawer title="Driver and Assistant" onClose={onClose} open={open}>
        <div className="">
          <div className="flex items-center border-b-[1px] border-slate-600">
            <FiUsers size={20} className="text-slate-600" />
            <div className="ms-2 text-lg text-slate-600">Driver:</div>
          </div>
          {driverData?.map((item, index) => (
            <div
              key={item?.driver.id}
              className="my-2 flex items-center justify-between"
            >
              <div className="flex items-center">
                <div className="text-md ms-2 w-[20px]">{index + 1}.</div>
                <div className="text-md ms-2">{item?.driver.name}</div>
                <div className="text-md ms-2 text-green-700">
                  ({item?.driver.email})
                </div>
              </div>
              <Link href={`/admin/driver?query=${item.driver.email}`}>
                <FaRegEye size={16} color="blue" className="cursor-pointer" />
              </Link>
            </div>
          ))}
        </div>
        <div className="mt-10">
          <div className="flex items-center border-b-[1px] border-slate-600">
            <FiUsers size={20} className="text-slate-600" />
            <div className="ms-2 text-lg text-slate-600">Assistant:</div>
          </div>
          {assistantData?.map((item, index) => (
            <div
              key={item.assistant.id}
              className="my-2 flex items-center justify-between"
            >
              <div className="flex items-center">
                <div className="text-md ms-2 w-[20px]">{index + 1}.</div>
                <div className="text-md ms-2">{item.assistant.name}</div>
                <div className="text-md ms-2 text-green-700">
                  ({item.assistant.email})
                </div>
              </div>
              <Link href={`/admin/assistant?query=${item.assistant.email}`}>
                <FaRegEye size={16} color="blue" className="cursor-pointer" />
              </Link>
            </div>
          ))}
        </div>
      </Drawer>
    </section>
  );
};

export default TruckComponent;
