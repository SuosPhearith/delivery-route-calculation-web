import apiRequest from "@/services/apiRequest";

export interface ResponseAll {
  data: DRCDate[];
  totalCount: number;
  totalPages: number;
  page: number;
  limit: number;
}

export interface DRCDate {
  id?: number;
  date: Date;
  _count?: Count;
  GroupLocation?: object[];
}

interface Count {
  Location: number;
}

export const getAllDRCDate = async (
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

    const res = await apiRequest("GET", `/drc-date?${params.toString()}`);
    return res;
  } catch (error) {
    throw error;
  }
};

export const createDRCDate = async (data: DRCDate) => {
  console.log(data);
  try {
    const { date } = data;
    return await apiRequest("POST", "/drc-date", {
      date,
    });
  } catch (error) {
    throw error;
  }
};

export const deleteDRCDate = async (id: number) => {
  try {
    const res = await apiRequest("DELETE", `/drc-date/${id}`);
    return res;
  } catch (error) {
    throw error;
  }
};
