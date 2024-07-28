import apiRequest from "@/services/apiRequest";
import { errorResponse } from "@/types/error";

interface Case {
  id: number;
  name: string;
  caseLenght: number;
  caseWeight: number;
  caseHeight: number;
  caseCubic: number;
}

export interface CaseResponse {
  data: Case[];
  totalCount: number;
  totalPages: number;
  page: number;
  limit: number;
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
): Promise<CaseResponse> => {
  try {
    const res = await apiRequest("GET", `/case?page=${page}&limit=${limit}`);
    return res;
  } catch (error) {
    console.log(error);
    throw new Error("Failed to fetch cases");
  }
};

export interface CreateCaseInterface {
  id?: number;
  name: string;
  caseLenght: number;
  caseWeight: number;
  caseHeight: number;
}

export const createCase = async (data: CreateCaseInterface) => {
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

export const updateCase = async (data: CreateCaseInterface) => {
  try {
    const { name, caseHeight, caseLenght, caseWeight } = data;
    const res = await apiRequest("PATCH", `/case/${data.id}`, {
      name,
      caseLenght,
      caseWeight,
      caseHeight,
    });
    return res;
  } catch (error) {
    throw error;
  }
};
