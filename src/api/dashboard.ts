import apiRequest from "@/services/apiRequest";

export const getDashboard = async (dates: any[] | null): Promise<any> => {
  try {
    let startDateTime = "";
    let endDateTime = "";
    if (dates) {
      startDateTime = dates[0].format("YYYY-MM-DD HH:mm:ss");
      endDateTime = dates[1].format("YYYY-MM-DD HH:mm:ss");
    }
    const res = await apiRequest(
      "GET",
      `/dashboard?start=${startDateTime}&end=${endDateTime}`,
    );
    return res;
  } catch (error) {
    throw new Error("Failed to fetch cases");
  }
};

export const getChartOne = async (sort: "year" | "month"): Promise<any> => {
  try {
    const res = await apiRequest(
      "GET",
      `/dashboard/get-chart-one?sort=${sort}`,
    );
    return res;
  } catch (error) {
    throw new Error("Failed to fetch cases");
  }
};

export const getChartSix = async (sort: "year" | "month"): Promise<any> => {
  try {
    const res = await apiRequest(
      "GET",
      `/dashboard/get-chart-six?sort=${sort}`,
    );
    return res;
  } catch (error) {
    throw new Error("Failed to fetch cases");
  }
};

export const getChartThree = async (sort: "year" | "month"): Promise<any> => {
  try {
    const res = await apiRequest(
      "GET",
      `/dashboard/get-chart-three?sort=${sort}`,
    );
    console.log(res);
    return res;
  } catch (error) {
    throw new Error("Failed to fetch cases");
  }
};

export const getChartTWo = async (): Promise<any> => {
  try {
    const res = await apiRequest("GET", `/dashboard/get-chart-two`);
    return res;
  } catch (error) {
    throw new Error("Failed to fetch cases");
  }
};

export interface ChartItem {
  caseSizeId: number;
  amount: number;
  name: string;
  color: string;
}
