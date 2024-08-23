import apiRequest from "@/services/apiRequest";
import { Moment } from "moment";

// Define the structure for a Truck object
export interface Truck {
  id: number;
  truckSizeId: number;
  fuelId: number;
  licensePlate: string;
  model: string;
  manufacturer: string;
  functioning: string;
  status: string;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  zoneId: number;
  warehouseId: number;
  truckOwnershipTypeId: number;
  truckSize?: any;
  fuel?: any;
  zone?: any;
  warehouse?: any;
  truckOwnershipType?: any;
  AssignLocationToTruck?: any[];
  partOfDays?: {
    [key: string]: {
      number_of_delivery: number;
      total_capacity: number;
    };
  } | null;
}

// Define the structure for a TruckByDate object
export interface TruckByDate {
  id: number;
  capacity: number;
  endTime: string | null; // ISO date string or null
  status: string;
  truckId: number;
  deliveryRouteCalculationDateId: number;
  truck: Truck;
  partOfDays?: {
    [key: string]: {
      number_of_delivery: number;
      total_capacity: number;
    };
  } | null;
  AssignLocationToTruck?: any[];
}

export const getAllTrucksByDate = async (
  deliveryRouteCalculationDateId: number, // Add this parameter to specify the date
  status: string = "",
  query: string = "",
  truckSizeId: string = "",
  zoneId: string = "",
  fuelId: string = "",
  warehouseId: string = "",
  truckOwnershipTypeId: string = "",
): Promise<TruckByDate[]> => {
  try {
    // Create a query string based on provided parameters
    const params = new URLSearchParams({
      deliveryRouteCalculationDateId: deliveryRouteCalculationDateId.toString(), // Ensure this is included in the query
    });

    if (status) {
      params.append("status", status);
    }

    if (query) {
      params.append("licensePlate", query);
    }

    if (truckSizeId) {
      params.append("truckSizeId", truckSizeId);
    }

    if (zoneId) {
      params.append("zoneId", zoneId);
    }

    if (fuelId) {
      params.append("fuelId", fuelId);
    }

    if (warehouseId) {
      params.append("warehouseId", warehouseId);
    }

    if (truckOwnershipTypeId) {
      params.append("truckOwnershipTypeId", truckOwnershipTypeId);
    }

    // Make the API request to the truck-by-date endpoint
    const res = await apiRequest(
      "GET",
      `/drc-date/get-all-trucks/route?${params.toString()}`,
    );
    return res;
  } catch (error) {
    throw error;
  }
};

// Define the structure for a Location object
export interface Location {
  id: number;
  zoneId?: number;
  truckSizeId?: number;
  documentType: string;
  documentNumber: string;
  documentDate: string;
  sla: string;
  uploaddTime: string; // ISO date string
  latitude: number;
  longitude: number;
  locationName: string;
  phone: string;
  se: string;
  homeNo?: string;
  streetNo?: string;
  village?: string;
  sangkat?: string;
  khan?: string;
  hotSpot?: string;
  direction?: string;
  area?: string;
  region?: string;
  division?: string;
  deliveryDate: string; // ISO date string
  paymentTerm?: string;
  comments?: string;
  priority: string; // Assuming it's an enum-like string
  partOfDay: string; // Assuming it's an enum-like string
  capacity?: number;
  isAssign: boolean;
  deliveryRouteCalculationDateId: number;
  zone: any;
  truckSize: any;
  isSplit?: boolean;
  code?: string;
  Requirement?: any[];
}

export const getAllLocations = async (
  deliveryRouteCalculationDateId: number, // Required parameter
  zoneId: string = "",
  truckSizeId: string = "",
  partOfDay: string = "",
  priority: string = "",
  capacity?: number, // Optional parameter
  query: string = "",
  isAssign: string = "",
  truckByDateId: string = "",
): Promise<Location[]> => {
  try {
    // Create a query string based on provided parameters
    const params = new URLSearchParams({
      deliveryRouteCalculationDateId: deliveryRouteCalculationDateId.toString(), // Ensure this is included in the query
    });

    if (zoneId) {
      params.append("zoneId", zoneId);
    }

    if (truckSizeId) {
      params.append("truckSizeId", truckSizeId);
    }

    if (partOfDay) {
      params.append("partOfDay", partOfDay);
    }

    if (priority) {
      params.append("priority", priority);
    }

    if (capacity !== undefined) {
      params.append("capacity", capacity.toString());
    }

    if (isAssign) {
      params.append("isAssign", isAssign);
    }
    if (truckByDateId) {
      params.append("truckByDateId", truckByDateId);
    }

    if (query) {
      params.append("query", query); // For search by phone or se
    }

    // Make the API request to the get-all-locations endpoint
    const res = await apiRequest(
      "GET",
      `/drc-date/get-all-locations/route?${params.toString()}`,
    );
    return res;
  } catch (error) {
    throw error;
  }
};

export const getAllZonesRoute = async (id: number) => {
  try {
    return await apiRequest("GET", `/drc-date/get-all-zones/route/${id}`);
  } catch (error) {
    throw error;
  }
};

export interface AssignTruck {
  truckByDateId: number;
  deliveryRouteCalculationDateIds: number[];
  DeliveryRouteCalculationDateId: number;
}

export const assignTruck = async (params: AssignTruck) => {
  const {
    truckByDateId,
    deliveryRouteCalculationDateIds,
    DeliveryRouteCalculationDateId,
  } = params;

  try {
    return await apiRequest(
      "POST",
      `/drc-date/assign-locations-truck/route/${DeliveryRouteCalculationDateId}`,
      {
        truckByDateId: +truckByDateId,
        deliveryRouteCalculationDateIds,
      },
    );
  } catch (error) {
    throw error;
  }
};

export interface UnassignTruck {
  locationIds: number[];
  DeliveryRouteCalculationDateId: number;
}

export const unassignTruck = async (params: UnassignTruck) => {
  const { locationIds, DeliveryRouteCalculationDateId } = params;

  try {
    return await apiRequest(
      "DELETE",
      `/drc-date/unassign-locations-truck/route/${DeliveryRouteCalculationDateId}`,
      {
        locationIds,
      },
    );
  } catch (error) {
    throw error;
  }
};

export interface CreateDrc {
  DeliveryRouteCalculationDateId?: number;
  file: any;
}

export const createDrc = async (data: CreateDrc) => {
  try {
    const { file, DeliveryRouteCalculationDateId } = data;

    console.log(file);

    // Create FormData object and append data
    const formData = new FormData();
    formData.append("file", file[0]);

    // Make API request with FormData
    return await apiRequest(
      "POST",
      `/drc-date/create-drc/${DeliveryRouteCalculationDateId}`,
      formData,
    );
  } catch (error) {
    throw error;
  }
};

export interface DeleteLocation {
  deliveryRouteCalculationDateId: number;
  latitude: number;
  longitude: number;
  partOfDay: string;
  priority: string;
}

export const deleteLocation = async (data: DeleteLocation) => {
  try {
    // Destructur
    const {
      deliveryRouteCalculationDateId,
      latitude,
      longitude,
      partOfDay,
      priority,
    } = data;
    // Make API request with FormData
    const response = await apiRequest(
      "DELETE",
      `/drc-date/delete-locations-drc/route`,
      {
        deliveryRouteCalculationDateId,
        latitude,
        longitude,
        partOfDay,
        priority,
      },
    );
    return response;
  } catch (error) {
    throw error;
  }
};

export interface UpdatePartOfDay {
  id: number;
  partOfDay: string;
}
export const updateLocationPartOfDay = async (data: UpdatePartOfDay) => {
  try {
    // Destructur
    const { partOfDay, id } = data;
    // Make API request with FormData
    const response = await apiRequest(
      "PATCH",
      `/drc-date/update-location-part-of-day/${id}`,
      {
        partOfDay,
      },
    );
    return response;
  } catch (error) {
    throw error;
  }
};

export const getAllWarehousesRoute = async () => {
  try {
    return await apiRequest("GET", "/drc-date/get-all-warehouses/route");
  } catch (error) {
    throw error;
  }
};

export const getAllCaseNames = async () => {
  try {
    return await apiRequest("GET", "/drc-date/get-all-case-name/route");
  } catch (error) {
    throw error;
  }
};

export enum Priority {
  CRITICAL = "CRITICAL",
  HIGH = "HIGH",
  MEDIUM = "MEDIUM",
  LOW = "LOW",
  TRIVIAL = "TRIVIAL",
}

export enum PartOfDay {
  MORNING = "MORNING", // 5am - 12pm
  AFTERNOON = "AFTERNOON", // 12pm - 5pm
  EVENING = "EVENING", // 5pm - 9pm
  NIGHT = "NIGHT", // 9pm - 5am
}

enum Flag {
  INF = "INF", // information_change
  CAP = "CAP", // capacity_change
  DEL = "DEL", // delete
}

export interface LocationCreate {
  id: number;
  zoneId?: number;
  truckSizeId?: number;
  documentType?: string;
  documentNumber?: string;
  documentDate?: string;
  sla?: string;
  uploaddTime?: string;
  latitude: number;
  longitude: number;
  locationName: string;
  phone: string;
  se: string;
  homeNo?: string;
  streetNo?: string;
  village?: string;
  sangkat?: string;
  khan?: string;
  hotSpot?: string;
  direction?: string;
  area?: string;
  region?: string;
  division?: string;
  deliveryDate: string;
  paymentTerm?: string;
  comments?: string;
  flag?: Flag;
  code?: string;
  priority: Priority;
  partOfDay: PartOfDay;
  deliveryRouteCalculationDateId: number;
  capacity?: number;
  isAssign: boolean;
}

export const createNewLocation = async (data: LocationCreate) => {
  try {
    // Make API request with FormData
    const response = await apiRequest(
      "POST",
      `/drc-date/create-single-location/route/${data.id}`,
      {
        ...data,
      },
    );
    return response;
  } catch (error) {
    throw error;
  }
};

export const updateNewLocation = async (data: LocationCreate) => {
  try {
    // Make API request with FormData
    const response = await apiRequest(
      "PATCH",
      `/drc-date/update-single-location/route/${data.id}`,
      {
        ...data,
      },
    );
    return response;
  } catch (error) {
    throw error;
  }
};

export const updateCapNewLocation = async (data: LocationCreate) => {
  try {
    // Make API request with FormData
    const response = await apiRequest(
      "PATCH",
      `/drc-date/update-cap-single-location/route/${data.id}`,
      {
        ...data,
      },
    );
    return response;
  } catch (error) {
    throw error;
  }
};
