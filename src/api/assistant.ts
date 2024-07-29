import apiRequest from "@/services/apiRequest";

// Define the status interface with string literal types
export const StatusInterface = {
  ACTIVE: "ACTIVE",
  PENDING: "PENDING",
  INACTIVE: "INACTIVE",
} as const;

export type Status = keyof typeof StatusInterface;

export interface ResponseAll {
  data: DriverResponse[];
  totalCount: number;
  totalPages: number;
  page: number;
  limit: number;
}

export interface DriverResponse {
  id: number;
  name: string;
  email: string;
  status: Status;
}

export const getAllAssistant = async (
  page: number,
  limit: number,
  status: Status | "",
  query: string,
): Promise<ResponseAll> => {
  try {
    // Create a query string based on provided parameters
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    if (status) {
      params.append("status", status);
    }

    if (query) {
      params.append("query", query);
    }

    const res = await apiRequest("GET", `/assistant?${params.toString()}`);
    return res;
  } catch (error) {
    throw error;
  }
};
