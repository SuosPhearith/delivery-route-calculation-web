import apiRequest from "@/services/apiRequest";

export interface Size {
  id?: number;
  name: string;
  containerLenght: number;
  containerWidth: number;
  containerHeight: number;
  containerCubic?: number;
  default?: boolean;
  _count?: TotalTrucks;
}

export interface TotalTrucks {
  Truck: string;
}

export interface ResponseAll {
  data: Size[];
  totalCount: number;
  totalPages: number;
  page: number;
  limit: number;
}

export const getAllSize = async (
  page: number,
  limit: number,
): Promise<ResponseAll> => {
  try {
    const res = await apiRequest(
      "GET",
      `/truck-size?page=${page}&limit=${limit}`,
    );
    return res;
  } catch (error) {
    throw new Error("Failed to fetch containers");
  }
};

export const createSize = async (data: Size) => {
  try {
    const res = await apiRequest("POST", "/truck-size", data);
    return res;
  } catch (error) {
    throw error;
  }
};

export const deleteSize = async (id: number) => {
  try {
    const res = await apiRequest("DELETE", `/truck-size/${id}`);
    return res;
  } catch (error) {
    throw error;
  }
};

export const defaultSize = async (id: number) => {
  try {
    const res = await apiRequest(
      "PATCH",
      `/truck-size/${id}/set-default-truck`,
    );
    return res;
  } catch (error) {
    throw error;
  }
};

export const updateSize = async (data: Size) => {
  try {
    const { name, containerHeight, containerLenght, containerWidth } = data;
    const res = await apiRequest("PATCH", `/truck-size/${data.id}`, {
      name,
      containerLenght,
      containerWidth,
      containerHeight,
    });
    return res;
  } catch (error) {
    throw error;
  }
};
