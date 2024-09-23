"use client";
import {
  assignTruck,
  autoAssign,
  CreateDrc,
  createDrc,
  createNewLocation,
  deleteLocation,
  deleteSingleLocation,
  getAllCaseNames,
  getAllLocations,
  getAllTrucksByDate,
  getAllWarehousesRoute,
  getAllZonesRoute,
  Location,
  LocationCreate,
  PartOfDay,
  Priority,
  Truck,
  TruckByDate,
  unassignTruck,
  updateCapNewLocation,
  updateLocationPartOfDay,
  updateNewLocation,
  updateSingleLocation,
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
  Button,
  Drawer,
  Input,
  InputNumber,
  message,
  Modal,
  notification,
  Popconfirm,
  Popover,
  Select,
  Tag,
} from "antd";
import Link from "next/link";
import React, { useMemo, useState } from "react";
import { FaRegEye, FaRegTrashAlt } from "react-icons/fa";
import { IoChevronBackCircle } from "react-icons/io5";
import {
  MdCheckBox,
  MdCheckBoxOutlineBlank,
  MdOutlineAssignmentReturned,
  MdOutlineCheckBoxOutlineBlank,
} from "react-icons/md";
import Skeleton from "../../components/Skeleton";
import { LuSearch } from "react-icons/lu";
import dynamic from "next/dynamic";
import { GrPowerReset } from "react-icons/gr";
import { GoLink, GoUnlink } from "react-icons/go";
import { GiCancel } from "react-icons/gi";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { IoMdAddCircleOutline } from "react-icons/io";
import { CgClose } from "react-icons/cg";
import { CiEdit } from "react-icons/ci";
import { CenterMap } from "../MapRoute";
import { PiSelectionSlash } from "react-icons/pi";
import axios from "axios";
import { VscCloudDownload } from "react-icons/vsc";
const baseUrl = process.env.NEXT_PUBLIC_API_URL;
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
  const [center, setCenter] = useState<CenterMap>({
    lat: 11.5564,
    long: 104.9282,
  });

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
  // create or update  location
  const [createModal, setCreateModal] = useState(false);
  const [updateCap, setUpdateCap] = useState(false);
  // Initialize the state to store values for each input
  const [inputValues, setInputValues] = useState<any>({});

  const handleUpdateCap = () => {
    setUpdateCap(true);
    setUpdateLocation(true);
  };

  // Function to handle value change for each InputNumber
  const handleInputChange = (name: any, value: any) => {
    setInputValues((prevValues: any) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const { mutateAsync: createMutate } = useMutation({
    mutationFn: createNewLocation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allLocations"] });
      queryClient.invalidateQueries({ queryKey: ["allTrucksByDate"] });
      queryClient.invalidateQueries({ queryKey: ["getAllZonesRoute"] });
      openNotification("Create", "Location created successfully");
      handleCancelCreate();
    },
    onError: (error: any) => {
      message.error(error);
    },
  });
  const { mutateAsync: updateMutate } = useMutation({
    mutationFn: updateNewLocation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allLocations"] });
      queryClient.invalidateQueries({ queryKey: ["allTrucksByDate"] });
      queryClient.invalidateQueries({ queryKey: ["getAllZonesRoute"] });
      openNotification("Update", "Location updated successfully");
      handleCancelCreate();
    },
    onError: (error: any) => {
      message.error(error);
    },
  });

  const { mutateAsync: updateCapMutate } = useMutation({
    mutationFn: updateCapNewLocation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allLocations"] });
      queryClient.invalidateQueries({ queryKey: ["allTrucksByDate"] });
      queryClient.invalidateQueries({ queryKey: ["getAllZonesRoute"] });
      openNotification("Update", "Location updated successfully");
      handleCancelCreate();
    },
    onError: (error: any) => {
      message.error(error);
    },
  });
  const { mutateAsync: updateSingleCapMutate } = useMutation({
    mutationFn: updateSingleLocation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allLocations"] });
      queryClient.invalidateQueries({ queryKey: ["allTrucksByDate"] });
      queryClient.invalidateQueries({ queryKey: ["getAllZonesRoute"] });
      openNotification("Update", "Location updated successfully");
      handleCancelCreate();
    },
    onError: (error: any) => {
      message.error(error);
    },
  });

  const {
    register: registerCreate,
    handleSubmit: handleSubmitCreate,
    reset: resetCreate,
    formState: { errors: errorsCreate },
    control,
    setValue: setValueCreate,
  } = useForm<LocationCreate>();
  const onSubmitCreate: SubmitHandler<LocationCreate> = async (data) => {
    if (updateLocation && !updateCap) {
      const newData = { ...data, id: id };
      await updateMutate(newData);
    } else if (updateLocation && updateCap && !updateSingle) {
      // need to validate
      if (!inputValues || Object.keys(inputValues).length === 0) {
        return message.error("Please input requirement");
      }
      const newData = { ...data, ...inputValues, id: id };
      await updateCapMutate(newData);
    } else if (updateLocation && updateCap && updateSingle) {
      // need to validate
      if (!inputValues || Object.keys(inputValues).length === 0) {
        return message.error("Please input requirement");
      }
      const newData = { ...data, ...inputValues, id: id };
      await updateSingleCapMutate(newData);
    } else {
      // need to validate
      if (!inputValues || Object.keys(inputValues).length === 0) {
        return message.error("Please input requirement");
      }
      const newData = { ...data, ...inputValues, id: id };
      await createMutate(newData);
    }
  };

  const handleCancelCreate = () => {
    setUpdateLocation(false);
    resetCreate();
    setInputValues({});
    setCreateModal(false);
    setUpdateCap(false);
  };
  const handleCreateNewLocation = () => {
    resetCreate();
    setCreateModal(true);
  };
  const [updateLocation, setUpdateLocation] = useState(false);
  const [updateSingle, setUpdateSingle] = useState(false);
  const handleUpdateSingleLocation = (item: Location) => {
    setUpdateLocation(true);
    setCreateModal(true);
    setUpdateCap(true);
    setUpdateSingle(true);
    setUpdateLocation(true);
    setValueCreate("code", item.code);
    setValueCreate("zoneId", item.zone.id);
    setValueCreate("phone", item.phone);
    setValueCreate("truckSizeId", item.truckSize.id);
    setValueCreate("partOfDay", item.partOfDay as PartOfDay);
    setValueCreate("priority", item.priority as Priority);
    setValueCreate("locationName", item.locationName);
    setValueCreate("se", item.se);
    setValueCreate("paymentTerm", item.paymentTerm);
    setValueCreate("latitude", item.latitude);
    setValueCreate("longitude", item.longitude);
    setValueCreate("deliveryDate", item.deliveryDate);
    setValueCreate("comments", item.comments);
    setValueCreate("documentType", item.documentType);
    setValueCreate("documentNumber", item.documentNumber);
    setValueCreate("documentDate", item.documentDate);
    setValueCreate("sla", item.sla);
    setValueCreate("uploaddTime", item.uploaddTime);
    setValueCreate("homeNo", item.homeNo);
    setValueCreate("streetNo", item.streetNo);
    setValueCreate("village", item.village);
    setValueCreate("sangkat", item.sangkat);
    setValueCreate("khan", item.khan);
    setValueCreate("hotSpot", item.hotSpot);
    setValueCreate("direction", item.direction);
    setValueCreate("area", item.area);
    setValueCreate("region", item.region);
    setValueCreate("division", item.division);

    for (const req of item.Requirement || []) {
      handleInputChange(req.caseSize.name, req.amount);
    }
  };
  const handleUpdateLocation = (item: Location) => {
    setUpdateLocation(true);
    setCreateModal(true);
    setValueCreate("code", item.code);
    setValueCreate("zoneId", item.zone.id);
    setValueCreate("phone", item.phone);
    setValueCreate("truckSizeId", item.truckSize.id);
    setValueCreate("partOfDay", item.partOfDay as PartOfDay);
    setValueCreate("priority", item.priority as Priority);
    setValueCreate("locationName", item.locationName);
    setValueCreate("se", item.se);
    setValueCreate("paymentTerm", item.paymentTerm);
    setValueCreate("latitude", item.latitude);
    setValueCreate("longitude", item.longitude);
    setValueCreate("deliveryDate", item.deliveryDate);
    setValueCreate("comments", item.comments);
    setValueCreate("documentType", item.documentType);
    setValueCreate("documentNumber", item.documentNumber);
    setValueCreate("documentDate", item.documentDate);
    setValueCreate("sla", item.sla);
    setValueCreate("uploaddTime", item.uploaddTime);
    setValueCreate("homeNo", item.homeNo);
    setValueCreate("streetNo", item.streetNo);
    setValueCreate("village", item.village);
    setValueCreate("sangkat", item.sangkat);
    setValueCreate("khan", item.khan);
    setValueCreate("hotSpot", item.hotSpot);
    setValueCreate("direction", item.direction);
    setValueCreate("area", item.area);
    setValueCreate("region", item.region);
    setValueCreate("division", item.division);

    for (const req of item.Requirement || []) {
      handleInputChange(req.caseSize.name, req.amount);
    }
  };

  // locations

  const [locationDateId, setLocationDateId] = useState<number>(id); // Unique name for deliveryRouteCalculationDateId
  const [locationZoneId, setLocationZoneId] = useState<string>(""); // Unique name for zoneId
  const [locationTruckSizeId, setLocationTruckSizeId] = useState<string>(""); // Unique name for truckSizeId
  const [locationPartOfDay, setLocationPartOfDay] = useState<string>(""); // Unique name for partOfDay
  const [locationPriority, setLocationPriority] = useState<string>(""); // Unique name for priority
  const [locationCapacity, setLocationCapacity] = useState<number>(); // Unique name for capacity
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

  const handleRightClick = (event: any, id: string, item: TruckByDate) => {
    event.preventDefault();
    setPosition({ x: event.clientX, y: event.clientY });
    setTruckItem({
      ...item.truck,
      AssignLocationToTruck: item.AssignLocationToTruck,
      partOfDays: item.partOfDays,
    });
    setRightClickTruckByDateId(id);
    setShowButton(true);
  };

  const handleClick = () => {
    setLocationIsAssign("false");
    setShowButton(false); // Hide the button when it's clicked
    setRightClickTruckByDateId("");
    setLocationTruckByDateId("");
  };

  // download excel
  const handleDownload = async () => {
    try {
      // validation
      for (const truck of data || []) {
        for (const partOfDay in truck.partOfDays) {
          if (truck.partOfDays[partOfDay]?.total_capacity > truck.capacity) {
            return message.error(
              `Please check truck with plate number : ${truck.truck.licensePlate}`,
            );
          }
        }
      }

      // Make a GET request to your backend route to download the file
      const response = await axios.get(
        `${baseUrl}/drc-date/download-excel-file/${id}`,
        {
          responseType: "blob", // Important to specify the response type as 'blob'
        },
      );

      // Create a URL for the downloaded file
      const url = window.URL.createObjectURL(new Blob([response.data]));

      // Create a link element to trigger the download
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "data.xlsx"); // Set the file name

      // Append the link to the body and trigger the download
      document.body.appendChild(link);
      link.click();

      // Clean up the link element
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error downloading the Excel file:", error);
    }
  };

  // auto assign
  const { mutateAsync: autoAssignMutaion, isPending: isPendingAutoAssign } =
    useMutation({
      mutationFn: autoAssign,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["allLocations"] });
        queryClient.invalidateQueries({ queryKey: ["allTrucksByDate"] });
        queryClient.invalidateQueries({ queryKey: ["getAllZonesRoute"] });
        openNotification("Assign", "Locations assigned successfully");
      },
      onError: (error: any) => {
        message.error(error);
      },
    });
  const handleAutoAssign = async () => {
    await autoAssignMutaion(id);
  };
  // end auto assign

  // delete location
  const {
    mutateAsync: deleteLocationMutaion,
    isPending: isPendingDeleteLocation,
  } = useMutation({
    mutationFn: deleteLocation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allLocations"] });
      queryClient.invalidateQueries({ queryKey: ["allTrucksByDate"] });
      queryClient.invalidateQueries({ queryKey: ["getAllZonesRoute"] });
      openNotification("Delete", "Location Deleted successfully");
    },
    onError: (error: any) => {
      message.error(error);
    },
  });
  const {
    mutateAsync: deleteSingleLocationMutaion,
    isPending: isPendingDeleteSingleLocation,
  } = useMutation({
    mutationFn: deleteSingleLocation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allLocations"] });
      queryClient.invalidateQueries({ queryKey: ["allTrucksByDate"] });
      queryClient.invalidateQueries({ queryKey: ["getAllZonesRoute"] });
      openNotification("Delete", "Location Deleted successfully");
    },
    onError: (error: any) => {
      message.error(error);
    },
  });
  const handleDeleteSingleLocation = async (id: number) => {
    await deleteSingleLocationMutaion(id);
  };
  const handleDeleteLocation = async (
    latitude: number,
    longitude: number,
    partOfDay: string,
    priority: string,
    deliveryRouteCalculationDateId: number,
  ) => {
    await deleteLocationMutaion({
      latitude,
      longitude,
      partOfDay,
      priority,
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
      queryClient.invalidateQueries({ queryKey: ["getAllZonesRoute"] });
      openNotification("Update Drc", "Drc Updated successfully");
      handleCancelPartOfDayModal();
    },
    onError: (error: any) => {
      message.error(error);
    },
  });
  const updatePartOfDay = async () => {
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
        queryClient.invalidateQueries({ queryKey: ["allTrucksByDate"] });
        queryClient.invalidateQueries({ queryKey: ["getAllZonesRoute"] });
        openNotification("Create", "Created successfully");
        handleCancel();
      },
      onError: (error: any) => {
        message.error(error);
      },
    });
  const onSubmit: SubmitHandler<CreateDrc> = async (data) => {
    reset();
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
  const [assign, setAssign] = useState<
    { id: number; capacity: number; partOfDay: string; truckSize: string }[]
  >([]);

  // assign function
  const handleAssign = (
    id: number,
    capacity: number,
    partOfDay: string,
    truckSize: string,
  ) => {
    setAssign((prevAssign) => {
      if (prevAssign.some((item) => item.id === id)) {
        return prevAssign.filter((item) => item.id !== id);
      } else {
        return [...prevAssign, { id, capacity, partOfDay, truckSize }];
      }
    });
  };
  // assign to truck
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleMarkerClick = (location: any) => {
    handleAssign(
      location.id,
      location.capacity,
      location.partOfDay,
      location.truckSize,
    );
  };
  const assignLocationsToTruck = async (
    truckByDateId: number,
    item: TruckByDate,
  ) => {
    if (assign.length <= 0) {
      return message.error("Please select locations");
    }
    // Extracting the array of ids from the assign array
    const deliveryRouteCalculationDateIds = assign.map((item) => item.id);

    // validation capacity
    const totalCapacity = assign.reduce((sum, item) => sum + item.capacity, 0);
    if (item.capacity < totalCapacity) {
      return message.error("Capacity out of truck");
    }

    const partOfDayValues = assign.map((item) => item.partOfDay);
    const uniquePartOfDayValues = Array.from(new Set(partOfDayValues));

    if (uniquePartOfDayValues.includes("MORNING")) {
      const morningCapacity = item?.partOfDays?.MORNING?.total_capacity;
      const compare = (morningCapacity || 0) + totalCapacity;
      if (compare > item.capacity) {
        return message.error("Capacity out of truck");
      }
    }
    if (uniquePartOfDayValues.includes("AFTERNOON")) {
      const afternoonCapacity = item?.partOfDays?.AFTERNOON?.total_capacity;
      const compare = (afternoonCapacity || 0) + totalCapacity;
      if (compare > item.capacity) {
        return message.error("Capacity out of truck");
      }
    }
    if (uniquePartOfDayValues.includes("EVENING")) {
      const eveningCapacity = item?.partOfDays?.EVENING?.total_capacity;
      const compare = (eveningCapacity || 0) + totalCapacity;
      if (compare > item.capacity) {
        return message.error("Capacity out of truck");
      }
    }
    if (uniquePartOfDayValues.includes("NIGHT")) {
      const nightCapacity = item?.partOfDays?.NIGHT?.total_capacity;
      const compare = (nightCapacity || 0) + totalCapacity;
      if (compare > item.capacity) {
        return message.error("Capacity out of truck");
      }
    }

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
      queryClient.invalidateQueries({ queryKey: ["getAllZonesRoute"] });
      message.success("Locations Unassigned successfully");
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
        queryClient.invalidateQueries({ queryKey: ["getAllZonesRoute"] });
        queryClient.invalidateQueries({ queryKey: ["getAllZonesRoute"] });
        message.success("Locations Unassigned successfully");
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
    data: getAllWarehousesRouteData,
    isLoading: isLoadinggetAllWarehousesRoute,
    isError: isErrorgetAllWarehousesRoute,
  } = useQuery({
    queryKey: ["getAllWarehousesRoute"],
    queryFn: getAllWarehousesRoute,
  });
  const {
    data: getAllCaseNamesData,
    isLoading: isLoadinggetAllCaseNames,
    isError: isErrorgetAllCaseNames,
  } = useQuery({
    queryKey: ["getAllCaseNames"],
    queryFn: getAllCaseNames,
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
    isLoadinggetAllZonesRoute ||
    isLoadinggetAllCaseNames ||
    isLoadinggetAllWarehousesRoute
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
    isErrorgetAllWarehouses ||
    isErrorgetAllCaseNames ||
    isErrorgetAllWarehousesRoute
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
        <div className="flex items-center justify-between overflow-auto">
          <div className="mb-2 ">
            <div className="flex items-center gap-x-3">
              <Link href={"/admin/route"}>
                <IoChevronBackCircle
                  color="blue"
                  className="cursor-pointer"
                  size={30}
                />
              </Link>
              <div className="flex flex-col">
                <Select
                  showSearch
                  className="select-me w-[135px] max-[770px]:w-full"
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
                  className="select-me w-[100px] max-[770px]:w-full"
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
                  className="select-me w-[150px] max-[770px]:w-full"
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
                  className="select-me w-[150px] max-[770px]:w-full"
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
                  className="select-me w-[150px] max-[770px]:w-full"
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
                  className="input-me min-w-[160px] dark:bg-gray-dark max-[770px]:w-full"
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
                  title="Add"
                  className="flex cursor-pointer justify-center rounded-md bg-primary p-1"
                >
                  <IoMdAddCircleOutline color="white" size={20} />
                </div>
              </div>
              <div className="flex flex-col ">
                <div
                  onClick={() => handleDownload()}
                  title="Export"
                  className="flex cursor-pointer justify-center rounded-md bg-primary p-1"
                >
                  <VscCloudDownload color="white" size={20} />
                </div>
              </div>
              <div className="flex flex-col ">
                <div
                  onClick={() => handleAutoAssign()}
                  title="Auto assign"
                  className="flex cursor-pointer justify-center rounded-md bg-primary p-1"
                >
                  <MdOutlineAssignmentReturned color="white" size={20} />
                </div>
              </div>
            </div>
          </div>
          <div className="flex gap-x-2"></div>
        </div>
        {/* locations */}
        <div className="flex items-center justify-between overflow-auto">
          <div className="flex gap-3 pb-2">
            <div className="ms-[10px] mt-1 flex flex-col">
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
                className="select-me w-[135px] max-[770px]:w-full"
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
                className="select-me w-[100px] max-[770px]:w-full"
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
                showSearch
                className="select-me w-[150px] max-[770px]:w-full"
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
                className="select-me w-[150px] max-[770px]:w-full"
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
                className="input-me min-w-[150px] dark:bg-gray-dark max-[770px]:w-full"
                placeholder="< Capacity"
                prefix={<LuSearch />}
                value={locationCapacity}
                onChange={(value) => setLocationCapacity(value || undefined)}
              />
            </div>
            <div className="flex flex-col">
              <Input
                allowClear
                className="input-me min-w-[160px] dark:bg-gray-dark max-[770px]:w-full"
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
                className="select-me w-[120px] max-[770px]:w-full"
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
            <div className="flex min-w-[200px] justify-center rounded-md border-[1px] bg-gray-50 p-1 px-2 text-black">
              Selected: {assign.length}({totalCapacity.toFixed(4)}
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
                <Button
                  title="Unassign locations"
                  className="flex cursor-pointer justify-center rounded-md bg-slate-300 p-1"
                  disabled={assign.length === 0 || locationIsAssign === "false"}
                >
                  <GiCancel color="red" size={20} />
                </Button>
              </Popconfirm>
            </div>
          </div>
        </div>

        <div className="mt-2 flex justify-between max-[1000px]:flex-col">
          <div className="h-[80vh] w-2/6 min-w-[300px] overflow-y-auto p-1 pe-3 max-[1000px]:flex max-[1000px]:h-fit max-[1000px]:w-full max-[1000px]:overflow-x-auto max-[1000px]:overflow-y-hidden">
            <div className="text-md">Trucks: {data?.length}</div>
            {data?.map((item) => (
              <div
                onContextMenu={() =>
                  handleRightClick(event, item.id.toString(), item)
                }
                onClick={() => assignLocationsToTruck(item.id, item)}
                key={item.id}
                className="mx-auto mb-2 max-w-sm  cursor-pointer overflow-hidden border-[1px] border-gray-300 bg-white shadow hover:border-primary hover:bg-slate-200 dark:bg-gray-dark max-[1000px]:m-1 max-[1000px]:w-[300px] max-[1000px]:min-w-[300px] sm:rounded-md"
              >
                <div className="">
                  <div className="px-2 py-2 sm:px-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-sm  leading-6 text-primary">
                        {item.truck.licensePlate}
                      </div>
                      <div className="text-md ms-1  text-sm dark:text-white">
                        {item?.truck?.truckSize?.name}
                      </div>
                      <div
                        className={`text-md ms-1 text-sm ${item.status === "AVAILABLE" ? "text-green-600" : "text-red-700"}`}
                      >
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
                            item.capacity >=
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
                            item.capacity >=
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
                            item.capacity >=
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
                            item.capacity >=
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
                        <span className="ms-1 text-xs dark:text-white">
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
          <div className="h-[80vh] w-2/6 min-w-[300px] overflow-y-auto p-1 pe-3 max-[1000px]:flex max-[1000px]:h-fit max-[1000px]:w-full max-[1000px]:overflow-x-auto max-[1000px]:overflow-y-hidden">
            <div className="text-md flex items-center justify-between ">
              <div className="flex">
                <IoMdAddCircleOutline
                  size={20}
                  color="blue"
                  className="cursor-pointer"
                  title="Create new location"
                  onClick={() => handleCreateNewLocation()}
                />
                Locations: {dataLocations?.length}
              </div>

              <div>
                <PiSelectionSlash
                  size={20}
                  color="blue"
                  className="cursor-pointer"
                  title="Deselected all"
                  onClick={() => setAssign([])}
                />
              </div>
            </div>
            {dataLocations?.map((item, index) => {
              const previousItem = index > 0 ? dataLocations[index - 1] : null;
              return (
                <div key={item.id} className="w-full dark:bg-gray-dark">
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
                    className={`mx-auto mb-2 max-w-sm overflow-hidden border-[1px] bg-white shadow-md dark:bg-gray-dark max-[1000px]:m-1 max-[1000px]:w-[300px] max-[1000px]:min-w-[300px] sm:rounded-lg ${
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
                            <span className="text-md ms-k">
                              ({item?.truckSize.name})
                            </span>
                            <span className="text-md ms-1 text-green-700">
                              {item.capacity?.toFixed(3)}m³
                            </span>
                            {item.isSplit ? (
                              <Tag color="magenta" className="ms-2">
                                Split
                              </Tag>
                            ) : (
                              ""
                            )}
                          </h3>
                          {item.isAssign ? (
                            assign.some(
                              (assignedItem) => assignedItem.id === item.id,
                            ) ? (
                              <MdCheckBoxOutlineBlank
                                size={22}
                                className="cursor-pointer text-green-700"
                                onClick={() =>
                                  handleAssign(
                                    item.id,
                                    item.capacity || 0,
                                    item.partOfDay,
                                    item.truckSize,
                                  )
                                }
                              />
                            ) : (
                              <MdCheckBox
                                size={22}
                                className="cursor-pointer text-green-700"
                                onClick={() =>
                                  handleAssign(
                                    item.id,
                                    item.capacity || 0,
                                    item.partOfDay,
                                    item.truckSize,
                                  )
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
                                handleAssign(
                                  item.id,
                                  item.capacity || 0,
                                  item.partOfDay,
                                  item.truckSize,
                                )
                              }
                            />
                          ) : (
                            <MdCheckBoxOutlineBlank
                              size={22}
                              className="cursor-pointer text-green-700"
                              onClick={() =>
                                handleAssign(
                                  item.id,
                                  item.capacity || 0,
                                  item.partOfDay,
                                  item.truckSize,
                                )
                              }
                            />
                          )}
                        </div>
                        <div className="mt-2 flex items-center justify-between">
                          <div className="flex w-[80px] items-center text-xs text-gray-500">
                            <div className="dark:text-white">
                              {item.partOfDay}
                            </div>
                          </div>
                          <div className="w-[40px] text-xs text-gray-500">
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
                            <span className=" dark:text-white">
                              {item.phone}
                            </span>
                          </div>
                          {item.isSplit ? (
                            <Popover
                              content={
                                <div className="flex justify-end">
                                  <Button
                                    onClick={() => handleUpdateLocation(item)}
                                    size="small"
                                    className="mx-1"
                                  >
                                    Split also
                                  </Button>
                                  <Button
                                    onClick={() =>
                                      handleUpdateSingleLocation(item)
                                    }
                                    size="small"
                                    className="mx-1"
                                  >
                                    Single
                                  </Button>
                                </div>
                              }
                              title="Update location"
                              trigger="hover"
                            >
                              <CiEdit
                                size={20}
                                color="blue"
                                className="me-1 cursor-pointer"
                              />
                            </Popover>
                          ) : (
                            <CiEdit
                              onClick={() => handleUpdateSingleLocation(item)}
                              size={20}
                              color="blue"
                              className="me-1 cursor-pointer"
                            />
                          )}

                          {item.isSplit ? (
                            <Popover
                              content={
                                <div className="flex justify-end">
                                  <Popconfirm
                                    placement="rightTop"
                                    title="Delete location"
                                    description="Are you sure?"
                                    onConfirm={() =>
                                      handleDeleteLocation(
                                        item.latitude,
                                        item.longitude,
                                        item.partOfDay,
                                        item.priority,
                                        item.deliveryRouteCalculationDateId,
                                      )
                                    }
                                    okText="Yes"
                                    cancelText="No"
                                  >
                                    <Button
                                      size="small"
                                      danger
                                      className="mx-1"
                                    >
                                      Split also
                                    </Button>
                                  </Popconfirm>
                                  <Popconfirm
                                    placement="rightTop"
                                    title="Delete location"
                                    description="Are you sure?"
                                    onConfirm={() =>
                                      handleDeleteSingleLocation(item.id)
                                    }
                                    okText="Yes"
                                    cancelText="No"
                                  >
                                    <Button
                                      size="small"
                                      danger
                                      className="mx-1"
                                    >
                                      Single
                                    </Button>
                                  </Popconfirm>
                                </div>
                              }
                              title="Delete location"
                              trigger="click"
                            >
                              <FaRegTrashAlt
                                color="red"
                                size={15}
                                className="me-1 cursor-pointer"
                              />
                            </Popover>
                          ) : (
                            <Popconfirm
                              placement="rightTop"
                              title="Delete location"
                              description="Are you sure?"
                              onConfirm={() =>
                                handleDeleteSingleLocation(item.id)
                              }
                              okText="Yes"
                              cancelText="No"
                            >
                              <FaRegTrashAlt
                                color="red"
                                size={15}
                                className="me-1 cursor-pointer"
                              />
                            </Popconfirm>
                          )}

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
          <div className="flex w-4/5 flex-col p-[1px] max-[1000px]:w-full">
            <div className="flex w-full overflow-x-auto pb-2">
              {getAllWarehousesRouteData.map((item: any) => (
                <div
                  key={item.id}
                  onClick={() => setCenter({ lat: item.lat, long: item.long })}
                  className="me-1 flex min-w-fit cursor-pointer items-center justify-center rounded-md border-[1px] bg-gray-50 p-1 px-2 text-sm text-black hover:bg-slate-200 dark:bg-gray-dark dark:text-white"
                >
                  {item.name}
                </div>
              ))}
            </div>
            <div className="min-h-[75vh] bg-slate-500 max-[1000px]:h-34 max-[1000px]:w-full">
              <MapRoute
                locations={dataLocations || []}
                center={center}
                onClickMarker={handleMarkerClick}
                clickedMarker={assign}
              />
            </div>
          </div>
        </div>
      </div>
      <Drawer
        title="Location Details"
        onClose={handleCloseLocationDrawer}
        open={openLocationDrawer}
      >
        <div className="px-4">
          <div className="mb-2 flex items-center">
            <FaRegEye
              color="blue"
              size={18}
              className="me-2 cursor-pointer"
              onClick={() => viewLocationMap(locationItem?.phone || "")}
            />
            <h2 className="text-xl">{locationItem?.locationName}</h2>
          </div>
          <div className="flex items-center justify-between">
            <div className="h-[1px] w-[40%] bg-slate-400"></div>
            <div className="flex w-[20%] items-center justify-center">Item</div>
            <div className="h-[1px] w-[40%] bg-slate-400"></div>
          </div>
          <div className="flex flex-col">
            {locationItem?.Requirement?.map((item) => (
              <div
                key={item.id}
                className="m-1 flex w-full items-center hover:bg-slate-100"
              >
                <p className="me-2 text-sm text-gray-500">
                  {item.caseSize.name}:
                </p>
                <p className="font-medium">{item.amount}</p>
              </div>
            ))}
          </div>
          <div className="mt-5 flex items-center justify-between">
            <div className="h-[1px] w-[35%] bg-slate-400"></div>
            <div className="flex w-[30%] items-center justify-center">
              Inforamtion
            </div>
            <div className="h-[1px] w-[35%] bg-slate-400"></div>
          </div>
          <div className="flex flex-col">
            {[
              { label: "SE", value: locationItem?.se },
              { label: "Phone", value: locationItem?.phone },
              { label: "Truck Size", value: locationItem?.truckSize?.name },
              {
                label: "Capacity",
                value: `${locationItem?.capacity?.toFixed(3)} m³`,
              },
              { label: "Part of Day", value: locationItem?.partOfDay },
              { label: "Priority", value: locationItem?.priority },
              { label: "Zone", value: locationItem?.zone?.name },
              { label: "Payment Term", value: locationItem?.paymentTerm },
              { label: "Delivery Date", value: locationItem?.deliveryDate },
              {
                label: "Assigned",
                value: locationItem?.isAssign ? "Yes" : "No",
              },
              {
                label: "Truck Size Cubic Capacity",
                value: `${locationItem?.truckSize?.containerCubic} m³`,
              },
              { label: "Latitude", value: locationItem?.latitude },
              { label: "Longitude", value: locationItem?.longitude },
              { label: "Document Type", value: locationItem?.documentType },
              { label: "Document Number", value: locationItem?.documentNumber },
              { label: "Document Date", value: locationItem?.documentDate },
              { label: "SLA", value: locationItem?.sla },
              { label: "Upload Time", value: locationItem?.uploaddTime },
              { label: "Home No", value: locationItem?.homeNo },
              { label: "Street No", value: locationItem?.streetNo },
              { label: "Village", value: locationItem?.village },
              { label: "Sangkat", value: locationItem?.sangkat },
              { label: "Khan", value: locationItem?.khan },
              { label: "Hot Spot", value: locationItem?.hotSpot },
              { label: "Direction", value: locationItem?.direction },
              { label: "Area", value: locationItem?.area },
              { label: "Region", value: locationItem?.region },
              { label: "Division", value: locationItem?.division },
              { label: "Comments", value: locationItem?.comments },
            ].map(({ label, value }) => (
              <div
                key={label}
                className="m-1 flex w-full items-center hover:bg-slate-100"
              >
                <p className="me-2 text-sm text-gray-500">{label}:</p>
                <p className="font-medium">{value}</p>
              </div>
            ))}
          </div>
        </div>
      </Drawer>

      <Drawer
        title="Truck Information"
        onClose={handleCloseTruckDrawer}
        open={openTruckDrawer}
      >
        <div className="px-4">
          <div className="flex items-center justify-between">
            <div className="h-[1px] w-[40%] bg-slate-400"></div>
            <div className="flex w-[20%] items-center justify-center">
              Dilivery
            </div>
            <div className="h-[1px] w-[40%] bg-slate-400"></div>
          </div>
          <div className="flex flex-col">
            {[
              { label: "MORNING" },
              { label: "AFTERNOON" },
              { label: "EVENING" },
              { label: "NIGHT" },
            ].map((item) => {
              let opt = item.label;
              return (
                <div
                  key={opt}
                  className="m-1 flex w-full items-center hover:bg-slate-100"
                >
                  <p className="me-2 text-sm text-gray-500">{opt}:</p>
                  <p className="font-medium">
                    {truckItem?.partOfDays?.[opt]?.total_capacity.toFixed(3) ||
                      0}{" "}
                    m³
                    <span className="me-1">, </span>
                    <span className="me-1">
                      {truckItem?.partOfDays?.[opt]?.number_of_delivery || 0}
                    </span>
                    Locations
                  </p>
                </div>
              );
            })}
          </div>

          <div className="mt-5 flex items-center justify-between">
            <div className="h-[1px] w-[35%] bg-slate-400"></div>
            <div className="flex w-[30%] items-center justify-center">
              Inforamtion
            </div>
            <div className="h-[1px] w-[35%] bg-slate-400"></div>
          </div>
          <div className="flex flex-col">
            {[
              { label: "License Plate", value: truckItem?.licensePlate },
              { label: "Model", value: truckItem?.model },
              { label: "Manufacturer", value: truckItem?.manufacturer },
              { label: "Functioning", value: truckItem?.functioning },
              { label: "Status", value: truckItem?.status },
              { label: "Truck Size", value: truckItem?.truckSize?.name },
              { label: "Fuel Type", value: truckItem?.fuel?.name },
              {
                label: "Zone",
                value: `${truckItem?.zone?.code} (${truckItem?.zone?.name})`,
              },
              { label: "Warehouse", value: truckItem?.warehouse?.name },
              {
                label: "Ownership Type",
                value: truckItem?.truckOwnershipType?.name,
              },
              {
                label: "Container Size (Cubic)",
                value: `${truckItem?.truckSize?.containerCubic} m³`,
              },
            ].map(({ label, value }) => (
              <div
                key={label}
                className="m-1 flex w-full items-center hover:bg-slate-100"
              >
                <p className="me-2 text-sm text-gray-500">{label}:</p>
                <p className="font-medium">{value}</p>
              </div>
            ))}
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
          <div className="text-slate-600">
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
      <Modal
        title={updateLocation ? "Update Location" : "Create Location"}
        style={{ top: 40 }}
        open={createModal}
        onOk={() => setCreateModal(false)}
        onCancel={handleCancelCreate}
        width={1000}
        footer={false}
        maskClosable={false}
      >
        <form onSubmit={handleSubmitCreate(onSubmitCreate)}>
          <div className="w-full">
            <div className="flex justify-between">
              <div className="m-1 w-full">
                <div className="text-slate-600">
                  Zone<span className="text-red">*</span>
                </div>
                <Controller
                  name="zoneId"
                  control={control}
                  rules={{ required: "This field is required" }}
                  render={({ field }) => (
                    <Select
                      {...field}
                      style={{ width: "100%" }}
                      placeholder="Please select"
                      onChange={(value) => field.onChange(value)}
                      options={getAllZonesData}
                      showSearch
                      filterOption={(input, option: any) =>
                        option.label.toLowerCase().includes(input.toLowerCase())
                      }
                    />
                  )}
                />
              </div>
              <div className="m-1 w-full">
                <div className="text-slate-600">
                  TruckSize<span className="text-red">*</span>
                </div>
                <Controller
                  name="truckSizeId"
                  control={control}
                  rules={{ required: "This field is required" }}
                  render={({ field }) => (
                    <Select
                      {...field}
                      disabled={updateLocation && !updateCap}
                      style={{ width: "100%" }}
                      placeholder="Please select"
                      onChange={(value) => field.onChange(value)}
                      options={getAllTruckSizesData}
                      showSearch
                      filterOption={(input, option: any) =>
                        option.label.toLowerCase().includes(input.toLowerCase())
                      }
                    />
                  )}
                />
              </div>
              <div className="m-1 w-full">
                <div className="text-slate-600">
                  PartOfDay<span className="text-red">*</span>
                </div>
                <Controller
                  name="partOfDay"
                  control={control}
                  rules={{ required: "This field is required" }}
                  render={({ field }) => (
                    <Select
                      {...field}
                      style={{ width: "100%" }}
                      placeholder="Please select"
                      onChange={(value) => field.onChange(value)}
                      options={[
                        { label: PartOfDay.MORNING, value: PartOfDay.MORNING },
                        {
                          label: PartOfDay.AFTERNOON,
                          value: PartOfDay.AFTERNOON,
                        },
                        { label: PartOfDay.EVENING, value: PartOfDay.EVENING },
                        { label: PartOfDay.NIGHT, value: PartOfDay.NIGHT },
                      ]}
                    />
                  )}
                />
              </div>

              <div className="m-1 w-full">
                <div className="text-slate-600">
                  Priority<span className="text-red">*</span>
                </div>
                <Controller
                  name="priority"
                  control={control}
                  rules={{ required: "This field is required" }}
                  render={({ field }) => (
                    <Select
                      {...field}
                      style={{ width: "100%" }}
                      placeholder="Please select"
                      onChange={(value) => field.onChange(value)}
                      options={[
                        { label: Priority.TRIVIAL, value: Priority.TRIVIAL },
                        { label: Priority.LOW, value: Priority.LOW },
                        { label: Priority.MEDIUM, value: Priority.MEDIUM },
                        { label: Priority.HIGH, value: Priority.HIGH },
                        { label: Priority.CRITICAL, value: Priority.CRITICAL },
                      ]}
                    />
                  )}
                />
              </div>
            </div>
            <div className="flex justify-between">
              <div className="m-1 w-full">
                <div className="text-slate-600">
                  LocationName<span className="text-red">*</span>
                </div>
                <Controller
                  name="locationName"
                  rules={{ required: "This field is required" }}
                  control={control}
                  render={({ field }) => (
                    <Input {...field} placeholder="locationName" />
                  )}
                />
              </div>
              <div className="m-1 w-full">
                <div className="text-slate-600">
                  Phone<span className="text-red">*</span>
                </div>
                <Controller
                  name="phone"
                  rules={{ required: "This field is required" }}
                  control={control}
                  render={({ field }) => (
                    <Input {...field} placeholder="Phone" />
                  )}
                />
              </div>
              <div className="m-1 w-full">
                <div className="text-slate-600">
                  SE<span className="text-red">*</span>
                </div>
                <Controller
                  name="se"
                  rules={{ required: "This field is required" }}
                  control={control}
                  render={({ field }) => <Input {...field} placeholder="se" />}
                />
              </div>
              <div className="m-1 w-full">
                <div className="text-slate-600">
                  Payment<span className="text-red">*</span>
                </div>
                <Controller
                  name="paymentTerm"
                  rules={{ required: "This field is required" }}
                  control={control}
                  render={({ field }) => (
                    <Input {...field} placeholder="paymentTerm" />
                  )}
                />
              </div>
            </div>
            <div className="flex justify-between">
              <div className="m-1 w-full">
                <div className="text-slate-600">
                  Latitude<span className="text-red">*</span>
                </div>
                <Controller
                  name="latitude"
                  rules={{ required: "This field is required" }}
                  control={control}
                  render={({ field }) => (
                    <InputNumber
                      {...field}
                      placeholder="latitude"
                      className="w-full"
                    />
                  )}
                />
              </div>
              <div className="m-1 w-full">
                <div className="text-slate-600">
                  Longitude<span className="text-red">*</span>
                </div>
                <Controller
                  name="longitude"
                  rules={{ required: "This field is required" }}
                  control={control}
                  render={({ field }) => (
                    <InputNumber
                      {...field}
                      placeholder="longitude"
                      className="w-full"
                    />
                  )}
                />
              </div>
              <div className="m-1 w-full">
                <div className="text-slate-600">
                  Date<span className="text-red">*</span>
                </div>
                <Controller
                  name="deliveryDate"
                  rules={{ required: "This field is required" }}
                  control={control}
                  render={({ field }) => (
                    <Input {...field} placeholder="deliveryDate" />
                  )}
                />
              </div>
              <div className="m-1 w-full">
                <div className="text-slate-600">
                  Comments<span className="text-red"></span>
                </div>
                <Controller
                  name="comments"
                  control={control}
                  render={({ field }) => (
                    <Input {...field} placeholder="comments" />
                  )}
                />
              </div>
            </div>
            <div className="flex justify-between">
              <div className="m-1 w-full">
                <div className="text-slate-600">
                  DocumentType<span className="text-red"></span>
                </div>
                <Controller
                  name="documentType"
                  control={control}
                  render={({ field }) => (
                    <Input {...field} placeholder="documentType" />
                  )}
                />
              </div>
              <div className="m-1 w-full">
                <div className="text-slate-600">
                  DocumentNumber<span className="text-red"></span>
                </div>
                <Controller
                  name="documentNumber"
                  control={control}
                  render={({ field }) => (
                    <Input {...field} placeholder="documentNumber" />
                  )}
                />
              </div>
              <div className="m-1 w-full">
                <div className="text-slate-600">
                  DocumentDate<span className="text-red"></span>
                </div>
                <Controller
                  name="documentDate"
                  control={control}
                  render={({ field }) => (
                    <Input {...field} placeholder="documentDate" />
                  )}
                />
              </div>
              <div className="m-1 w-full">
                <div className="text-slate-600">
                  SLA<span className="text-red"></span>
                </div>
                <Controller
                  name="sla"
                  control={control}
                  render={({ field }) => <Input {...field} placeholder="sla" />}
                />
              </div>
            </div>
            <div className="flex justify-between">
              <div className="m-1 w-full">
                <div className="text-slate-600">
                  UploadedTime<span className="text-red"></span>
                </div>
                <Controller
                  name="uploaddTime"
                  control={control}
                  render={({ field }) => (
                    <Input {...field} placeholder="uploaddTime" />
                  )}
                />
              </div>
              <div className="m-1 w-full">
                <div className="text-slate-600">
                  HomeNo<span className="text-red"></span>
                </div>
                <Controller
                  name="homeNo"
                  control={control}
                  render={({ field }) => (
                    <Input {...field} placeholder="homeNo" />
                  )}
                />
              </div>
              <div className="m-1 w-full">
                <div className="text-slate-600">
                  StreetNo<span className="text-red"></span>
                </div>
                <Controller
                  name="streetNo"
                  control={control}
                  render={({ field }) => (
                    <Input {...field} placeholder="streetNo" />
                  )}
                />
              </div>
              <div className="m-1 w-full">
                <div className="text-slate-600">
                  Village<span className="text-red"></span>
                </div>
                <Controller
                  name="village"
                  control={control}
                  render={({ field }) => (
                    <Input {...field} placeholder="village" />
                  )}
                />
              </div>
            </div>
            <div className="flex justify-between">
              <div className="m-1 w-full">
                <div className="text-slate-600">
                  Sangkat<span className="text-red"></span>
                </div>
                <Controller
                  name="sangkat"
                  control={control}
                  render={({ field }) => (
                    <Input {...field} placeholder="sangkat" />
                  )}
                />
              </div>
              <div className="m-1 w-full">
                <div className="text-slate-600">
                  Khan<span className="text-red"></span>
                </div>
                <Controller
                  name="khan"
                  control={control}
                  render={({ field }) => (
                    <Input {...field} placeholder="khan" />
                  )}
                />
              </div>
              <div className="m-1 w-full">
                <div className="text-slate-600">
                  HotSpot<span className="text-red"></span>
                </div>
                <Controller
                  name="hotSpot"
                  control={control}
                  render={({ field }) => (
                    <Input {...field} placeholder="hotSpot" />
                  )}
                />
              </div>
              <div className="m-1 w-full">
                <div className="text-slate-600">
                  Direction<span className="text-red"></span>
                </div>
                <Controller
                  name="direction"
                  control={control}
                  render={({ field }) => (
                    <Input {...field} placeholder="direction" />
                  )}
                />
              </div>
            </div>
            <div className="flex justify-between">
              <div className="m-1 w-full">
                <div className="text-slate-600">
                  Area<span className="text-red"></span>
                </div>
                <Controller
                  name="area"
                  control={control}
                  render={({ field }) => (
                    <Input {...field} placeholder="area" />
                  )}
                />
              </div>
              <div className="m-1 w-full">
                <div className="text-slate-600">
                  Region<span className="text-red"></span>
                </div>
                <Controller
                  name="region"
                  control={control}
                  render={({ field }) => (
                    <Input {...field} placeholder="region" />
                  )}
                />
              </div>
              <div className="m-1 w-full">
                <div className="text-slate-600">
                  Division<span className="text-red"></span>
                </div>
                <Controller
                  name="division"
                  control={control}
                  render={({ field }) => (
                    <Input {...field} placeholder="division" />
                  )}
                />
              </div>
              <div className="m-1 w-full">
                <div className="text-slate-600">
                  Other<span className="text-red"></span>
                </div>
                <Input placeholder="Other" disabled={true} />
              </div>
            </div>
            {updateLocation && !updateCap ? (
              <div className="mt-1 flex">
                <MdOutlineCheckBoxOutlineBlank
                  size={20}
                  color="blue"
                  onClick={() => handleUpdateCap()}
                />
                Update Capacity
              </div>
            ) : (
              ""
            )}
            {!updateLocation || updateCap ? (
              <div>
                {getAllCaseNamesData.map((item: any) => (
                  <div key={item.name} className="m-1 w-full">
                    <div className="m-1 w-full">
                      <div className="text-slate-600">
                        {item.name}
                        <span className="text-red"></span>
                      </div>
                      <InputNumber
                        placeholder={item.name}
                        className="w-full"
                        value={inputValues[item.name]} // Controlled input
                        onChange={(value) =>
                          handleInputChange(item.name, value)
                        } // Handle change
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              ""
            )}
            <div className="flex w-full items-center justify-end">
              <div
                onClick={() => handleCancelCreate()}
                className="me-1 mt-5 cursor-pointer rounded-md bg-blue-400 px-4 py-2 text-white"
              >
                Cancel
              </div>
              <button
                type="submit"
                className="me-1 mt-5 rounded-md bg-primary px-4 py-2 text-white"
                disabled={isPendingCreate}
              >
                {updateLocation ? "Update" : "Create"}
              </button>
            </div>
          </div>
        </form>
      </Modal>
    </section>
  );
};

export default EachRouteComponent;
