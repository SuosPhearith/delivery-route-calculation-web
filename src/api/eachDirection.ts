import apiRequest from "@/services/apiRequest";

// Define the Direction interface
export interface Direction {
  id: number;
  route: string;
  lat: number;
  long: number;
  name: string;
  status: string;
  type: string;
  groupDirectionId: number;
}

// Define the Route interface
export interface Route {
  route: string;
  directions: Direction[];
}

// Function to calculate the sum of lat from all directions in all routes
export const sumOfLatFromAllDirections = (routes: Route[]): number => {
  let totalLat = 0;
  routes.forEach((route) => {
    totalLat += route.directions.length;
  });

  return totalLat;
};

export const getEachDirection = async (id: number): Promise<Route[]> => {
  try {
    const res = await apiRequest("GET", `/direction/${id}`);
    return res;
  } catch (error) {
    throw error;
  }
};
