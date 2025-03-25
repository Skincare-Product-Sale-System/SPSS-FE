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
    countryId: "",
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

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.customerName) {
      toast.error("Customer name is required");
      return;
    }
    if (!formData.phoneNumber) {
      toast.error("Phone number is required");
      return;
    }
    if (!formData.streetNumber) {
      toast.error("Street number is required");
      return;
    }
    if (!formData.addressLine1) {
      toast.error("Address Line 1 is required");
      return;
    }
    if (!formData.city) {
      toast.error("City is required");
      return;
    }
    if (!formData.ward) {
      toast.error("Ward is required");
      return;
    }
    if (!formData.province) {
      toast.error("Province is required");
      return;
    }
    if (!formData.postCode) {
      toast.error("Postal code is required");
      return;
    }
    if (!formData.countryId) {
      toast.error("Country is required");
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
        toast.success("Address updated successfully");
      } else {
        await request.post("/addresses", payload);
        toast.success("Address added successfully");
      }
      
      onSuccess();
      onClose();
    } catch (err) {
      console.error("Error saving address:", err);
      toast.error(
        address ? "Failed to update address" : "Failed to add address"
      );
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
            Tên khách hàng
          </label>
          <input
            className="border rounded-md w-full focus:outline-none focus:ring-2 px-3 py-2"
            style={{ 
              borderColor: theme.palette.divider,
              focusRing: theme.palette.primary.light
            }}
            type="text"
            id="customerName"
            name="customerName"
            value={formData.customerName}
            onChange={handleInputChange}
          />
        </div>
        
        <div className="tf-field">
          <label className="text-sm block font-medium mb-1" style={{ color: theme.palette.text.secondary }}>
            Số điện thoại
          </label>
          <input
            className="border rounded-md w-full focus:outline-none focus:ring-2 px-3 py-2"
            style={{ 
              borderColor: theme.palette.divider,
              focusRing: theme.palette.primary.light
            }}
            type="text"
            id="phoneNumber"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleInputChange}
          />
        </div>
        
        <div className="tf-field">
          <label className="text-sm block font-medium mb-1" style={{ color: theme.palette.text.secondary }}>
            Số nhà
          </label>
          <input
            className="border rounded-md w-full focus:outline-none focus:ring-2 px-3 py-2"
            style={{ 
              borderColor: theme.palette.divider,
              focusRing: theme.palette.primary.light
            }}
            type="text"
            id="streetNumber"
            name="streetNumber"
            value={formData.streetNumber}
            onChange={handleInputChange}
          />
        </div>
        
        <div className="tf-field">
          <label className="text-sm block font-medium mb-1" style={{ color: theme.palette.text.secondary }}>
            Địa chỉ 1
          </label>
          <input
            className="border rounded-md w-full focus:outline-none focus:ring-2 px-3 py-2"
            style={{ 
              borderColor: theme.palette.divider,
              focusRing: theme.palette.primary.light
            }}
            type="text"
            id="addressLine1"
            name="addressLine1"
            value={formData.addressLine1}
            onChange={handleInputChange}
          />
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
            Thành phố
          </label>
          <input
            className="border rounded-md w-full focus:outline-none focus:ring-2 px-3 py-2"
            style={{ 
              borderColor: theme.palette.divider,
              focusRing: theme.palette.primary.light
            }}
            type="text"
            id="city"
            name="city"
            value={formData.city}
            onChange={handleInputChange}
          />
        </div>
        
        <div className="tf-field">
          <label className="text-sm block font-medium mb-1" style={{ color: theme.palette.text.secondary }}>
            Phường/Xã
          </label>
          <input
            className="border rounded-md w-full focus:outline-none focus:ring-2 px-3 py-2"
            style={{ 
              borderColor: theme.palette.divider,
              focusRing: theme.palette.primary.light
            }}
            type="text"
            id="ward"
            name="ward"
            value={formData.ward}
            onChange={handleInputChange}
          />
        </div>
        
        <div className="tf-field">
          <label className="text-sm block font-medium mb-1" style={{ color: theme.palette.text.secondary }}>
            Quận/Huyện
          </label>
          <input
            className="border rounded-md w-full focus:outline-none focus:ring-2 px-3 py-2"
            style={{ 
              borderColor: theme.palette.divider,
              focusRing: theme.palette.primary.light
            }}
            type="text"
            id="province"
            name="province"
            value={formData.province}
            onChange={handleInputChange}
          />
        </div>
        
        <div className="tf-field">
          <label className="text-sm block font-medium mb-1" style={{ color: theme.palette.text.secondary }}>
            Mã bưu điện
          </label>
          <input
            className="border rounded-md w-full focus:outline-none focus:ring-2 px-3 py-2"
            style={{ 
              borderColor: theme.palette.divider,
              focusRing: theme.palette.primary.light
            }}
            type="text"
            id="postCode"
            name="postCode"
            value={formData.postCode}
            onChange={handleInputChange}
          />
        </div>
        
        <div className="md:col-span-2 tf-field">
          <label className="text-sm block font-medium mb-1" style={{ color: theme.palette.text.secondary }}>
            Quốc gia
          </label>
          <select
            className="border rounded-md w-full focus:outline-none focus:ring-2 px-3 py-2"
            style={{ 
              borderColor: theme.palette.divider,
              focusRing: theme.palette.primary.light
            }}
            id="countryId"
            name="countryId"
            value={formData.countryId}
            onChange={handleInputChange}
          >
            <option value="">Select a country</option>
            {countries && countries.length > 0 ? (
              countries.map((country) => (
                <option key={country.id} value={country.id}>
                  {country.countryName}
                </option>
              ))
            ) : (
              <option disabled>No countries available</option>
            )}
          </select>
        </div>
        
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