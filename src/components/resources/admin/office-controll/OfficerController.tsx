"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Input, message, Modal, notification, Popconfirm } from "antd";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { FaRegEdit } from "react-icons/fa";
import { FaRegTrashCan, FaRegEye } from "react-icons/fa6";
import {
  LuArrowLeft,
  LuArrowRight,
  LuPlusCircle,
  LuSearch,
  LuUploadCloud,
} from "react-icons/lu";
import Skeleton from "../../components/Skeleton";
import Link from "next/link";
import { SubmitHandler, useForm } from "react-hook-form";
import {
  createOfficerControll,
  deleteOfficerControll,
  getAllOfficerControll,
  OfficerControll,
  ResponseAll,
  updateOfficerControll,
} from "@/api/officerControll";
import { RiMapPinLine } from "react-icons/ri";
import TableSeleton from "../../components/TableSeleton";

const OfficerController = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedPage = Number(searchParams.get("page")) || 1;
  const selectedLimit = Number(searchParams.get("limit")) || 10;
  const selectedQuery = searchParams.get("query") || "";
  const [page, setPage] = useState(selectedPage);
  const [limit, setLimit] = useState(selectedLimit);
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState(selectedQuery);
  const queryClient = useQueryClient();
  const [api, contextHolder] = notification.useNotification();

  const openNotification = (
    message: string = "Default",
    description: string = "Successfully",
  ) => {
    api.success({
      message,
      description,
      duration: 3,
      placement: "bottomLeft",
    });
  };

  // create or update
  const [updateId, setUpdateId] = useState<number>();
  const handleEdit = (item: OfficerControll) => {
    reset();
    setValue("description", item.description);
    showModal();
    setUpdateId(item.id);
  };
  const { mutateAsync: createMutaion, isPending: isPendingCreate } =
    useMutation({
      mutationFn: createOfficerControll,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["officerControll"] });
        // message.success("Officer controll created successfully");
        openNotification(
          "Create Officer Controll",
          "Officer Controll Created successfully",
        );
        handleCancel();
      },
      onError: (error: any) => {
        message.error(error);
      },
    });
  const { mutateAsync: updateMutate, isPending: isPendingUpdate } = useMutation(
    {
      mutationFn: updateOfficerControll,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["officerControll"] });
        // message.success("Officer controll updated successfully");
        openNotification(
          "Update Officer Controll",
          "Officer Controll Updated successfully",
        );
        handleCancel();
      },
      onError: (error: any) => {
        message.error(error);
      },
    },
  );
  const onSubmit: SubmitHandler<OfficerControll> = async (data) => {
    if (updateId) {
      const officerControllData: OfficerControll = {
        id: updateId,
        description: data.description,
      };

      await updateMutate(officerControllData);
    } else {
      const officerControllData: OfficerControll = {
        description: data.description,
      };

      await createMutaion(officerControllData);
    }
  };
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setValue,
  } = useForm<OfficerControll>();
  // end create or update

  //modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setUpdateId(NaN);
    setIsModalOpen(false);
    reset();
  };
  // end modal

  // delete
  const { mutateAsync: deleteMutate, isPending: isPendingDelete } = useMutation(
    {
      mutationFn: deleteOfficerControll,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["officerControll"] });
        // message.success("Case deleted successfully");
        openNotification(
          "Delete Officer Controll",
          "Officer Controll Deleted successfully",
        );
      },
      onError: (error: any) => {
        message.error(error);
      },
    },
  );
  const handleDelete = async (id: number) => {
    await deleteMutate(id);
  };
  // end delete

  //fectch
  const { data, isLoading, isError } = useQuery<ResponseAll>({
    queryKey: ["officerControll", page, limit, query],
    queryFn: () => getAllOfficerControll(page, limit, query),
  });

  useEffect(() => {
    setPage(selectedPage);
    setLimit(selectedLimit);
  }, [selectedPage, selectedLimit]);

  // if (isLoading) {
  //   return <Skeleton />;
  // }
  if (isError) {
    return <div>Something happened</div>;
  }

  const handlePageSizeChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    const newSize = Number(event.target.value);
    setLimit(newSize);
    router.push(`?page=1&limit=${newSize}`);
  };
  const handleSearch = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      setQuery(search);
      router.push("controll");
    }
  };
  const handleChangeSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearch(value);
    if (value.trim() === "") {
      setQuery("");
      router.push("controll");
    }
  };
  // end fectch

  return (
    <section className="container mx-auto px-1">
      {contextHolder}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-x-3">
            <h2 className="text-lg font-medium text-gray-800 dark:text-white">
              Officer Controll
            </h2>
            <span className="rounded-full bg-blue-100 px-3 py-1 text-xs text-blue-600 dark:bg-gray-800 dark:text-blue-400">
              {data?.totalCount} Officer Controlls
            </span>
          </div>
        </div>
        <div
          title="Create"
          className="flex cursor-pointer justify-center rounded-md bg-primary p-1"
        >
          <LuPlusCircle color="white" size={20} onClick={showModal} />
        </div>
      </div>
      <div className=" md:flex md:items-center md:justify-end">
        <div className="flex flex-col">
          <p className="me-1 text-xs">.</p>
          <Input
            className="w-[250px] max-[770px]:w-full"
            prefix={<LuSearch />}
            onChange={handleChangeSearch}
            value={search ? search : query}
            onKeyDown={handleSearch}
            type="text"
            placeholder="Search"
          />
        </div>
      </div>
      {isLoading ? (
        <div>
          <TableSeleton />
        </div>
      ) : (
        <div className="mt-3 flex flex-col">
          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
              <div className="overflow-hidden border border-gray-200 dark:border-gray-700 md:rounded-md">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-800">
                    <tr>
                      <th
                        scope="col"
                        className="px-4 py-3 text-left text-sm font-normal text-gray-500 dark:text-gray-400 rtl:text-right"
                      >
                        <button className="flex items-center gap-x-3 focus:outline-none">
                          NO.
                        </button>
                      </th>
                      <th
                        scope="col"
                        className="px-4 py-3 text-left text-sm font-normal text-gray-500 dark:text-gray-400 rtl:text-right"
                      >
                        Name
                      </th>
                      <th
                        scope="col"
                        className="px-4 py-3 text-left text-sm font-normal text-gray-500 dark:text-gray-400 rtl:text-right"
                      >
                        Description
                      </th>
                      <th
                        scope="col"
                        className="px-4 py-3 text-left text-sm font-normal text-gray-500 dark:text-gray-400 rtl:text-right"
                      >
                        Zones Controll
                      </th>
                      <th
                        scope="col"
                        className="px-4 py-3 text-left text-sm font-normal text-gray-500 dark:text-gray-400 rtl:text-right"
                      >
                        Action
                      </th>
                    </tr>
                  </thead>
                  {data?.data.map((item, index) => (
                    <tbody
                      className="divide-y divide-gray-200 bg-white hover:bg-slate-100 dark:divide-gray-700 dark:bg-gray-900"
                      key={item.id}
                    >
                      <tr>
                        <td className="whitespace-nowrap px-4 py-3 text-sm">
                          <h4 className="text-black dark:text-gray-200">
                            {(page - 1) * limit + index + 1}
                          </h4>
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-sm">
                          <h4 className="text-black dark:text-gray-200">
                            {item.name}
                          </h4>
                        </td>

                        <td className="whitespace-nowrap px-4 py-3 text-sm">
                          <h4 className="... w-[300px] truncate text-black dark:text-gray-200">
                            {item.description}
                          </h4>
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-sm">
                          <h4 className="flex items-center text-black dark:text-gray-200">
                            <span className="me-2">{item.Zone?.length}</span>
                            <RiMapPinLine />
                          </h4>
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-sm">
                          <h4 className="flex text-black dark:text-gray-200">
                            <Link href={`/admin/zone?query=${item?.name}`}>
                              <FaRegEye
                                size={18}
                                className="mx-1 cursor-pointer"
                                title="See detail"
                              />
                            </Link>
                            <FaRegEdit
                              size={18}
                              color="blue"
                              className="mx-1 cursor-pointer"
                              title="Edit item"
                              onClick={() => handleEdit(item)}
                            />
                            <Popconfirm
                              title="Delete"
                              description="Are you sure to delete?"
                              okText="Yes"
                              cancelText="No"
                              onConfirm={() => handleDelete(item.id || 0)}
                            >
                              <FaRegTrashCan
                                size={18}
                                color="red"
                                className="mx-1 cursor-pointer"
                                title="Delete item"
                              />
                            </Popconfirm>
                          </h4>
                        </td>
                      </tr>
                    </tbody>
                  ))}
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="mt-6 sm:flex sm:items-center sm:justify-between">
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Page
          <span className="font-medium text-black dark:text-gray-100">
            {page} of {data?.totalPages}
          </span>
        </div>
        <div className="mt-4 flex items-center gap-x-4 sm:mt-0">
          <Link
            href={`?page=${page > 1 ? page - 1 : 1}&limit=${limit}`}
            className="flex w-1/2 items-center justify-center gap-x-2 rounded-md border bg-white px-5 py-2 text-sm capitalize text-black transition-colors duration-200 hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800 sm:w-auto"
          >
            <LuArrowLeft size={20} />
            <span>Previous</span>
          </Link>
          <Link
            href={`?page=${page < (data?.totalPages || 1) ? page + 1 : page}&limit=${limit}`}
            className="flex w-1/2 items-center justify-center gap-x-2 rounded-md border bg-white px-5 py-2 text-sm capitalize text-black transition-colors duration-200 hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800 sm:w-auto"
          >
            <span>Next</span>
            <LuArrowRight size={20} />
          </Link>
          <select
            name="warehouse"
            value={limit}
            onChange={handlePageSizeChange}
            className="flex w-1/2 items-center justify-center gap-x-2 rounded-md border bg-white px-5 py-2 text-sm capitalize text-black transition-colors duration-200 hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800 sm:w-auto"
            id="warehouse"
          >
            <option value="10">10</option>
            <option value="25">25</option>
            <option value="50">50</option>
            <option value="100">100</option>
          </select>
        </div>
      </div>
      <Modal
        title={updateId ? "Update" : "Create"}
        className="font-satoshi"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        maskClosable={false}
        footer
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mt-2 text-slate-600">
            Description<span className="text-red">*</span>
          </div>
          <input
            {...register("description", { required: true })}
            type="text"
            placeholder="Description"
            className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3  text-dark outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-2 "
          />
          {errors.description && (
            <span className="text-sm text-red-800">
              Please input valid description.
            </span>
          )}
          <div className="flex w-full items-center justify-end">
            <div
              onClick={handleCancel}
              className="me-1 mt-5 cursor-pointer rounded-md bg-blue-400 px-4 py-2 text-white"
            >
              Cancel
            </div>
            <button
              type="submit"
              className="me-1 mt-5 rounded-md bg-primary px-4 py-2 text-white"
              disabled={isPendingCreate}
            >
              {isPendingCreate || isPendingUpdate
                ? "Submiting..."
                : updateId
                  ? "Update"
                  : "Create"}
            </button>
          </div>
        </form>
      </Modal>
    </section>
  );
};

export default OfficerController;
