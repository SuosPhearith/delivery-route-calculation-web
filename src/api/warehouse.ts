import apiRequest from "@/services/apiRequest";

export interface ResponseAll {
  data: Warehouse[];
  totalCount: number;
  totalPages: number;
  page: number;
  limit: number;
}

export interface Warehouse {
  id?: number;
  name: string;
  lat: number;
  long: number;
  information: string;
  _count?: TotalTrucks;
}

export interface TotalTrucks {
  Truck: string;
}

export const getAllWarehouse = async (
  page: number,
  limit: number,
  query: string,
): Promise<ResponseAll> => {
  try {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    if (query) {
      params.append("query", query);
    }

    const res = await apiRequest("GET", `/warehouse?${params.toString()}`);
    return res;
  } catch (error) {
    throw error;
  }
};

export const createWarehouse = async (data: Warehouse) => {
  try {
    const { name, lat, long, information } = data;
    return await apiRequest("POST", "/warehouse", {
      name,
      lat: +lat,
      long: +long,
      information,
    });
  } catch (error) {
    throw error;
  }
};

export const deleteWarehouse = async (id: number) => {
  try {
    const res = await apiRequest("DELETE", `/warehouse/${id}`);
    return res;
  } catch (error) {
    throw error;
  }
};

export const updateWarehouse = async (data: Warehouse) => {
  try {
    const { name, lat, long, information } = data;
    const res = await apiRequest("PATCH", `/warehouse/${data.id}`, {
      name,
      lat: +lat,
      long: +long,
      information,
    });
    return res;
  } catch (error) {
    throw error;
  }
};
