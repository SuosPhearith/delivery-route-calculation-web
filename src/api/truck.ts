import apiRequest from "@/services/apiRequest";

interface Zone {
  id: number;
  code: string;
  name: string;
  truckAmount: number | null;
  description: string;
  officerControllId: number;
}

interface TruckOwnershipType {
  id: number;
  name: string;
  description: string;
}

interface Warehouse {
  id: number;
  name: string;
  lat: number;
  long: number;
  information: string;
}

interface TruckSize {
  name: string;
}

interface Fuel {
  name: string;
}

export interface Truck {
  id?: number;
  truckSizeId: number;
  fuelId: number;
  licensePlate: string;
  model: string;
  manufacturer: string;
  functioning: string;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
  zoneId: number;
  warehouseId: number;
  truckOwnershipTypeId: number;
  zone?: Zone;
  truckOwnershipType?: TruckOwnershipType;
  warehouse?: Warehouse;
  truckSize?: TruckSize;
  fuel?: Fuel;
  TruckDriver?: any[];
  TruckAssistant?: any[];
}

export interface ResponseAll {
  data: Truck[];
  totalCount: number;
  totalPages: number;
  page: number;
  limit: number;
}

export const getAllTrucks = async (
  page: number,
  limit: number,
  status: string | "",
  query: string,
  truckSizeId: string,
  zoneId: string,
  fuelId: string,
  warehouseId: string,
  truckOwnershipTypeId: string,
): Promise<ResponseAll> => {
  try {
    // Create a query string based on provided parameters
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    if (status) {
      params.append("status", status);
    }

    if (query) {
      params.append("query", query);
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

    const res = await apiRequest("GET", `/truck?${params.toString()}`);
    return res;
  } catch (error) {
    throw error;
  }
};

export const getAllTruckSizes = async () => {
  try {
    return await apiRequest("GET", "/truck/find-all-truck-sizes/select");
  } catch (error) {
    throw error;
  }
};

export const getAllTruckOwnershipTypes = async () => {
  try {
    return await apiRequest(
      "GET",
      "/truck/find-all-truck-ownership-types/select",
    );
  } catch (error) {
    throw error;
  }
};

export const getAllZones = async () => {
  try {
    return await apiRequest("GET", "/truck/find-all-zones/select");
  } catch (error) {
    throw error;
  }
};

export const getAllWarehouses = async () => {
  try {
    return await apiRequest("GET", "/truck/find-all-warehouses/select");
  } catch (error) {
    throw error;
  }
};

export const getAllTruckFuels = async () => {
  try {
    return await apiRequest("GET", "/truck/find-all-truck-fuels/select");
  } catch (error) {
    throw error;
  }
};

export const getAllTruckDrivers = async () => {
  try {
    return await apiRequest("GET", "/truck/find-all-drivers/select");
  } catch (error) {
    throw error;
  }
};

export const getAllTruckAssistants = async () => {
  try {
    return await apiRequest("GET", "/truck/find-all-assistants/select");
  } catch (error) {
    throw error;
  }
};

export const createTruck = async (data: Truck) => {
  try {
    const res = await apiRequest("POST", "/truck", {
      licensePlate: data.licensePlate,
      functioning: data.functioning,
      model: data.model,
      manufacturer: data.manufacturer,
      truckSizeId: data.truckSizeId,
      zoneId: data.zoneId,
      warehouseId: data.warehouseId,
      fuelId: data.fuelId,
      driver: data.TruckDriver,
      assistant: data.TruckAssistant,
      truckOwnershipTypeId: data.truckOwnershipTypeId,
    });
    return res;
  } catch (error) {
    throw error;
  }
};

export const deleteTruck = async (id: number) => {
  try {
    const res = await apiRequest("DELETE", `/truck/${id}`);
    return res;
  } catch (error) {
    throw error;
  }
};

export const updateTruck = async (data: Truck) => {
  try {
    console.log(data.TruckDriver);
    const res = await apiRequest("PATCH", `/truck/${data.id}`, {
      licensePlate: data.licensePlate,
      functioning: data.functioning,
      model: data.model,
      manufacturer: data.manufacturer,
      truckSizeId: data.truckSizeId,
      zoneId: data.zoneId,
      warehouseId: data.warehouseId,
      fuelId: data.fuelId,
      driver: data.TruckDriver,
      assistant: data.TruckAssistant,
      truckOwnershipTypeId: data.truckOwnershipTypeId,
    });
    return res;
  } catch (error) {
    throw error;
  }
};
