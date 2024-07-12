import { errorResponse } from "@/types/error";
import axios, { Method } from "axios";
const baseUrl = process.env.NEXT_PUBLIC_API_URL;
const apiRequest = async (
  method: Method,
  url: string,
  data?: any,
  withCredentials: boolean = true,
) => {
  const endPoint = `${baseUrl}${url}`;
  try {
    const response = await axios({
      method,
      url: endPoint,
      data,
      withCredentials,
    });
    return response.data;
  } catch (error: any) {
    const errorMsg =
      (error as errorResponse)?.response?.data?.message ??
      "An unexpected error occurred";
    const errorCode =
      (error as errorResponse)?.response?.data?.statusCode ??
      "An unexpected error occurred";
    if (errorCode === 401 || errorCode === 403) {
      window.location.href = "/auth/signin";
    }
    throw errorMsg;
  }
};

export default apiRequest;
