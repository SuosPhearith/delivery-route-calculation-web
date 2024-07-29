import apiRequest from "@/services/apiRequest";

export interface Fuel {
  id?: number;
  name: string;
  description: string;
  _count?: TotalTrucks;
}

export interface TotalTrucks {
  Truck: string;
}

export interface ResponseAll {
  data: Fuel[];
  totalCount: number;
  totalPages: number;
  page: number;
  limit: number;
}

export const getAllFuel = async (
  page: number,
  limit: number,
): Promise<ResponseAll> => {
  try {
    const res = await apiRequest("GET", `/fuel?page=${page}&limit=${limit}`);
    return res;
  } catch (error) {
    throw new Error("Failed to fetch containers");
  }
};

export const createFuel = async (data: Fuel) => {
  try {
    const res = await apiRequest("POST", "/fuel", data);
    return res;
  } catch (error) {
    throw error;
  }
};

export const deleteFuel = async (id: number) => {
  try {
    const res = await apiRequest("DELETE", `/fuel/${id}`);
    return res;
  } catch (error) {
    throw error;
  }
};

export const updateFuel = async (data: Fuel) => {
  try {
    const { name, description } = data;
    const res = await apiRequest("PATCH", `/fuel/${data.id}`, {
      name,
      description,
    });
    return res;
  } catch (error) {
    throw error;
  }
};
