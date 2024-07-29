import React from "react";

const Skeleton = () => {
  return (
    <div>
      <div className="flex h-[40px] w-full animate-pulse flex-col justify-center rounded-md bg-gray-200">
        <div className="my-[2px] ms-[20px] h-2 w-[20%] rounded-sm bg-gray-300"></div>
        <div className="my-[2px] ms-[20px] h-2 w-[25%] rounded-sm bg-gray-300"></div>
      </div>
      <div className="mt-3 h-[60vh] w-full animate-pulse rounded-md bg-gray-200 pt-4">
        <div className="my-[5px] ms-[20px] h-3 w-[20%] rounded-sm bg-gray-300"></div>
        <div className="my-[5px] ms-[20px] h-3 w-[30%] rounded-sm bg-gray-300"></div>
        <div className="my-[5px] ms-[20px] h-3 w-[40%] rounded-sm bg-gray-300"></div>
        <div className="my-[5px] ms-[20px] h-3 w-[25%] rounded-sm bg-gray-300"></div>
      </div>
    </div>
  );
};

export default Skeleton;