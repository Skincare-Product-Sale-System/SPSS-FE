"use client";
import React, { useState, useEffect } from "react";
import request from "@/utlis/axios";
import toast from "react-hot-toast";
import useAuthStore from "@/context/authStore";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import useQueryStore from "@/context/queryStore";

const addressSchema = z.object({
  addressLine: z.string().min(1, { message: "Address is required" }),
  city: z.string().min(1, { message: "City is required" }),
  state: z.string().min(1, { message: "State/Province is required" }),
  country: z.string().min(1, { message: "Country is required" }),
  postalCode: z.string().min(1, { message: "Postal code is required" }),
  isDefault: z.boolean().default(false),
});

export default function AddressesPage() {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const { Id } = useAuthStore();
  const { switcher, revalidate } = useQueryStore();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(addressSchema),
    mode: "onChange",
  });

  useEffect(() => {
    request.get(`/address`).then(({ data }) => {
      setAddresses(data.data.items);
      console.log("data.data.items", data.data.items);

      setLoading(false);
    });
  }, [Id, switcher]);

  const onSubmit = async (data) => {
    try {
      if (isEditing) {
        await request.put(`/user-addresses/${editingId}`, data);
        toast.success("Address updated successfully");
      } else {
        await request.post("/user-addresses", { ...data, userId: Id });
        toast.success("Address added successfully");
      }
      revalidate();
      setShowForm(false);
      setIsEditing(false);
      setEditingId(null);
      reset();
    } catch (err) {
      toast.error(
        isEditing ? "Failed to update address" : "Failed to add address"
      );
    }
  };

  const handleEdit = (address) => {
    setIsEditing(true);
    setEditingId(address.id);
    setShowForm(true);
    Object.keys(addressSchema.shape).forEach((key) => {
      setValue(key, address[key]);
    });
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this address?")) {
      try {
        await request.delete(`/user-addresses/${id}`);
        toast.success("Address deleted successfully");
        revalidate();
      } catch (err) {
        toast.error("Failed to delete address");
      }
    }
  };

  const handleSetDefault = async (id) => {
    try {
      await request.put(`/user-addresses/${id}/set-default`);
      toast.success("Default address updated");
      revalidate();
    } catch (err) {
      toast.error("Failed to update default address");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-800 z-20"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">My Addresses</h2>
        <button
          onClick={() => {
            setShowForm(true);
            setIsEditing(false);
            setEditingId(null);
            reset();
          }}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Add New Address
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-20">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address Line
                </label>
                <input
                  type="text"
                  {...register("addressLine")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
                {errors.addressLine && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.addressLine.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  City
                </label>
                <input
                  type="text"
                  {...register("city")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
                {errors.city && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.city.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  State/Province
                </label>
                <input
                  type="text"
                  {...register("state")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
                {errors.state && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.state.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Country
                </label>
                <input
                  type="text"
                  {...register("country")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
                {errors.country && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.country.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Postal Code
                </label>
                <input
                  type="text"
                  {...register("postalCode")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
                {errors.postalCode && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.postalCode.message}
                  </p>
                )}
              </div>
            </div>

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  reset();
                }}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                {isEditing ? "Update" : "Add"} Address
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {addresses.map((address) => (
          <div
            key={address.id}
            className="bg-white p-4 rounded-lg shadow border border-gray-200"
          >
            <div className="flex justify-between items-start mb-2">
              <div className="flex-1">
                <p className="font-medium">{address.addressLine}</p>
                <p className="text-gray-600">
                  {address.city}, {address.state}
                </p>
                <p className="text-gray-600">
                  {address.country}, {address.postalCode}
                </p>
              </div>
              {address.isDefault && (
                <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                  Default
                </span>
              )}
            </div>
            <div className="flex justify-end space-x-2 mt-4">
              {!address.isDefault && (
                <button
                  onClick={() => handleSetDefault(address.id)}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  Set as Default
                </button>
              )}
              <button
                onClick={() => handleEdit(address)}
                className="text-sm text-gray-600 hover:text-gray-800"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(address.id)}
                className="text-sm text-red-600 hover:text-red-800"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {addresses.length === 0 && !showForm && (
        <div className="text-center py-8 text-gray-500">
          No addresses found. Add your first address!
        </div>
      )}
    </div>
  );
}
