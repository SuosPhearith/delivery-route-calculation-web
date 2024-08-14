"use client";
import {
  assignTruck,
  CreateDrc,
  createDrc,
  deleteLocation,
  getAllLocations,
  getAllTrucksByDate,
  getAllZonesRoute,
  Location,
  Truck,
  TruckByDate,
  unassignTruck,
  updateLocationPartOfDay,
} from "@/api/eachRoute";
import {
  getAllTruckAssistants,
  getAllTruckDrivers,
  getAllTruckFuels,
  getAllTruckOwnershipTypes,
  getAllTruckSizes,
  getAllWarehouses,
  getAllZones,
} from "@/api/truck";
import Header from "@/components/Header";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Card,
  Drawer,
  Input,
  InputNumber,
  message,
  Modal,
  notification,
  Popconfirm,
  Select,
  Space,
} from "antd";
import Link from "next/link";
import React, { useEffect, useMemo, useState } from "react";
import {
  FaCheckSquare,
  FaListUl,
  FaLongArrowAltRight,
  FaRegEye,
  FaRegTrashAlt,
} from "react-icons/fa";
import { IoChevronBackCircle } from "react-icons/io5";
import { MdAltRoute, MdCheckBox, MdCheckBoxOutlineBlank } from "react-icons/md";
import Skeleton from "../../components/Skeleton";
import { LuSearch } from "react-icons/lu";
import dynamic from "next/dynamic";
import { GrPowerReset } from "react-icons/gr";
import { GoLink, GoUnlink } from "react-icons/go";
import { GiCancel } from "react-icons/gi";
import { SubmitHandler, useForm } from "react-hook-form";
import { IoMdAddCircleOutline, IoMdCloseCircleOutline } from "react-icons/io";
import { CgClose } from "react-icons/cg";
import { CiEdit } from "react-icons/ci";
// Dynamically import Map component with no SSR
const MapRoute = dynamic(() => import("../MapRoute"), {
  ssr: false,
});
interface DirectionProps {
  id: number;
}

const EachRouteComponent: React.FC<DirectionProps> = ({ id }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // fetch
  // Define state for each parameter
  const [deliveryRouteCalculationDateId, setDeliveryRouteCalculationDateId] =
    useState<number>(id); // Replace with actual ID
  const [status, setStatus] = useState<string>("");
  const [query, setQuery] = useState<string>("");
  const [truckSizeId, setTruckSizeId] = useState<string>("");
  const [zoneId, setZoneId] = useState<string>("");
  const [fuelId, setFuelId] = useState<string>("");
  const [warehouseId, setWarehouseId] = useState<string>("");
  const [truckOwnershipTypeId, setTruckOwnershipTypeId] = useState<string>("");
  const [link, setLink] = useState(false);
  const queryClient = useQueryClient();
  const [api, contextHolder] = notification.useNotification();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [lastPartOfDay, setLastPartOfDay] = useState("");

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

  // locations

  const [locationDateId, setLocationDateId] = useState<number>(id); // Unique name for deliveryRouteCalculationDateId
  const [locationZoneId, setLocationZoneId] = useState<string>(""); // Unique name for zoneId
  const [locationTruckSizeId, setLocationTruckSizeId] = useState<string>(""); // Unique name for truckSizeId
  const [locationPartOfDay, setLocationPartOfDay] = useState<string>(""); // Unique name for partOfDay
  const [locationPriority, setLocationPriority] = useState<string>(""); // Unique name for priority
  const [locationCapacity, setLocationCapacity] = useState<number | undefined>(
    undefined,
  ); // Unique name for capacity
  const [locationQuery, setLocationQuery] = useState<string>(""); // Unique name for query
  const [locationIsAssign, setLocationIsAssign] = useState<string>("false");
  const [locationTruckByDateId, setLocationTruckByDateId] =
    useState<string>("");

  // drawer

  const [openLocationDrawer, setOpenLocationDrawer] = useState(false);
  const [openTruckDrawer, setOpenTruckDrawer] = useState(false);
  const [locationItem, setLocationItem] = useState<Location | null>();
  const [truckItem, setTruckItem] = useState<Truck | null>();

  // rightClick
  const [showButton, setShowButton] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [rightClickTruckByDateId, setRightClickTruckByDateId] = useState("");

  const handleRightClick = (event: any, id: string, item: any) => {
    event.preventDefault();
    setPosition({ x: event.clientX, y: event.clientY });
    setTruckItem(item);
    setRightClickTruckByDateId(id);
    setShowButton(true);
  };

  const handleClick = () => {
    setLocationIsAssign("false");
    setShowButton(false); // Hide the button when it's clicked
    setRightClickTruckByDateId("");
    setLocationTruckByDateId("");
  };

  // delete location
  const {
    mutateAsync: deleteLocationMutaion,
    isPending: isPendingDeleteLocation,
  } = useMutation({
    mutationFn: deleteLocation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allLocations"] });
      queryClient.invalidateQueries({ queryKey: ["allTrucksByDate"] });
      // message.success("Direction created successfully");
      openNotification("Create Drc", "Drc Created successfully");
    },
    onError: (error: any) => {
      message.error(error);
    },
  });
  const handleDeleteLocation = async (
    latitude: number,
    longitude: number,
    deliveryRouteCalculationDateId: number,
  ) => {
    await deleteLocationMutaion({
      latitude,
      longitude,
      deliveryRouteCalculationDateId,
    });
  };
  // end delete location

  // edit part of day
  const [partOfDayModal, setPartOfDayModal] = useState(false);
  const [currentPartOfDay, setCurrentPartOfDay] = useState("");
  const [partOfDayUpdatedId, setPartOfDayUpdatedId] = useState<number>();
  const handleUpdatePartOfDay = (partOfDay: string, id: number) => {
    setPartOfDayUpdatedId(id);
    setCurrentPartOfDay(partOfDay);
    setPartOfDayModal(true);
  };
  const handleCancelPartOfDayModal = () => {
    setPartOfDayUpdatedId(undefined);
    setCurrentPartOfDay("");
    setPartOfDayModal(false);
  };
  const { mutateAsync: updatePartOfDayMutate } = useMutation({
    mutationFn: updateLocationPartOfDay,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allLocations"] });
      queryClient.invalidateQueries({ queryKey: ["allTrucksByDate"] });
      // message.success("Direction created successfully");
      openNotification("Update Drc", "Drc Updated successfully");
      handleCancelPartOfDayModal();
    },
    onError: (error: any) => {
      message.error(error);
    },
  });
  const updatePartOfDay = async () => {
    // console.log(partOfDayUpdatedId + " --" + currentPartOfDay);
    await updatePartOfDayMutate({
      id: partOfDayUpdatedId || 0,
      partOfDay: currentPartOfDay,
    });
  };
  // end edit part of day

  // create
  const { mutateAsync: createMutaion, isPending: isPendingCreate } =
    useMutation({
      mutationFn: createDrc,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["allLocations"] });
        // message.success("Direction created successfully");
        openNotification("Create Drc", "Drc Created successfully");
        handleCancel();
      },
      onError: (error: any) => {
        message.error(error);
      },
    });
  const onSubmit: SubmitHandler<CreateDrc> = async (data) => {
    await createMutaion({
      file: data.file,
      DeliveryRouteCalculationDateId: id,
    });
  };
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setValue,
  } = useForm<CreateDrc>();
  // end create

  //modal
  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    reset();
    setIsModalOpen(false);
  };
  // end modal

  // assign state
  const [assign, setAssign] = useState<{ id: number; capacity: number }[]>([]);

  // assign function
  const handleAssign = (id: number, capacity: number) => {
    setAssign((prevAssign) => {
      if (prevAssign.some((item) => item.id === id)) {
        return prevAssign.filter((item) => item.id !== id);
      } else {
        return [...prevAssign, { id, capacity }];
      }
    });
  };
  // assign to truck
  const [isModalVisible, setIsModalVisible] = useState(false);
  const assignLocationsToTruck = async (truckByDateId: number) => {
    if (assign.length <= 0) {
      return message.error("Please select locations");
    }
    // Extracting the array of ids from the assign array
    const deliveryRouteCalculationDateIds = assign.map((item) => item.id);

    // setIsModalVisible(true);
    // check confirm before go throw in 2 condition : out of truck capacity, and assign not same truck size
    // rith

    await mutateAsync({
      truckByDateId,
      deliveryRouteCalculationDateIds, // passing the array of ids here
      DeliveryRouteCalculationDateId: id,
    });
  };
  // unassign
  const unassignLocationsToTruck = async () => {
    if (locationIsAssign === "false") {
      return message.error("Please switch to Assigned Locations");
    }
    if (assign.length <= 0) {
      return message.error("Please select Locations");
    }
    // Extracting the array of ids from the assign array
    const locationIds = assign.map((item) => item.id);

    await unassignMutateAsync({
      locationIds, // passing the array of ids here
      DeliveryRouteCalculationDateId: id,
    });
  };
  const { mutateAsync, isPending } = useMutation({
    mutationFn: assignTruck,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allLocations"] });
      queryClient.invalidateQueries({ queryKey: ["allTrucksByDate"] });
      // message.success("Ownership created successfully");
      openNotification("Assigned", "Locations Unassigned successfully");
      setAssign([]);
    },
    onError: (error: any) => {
      message.error(error);
    },
  });
  const { mutateAsync: unassignMutateAsync, isPending: unassignIsPending } =
    useMutation({
      mutationFn: unassignTruck,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["allLocations"] });
        queryClient.invalidateQueries({ queryKey: ["allTrucksByDate"] });
        // message.success("Ownership created successfully");
        openNotification("Unassigned", "Locations Assigned successfully");
        setAssign([]);
      },
      onError: (error: any) => {
        message.error(error);
      },
    });

  // Calculate the sum of capacities
  const totalCapacity = useMemo(() => {
    return assign.reduce((acc, item) => acc + item.capacity, 0);
  }, [assign]);

  // drawer functions
  const handleOpenLocationDrawer = (item: Location) => {
    setLocationItem(item);
    setOpenLocationDrawer(true);
  };
  const handleCloseLocationDrawer = () => {
    setLocationItem(null);
    setOpenLocationDrawer(false);
  };

  const handleOpenTruckDrawer = () => {
    setOpenTruckDrawer(true);
  };
  const handleCloseTruckDrawer = () => {
    setTruckItem(null);
    setOpenTruckDrawer(false);
    setShowButton(false); // Hide the button when it's clicked
    setRightClickTruckByDateId("");
    setLocationTruckByDateId("");
    setLocationIsAssign("false");
  };

  const viewLocationMap = (location: string) => {
    setOpenLocationDrawer(false);
    setLocationQuery(location);
  };

  // Fetch data using useQuery
  const { data, isLoading, isError } = useQuery<TruckByDate[]>({
    queryKey: [
      "allTrucksByDate",
      deliveryRouteCalculationDateId,
      status,
      query,
      truckSizeId,
      zoneId,
      fuelId,
      warehouseId,
      truckOwnershipTypeId,
    ],
    queryFn: () =>
      getAllTrucksByDate(
        deliveryRouteCalculationDateId,
        status,
        query,
        truckSizeId,
        zoneId,
        fuelId,
        warehouseId,
        truckOwnershipTypeId,
      ),
  });

  // location

  // Fetch data using useQuery
  const {
    data: dataLocations,
    isLoading: isLoadingLocations,
    isError: isErrorLocations,
  } = useQuery<Location[]>({
    queryKey: [
      "allLocations",
      locationDateId,
      locationZoneId,
      locationTruckSizeId,
      locationPartOfDay,
      locationPriority,
      locationCapacity,
      locationQuery,
      locationIsAssign,
      locationTruckByDateId,
    ],
    queryFn: () =>
      getAllLocations(
        locationDateId,
        locationZoneId,
        locationTruckSizeId,
        locationPartOfDay,
        locationPriority,
        locationCapacity,
        locationQuery,
        locationIsAssign,
        locationTruckByDateId,
      ),
  });

  // end location

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

  const {
    data: getAllZonesRouteData,
    isLoading: isLoadinggetAllZonesRoute,
    isError: isErrorgetAllZonesRoute,
  } = useQuery({
    queryKey: ["getAllZonesRoute", id],
    queryFn: () => getAllZonesRoute(id),
  });

  // Handle loading and error states
  if (
    // isLoading ||
    isLoadinggetAllZones ||
    isLoadingfindAllTruckOwnershipTypes ||
    isLoadinggetAllTruckAssistants ||
    isLoadinggetAllTruckDrivers ||
    isLoadinggetAllTruckFuels ||
    isLoadinggetAllTruckSizes ||
    isLoadinggetAllWarehouses ||
    isLoadinggetAllZonesRoute
  ) {
    return <Skeleton />;
  }
  if (
    // isError ||
    isErrorgetAllZones ||
    isErrorfindAllTruckOwnershipTypes ||
    isErrorgetAllTruckAssistants ||
    isErrorgetAllTruckDrivers ||
    isErrorgetAllTruckFuels ||
    isErrorgetAllTruckSizes ||
    isErrorgetAllWarehouses
  ) {
    return <div>Something happened</div>;
  }

  // end fetch

  const resetLocationsFilter = () => {
    setLocationPartOfDay("");
    setLocationCapacity(undefined);
    setLocationZoneId("");
    setLocationPriority("");
    setLocationQuery("");
    setLocationTruckSizeId("");
  };
  const resetTrucksFilter = () => {
    setStatus("");
    setTruckSizeId("");
    setZoneId("");
    setWarehouseId("");
    setTruckOwnershipTypeId("");
    setQuery("");
  };

  const handleLink = () => {
    setLink(!link);
    setTruckSizeId(locationTruckSizeId);
    setZoneId(locationZoneId);
  };

  const changeLocationZone = (value: any) => {
    setLocationZoneId(value);
    if (link) {
      setZoneId(value);
    }
  };
  const changeLocationSize = (value: any) => {
    setLocationTruckSizeId(value);
    if (link) {
      setTruckSizeId(value);
    }
  };

  const switchAssign = (value: any) => {
    setAssign([]);
    setLocationIsAssign(value);
  };

  const countByPartOfDay = (dataLocations: any[], partOfDay: any) =>
    dataLocations.filter((item) => item.partOfDay === partOfDay).length;

  return (
    <section className="">
      {contextHolder}
      <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="px-3 py-2">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-x-3">
              <Link href={"/admin/route"}>
                <IoChevronBackCircle
                  color="blue"
                  className="cursor-pointer"
                  size={30}
                />
              </Link>
              <div className="flex flex-col ">
                <Select
                  showSearch
                  className="w-[135px] max-[770px]:w-full"
                  defaultValue=""
                  value={status}
                  optionFilterProp="label"
                  onChange={(value) => setStatus(value)}
                  options={[
                    {
                      value: "",
                      label: "All Status",
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
                <Select
                  // size="small"
                  showSearch
                  className="w-[100px] max-[770px]:w-full"
                  defaultValue=""
                  value={truckSizeId}
                  optionFilterProp="label"
                  onChange={(value) => setTruckSizeId(value)}
                  options={[
                    { value: "", label: "All Size" },
                    ...getAllTruckSizesData,
                  ]}
                />
              </div>
              <div className="flex flex-col ">
                <Select
                  // size="small"
                  showSearch
                  className="w-[150px] max-[770px]:w-full"
                  // style={{ width: 200 }}
                  defaultValue=""
                  value={zoneId}
                  optionFilterProp="label"
                  onChange={(value) => setZoneId(value)}
                  options={[
                    { value: "", label: "All Zone" },
                    ...getAllZonesData,
                  ]}
                />
              </div>
              <div className="flex flex-col ">
                <Select
                  // size="small"
                  showSearch
                  className="w-[150px] max-[770px]:w-full"
                  // style={{ width: 150 }}
                  defaultValue=""
                  value={warehouseId}
                  optionFilterProp="label"
                  onChange={(value) => setWarehouseId(value)}
                  options={[
                    { value: "", label: "All Warehouse" },
                    ...getAllWarehousesData,
                  ]}
                />
              </div>
              <div className="flex flex-col">
                <Select
                  // size="small"
                  showSearch
                  className="w-[150px] max-[770px]:w-full"
                  // style={{ width: 150 }}
                  defaultValue=""
                  value={truckOwnershipTypeId}
                  optionFilterProp="label"
                  onChange={(value) => setTruckOwnershipTypeId(value)}
                  options={[
                    { value: "", label: "All Ownership" },
                    ...getAllTruckOwnershipTypesData,
                  ]}
                />
              </div>
              <div className="flex flex-col">
                <Input
                  allowClear
                  className="w-[160px] max-[770px]:w-full"
                  prefix={<LuSearch />}
                  onChange={(e) => setQuery(e.target.value)}
                  value={query}
                  placeholder="Search by plate"
                />
              </div>
              <div className="flex flex-col ">
                <Popconfirm
                  placement="rightTop"
                  title="Remove Truck Filter"
                  description="Are you sure?"
                  onConfirm={resetTrucksFilter}
                  okText="Yes"
                  cancelText="No"
                >
                  <div
                    title="Reset truck filter"
                    className="flex cursor-pointer justify-center rounded-md bg-primary p-1"
                  >
                    <GrPowerReset color="white" size={20} />
                  </div>
                </Popconfirm>
              </div>
              <div className="flex flex-col ">
                <div
                  onClick={showModal}
                  title="Reset truck filter"
                  className="flex cursor-pointer justify-center rounded-md bg-primary p-1"
                >
                  <IoMdAddCircleOutline color="white" size={20} />
                </div>
              </div>
            </div>
          </div>
          <div className="flex gap-x-2"></div>
        </div>
        {/* locations */}
        <div className="flex w-full items-center justify-between">
          <div className="flex w-full">
            <div className="flex w-full flex-wrap items-center justify-between gap-x-3">
              <div className="ms-[10px] flex flex-col">
                {link ? (
                  <GoUnlink
                    className="cursor-pointer text-primary"
                    onClick={handleLink}
                    size={20}
                  />
                ) : (
                  <GoLink
                    className="cursor-pointer text-primary"
                    onClick={handleLink}
                    size={20}
                  />
                )}
              </div>
              <div className="flex flex-col ">
                <Select
                  showSearch
                  className="w-[135px] max-[770px]:w-full"
                  defaultValue=""
                  value={locationPartOfDay}
                  optionFilterProp="label"
                  onChange={(value) => setLocationPartOfDay(value)}
                  options={[
                    {
                      value: "",
                      label: "All Time",
                    },
                    {
                      value: "MORNING",
                      label: "MORNING",
                    },
                    {
                      value: "AFTERNOON",
                      label: "AFTERNOON",
                    },
                    {
                      value: "EVENING",
                      label: "EVENING",
                    },
                    {
                      value: "NIGHT",
                      label: "NIGHT",
                    },
                  ]}
                />
              </div>
              <div className="flex flex-col ">
                <Select
                  // size="small"
                  showSearch
                  className="w-[100px] max-[770px]:w-full"
                  defaultValue=""
                  value={locationTruckSizeId}
                  optionFilterProp="label"
                  onChange={(value) => changeLocationSize(value)}
                  options={[
                    { value: "", label: "All Size" },
                    ...getAllTruckSizesData,
                  ]}
                />
              </div>
              <div className="flex flex-col ">
                <Select
                  // size="small"
                  showSearch
                  className="w-[150px] max-[770px]:w-full"
                  // style={{ width: 200 }}
                  defaultValue=""
                  value={locationZoneId}
                  optionFilterProp="label"
                  onChange={(value) => changeLocationZone(value)}
                  options={[
                    { value: "", label: "All Zone" },
                    ...getAllZonesRouteData,
                  ]}
                />
              </div>
              <div className="flex flex-col ">
                <Select
                  showSearch
                  className="w-[150px] max-[770px]:w-full"
                  defaultValue=""
                  value={locationPriority}
                  optionFilterProp="label"
                  onChange={(value) => setLocationPriority(value)}
                  options={[
                    {
                      value: "",
                      label: "All Priority",
                    },
                    {
                      value: "CRITICAL",
                      label: "CRITICAL",
                    },
                    {
                      value: "HIGH",
                      label: "HIGH",
                    },
                    {
                      value: "MEDIUM",
                      label: "MEDIUM",
                    },
                    {
                      value: "LOW",
                      label: "LOW",
                    },
                    {
                      value: "TRIVIAL",
                      label: "TRIVIAL",
                    },
                  ]}
                />
              </div>
              <div className="flex flex-col">
                <InputNumber
                  className="w-[150px] max-[770px]:w-full"
                  placeholder="< Capacity"
                  prefix={<LuSearch />}
                  value={locationCapacity}
                  onChange={(value) => setLocationCapacity(value || 0)}
                />
              </div>
              <div className="flex flex-col">
                <Input
                  allowClear
                  className="w-[160px] max-[770px]:w-full"
                  prefix={<LuSearch />}
                  onChange={(e) => setLocationQuery(e.target.value)}
                  value={locationQuery}
                  placeholder="Search location"
                />
              </div>
              <div className="flex flex-col ">
                <Popconfirm
                  placement="rightTop"
                  title="Remove Locations Filter"
                  description="Are you sure?"
                  onConfirm={resetLocationsFilter}
                  okText="Yes"
                  cancelText="No"
                >
                  <div
                    title="Reset location filter"
                    className="flex cursor-pointer justify-center rounded-md bg-primary p-1"
                  >
                    <GrPowerReset color="white" size={20} />
                  </div>
                </Popconfirm>
              </div>
              <div className="flex flex-col ">
                <Select
                  showSearch
                  className="w-[160px] max-[770px]:w-full"
                  defaultValue="false"
                  value={locationIsAssign}
                  optionFilterProp="label"
                  onChange={(value) => switchAssign(value)}
                  options={[
                    {
                      value: "false",
                      label: "Unassigned",
                    },
                    {
                      value: "true",
                      label: "Assigned",
                    },
                  ]}
                />
              </div>
              <div className="flex w-[290px] justify-center rounded-md border-[1px] bg-gray-50 p-1 px-2 text-black">
                Selected Locations: {assign.length}({totalCapacity.toFixed(4)}
                m³)
              </div>
              <div className="flex flex-col ">
                <Popconfirm
                  placement="rightTop"
                  title="Unassign"
                  description="Are you sure?"
                  onConfirm={unassignLocationsToTruck}
                  okText="Yes"
                  cancelText="No"
                >
                  <div
                    title="Reset location filter"
                    className="flex cursor-pointer justify-center rounded-md bg-slate-300 p-1"
                  >
                    <GiCancel color="red" size={20} />
                  </div>
                </Popconfirm>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-2 flex justify-between max-[700px]:flex-col">
          <div className="h-[80vh] w-2/6 min-w-[300px] overflow-y-auto p-1 pe-3 max-[700px]:flex max-[700px]:h-fit max-[700px]:w-full max-[700px]:overflow-x-auto max-[700px]:overflow-y-hidden">
            <div className="text-md">Trucks: {data?.length}</div>
            {data?.map((item) => (
              <div
                onContextMenu={() =>
                  handleRightClick(event, item.id.toString(), item.truck)
                }
                onClick={() => assignLocationsToTruck(item.id)}
                key={item.id}
                className="mx-auto mb-2 max-w-sm  cursor-pointer overflow-hidden border-[1px] border-gray-300 bg-white shadow hover:border-primary hover:bg-slate-200 max-[700px]:m-1 max-[700px]:w-[300px] max-[700px]:min-w-[300px] sm:rounded-md"
              >
                <div className="">
                  <div className="px-2 py-2 sm:px-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-sm  leading-6 text-primary">
                        {item.truck.licensePlate}
                      </div>
                      <div className="text-md ms-1  text-sm  text-black">
                        {item?.truck?.truckSize?.name}
                      </div>
                      <div className="text-md ms-1 text-sm text-green-700">
                        {item.status}
                      </div>
                    </div>
                    <div className="my-1 flex items-center justify-between">
                      <div className="text-xs">
                        <span className="text-blue-500">
                          M({item.partOfDays?.MORNING?.number_of_delivery || 0}
                          ):
                        </span>
                        <span
                          className={
                            item.capacity >
                            (item.partOfDays?.MORNING?.total_capacity || 0)
                              ? "text-primary"
                              : "text-red-800"
                          }
                        >
                          <span>
                            {item.partOfDays?.MORNING?.total_capacity !==
                            undefined
                              ? `${item.partOfDays.MORNING.total_capacity.toFixed(2)}m³`
                              : "N/A"}
                          </span>
                          {/* /
                          {Math.ceil(
                            (item.partOfDays?.MORNING?.total_capacity || 0) /
                              item.capacity,
                          )} */}
                        </span>
                      </div>
                      <div className="text-xs">
                        <span className="text-green-500">
                          A(
                          {item.partOfDays?.AFTERNOON?.number_of_delivery || 0}
                          ):
                        </span>
                        <span
                          className={
                            item.capacity >
                            (item.partOfDays?.AFTERNOON?.total_capacity || 0)
                              ? "text-primary"
                              : "text-red-800"
                          }
                        >
                          <span>
                            {item.partOfDays?.AFTERNOON?.total_capacity !==
                            undefined
                              ? `${item.partOfDays.AFTERNOON.total_capacity.toFixed(2)} m³`
                              : "N/A"}
                          </span>
                        </span>
                      </div>
                      <div className="text-xs">
                        <span className="text-orange-500">
                          E({item.partOfDays?.EVENING?.number_of_delivery || 0}
                          ):
                        </span>
                        <span
                          className={
                            item.capacity >
                            (item.partOfDays?.EVENING?.total_capacity || 0)
                              ? "text-primary"
                              : "text-red-800"
                          }
                        >
                          <span>
                            {item.partOfDays?.EVENING?.total_capacity !==
                            undefined
                              ? `${item.partOfDays.EVENING.total_capacity.toFixed(2)} m³`
                              : "N/A"}
                          </span>
                        </span>
                      </div>
                      <div className="text-xs">
                        <span className="text-purple-500">
                          N({item.partOfDays?.NIGHT?.number_of_delivery || 0}):
                        </span>
                        <span
                          className={
                            item.capacity >
                            (item.partOfDays?.NIGHT?.total_capacity || 0)
                              ? "text-primary"
                              : "text-red-800"
                          }
                        >
                          <span>
                            {item.partOfDays?.NIGHT?.total_capacity !==
                            undefined
                              ? `${item.partOfDays.NIGHT.total_capacity.toFixed(2)} m³`
                              : "N/A"}
                          </span>
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className=" w-[100px] text-sm text-gray-500">
                        <span className="text-xs">Zone:</span>
                        <span
                          className="ms-1 cursor-help text-xs text-red-900"
                          title={item.truck.zone.name}
                        >
                          {item.truck.zone.code}
                        </span>
                      </div>
                      <div className=" ms-1 text-sm text-gray-500">
                        <span className="text-xs">Locations:</span>
                        <span className="ms-1 text-xs text-black">
                          {item.AssignLocationToTruck?.length}
                        </span>
                      </div>
                      <div className=" ms-1 text-sm text-gray-500">
                        <span className="text-xs">Capacity:</span>
                        <span className="ms-1 text-xs text-green-600">
                          {item.capacity.toFixed(2)}m³
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="h-[80vh] w-2/6 min-w-[300px] overflow-y-auto p-1 pe-3 max-[700px]:flex max-[700px]:h-fit max-[700px]:w-full max-[700px]:overflow-x-auto max-[700px]:overflow-y-hidden">
            <div className="text-md">Locations: {dataLocations?.length}</div>
            {dataLocations?.map((item, index) => {
              const previousItem = index > 0 ? dataLocations[index - 1] : null;
              return (
                <div key={item.id}>
                  {item.partOfDay !== previousItem?.partOfDay ? (
                    <div className="flex w-full items-center justify-between text-xs text-purple-700">
                      <div className="h-[1px] w-[100px] bg-purple-700"></div>
                      <div>
                        {item.partOfDay} :{" "}
                        {countByPartOfDay(dataLocations, item.partOfDay)}
                      </div>
                      <div className="h-[1px] w-[100px] bg-purple-700"></div>
                    </div>
                  ) : (
                    ""
                  )}
                  <div
                    // onClick={() => handleAssign(item.id, item.capacity || 0)}
                    // onDoubleClick={() => handleOpenLocationDrawer(item)}
                    className={`mx-auto mb-2 max-w-sm overflow-hidden border-[1px] bg-white shadow-md max-[700px]:m-1 max-[700px]:w-[300px] max-[700px]:min-w-[300px] sm:rounded-lg ${
                      item.priority === "CRITICAL"
                        ? "border-red-500"
                        : item.priority === "HIGH"
                          ? "border-orange-500"
                          : item.priority === "MEDIUM"
                            ? "border-orange-300"
                            : item.priority === "LOW"
                              ? "border-green-500"
                              : "border-gray-300"
                    }`}
                  >
                    <div className="">
                      <div className="px-2 py-2 sm:px-3">
                        <div className="flex items-center justify-between">
                          <h3 className="flex items-center text-sm leading-6">
                            <span
                              className="cursor-help text-red-900"
                              title={item.zone.name}
                            >
                              {item.zone.code}
                            </span>
                            <span className="text-md ms-1 text-black">
                              ({item?.truckSize.name})
                            </span>
                            <span className="text-md ms-1 text-green-700">
                              {item.capacity?.toFixed(3)}m³
                            </span>
                          </h3>
                          {item.isAssign ? (
                            assign.some(
                              (assignedItem) => assignedItem.id === item.id,
                            ) ? (
                              <MdCheckBoxOutlineBlank
                                size={22}
                                className="cursor-pointer text-green-700"
                                onClick={() =>
                                  handleAssign(item.id, item.capacity || 0)
                                }
                              />
                            ) : (
                              <MdCheckBox
                                size={22}
                                className="cursor-pointer text-green-700"
                                onClick={() =>
                                  handleAssign(item.id, item.capacity || 0)
                                }
                              />
                            )
                          ) : assign.some(
                              (assignedItem) => assignedItem.id === item.id,
                            ) ? (
                            <MdCheckBox
                              size={22}
                              className="cursor-pointer text-green-700"
                              onClick={() =>
                                handleAssign(item.id, item.capacity || 0)
                              }
                            />
                          ) : (
                            <MdCheckBoxOutlineBlank
                              size={22}
                              className="cursor-pointer text-green-700"
                              onClick={() =>
                                handleAssign(item.id, item.capacity || 0)
                              }
                            />
                          )}
                        </div>
                        <div className="mt-2 flex items-center justify-between">
                          <div className="flex w-[110px] items-center text-xs text-gray-500">
                            <div className=" text-black">{item.partOfDay}</div>
                            <CiEdit
                              onClick={() =>
                                handleUpdatePartOfDay(item.partOfDay, item.id)
                              }
                              size={15}
                              color="blue"
                              className="cursor-pointer"
                            />
                          </div>
                          <div className="w-[30px] text-xs text-gray-500">
                            <span
                              className={`${
                                item.priority === "CRITICAL"
                                  ? "text-red-900"
                                  : item.priority === "HIGH"
                                    ? "text-orange-600"
                                    : item.priority === "MEDIUM"
                                      ? "text-orange-400"
                                      : item.priority === "LOW"
                                        ? "text-lime-600"
                                        : "text-gray-500"
                              }`}
                            >
                              {item.priority}
                            </span>
                          </div>
                          <div className="w-[100px] text-end text-xs text-gray-500">
                            <span className=" text-black">{item.phone}</span>
                          </div>
                          <Popconfirm
                            placement="rightTop"
                            title="Delete location"
                            description="Are you sure?"
                            onConfirm={() =>
                              handleDeleteLocation(
                                item.latitude,
                                item.longitude,
                                item.deliveryRouteCalculationDateId,
                              )
                            }
                            okText="Yes"
                            cancelText="No"
                          >
                            <FaRegTrashAlt
                              color="red"
                              size={15}
                              className="cursor-pointer"
                            />
                          </Popconfirm>

                          <FaRegEye
                            color="blue"
                            size={20}
                            className="cursor-pointer "
                            onClick={() => handleOpenLocationDrawer(item)}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="w-4/5 bg-slate-400 p-[1px] max-[700px]:h-[700px] max-[700px]:w-full">
            {/* <MapRoute locations={dataLocations || []} /> */}
          </div>
        </div>
      </div>
      <Drawer
        title="Location Details"
        onClose={handleCloseLocationDrawer}
        open={openLocationDrawer}
        size="large"
      >
        <div className="px-4">
          <div className="flex items-center">
            <FaRegEye
              color="blue"
              size={20}
              className="mb-2 me-2 cursor-pointer"
              onClick={() => viewLocationMap(locationItem?.phone || "")}
            />
            <h2 className="mb-2 text-xl">{locationItem?.locationName}</h2>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="border-gray-30 flex w-full items-center break-words rounded border-[1px] bg-white p-4">
              <p className="me-2 text-sm text-gray-500">SE:</p>
              <p className="font-medium">{locationItem?.se}</p>
            </div>
            <div className="border-gray-30 flex w-full items-center break-words rounded border-[1px] bg-white p-4">
              <p className="me-2 text-sm text-gray-500">Phone:</p>
              <p className="font-medium">{locationItem?.phone}</p>
            </div>
            <div className="border-gray-30 flex w-full items-center break-words rounded border-[1px] bg-white p-4">
              <p className="me-2 text-sm text-gray-500">Truck Size:</p>
              <p className="font-medium">{locationItem?.truckSize?.name}</p>
            </div>
            <div className="border-gray-30 flex w-full items-center break-words rounded border-[1px] bg-white p-4">
              <p className="me-2 text-sm text-gray-500">Capacity:</p>
              <p className="font-medium">{locationItem?.capacity} m³</p>
            </div>
            <div className="border-gray-30 flex w-full items-center break-words rounded border-[1px] bg-white p-4">
              <p className="me-2 text-sm text-gray-500">Part of Day:</p>
              <p className="font-medium">{locationItem?.partOfDay}</p>
            </div>
            <div className="border-gray-30 flex w-full items-center break-words rounded border-[1px] bg-white p-4">
              <p className="me-2 text-sm text-gray-500">Priority:</p>
              <p className="font-medium">{locationItem?.priority}</p>
            </div>
            <div className="border-gray-30 flex w-full items-center break-words rounded border-[1px] bg-white p-4">
              <p className="me-2 text-sm text-gray-500">Zone:</p>
              <p className="font-medium">{locationItem?.zone?.name}</p>
            </div>
            <div className="border-gray-30 flex w-full items-center break-words rounded border-[1px] bg-white p-4">
              <p className="me-2 text-sm text-gray-500">Payment Term:</p>
              <p className="font-medium">{locationItem?.paymentTerm}</p>
            </div>
            <div className="border-gray-30 flex w-full items-center break-words rounded border-[1px] bg-white p-4">
              <p className="me-2 text-sm text-gray-500">Delivery Date:</p>
              <p className="font-medium">{locationItem?.deliveryDate}</p>
            </div>
            <div className="border-gray-30 flex w-full items-center break-words rounded border-[1px] bg-white p-4">
              <p className="me-2 text-sm text-gray-500">Assigned:</p>
              <p className="font-medium">
                {locationItem?.isAssign ? "Yes" : "No"}
              </p>
            </div>
            <div className="border-gray-30 flex w-full items-center break-words rounded border-[1px] bg-white p-4">
              <p className="me-2 text-sm text-gray-500">
                Truck Size Cubic Capacity:
              </p>
              <p className="font-medium">
                {locationItem?.truckSize?.containerCubic} m³
              </p>
            </div>
            <div className="border-gray-30 flex w-full items-center break-words rounded border-[1px] bg-white p-4">
              <p className="me-2 text-sm text-gray-500">Latitude:</p>
              <p className="font-medium">{locationItem?.latitude}</p>
            </div>
            <div className="border-gray-30 flex w-full items-center break-words rounded border-[1px] bg-white p-4">
              <p className="me-2 text-sm text-gray-500">Longitude:</p>
              <p className="font-medium">{locationItem?.longitude}</p>
            </div>
            <div className="border-gray-30 flex w-full items-center break-words rounded border-[1px] bg-white p-4">
              <p className="me-2 text-sm text-gray-500">Document Type:</p>
              <p className="font-medium">{locationItem?.documentType}</p>
            </div>
            <div className="border-gray-30 flex w-full items-center break-words rounded border-[1px] bg-white p-4">
              <p className="me-2 text-sm text-gray-500">Document Number:</p>
              <p className="font-medium">{locationItem?.documentNumber}</p>
            </div>
            <div className="border-gray-30 flex w-full items-center break-words rounded border-[1px] bg-white p-4">
              <p className="me-2 text-sm text-gray-500">Document Date:</p>
              <p className="font-medium">{locationItem?.documentDate}</p>
            </div>
            <div className="border-gray-30 flex w-full items-center break-words rounded border-[1px] bg-white p-4">
              <p className="me-2 text-sm text-gray-500">SLA:</p>
              <p className="font-medium">{locationItem?.sla}</p>
            </div>
            <div className="border-gray-30 flex w-full items-center break-words rounded border-[1px] bg-white p-4">
              <p className="me-2 text-sm text-gray-500">Upload Time:</p>
              <p className="font-medium">{locationItem?.uploaddTime}</p>
            </div>
            <div className="border-gray-30 flex w-full items-center break-words rounded border-[1px] bg-white p-4">
              <p className="me-2 text-sm text-gray-500">Home No:</p>
              <p className="font-medium">{locationItem?.homeNo}</p>
            </div>
            <div className="border-gray-30 flex w-full items-center break-words rounded border-[1px] bg-white p-4">
              <p className="me-2 text-sm text-gray-500">Street No:</p>
              <p className="font-medium">{locationItem?.streetNo}</p>
            </div>
            <div className="border-gray-30 flex w-full items-center break-words rounded border-[1px] bg-white p-4">
              <p className="me-2 text-sm text-gray-500">Village:</p>
              <p className="font-medium">{locationItem?.village}</p>
            </div>
            <div className="border-gray-30 flex w-full items-center break-words rounded border-[1px] bg-white p-4">
              <p className="me-2 text-sm text-gray-500">Sangkat:</p>
              <p className="font-medium">{locationItem?.sangkat}</p>
            </div>
            <div className="border-gray-30 flex w-full items-center break-words rounded border-[1px] bg-white p-4">
              <p className="me-2 text-sm text-gray-500">Khan:</p>
              <p className="font-medium">{locationItem?.khan}</p>
            </div>
            <div className="border-gray-30 flex w-full items-center break-words rounded border-[1px] bg-white p-4">
              <p className="me-2 text-sm text-gray-500">Hot Spot:</p>
              <p className="font-medium">{locationItem?.hotSpot}</p>
            </div>
            <div className="border-gray-30 flex w-full items-center break-words rounded border-[1px] bg-white p-4">
              <p className="me-2 text-sm text-gray-500">Direction:</p>
              <p className="font-medium">{locationItem?.direction}</p>
            </div>
            <div className="border-gray-30 flex w-full items-center break-words rounded border-[1px] bg-white p-4">
              <p className="me-2 text-sm text-gray-500">Area:</p>
              <p className="font-medium">{locationItem?.area}</p>
            </div>
            <div className="border-gray-30 flex w-full items-center break-words rounded border-[1px] bg-white p-4">
              <p className="me-2 text-sm text-gray-500">Region:</p>
              <p className="font-medium">{locationItem?.region}</p>
            </div>
            <div className="border-gray-30 flex w-full items-center break-words rounded border-[1px] bg-white p-4">
              <p className="me-2 text-sm text-gray-500">Division:</p>
              <p className="font-medium">{locationItem?.division}</p>
            </div>
            <div className="border-gray-30 flex w-full items-center break-words rounded border-[1px] bg-white p-4">
              <p className="me-2 text-sm text-gray-500">Comments:</p>
              <p className="font-medium">{locationItem?.comments}</p>
            </div>
          </div>
        </div>
      </Drawer>
      <Drawer
        title="Truck Information"
        onClose={handleCloseTruckDrawer}
        open={openTruckDrawer}
        size="large"
      >
        <div className="p-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="border-gray-30 flex w-full items-center break-words rounded border-[1px] bg-white p-4">
              <p className="me-2 text-sm text-gray-500">License Plate:</p>
              <p className="font-medium">{truckItem?.licensePlate}</p>
            </div>
            <div className="border-gray-30 flex w-full items-center break-words rounded border-[1px] bg-white p-4">
              <p className="me-2 text-sm text-gray-500">Model:</p>
              <p className="font-medium">{truckItem?.model}</p>
            </div>
            <div className="border-gray-30 flex w-full items-center break-words rounded border-[1px] bg-white p-4">
              <p className="me-2 text-sm text-gray-500">Manufacturer:</p>
              <p className="font-medium">{truckItem?.manufacturer}</p>
            </div>
            <div className="border-gray-30 flex w-full items-center break-words rounded border-[1px] bg-white p-4">
              <p className="me-2 text-sm text-gray-500">Functioning:</p>
              <p className="font-medium">{truckItem?.functioning}</p>
            </div>
            <div className="border-gray-30 flex w-full items-center break-words rounded border-[1px] bg-white p-4">
              <p className="me-2 text-sm text-gray-500">Status:</p>
              <p className="font-medium">{truckItem?.status}</p>
            </div>
            <div className="border-gray-30 flex w-full items-center break-words rounded border-[1px] bg-white p-4">
              <p className="me-2 text-sm text-gray-500">Truck Size:</p>
              <p className="font-medium">{truckItem?.truckSize?.name}</p>
            </div>
            <div className="border-gray-30 flex w-full items-center break-words rounded border-[1px] bg-white p-4">
              <p className="me-2 text-sm text-gray-500">Fuel Type:</p>
              <p className="font-medium">{truckItem?.fuel?.name}</p>
            </div>
            <div className="border-gray-30 flex w-full items-center break-words rounded border-[1px] bg-white p-4">
              <p className="me-2 text-sm text-gray-500">Zone:</p>
              <p className="font-medium">
                {truckItem?.zone?.code}({truckItem?.zone?.name})
              </p>
            </div>
            <div className="border-gray-30 flex w-full items-center break-words rounded border-[1px] bg-white p-4">
              <p className="me-2 text-sm text-gray-500">Warehouse:</p>
              <p className="font-medium">{truckItem?.warehouse?.name}</p>
            </div>
            <div className="border-gray-30 flex w-full items-center break-words rounded border-[1px] bg-white p-4">
              <p className="me-2 text-sm text-gray-500">Ownership Type:</p>
              <p className="font-medium">
                {truckItem?.truckOwnershipType?.name}
              </p>
            </div>
            <div className="border-gray-30 flex w-full items-center break-words rounded border-[1px] bg-white p-4">
              <p className="me-2 text-sm text-gray-500">
                Container Size (Cubic):
              </p>
              <p className="font-medium">
                {truckItem?.truckSize?.containerCubic} m³
              </p>
            </div>
          </div>
        </div>
      </Drawer>
      <Modal
        title={"Create"}
        className="font-satoshi"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        maskClosable={false}
        footer={null} // Set footer to null if you don't want to display anything there
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mt-2 text-slate-600">
            File<span className="text-red">*</span>
          </div>
          <input
            {...register("file", {
              required: true,
              validate: {
                // Custom validation function
                isExcel: (value) => {
                  const allowedExtensions = [
                    "application/vnd.ms-excel",
                    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                  ];
                  return (
                    (value &&
                      value[0] &&
                      allowedExtensions.includes(value[0].type)) ||
                    "Please upload a valid Excel file."
                  );
                },
              },
            })}
            type="file"
            className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-2"
          />
          {errors.file && (
            <span className="text-sm text-red-800">
              {errors.file.message?.toString()}
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
              {isPendingCreate ? "Submitting..." : "Create"}
            </button>
          </div>
        </form>
      </Modal>
      <Modal
        title={"Update Part of day"}
        className="font-satoshi"
        open={partOfDayModal}
        // onOk={handleOk}
        onCancel={handleCancelPartOfDayModal}
        maskClosable={false}
        footer={null}
      >
        <div className="w-full">
          <Select
            showSearch
            className="w-full"
            defaultValue=""
            value={currentPartOfDay}
            optionFilterProp="label"
            onChange={(value) => setCurrentPartOfDay(value)}
            options={[
              {
                value: "MORNING",
                label: "MORNING",
              },
              {
                value: "AFTERNOON",
                label: "AFTERNOON",
              },
              {
                value: "EVENING",
                label: "EVENING",
              },
              {
                value: "NIGHT",
                label: "NIGHT",
              },
            ]}
          />
          <div className="flex w-full items-center justify-end">
            <div
              onClick={handleCancelPartOfDayModal}
              className="me-1 mt-5 cursor-pointer rounded-md bg-blue-400 px-4 py-2 text-white"
            >
              Cancel
            </div>
            <button
              onClick={updatePartOfDay}
              className="me-1 mt-5 rounded-md bg-primary px-4 py-2 text-white"
            >
              Update
            </button>
          </div>
        </div>
      </Modal>
      {showButton && (
        <div
          className="flex w-[140px] flex-col rounded-md border-[1px] bg-slate-50 p-1 px-2 text-black shadow-4"
          style={{
            position: "absolute",
            top: position.y,
            left: position.x,
          }}
        >
          <div className="text-s flex items-center justify-between p-1">
            <div
              className="cursor-pointer text-sm text-primary hover:underline"
              onClick={() => (
                setLocationTruckByDateId(rightClickTruckByDateId),
                setLocationIsAssign("true")
              )}
            >
              See locations
            </div>
            <div className="p-1" onClick={handleClick}>
              <CgClose size={20} color="red" />
            </div>
          </div>
          <div className="flex items-center justify-between p-1 text-sm ">
            <div
              onClick={() => handleOpenTruckDrawer()}
              className="cursor-pointer text-primary hover:underline"
            >
              See detail
            </div>
            <div className="p-1">{/* <CgClose size={20} color="red" /> */}</div>
          </div>
        </div>
      )}
      <Modal
        title="Basic Modal"
        open={isModalVisible}
        onOk={() => setIsModalVisible(false)}
        onCancel={() => setIsModalVisible(false)}
      >
        <p>Some contents...</p>
        <p>Some contents...</p>
        <p>Some contents...</p>
      </Modal>
    </section>
  );
};

export default EachRouteComponent;
