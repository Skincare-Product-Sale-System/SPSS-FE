"use client"
import { useState, useEffect } from "react";
import { useTheme } from "@mui/material/styles";
import request from "@/utils/axios";
import toast from "react-hot-toast";
import useAuthStore from "@/context/authStore";

export default function AddressForm({ open, onClose, address, onSuccess }) {
  const theme = useTheme();
  const { Id } = useAuthStore();
  const [countries, setCountries] = useState([]);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({
    customerName: "",
    phoneNumber: "",
    streetNumber: "",
    addressLine1: "",
    city: "",
    ward: "",
    province: "",
    postCode: "",
    countryId: ""
  });
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
    isDefault: false
  });

  useEffect(() => {
    fetchCountries();
    if (address) {
      setFormData({
        customerName: address.customerName || "",
        phoneNumber: address.phoneNumber || "",
        countryId: address.countryId || "",
        streetNumber: address.streetNumber || "",
        addressLine1: address.addressLine1 || "",
        addressLine2: address.addressLine2 || "",
        city: address.city || "",
        ward: address.ward || "",
        province: address.province || "",
        postCode: address.postCode || "",
        isDefault: address.isDefault || false
      });
      // Clear errors when editing an existing address
      setErrors({
        customerName: "",
        phoneNumber: "",
        streetNumber: "",
        addressLine1: "",
        city: "",
        ward: "",
        province: "",
        postCode: "",
        countryId: ""
      });
    }
  }, [address]);

  const fetchCountries = async () => {
    try {
      const { data } = await request.get(`/countries`);
      setCountries(data.data || []);
    } catch (error) {
      console.error("Error fetching countries:", error);
      toast.error("Failed to load countries");
    }
  };

  const validateField = (name, value) => {
    let error = "";

    switch (name) {
      case "customerName":
        if (!value.trim()) {
          error = "Tên khách hàng là bắt buộc";
        } else if (value.trim().length < 2) {
          error = "Tên khách hàng phải có ít nhất 2 ký tự";
        }
        break;
      case "phoneNumber":
        if (!value.trim()) {
          error = "Số điện thoại là bắt buộc";
        } else {
          // Vietnamese phone number validation
          const phoneRegex = /^(\+84|0)\d{9,10}$/;
          if (!phoneRegex.test(value)) {
            error = "Số điện thoại không hợp lệ (VD: 0912345678 hoặc +84912345678)";
          }
        }
        break;
      case "streetNumber":
        if (!value.trim()) {
          error = "Số nhà là bắt buộc";
        }
        break;
      case "addressLine1":
        if (!value.trim()) {
          error = "Địa chỉ 1 là bắt buộc";
        }
        break;
      case "city":
        if (!value.trim()) {
          error = "Thành phố là bắt buộc";
        }
        break;
      case "ward":
        if (!value.trim()) {
          error = "Phường/Xã là bắt buộc";
        }
        break;
      case "province":
        if (!value.trim()) {
          error = "Tỉnh/Thành phố là bắt buộc";
        }
        break;
      case "postCode":
        if (!value.trim()) {
          error = "Mã bưu điện là bắt buộc";
        } else if (!/^\d{5,6}$/.test(value)) {
          error = "Mã bưu điện không hợp lệ (phải là 5-6 chữ số)";
        }
        break;
      case "countryId":
        if (!value) {
          error = "Quốc gia là bắt buộc";
        }
        break;
      default:
        break;
    }

    return error;
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;

    setFormData({
      ...formData,
      [name]: newValue
    });

    // Validate the field and update errors
    if (name !== 'addressLine2' && name !== 'isDefault') { // Skip validation for optional fields
      const error = validateField(name, newValue);
      setErrors({
        ...errors,
        [name]: error
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate all required fields before submission
    const newErrors = {};
    let isValid = true;

    // Validate each field
    Object.keys(formData).forEach(key => {
      if (key !== 'addressLine2' && key !== 'isDefault') { // Skip validation for optional fields
        const error = validateField(key, formData[key]);
        if (error) {
          isValid = false;
          newErrors[key] = error;
        }
      }
    });

    setErrors(newErrors);

    // If validation fails, don't submit
    if (!isValid) {
      return;
    }

    setSaving(true);
    try {
      const payload = {
        ...formData,
        userId: Id
      };

      if (address) {
        await request.patch(`/addresses/${address.id}`, payload);
        toast.success("Địa chỉ đã được cập nhật thành công");
      } else {
        await request.post("/addresses", payload);
        toast.success("Địa chỉ đã được thêm thành công");
      }

      onSuccess();
      onClose();
    } catch (err) {
      console.error("Error saving address:", err);

      // Display validation errors from API
      if (err.response?.status === 400 && err.response?.data?.errors) {
        const apiErrors = err.response.data.errors;
        const updatedErrors = { ...newErrors };

        // Map API error fields to form fields
        Object.keys(apiErrors).forEach(field => {
          const errorMessage = apiErrors[field][0];
          const fieldName = field.charAt(0).toLowerCase() + field.slice(1);
          updatedErrors[fieldName] = errorMessage;
        });

        setErrors(updatedErrors);
      } else {
        toast.error(
          address ? "Cập nhật địa chỉ thất bại" : "Thêm địa chỉ thất bại"
        );
      }
    } finally {
      setSaving(false);
    }
  };

  if (!open) return null;

  return (
    <div className="bg-white border p-6 rounded-lg shadow-md mb-8" style={{ borderColor: theme.palette.divider }}>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-medium" style={{ color: theme.palette.text.primary }}>
          {address ? "Chỉnh sửa địa chỉ" : "Thêm địa chỉ mới"}
        </h3>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="tf-field">
          <label className="text-sm block font-medium mb-1" style={{ color: theme.palette.text.secondary }}>
            Tên khách hàng <span className="text-red-500">*</span>
          </label>
          <input
            className={`border rounded-md w-full focus:outline-none focus:ring-2 px-3 py-2 ${errors.customerName ? 'border-red-500' : ''}`}
            style={{
              borderColor: errors.customerName ? 'red' : theme.palette.divider,
              focusRing: theme.palette.primary.light
            }}
            type="text"
            id="customerName"
            name="customerName"
            value={formData.customerName}
            onChange={handleInputChange}
          />
          {errors.customerName && (
            <p className="text-xs text-red-500 mt-1">{errors.customerName}</p>
          )}
        </div>

        <div className="tf-field">
          <label className="text-sm block font-medium mb-1" style={{ color: theme.palette.text.secondary }}>
            Số điện thoại <span className="text-red-500">*</span>
          </label>
          <input
            className={`border rounded-md w-full focus:outline-none focus:ring-2 px-3 py-2 ${errors.phoneNumber ? 'border-red-500' : ''}`}
            style={{
              borderColor: errors.phoneNumber ? 'red' : theme.palette.divider,
              focusRing: theme.palette.primary.light
            }}
            type="text"
            id="phoneNumber"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleInputChange}
          />
          {errors.phoneNumber && (
            <p className="text-xs text-red-500 mt-1">{errors.phoneNumber}</p>
          )}
        </div>

        <div className="tf-field">
          <label className="text-sm block font-medium mb-1" style={{ color: theme.palette.text.secondary }}>
            Số nhà <span className="text-red-500">*</span>
          </label>
          <input
            className={`border rounded-md w-full focus:outline-none focus:ring-2 px-3 py-2 ${errors.streetNumber ? 'border-red-500' : ''}`}
            style={{
              borderColor: errors.streetNumber ? 'red' : theme.palette.divider,
              focusRing: theme.palette.primary.light
            }}
            type="text"
            id="streetNumber"
            name="streetNumber"
            value={formData.streetNumber}
            onChange={handleInputChange}
          />
          {errors.streetNumber && (
            <p className="text-xs text-red-500 mt-1">{errors.streetNumber}</p>
          )}
        </div>

        <div className="tf-field">
          <label className="text-sm block font-medium mb-1" style={{ color: theme.palette.text.secondary }}>
            Địa chỉ 1 <span className="text-red-500">*</span>
          </label>
          <input
            className={`border rounded-md w-full focus:outline-none focus:ring-2 px-3 py-2 ${errors.addressLine1 ? 'border-red-500' : ''}`}
            style={{
              borderColor: errors.addressLine1 ? 'red' : theme.palette.divider,
              focusRing: theme.palette.primary.light
            }}
            type="text"
            id="addressLine1"
            name="addressLine1"
            value={formData.addressLine1}
            onChange={handleInputChange}
          />
          {errors.addressLine1 && (
            <p className="text-xs text-red-500 mt-1">{errors.addressLine1}</p>
          )}
        </div>

        <div className="tf-field">
          <label className="text-sm block font-medium mb-1" style={{ color: theme.palette.text.secondary }}>
            Địa chỉ 2 (Tùy chọn)
          </label>
          <input
            className="border rounded-md w-full focus:outline-none focus:ring-2 px-3 py-2"
            style={{
              borderColor: theme.palette.divider,
              focusRing: theme.palette.primary.light
            }}
            type="text"
            id="addressLine2"
            name="addressLine2"
            value={formData.addressLine2}
            onChange={handleInputChange}
          />
        </div>

        <div className="tf-field">
          <label className="text-sm block font-medium mb-1" style={{ color: theme.palette.text.secondary }}>
            Thành phố <span className="text-red-500">*</span>
          </label>
          <input
            className={`border rounded-md w-full focus:outline-none focus:ring-2 px-3 py-2 ${errors.city ? 'border-red-500' : ''}`}
            style={{
              borderColor: errors.city ? 'red' : theme.palette.divider,
              focusRing: theme.palette.primary.light
            }}
            type="text"
            id="city"
            name="city"
            value={formData.city}
            onChange={handleInputChange}
          />
          {errors.city && (
            <p className="text-xs text-red-500 mt-1">{errors.city}</p>
          )}
        </div>

        <div className="tf-field">
          <label className="text-sm block font-medium mb-1" style={{ color: theme.palette.text.secondary }}>
            Phường/Xã <span className="text-red-500">*</span>
          </label>
          <input
            className={`border rounded-md w-full focus:outline-none focus:ring-2 px-3 py-2 ${errors.ward ? 'border-red-500' : ''}`}
            style={{
              borderColor: errors.ward ? 'red' : theme.palette.divider,
              focusRing: theme.palette.primary.light
            }}
            type="text"
            id="ward"
            name="ward"
            value={formData.ward}
            onChange={handleInputChange}
          />
          {errors.ward && (
            <p className="text-xs text-red-500 mt-1">{errors.ward}</p>
          )}
        </div>

        <div className="tf-field">
          <label className="text-sm block font-medium mb-1" style={{ color: theme.palette.text.secondary }}>
            Quận/Huyện <span className="text-red-500">*</span>
          </label>
          <input
            className={`border rounded-md w-full focus:outline-none focus:ring-2 px-3 py-2 ${errors.province ? 'border-red-500' : ''}`}
            style={{
              borderColor: errors.province ? 'red' : theme.palette.divider,
              focusRing: theme.palette.primary.light
            }}
            type="text"
            id="province"
            name="province"
            value={formData.province}
            onChange={handleInputChange}
          />
          {errors.province && (
            <p className="text-xs text-red-500 mt-1">{errors.province}</p>
          )}
        </div>

        <div className="tf-field">
          <label className="text-sm block font-medium mb-1" style={{ color: theme.palette.text.secondary }}>
            Mã bưu điện <span className="text-red-500">*</span>
          </label>
          <input
            className={`border rounded-md w-full focus:outline-none focus:ring-2 px-3 py-2 ${errors.postCode ? 'border-red-500' : ''}`}
            style={{
              borderColor: errors.postCode ? 'red' : theme.palette.divider,
              focusRing: theme.palette.primary.light
            }}
            type="text"
            id="postCode"
            name="postCode"
            value={formData.postCode}
            onChange={handleInputChange}
          />
          {errors.postCode && (
            <p className="text-xs text-red-500 mt-1">{errors.postCode}</p>
          )}
        </div>

        <input
          type="hidden"
          name="countryId"
          id="countryId"
          value={formData.countryId}
        />

        <div className="flex items-center md:col-span-2 mt-2">
          <input
            type="checkbox"
            id="isDefault"
            name="isDefault"
            checked={formData.isDefault}
            onChange={handleInputChange}
            className="mr-2"
          />
          <label htmlFor="isDefault" style={{ color: theme.palette.text.secondary }}>
            Đặt làm địa chỉ mặc định
          </label>
        </div>

        <div className="flex justify-end gap-4 md:col-span-2 mt-4">
          <button
            type="button"
            className="border rounded-md px-4 py-2"
            style={{
              borderColor: theme.palette.divider,
              color: theme.palette.text.primary
            }}
            onClick={onClose}
          >
            Hủy
          </button>
          <button
            type="submit"
            className="rounded-md text-white px-4 py-2"
            style={{ backgroundColor: theme.palette.primary.main }}
            disabled={saving}
          >
            {saving ? 'Saving...' : address ? 'Update Address' : 'Add Address'}
          </button>
        </div>
      </form>
    </div>
  );
} 