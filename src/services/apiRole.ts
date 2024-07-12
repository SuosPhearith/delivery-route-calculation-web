import axios from "axios";

type meType = {
  roleId: number;
};
const apiRole = async () => {
  try {
    const response: any = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/me`,
      { withCredentials: true },
    );
    const data: meType = response.data;
    return data.roleId;
  } catch (error) {
    return (window.location.href = "/auth/signin");
  }
};

export default apiRole;
