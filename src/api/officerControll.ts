import apiRequest from "@/services/apiRequest";

export interface ResponseAll {
  data: OfficerControll[];
  totalCount: number;
  totalPages: number;
  page: number;
  limit: number;
}

export interface OfficerControll {
  id?: number;
  name?: string;
  description: string;
  Zone?: object[];
}

export const getAllOfficerControll = async (
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

    const res = await apiRequest(
      "GET",
      `/officer-controll?${params.toString()}`,
    );
    return res;
  } catch (error) {
    throw error;
  }
};

export const createOfficerControll = async (data: OfficerControll) => {
  console.log(data);
  try {
    const { description } = data;
    return await apiRequest("POST", "/officer-controll", {
      description,
    });
  } catch (error) {
    throw error;
  }
};

export const deleteOfficerControll = async (id: number) => {
  try {
    const res = await apiRequest("DELETE", `/officer-controll/${id}`);
    return res;
  } catch (error) {
    throw error;
  }
};

export const updateOfficerControll = async (data: OfficerControll) => {
  try {
    const { description } = data;
    const res = await apiRequest("PATCH", `/officer-controll/${data.id}`, {
      description,
    });
    return res;
  } catch (error) {
    throw error;
  }
};
