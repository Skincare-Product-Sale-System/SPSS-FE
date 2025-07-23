"use client";
import React, { useState } from "react";
import request from "@/utils/axios";
import useAuthStore from "@/context/authStore";
import toast from "react-hot-toast";
import { useTheme } from "@mui/material/styles";

export default function AddressSection({
  addresses,
  selectedAddress,
  setSelectedAddress,
  countries,
  onAddressAdded
}) {
  const theme = useTheme();
  const { Id } = useAuthStore();
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [saving, setSaving] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    customerName: "",
    phoneNumber: "",
    streetNumber: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    ward: "",
    province: "",
    postCode: "",
    countryId: "1", // Default to country ID 1
    isDefault: true, // Default checked
  });

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      customerName: "",
      phoneNumber: "",
      streetNumber: "",
      addressLine1: "",
      addressLine2: "",
      city: "",
      ward: "",
      province: "",
      postCode: "",
      countryId: "1", // Default to country ID 1
      isDefault: true, // Default checked
    });
  };

  // Handle form submission for adding a new address
  const handleAddAddress = async (e) => {
    e.preventDefault();

    // Validate form
    if (!formData.customerName) {
      toast.error("Tên khách hàng là bắt buộc");
      return;
    }
    if (!formData.phoneNumber) {
      toast.error("Số điện thoại là bắt buộc");
      return;
    }
    if (!formData.streetNumber) {
      toast.error("Số nhà là bắt buộc");
      return;
    }
    if (!formData.addressLine1) {
      toast.error("Địa chỉ là bắt buộc");
      return;
    }
    if (!formData.city) {
      toast.error("Thành phố là bắt buộc");
      return;
    }
    if (!formData.ward) {
      toast.error("Phường/Xã là bắt buộc");
      return;
    }
    if (!formData.province) {
      toast.error("Quận/Huyện là bắt buộc");
      return;
    }
    if (!formData.postCode) {
      toast.error("Mã bưu điện là bắt buộc");
      return;
    }

    setSaving(true);
    try {
      const payload = {
        ...formData,
        userId: Id,
      };

      const response = await request.post("/addresses", payload);

      if (response.data && response.data.success) {
        toast.success("Thêm địa chỉ thành công");

        // Get the new address from the response
        const newAddress = response.data.data;

        if (newAddress && newAddress.id) {
          // Call the callback to update parent state
          if (onAddressAdded) {
            onAddressAdded(newAddress);
          }
        } else {
          console.error("Invalid address data in response:", response.data);
        }

        // Reset form and UI state
        setShowAddressForm(false);
        resetForm();
      } else {
        console.error("Error in response:", response.data);
        toast.error(response.data?.message || "Thêm địa chỉ thất bại");
      }
    } catch (err) {
      console.error("Error saving address:", err);

      // Display validation errors from API
      if (err.response?.status === 400 && err.response?.data?.errors) {
        const apiErrors = err.response.data.errors;

        // Show each validation error as toast message
        Object.keys(apiErrors).forEach(field => {
          const errorMessage = apiErrors[field][0];
          toast.error(errorMessage);
        });
      } else {
        toast.error("Thêm địa chỉ thất bại");
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm mb-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="fw-5 mb-0" style={{ fontFamily: '"Roboto", sans-serif' }}>
          1. Địa Chỉ Giao Hàng
        </h5>
        <button
          className="btn btn-sm text-white"
          style={{ backgroundColor: theme.palette.primary.main, fontFamily: '"Roboto", sans-serif' }}
          onClick={() => setShowAddressForm(!showAddressForm)}
        >
          {showAddressForm ? "Hủy" : "Thêm địa chỉ mới"}
        </button>
      </div>

      {selectedAddress && !showAddressForm && (
        <div className="border rounded p-3 mb-2"
          style={{ borderColor: theme.palette.primary.light, backgroundColor: `${theme.palette.primary.main}08` }}>
          <div className="d-flex justify-content-between">
            <div>
              <p className="fw-medium mb-1">
                {selectedAddress.customerName} • {selectedAddress.phoneNumber}
              </p>
              <p className="fs-14 text-muted mb-0">
                {selectedAddress.streetNumber}, {selectedAddress.addressLine1}
                {selectedAddress.addressLine2 ? `, ${selectedAddress.addressLine2}` : ''},
                {selectedAddress.ward}, {selectedAddress.province}, {selectedAddress.city}
              </p>
            </div>
            <button
              className="text-primary fs-14 text-decoration-underline bg-transparent border-0"
              onClick={() => document.getElementById('address-list').classList.toggle('d-none')}
            >
              Thay đổi
            </button>
          </div>
        </div>
      )}

      {/* Collapsed address list */}
      <div id="address-list" className="d-none mb-3">
        {addresses.map((address) => (
          <div
            key={address.id}
            className={`border rounded p-3 mb-2 cursor-pointer ${selectedAddress?.id === address.id
              ? "border-primary bg-light"
              : ""
              }`}
            onClick={() => {
              setSelectedAddress(address);
              document.getElementById('address-list').classList.add('d-none');
            }}
            style={{ cursor: 'pointer' }}
          >
            <p className="fw-medium mb-1">
              {address.customerName} • {address.phoneNumber}
            </p>
            <p className="fs-14 text-muted mb-0">
              {address.streetNumber}, {address.addressLine1}
              {address.addressLine2 ? `, ${address.addressLine2}` : ''},
              {address.ward}, {address.province}, {address.city}
            </p>
          </div>
        ))}
      </div>

      {/* Address form - show when needed */}
      {showAddressForm && (
        <div className="border rounded p-3">
          <form onSubmit={handleAddAddress} className="row g-3">
            <div className="col-md-6">
              <label className="form-label">Tên Khách Hàng</label>
              <input
                type="text"
                className="form-control"
                name="customerName"
                value={formData.customerName}
                onChange={handleInputChange}
              />
            </div>

            <div className="col-md-6">
              <label className="form-label">Số Điện Thoại</label>
              <input
                type="text"
                className="form-control"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleInputChange}
              />
            </div>

            <div className="col-md-6">
              <label className="form-label">Số Nhà</label>
              <input
                type="text"
                className="form-control"
                name="streetNumber"
                value={formData.streetNumber}
                onChange={handleInputChange}
              />
            </div>

            <div className="col-md-6">
              <label className="form-label">Địa Chỉ</label>
              <input
                type="text"
                className="form-control"
                name="addressLine1"
                value={formData.addressLine1}
                onChange={handleInputChange}
              />
            </div>

            <div className="col-md-6">
              <label className="form-label">Địa Chỉ (Tùy chọn)</label>
              <input
                type="text"
                className="form-control"
                name="addressLine2"
                value={formData.addressLine2}
                onChange={handleInputChange}
              />
            </div>

            <div className="col-md-6">
              <label className="form-label">Thành Phố</label>
              <input
                type="text"
                className="form-control"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
              />
            </div>

            <div className="col-md-6">
              <label className="form-label">Phường/Xã</label>
              <input
                type="text"
                className="form-control"
                name="ward"
                value={formData.ward}
                onChange={handleInputChange}
              />
            </div>

            <div className="col-md-6">
              <label className="form-label">Quận/Huyện</label>
              <input
                type="text"
                className="form-control"
                name="province"
                value={formData.province}
                onChange={handleInputChange}
              />
            </div>

            <div className="col-md-6">
              <label className="form-label">Mã Bưu Điện</label>
              <input
                type="text"
                className="form-control"
                name="postCode"
                value={formData.postCode}
                onChange={handleInputChange}
              />
            </div>

            <input
              type="hidden"
              name="countryId"
              value={formData.countryId}
            />

            <div className="col-12">
              <div className="form-check">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id="isDefault"
                  name="isDefault"
                  checked={formData.isDefault}
                  onChange={handleInputChange}
                />
                <label className="form-check-label" htmlFor="isDefault">
                  Đặt làm địa chỉ mặc định
                </label>
              </div>
            </div>

            <div className="col-12 mt-3 d-flex justify-content-end">
              <button
                type="button"
                className="btn btn-outline-secondary me-2"
                onClick={() => {
                  setShowAddressForm(false);
                  resetForm();
                }}
              >
                Hủy
              </button>
              <button
                type="submit"
                className="btn text-white"
                style={{ backgroundColor: theme.palette.primary.main }}
                disabled={saving}
              >
                {saving ? "Đang lưu..." : "Thêm Địa Chỉ"}
              </button>
            </div>
          </form>
        </div>
      )}

      {addresses.length === 0 && !showAddressForm && (
        <div className="alert alert-secondary">
          Chưa có địa chỉ nào. Vui lòng thêm địa chỉ để tiếp tục.
        </div>
      )}
    </div>
  );
} 