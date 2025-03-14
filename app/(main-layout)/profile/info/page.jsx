"use client";
import React, { useState, useEffect } from "react";
import request from "@/utlis/axios";
import toast from "react-hot-toast";
import useAuthStore from "@/context/authStore";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import useQueryStore from "@/context/queryStore";

const schema = z.object({
  userName: z.string().min(1, { message: "Username is required" }),
  surName: z.string().min(1, { message: "Surname is required" }),
  lastName: z.string().min(1, { message: "Last name is required" }),
  emailAddress: z.string().email({ message: "Invalid email address" }),
  phoneNumber: z
    .string()
    .min(10, { message: "Phone number must be at least 10 digits" }),
  avatarUrl: z.string().url().optional().nullable(),
});

export default function ProfileInfo() {
  const [loading, setLoading] = useState(true);
  const { switcher, revalidate } = useQueryStore();
  const { Id, isLoggedIn } = useAuthStore();
  const [skinTypes, setSkinTypes] = useState([]);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    mode: "onChange",
  });

  useEffect(() => {
    request.get(`/skin-types`).then(({ data }) => {
      setSkinTypes(data.data.items);
    });
  }, []);

  useEffect(() => {
    request
      .get(`/user/${Id}`)
      .then(({ data }) => {
        // Set form values
        const userData = data.data;
        setValue("userName", userData.userName);
        setValue("surName", userData.surName);
        setValue("lastName", userData.lastName);
        setValue("emailAddress", userData.emailAddress);
        setValue("phoneNumber", userData.phoneNumber);
        setValue("avatarUrl", userData.avatarUrl);
      })
      .catch((err) => {
        console.error("Error fetching user info:", err);
        toast.error("Failed to load user information");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [Id, isLoggedIn, setValue, switcher]);

  const onSubmit = async (data) => {
    try {
      request.put(`/user`, data).then((res) => {
        toast.success("Profile updated successfully");
        revalidate();
      });
    } catch (err) {
      toast.error("Failed to update profile");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Avatar Section */}
      <div className="flex justify-center mb-6">
        <div className="relative">
          <Image
            src={register("avatarUrl").value || "/images/default-avatar.png"}
            alt="Profile"
            width={100}
            height={100}
            className="rounded-full object-cover"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Username
          </label>
          <input
            type="text"
            {...register("userName")}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
          {errors.userName && (
            <p className="mt-1 text-sm text-red-600">
              {errors.userName.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Surname
          </label>
          <input
            type="text"
            {...register("surName")}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
          {errors.surName && (
            <p className="mt-1 text-sm text-red-600">
              {errors.surName.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Last Name
          </label>
          <input
            type="text"
            {...register("lastName")}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
          {errors.lastName && (
            <p className="mt-1 text-sm text-red-600">
              {errors.lastName.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email Address
          </label>
          <input
            type="email"
            {...register("emailAddress")}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
          {errors.emailAddress && (
            <p className="mt-1 text-sm text-red-600">
              {errors.emailAddress.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Phone Number
          </label>
          <input
            type="tel"
            {...register("phoneNumber")}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
          {errors.phoneNumber && (
            <p className="mt-1 text-sm text-red-600">
              {errors.phoneNumber.message}
            </p>
          )}
        </div>
        <div className="select-custom">
          <select
            className="tf-select w-100"
            id="country"
            name="address[country]"
            data-default=""
          >
            <option value="---" data-provinces="[]">
              ---
            </option>
          </select>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Update Profile
        </button>
      </div>
    </form>
  );
}
