import apiRequest from "@/services/apiRequest";

export interface Case {
  id?: number;
  name: string;
  caseLenght: number;
  caseWidth: number;
  caseHeight: number;
  caseCubic?: number;
}

export interface ResponseAll {
  data: Case[];
  totalCount: number;
  totalPages: number;
  page: number;
  limit: number;
}

export const getAllCase = async (
  page: number,
  limit: number,
): Promise<ResponseAll> => {
  try {
    const res = await apiRequest("GET", `/case?page=${page}&limit=${limit}`);
    return res;
  } catch (error) {
    console.log(error);
    throw new Error("Failed to fetch cases");
  }
};

export const createCase = async (data: Case) => {
  try {
    const res = await apiRequest("POST", "/case", data);
    return res;
  } catch (error) {
    throw error;
  }
};

export const deleteCase = async (id: number) => {
  try {
    const res = await apiRequest("DELETE", `/case/${id}`);
    return res;
  } catch (error) {
    throw error;
  }
};

export const updateCase = async (data: Case) => {
  try {
    const { name, caseHeight, caseLenght, caseWidth } = data;
    const res = await apiRequest("PATCH", `/case/${data.id}`, {
      name,
      caseLenght,
      caseWidth,
      caseHeight,
    });
    return res;
  } catch (error) {
    throw error;
  }
};
