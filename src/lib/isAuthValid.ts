import axios from "axios";
const baseUrl = process.env.NEXT_PUBLIC_API_URL;

export const isAuthValid = async (): Promise<boolean> => {
  try {
    const me = await axios.get(`${baseUrl}/auth/me`, {
      withCredentials: true,
    });
    console.log(me);
    return true;
  } catch (error) {
    // console.log(error);
    return false;
  }
};
