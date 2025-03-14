"use client";
import React, { useState, useEffect } from "react";
import request from "@/utlis/axios";
import toast from "react-hot-toast";
import useAuthStore from "@/context/authStore";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import useQueryStore from "@/context/queryStore";
import AddressItem from "@/components/address/AddressItem";

const addressSchema = z.object({
  countryId: z.coerce.number().min(1, { message: "Country is required" }),
  streetNumber: z.string().min(1, { message: "Street number is required" }),
  addressLine1: z.string().min(1, { message: "Address is required" }),
  addressLine2: z.string().min(1, { message: "Address is required" }),
  city: z.string().min(1, { message: "City is required" }),
  ward: z.string().min(1, { message: "Ward is required" }),
  postCode: z.string().min(1, { message: "Postal code is required" }),
  province: z.string().min(1, { message: "Province is required" }),
  isDefault: z.boolean().default(false),
});

export default function AddressesPage() {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [countries, setCountries] = useState([]);
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
    request.get(`/address/user/${Id}`).then(({ data }) => {
      setAddresses(data.data.items);
      setLoading(false);
    });
  }, [Id, switcher]);

  useEffect(() => {
    request.get(`/countries`).then(({ data }) => {
      console.log("coutrn", data.data);
      setCountries(data.data);
    });
  }, []);

  const onSubmit = async (data) => {
    try {
      if (isEditing) {
        await request.patch(`/address/${editingId}`, { ...data, userId: Id });
        toast.success("Address updated successfully");
      } else {
        await request.post("/address", { ...data, userId: Id });
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
        await request.delete(`/address/${id}`);
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
          <form onSubmit={handleSubmit(onSubmit)} className="">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-20">
              <div className="select-custom">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Country
                </label>
                <select {...register("countryId")} className="tf-select w-100">
                  <option value="" data-provinces="[]">
                    ---
                  </option>
                  {countries?.map((country) => (
                    <option value={country.id}>{country.countryName}</option>
                  ))}
                </select>
                {errors.countryId && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.countryId.message}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Street Number
                </label>
                <input
                  type="text"
                  {...register("streetNumber")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
                {errors.streetNumber && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.streetNumber.message}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address Line 1
                </label>
                <input
                  type="text"
                  {...register("addressLine1")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
                {errors.addressLine1 && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.addressLine1.message}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address Line 2
                </label>
                <input
                  type="text"
                  {...register("addressLine2")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
                {errors.addressLine2 && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.addressLine2.message}
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
                  Ward
                </label>
                <input
                  type="text"
                  {...register("ward")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
                {errors.ward && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.ward.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Province
                </label>
                <input
                  type="text"
                  {...register("province")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
                {errors.province && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.province.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Post Code
                </label>
                <input
                  type="text"
                  {...register("postCode")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
                {errors.postCode && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.postCode.message}
                  </p>
                )}
              </div>
              <div className="box-field text-start">
                <div className="box-checkbox fieldset-radio d-flex align-items-center gap-8">
                  <input
                    {...register("isDefault")}
                    type="checkbox"
                    className="tf-check"
                  />
                  <label
                    htmlFor="check-new-address"
                    className="text_black-2 fw-4"
                  >
                    Set as default address.
                  </label>
                </div>
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
                onClick={() => console.log("errors", errors)}
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
          <AddressItem
            key={address.id}
            address={address}
            showActions={true}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onSetDefault={handleSetDefault}
          />
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
