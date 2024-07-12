"use client";
import React, { useState, useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { FaInfoCircle } from "react-icons/fa";
import { TbLogin } from "react-icons/tb";
import { useRouter } from "next/navigation";
import Roles from "@/utils/Roles.enum";
import apiRequest from "@/services/apiRequest";

type Inputs = {
  email: string;
  password: string;
};

const SignIn = () => {
  const [errorMessage, setErrorMessage] = useState("");
  const [userAgent, setUserAgent] = useState("");
  const route = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      setUserAgent(navigator.userAgent);
    }
  }, []);

  const signIn = async (data: {
    email: string;
    password: string;
    userAgent: string;
  }) => {
    try {
      const responseData = await apiRequest("post", `/auth/signIn`, data);
      const roleId = responseData.user.roleId;
      if (roleId === Roles.admin) {
        route.push("/admin");
      }
      return responseData;
    } catch (message: any) {
      setErrorMessage(message);
    }
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    await signIn({ ...data, userAgent });
  };

  return (
    <div className="mx-auto my-10 max-w-lg rounded-xl bg-white p-8 shadow shadow-slate-300">
      <div className="w-full text-center">
        <h1 className="text-4xl font-medium">Login</h1>
        <p className="text-slate-500">Hi, Welcome back 👋</p>
      </div>
      {errorMessage && (
        <div className="w-full">
          <div className="mb-4 mt-5 flex rounded-lg bg-red-100 p-4 text-sm text-red-700">
            <FaInfoCircle size={20} className="mx-2" />
            <div>{errorMessage}</div>
          </div>
        </div>
      )}
      <div className="my-5"></div>
      <form onSubmit={handleSubmit(onSubmit)} className="my-10">
        <div className="flex flex-col space-y-5">
          <label htmlFor="email">
            <p className="pb-2 font-medium text-slate-700">Email address</p>
            <input
              {...register("email", { required: true })}
              id="email"
              name="email"
              type="email"
              className="w-full rounded-lg border border-slate-200 px-3 py-3 hover:shadow focus:border-slate-500 focus:outline-none"
              placeholder="Enter email address"
            />
            {errors.email && (
              <span className="text-sm text-red-800">
                Please input valid email.
              </span>
            )}
          </label>
          <label htmlFor="password">
            <p className="pb-2 font-medium text-slate-700">Password</p>
            <input
              {...register("password", { required: true, minLength: 6 })}
              id="password"
              name="password"
              type="password"
              className="w-full rounded-lg border border-slate-200 px-3 py-3 hover:shadow focus:border-slate-500 focus:outline-none"
              placeholder="Enter your password"
            />
            {errors.password && (
              <span className="text-sm text-red-800">
                Password must be at least 6 characters long.
              </span>
            )}
          </label>
          <button
            type="submit"
            className="inline-flex w-full items-center justify-center space-x-2 rounded-lg border-indigo-500 bg-indigo-600 py-3 font-medium text-white hover:bg-indigo-500 hover:shadow"
          >
            <TbLogin size={25} />
            <span>Login</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default SignIn;
