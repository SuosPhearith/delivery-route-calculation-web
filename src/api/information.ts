import apiRequest from "@/services/apiRequest";

// Interface for TruckSize
export interface TruckSize {
  id: number;
  name: string;
  containerLenght: number;
  containerWidth: number;
  containerHeight: number;
  containerCubic: number;
  default: boolean;
}

// Interface for Warehouse
export interface Warehouse {
  id: number;
  name: string;
  lat: number;
  long: number;
  information: string;
}

// Interface for TruckOwnershipType
export interface TruckOwnershipType {
  id: number;
  name: string;
  description: string;
}

// Interface for Zone
export interface Zone {
  id: number;
  code: string;
  name: string;
  truckAmount: number | null;
  description: string;
  officerControllId: number;
}

// Interface for Fuel
export interface Fuel {
  id: number;
  name: string;
  description: string;
}

// Interface for Truck
export interface Truck {
  id: number;
  truckSizeId: number;
  fuelId: number;
  licensePlate: string;
  model: string;
  manufacturer: string;
  functioning: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  zoneId: number;
  warehouseId: number;
  truckOwnershipTypeId: number;
  truckSize: TruckSize;
  warehouse: Warehouse;
  truckOwnershipType: TruckOwnershipType;
  zone: Zone;
  fuel: Fuel;
}

// Interface for Delivery
export interface Delivery {
  id: number;
  truckId: number;
  driverId: number;
  deliveryAmount: number | null;
  truck: Truck;
}

// Interface for Data Response
export interface DeliveryDataResponse {
  data: Delivery[];
}

export const getInformation = async (): Promise<DeliveryDataResponse> => {
  try {
    const data: DeliveryDataResponse = await apiRequest(
      "GET",
      "/driver-resource",
    );
    return data;
  } catch (error) {
    throw error;
  }
};
