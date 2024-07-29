"use client";
import {
  Case,
  createCase,
  deleteCase,
  getAllCase,
  ResponseAll,
  updateCase,
} from "@/api/case";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { LuArrowLeft, LuArrowRight, LuPlusCircle } from "react-icons/lu";
import Skeleton from "../../components/Skeleton";
import { message, Modal, notification, Popconfirm } from "antd";
import { SubmitHandler, useForm } from "react-hook-form";
import { FaRegTrashCan } from "react-icons/fa6";
import { FaRegEdit } from "react-icons/fa";

const CaseComponent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedPage = Number(searchParams.get("page")) || 1;
  const selectedLimit = Number(searchParams.get("limit")) || 10;
  const [page, setPage] = useState(selectedPage);
  const [limit, setLimit] = useState(selectedLimit);
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

  // create or update
  const [updateId, setUpdateId] = useState<number>();
  const handleEdit = (item: Case) => {
    reset();
    setValue("name", item.name);
    setValue("caseHeight", item.caseHeight);
    setValue("caseWidth", item.caseWidth);
    setValue("caseLenght", item.caseLenght);
    showModal();
    setUpdateId(item.id);
  };

  const { mutateAsync: updateMutate, isPending: isPendingUpdate } = useMutation(
    {
      mutationFn: updateCase,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["cases"] });
        // message.success("Case updated successfully");
        openNotification("Update Case", "Case Updated successfully");
        handleCancel();
      },
      onError: (error: any) => {
        message.error(error);
      },
    },
  );

  const { mutateAsync, isPending } = useMutation({
    mutationFn: createCase,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cases"] });
      // message.success("Case created successfully");
      openNotification("Create Case", "Case created successfully");
      handleCancel();
    },
    onError: (error: any) => {
      message.error(error);
    },
  });
  const onSubmit: SubmitHandler<Case> = async (data) => {
    const caseData: Case = {
      name: data.name,
      caseLenght: data.caseLenght,
      caseWidth: data.caseWidth,
      caseHeight: data.caseHeight,
    };

    if (updateId) {
      caseData.id = updateId;
      await updateMutate(caseData);
    } else {
      await mutateAsync(caseData);
    }
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setValue,
  } = useForm<Case>();

  // end create or update

  // delete
  const { mutateAsync: deleteMutate, isPending: isPendingDelete } = useMutation(
    {
      mutationFn: deleteCase,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["cases"] });
        // message.success("Case deleted successfully");
        openNotification("Delete Case", "Case Deleted successfully");
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
    queryKey: ["cases", page, limit],
    queryFn: () => getAllCase(page, limit),
  });

  useEffect(() => {
    setPage(selectedPage);
    setLimit(selectedLimit);
  }, [selectedPage, selectedLimit]);

  if (isLoading) {
    return <Skeleton />;
  }
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
  // end fectch

  return (
    <section className="case mx-auto px-1">
      {contextHolder}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-x-3">
            <h2 className="text-lg font-medium text-gray-800 dark:text-white">
              Case
            </h2>
            <span className="rounded-full bg-blue-100 px-3 py-1 text-xs text-blue-600 dark:bg-gray-800 dark:text-blue-400">
              {data?.totalCount} Cases
            </span>
          </div>
        </div>
        <div className="flex items-center gap-x-3">
          <button
            onClick={showModal}
            className="flex shrink-0 items-center justify-center gap-x-2 rounded-lg bg-primary px-5 py-2 text-sm tracking-wide text-white transition-colors duration-200 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-500"
          >
            <LuPlusCircle size={20} />
            <span>Add case</span>
          </button>
        </div>
      </div>
      <div className="mt-3 flex flex-col">
        <div className="-mx-4 -overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
            <div className="overflow-hidden border border-gray-200 dark:border-gray-700 md:rounded-lg">
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
                      Case Name
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3 text-left text-sm font-normal text-gray-500 dark:text-gray-400 rtl:text-right"
                    >
                      Case length
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3 text-left text-sm font-normal text-gray-500 dark:text-gray-400 rtl:text-right"
                    >
                      Case width
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3 text-left text-sm font-normal text-gray-500 dark:text-gray-400 rtl:text-right"
                    >
                      Case height
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3 text-left text-sm font-normal text-gray-500 dark:text-gray-400 rtl:text-right"
                    >
                      Case cubic
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
                        <h4 className="text-black dark:text-gray-200">
                          {item.caseLenght} m
                        </h4>
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-sm">
                        <h4 className="text-black dark:text-gray-200">
                          {item.caseWidth} m
                        </h4>
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-sm">
                        <h4 className="text-black dark:text-gray-200">
                          {item.caseHeight} m
                        </h4>
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-sm">
                        <h4 className="text-black dark:text-gray-200">
                          {item.caseCubic} m³
                        </h4>
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-sm">
                        <h4 className="flex text-black dark:text-gray-200">
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
                            onConfirm={() => handleDelete(item?.id || 0)}
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
                    {/* Additional rows here */}
                  </tbody>
                ))}
              </table>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-6 sm:flex sm:items-center sm:justify-between">
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Page
          <span className="font-medium text-gray-700 dark:text-gray-100">
            {page} of {data?.totalPages}
          </span>
        </div>
        <div className="mt-4 flex items-center gap-x-4 sm:mt-0">
          <Link
            href={`?page=${page > 1 ? page - 1 : 1}&limit=${limit}`}
            className="flex w-1/2 items-center justify-center gap-x-2 rounded-md border bg-white px-5 py-2 text-sm capitalize text-gray-700 transition-colors duration-200 hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800 sm:w-auto"
          >
            <LuArrowLeft size={20} />
            <span>Previous</span>
          </Link>
          <Link
            href={`?page=${page < (data?.totalPages || 1) ? page + 1 : page}&limit=${limit}`}
            className="flex w-1/2 items-center justify-center gap-x-2 rounded-md border bg-white px-5 py-2 text-sm capitalize text-gray-700 transition-colors duration-200 hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800 sm:w-auto"
          >
            <span>Next</span>
            <LuArrowRight size={20} />
          </Link>
          <select
            name="cars"
            value={limit}
            onChange={handlePageSizeChange}
            className="flex w-1/2 items-center justify-center gap-x-2 rounded-md border bg-white px-5 py-2 text-sm capitalize text-gray-700 transition-colors duration-200 hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800 sm:w-auto"
            id="cars"
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
        closable={false}
        footer
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mt-2 text-slate-600">
            Name<span className="text-red">*</span>
          </div>
          <input
            {...register("name", { required: true })}
            type="text"
            placeholder="Name"
            className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3  text-dark outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-2 "
          />
          {errors.name && (
            <span className="text-sm text-red-800">
              Please input valid name.
            </span>
          )}
          <div className="mt-2 text-slate-600">
            Case length<span className="text-red">*</span>
          </div>
          <input
            {...register("caseLenght", { required: true })}
            type="number"
            placeholder="Case length"
            className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3  text-dark outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-2 "
          />
          {errors.caseLenght && (
            <span className="text-sm text-red-800">
              Please input valid case lenght.
            </span>
          )}
          <div className="mt-2 text-slate-600">
            Case width<span className="text-red">*</span>
          </div>
          <input
            {...register("caseWidth", { required: true })}
            type="number"
            placeholder="Case width"
            className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3  text-dark outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-2 "
          />
          {errors.caseWidth && (
            <span className="text-sm text-red-800">
              Please input valid case width.
            </span>
          )}
          <div className="mt-2 text-slate-600">
            Case height<span className="text-red">*</span>
          </div>
          <input
            {...register("caseHeight", { required: true })}
            type="number"
            placeholder="Case height"
            className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3  text-dark outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-2 "
          />
          {errors.caseHeight && (
            <span className="text-sm text-red-800">
              Please input valid case height.
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
              disabled={isPending}
            >
              {isPending ? "Creating..." : updateId ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </Modal>
    </section>
  );
};

export default CaseComponent;
