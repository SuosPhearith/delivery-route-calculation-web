"use client";
import React, { useState, useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { FaInfoCircle } from "react-icons/fa";
import { useRouter } from "next/navigation";
import axios from "axios";
import saveToken from "@/services/saveToken";
import Roles from "@/utils/Roles.enum";
import Image from "next/image";
const baseUrl = process.env.NEXT_PUBLIC_API_URL;

type Inputs = {
  email: string;
  password: string;
};

const SignIn = () => {
  const [errorMessage, setErrorMessage] = useState("");
  const [isPending, setIsPending] = useState(false);
  const route = useRouter();

  const signIn = async (data: { email: string; password: string }) => {
    try {
      setIsPending(true);
      const response = await axios.post(`${baseUrl}/keycloak/auth/signin`, {
        email: data.email,
        password: data.password,
      });
      console.log(response.data);
      const responseData: LoginResponse = response.data;
      saveToken(
        responseData.access_token,
        responseData.refresh_token,
        responseData.role,
      );
      window.localStorage.setItem("name", responseData.name);
      window.localStorage.setItem("email", responseData.email);
      if (responseData.role === Roles.ADMIN) {
        route.push("/admin");
      }
    } catch (error: any) {
      setErrorMessage(error?.response?.data?.message || "Something went wrong");
    } finally {
      setIsPending(false);
    }
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    await signIn({ ...data });
  };

  return (
    <div className="flex min-h-screen justify-center bg-gray-100 text-gray-900">
      <div className="m-0 flex max-w-screen-xl flex-1 justify-center bg-white shadow sm:m-10 sm:rounded-lg">
        <div className="h-full p-6 sm:p-12 lg:w-1/2 xl:w-5/12">
          <div className="flex h-full flex-col items-center justify-center">
            <Image
              width={82}
              height={82}
              src={"/images/logo/logo-icon.svg"}
              alt="Logo"
            />
            <h1 className=" mb-10 text-2xl font-extrabold text-primary xl:text-3xl">
              D.R.C
            </h1>
            {errorMessage && (
              <div className="w-full">
                <div className="mb-4 mt-5 flex rounded-lg bg-red-100 p-4 text-sm text-red-700">
                  <FaInfoCircle size={20} className="mx-2" />
                  <div>{errorMessage}</div>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="mt-8 w-full flex-1">
                <div className="mx-auto">
                  <input
                    {...register("email", { required: true })}
                    className="w-full rounded-lg border border-gray-200 bg-gray-100 px-8 py-4 text-sm font-medium placeholder-gray-500 focus:border-gray-400 focus:bg-white focus:outline-none"
                    type="email"
                    placeholder="Email"
                  />
                  {errors.email && (
                    <span className="text-sm text-red-800">
                      Please input valid email.
                    </span>
                  )}
                  <input
                    {...register("password", { required: true, minLength: 6 })}
                    className="mt-5 w-full rounded-lg border border-gray-200 bg-gray-100 px-8 py-4 text-sm font-medium placeholder-gray-500 focus:border-gray-400 focus:bg-white focus:outline-none"
                    type="password"
                    placeholder="Password"
                  />
                  {errors.password && (
                    <span className="text-sm text-red-800">
                      Password must be at least 6 characters long.
                    </span>
                  )}
                  <button
                    type="submit"
                    disabled={isPending}
                    className="focus:shadow-outline mt-5 flex w-full items-center justify-center rounded-lg bg-indigo-500 py-4 font-semibold tracking-wide text-gray-100 transition-all duration-300 ease-in-out hover:bg-indigo-700 focus:outline-none"
                  >
                    <span className="ml-3">Sign In</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
        <div className="hidden h-full flex-1 bg-indigo-100 text-center lg:flex lg:items-center lg:justify-center">
          <div className="m-12 w-full bg-contain bg-center bg-no-repeat xl:m-16 xl:ms-40">
            <Image
              width={500}
              height={500}
              src={"/images/dashboard.svg"}
              alt="Logo"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;

type LoginResponse = {
  access_token: string;
  refresh_token: string;
  role: string;
  name: string;
  email: string;
};
