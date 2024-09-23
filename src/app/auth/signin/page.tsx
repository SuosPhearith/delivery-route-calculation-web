"use client";
import React, { useState, useEffect } from "react";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { useRouter } from "next/navigation";
import axios from "axios";
import saveToken from "@/services/saveToken";
import Roles from "@/utils/Roles.enum";
import Image from "next/image";
import { Input, message } from "antd";
const baseUrl = process.env.NEXT_PUBLIC_API_URL;

type Inputs = {
  email: string;
  password: string;
};

const SignIn = () => {
  const [token, setToken] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);
  const route = useRouter();

  // Check if the user is already logged in
  useEffect(() => {
    const storedToken = window.localStorage.getItem("accessToken");
    const storedRole = window.localStorage.getItem("role");

    if (storedToken && storedRole) {
      setToken(storedToken);
      setRole(storedRole);

      // Redirect based on the user's role
      if (storedRole === Roles.ADMIN || storedRole === Roles.MANAGER) {
        route.push("/admin");
      } else {
        route.push("/admin/information");
      }
    }
  }, [route]);

  const signIn = async (data: { email: string; password: string }) => {
    try {
      setIsPending(true);
      const response = await axios.post(`${baseUrl}/keycloak/auth/signin`, {
        email: data.email,
        password: data.password,
      });
      const responseData: LoginResponse = response.data;
      saveToken(
        responseData.access_token,
        responseData.refresh_token,
        responseData.role,
      );

      // Save tokens and role to localStorage
      window.localStorage.setItem("name", responseData.name);
      window.localStorage.setItem("email", responseData.email);
      window.localStorage.setItem("role", responseData.role);
      window.localStorage.setItem("accessToken", responseData.access_token);

      // Immediately update token and role state
      setToken(responseData.access_token);
      setRole(responseData.role);

      // Redirect based on role after login
      if (
        responseData.role === Roles.ADMIN ||
        responseData.role === Roles.MANAGER
      ) {
        route.push("/admin");
      } else {
        route.push("/admin/information");
      }
    } catch (error: any) {
      message.error(error?.response?.data?.message || "Something went wrong");
    } finally {
      setIsPending(false);
    }
  };

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<Inputs>();

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    await signIn({ ...data });
  };

  // If token and role are present, show a placeholder or redirect user
  if (token && role) {
    return <div>Redirecting...</div>; // Optionally add a loading spinner or redirect manually
  }

  return (
    <section className="flex min-h-screen items-center justify-center bg-gray-50">
      {/* login container */}
      <div className="flex max-w-3xl items-center rounded-2xl bg-gray-100 p-5 shadow-lg">
        {/* image */}
        <div className="mt-5 hidden w-1/2 md:block">
          <Image src="/vital2.png" alt="logo" width={250} height={120} />
        </div>
        {/* form */}
        <div className="px-2 md:w-1/2">
          <Image
            src="/logo.svg"
            alt="logo"
            width={200}
            height={120}
            className="mb-4"
          />

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
            <p className="text-slate-500">Email:</p>
            <Controller
              name="email"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <Input
                  {...field}
                  type="email"
                  placeholder="example@gmail.com"
                  size="large"
                  className="mb-3"
                />
              )}
            />
            {errors.email && (
              <span className="text-sm text-red-800">
                Please input valid email.
              </span>
            )}
            <p className="text-slate-500">Password:</p>
            <Controller
              name="password"
              control={control}
              rules={{ required: true, minLength: 6 }}
              render={({ field }) => (
                <Input.Password
                  {...field}
                  placeholder="Enter your password"
                  size="large"
                  className="mb-3"
                />
              )}
            />
            {errors.password && (
              <span className="text-sm text-red-800">
                Password must be at least 6 characters long.
              </span>
            )}
            <input
              type="submit"
              disabled={isPending}
              className="mt-2 cursor-pointer rounded-md bg-[#afaf4c] py-2.5 text-white duration-300 hover:scale-105"
              value={"Login"}
            />
          </form>
        </div>
      </div>
    </section>
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
