import apiRequest from "@/services/apiRequest";

export interface OwnerShip {
  id?: number;
  name: string;
  description: string;
  _count?: TotalTrucks;
}

export interface TotalTrucks {
  Truck: string;
}

export interface ResponseAll {
  data: OwnerShip[];
  totalCount: number;
  totalPages: number;
  page: number;
  limit: number;
}

export const getAllOwnerShip = async (
  page: number,
  limit: number,
): Promise<ResponseAll> => {
  try {
    const res = await apiRequest(
      "GET",
      `/truck-ownership-type?page=${page}&limit=${limit}`,
    );
    return res;
  } catch (error) {
    console.log(error);
    throw new Error("Failed to fetch containers");
  }
};

export const createOwnerShip = async (data: OwnerShip) => {
  try {
    const res = await apiRequest("POST", "/truck-ownership-type", data);
    return res;
  } catch (error) {
    throw error;
  }
};

export const deleteOwnerShip = async (id: number) => {
  try {
    const res = await apiRequest("DELETE", `/truck-ownership-type/${id}`);
    return res;
  } catch (error) {
    throw error;
  }
};

export const updateOwnerShip = async (data: OwnerShip) => {
  try {
    const { name, description } = data;
    const res = await apiRequest("PATCH", `/truck-ownership-type/${data.id}`, {
      name,
      description,
    });
    return res;
  } catch (error) {
    throw error;
  }
};
