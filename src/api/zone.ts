import apiRequest from "@/services/apiRequest";

export interface ResponseAll {
  data: Zone[];
  totalCount: number;
  totalPages: number;
  page: number;
  limit: number;
}

export interface Zone {
  id?: number;
  code?: string;
  truckAmount?: number;
  name: string;
  description: string;
  officerControllId: number;
  officerControll?: officerControll;
  Truck?: object[];
}

export interface officerControll {
  id: string;
  name: string;
  description: string;
}

export const findAllOfficerControll = async () => {
  try {
    return await apiRequest("GET", "/zone/get-all-officer-controll/select");
  } catch (error) {
    throw error;
  }
};

export const getAllZone = async (
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

    const res = await apiRequest("GET", `/zone?${params.toString()}`);
    return res;
  } catch (error) {
    throw error;
  }
};

export const createZone = async (data: Zone) => {
  console.log(data);
  try {
    const { name, description, officerControllId } = data;
    return await apiRequest("POST", "/zone", {
      name,
      description,
      officerControllId: +officerControllId,
    });
  } catch (error) {
    throw error;
  }
};

export const deleteZone = async (id: number) => {
  try {
    const res = await apiRequest("DELETE", `/zone/${id}`);
    return res;
  } catch (error) {
    throw error;
  }
};

export const updateZone = async (data: Zone) => {
  try {
    const { name, description, officerControllId } = data;
    const res = await apiRequest("PATCH", `/zone/${data.id}`, {
      name,
      description,
      officerControllId: +officerControllId,
    });
    return res;
  } catch (error) {
    throw error;
  }
};
