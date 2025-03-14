"use client";

import { useState, useEffect } from "react";
import { useTheme } from "@mui/material/styles";
import Pagination from "@mui/material/Pagination";
import request from "@/utlis/axios";
import toast from "react-hot-toast";
import useAuthStore from "@/context/authStore";

export default function AccountAddress() {
  const theme = useTheme();
  const { Id } = useAuthStore();
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeEdit, setActiveEdit] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 5;

  useEffect(() => {
    fetchAddresses();
  }, [Id, currentPage]);

  const fetchAddresses = async () => {
    try {
      const { data } = await request.get(`/address/user/${Id}?pageNumber=${currentPage}&pageSize=${pageSize}`);
      setAddresses(data.data.items);
      setTotalPages(data.data.totalPages);
      setLoading(false);
    } catch (error) {
      toast.error("Failed to load addresses");
      setLoading(false);
    }
  };

  const handleSetDefault = async (id) => {
    try {
      await request.put(`/address/${id}/set-default`);
      toast.success("Default address updated");
      fetchAddresses();
    } catch (error) {
      toast.error("Failed to update default address");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this address?")) {
      try {
        await request.delete(`/address/${id}`);
        toast.success("Address deleted successfully");
        fetchAddresses();
      } catch (error) {
        toast.error("Failed to delete address");
      }
    }
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2" 
             style={{ borderColor: theme.palette.primary.main }}></div>
      </div>
    );
  }

  return (
    <div className="my-account-content account-address">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold" style={{ color: theme.palette.text.primary }}>My Addresses</h2>
        <button
          className="px-4 py-2 rounded-md text-white transition-all hover:opacity-90"
          style={{ backgroundColor: theme.palette.primary.main }}
          onClick={() => setActiveEdit(true)}
        >
          Add a new address
        </button>
      </div>

      {/* Add Address Form */}
      {activeEdit && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-8 border" style={{ borderColor: theme.palette.divider }}>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-medium" style={{ color: theme.palette.text.primary }}>Add a new address</h3>
            <button 
              onClick={() => setActiveEdit(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <form onSubmit={(e) => e.preventDefault()} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="tf-field">
              <label className="block text-sm font-medium mb-1" style={{ color: theme.palette.text.secondary }}>
                Customer Name
              </label>
              <input
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2"
                style={{ 
                  borderColor: theme.palette.divider,
                  focusRing: theme.palette.primary.light
                }}
                type="text"
                id="customerName"
                name="customerName"
              />
            </div>
            
            <div className="tf-field">
              <label className="block text-sm font-medium mb-1" style={{ color: theme.palette.text.secondary }}>
                Phone Number
              </label>
              <input
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2"
                style={{ 
                  borderColor: theme.palette.divider,
                  focusRing: theme.palette.primary.light
                }}
                type="text"
                id="phoneNumber"
                name="phoneNumber"
              />
            </div>
            
            <div className="tf-field">
              <label className="block text-sm font-medium mb-1" style={{ color: theme.palette.text.secondary }}>
                Street Number
              </label>
              <input
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2"
                style={{ 
                  borderColor: theme.palette.divider,
                  focusRing: theme.palette.primary.light
                }}
                type="text"
                id="streetNumber"
                name="streetNumber"
              />
            </div>
            
            <div className="tf-field">
              <label className="block text-sm font-medium mb-1" style={{ color: theme.palette.text.secondary }}>
                Address Line 1
              </label>
              <input
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2"
                style={{ 
                  borderColor: theme.palette.divider,
                  focusRing: theme.palette.primary.light
                }}
                type="text"
                id="addressLine1"
                name="addressLine1"
              />
            </div>
            
            <div className="tf-field">
              <label className="block text-sm font-medium mb-1" style={{ color: theme.palette.text.secondary }}>
                Address Line 2 (Optional)
              </label>
              <input
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2"
                style={{ 
                  borderColor: theme.palette.divider,
                  focusRing: theme.palette.primary.light
                }}
                type="text"
                id="addressLine2"
                name="addressLine2"
              />
            </div>
            
            <div className="tf-field">
              <label className="block text-sm font-medium mb-1" style={{ color: theme.palette.text.secondary }}>
                City
              </label>
              <input
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2"
                style={{ 
                  borderColor: theme.palette.divider,
                  focusRing: theme.palette.primary.light
                }}
                type="text"
                id="city"
                name="city"
              />
            </div>
            
            <div className="tf-field">
              <label className="block text-sm font-medium mb-1" style={{ color: theme.palette.text.secondary }}>
                Ward
              </label>
              <input
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2"
                style={{ 
                  borderColor: theme.palette.divider,
                  focusRing: theme.palette.primary.light
                }}
                type="text"
                id="ward"
                name="ward"
              />
            </div>
            
            <div className="tf-field">
              <label className="block text-sm font-medium mb-1" style={{ color: theme.palette.text.secondary }}>
                Province
              </label>
              <input
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2"
                style={{ 
                  borderColor: theme.palette.divider,
                  focusRing: theme.palette.primary.light
                }}
                type="text"
                id="province"
                name="province"
              />
            </div>
            
            <div className="tf-field">
              <label className="block text-sm font-medium mb-1" style={{ color: theme.palette.text.secondary }}>
                Postal Code
              </label>
              <input
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2"
                style={{ 
                  borderColor: theme.palette.divider,
                  focusRing: theme.palette.primary.light
                }}
                type="text"
                id="postcode"
                name="postcode"
              />
            </div>
            
            <div className="tf-field md:col-span-2">
              <label className="block text-sm font-medium mb-1" style={{ color: theme.palette.text.secondary }}>
                Country
              </label>
              <select
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2"
                style={{ 
                  borderColor: theme.palette.divider,
                  focusRing: theme.palette.primary.light
                }}
                id="country"
                name="country"
              >
                <option value="Vietnam">Vietnam</option>
                <option value="United States">United States</option>
                <option value="Japan">Japan</option>
                <option value="South Korea">South Korea</option>
              </select>
            </div>
            
            <div className="md:col-span-2 flex items-center mt-2">
              <input
                type="checkbox"
                id="isDefault"
                name="isDefault"
                className="mr-2"
              />
              <label htmlFor="isDefault" style={{ color: theme.palette.text.secondary }}>
                Set as default address
              </label>
            </div>
            
            <div className="md:col-span-2 flex justify-end gap-4 mt-4">
              <button
                type="button"
                className="px-4 py-2 border rounded-md"
                style={{ 
                  borderColor: theme.palette.divider,
                  color: theme.palette.text.primary
                }}
                onClick={() => setActiveEdit(false)}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-md text-white"
                style={{ backgroundColor: theme.palette.primary.main }}
              >
                Add Address
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Default Address */}
      {addresses.filter(address => address.isDefault).length > 0 && (
        <div className="mb-8">
          <h3 className="text-lg font-medium mb-4" style={{ color: theme.palette.text.primary }}>Default Address</h3>
          {addresses.filter(address => address.isDefault).map((address) => (
            <div 
              key={address.id}
              className="bg-white p-6 rounded-lg shadow-md border-2 relative"
              style={{ 
                borderColor: theme.palette.primary.main,
                backgroundColor: `${theme.palette.primary.light}10` 
              }}
            >
              <div className="absolute top-4 right-4 px-3 py-1 rounded-full text-sm font-medium"
                style={{ 
                  backgroundColor: theme.palette.primary.main,
                  color: theme.palette.primary.contrastText
                }}
              >
                Default
              </div>
              
              <div className="flex items-start">
                <div className="mr-4 mt-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" 
                    style={{ color: theme.palette.primary.main }}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                </div>
                
                <div className="flex-1">
                  <div className="mb-3">
                    <h3 className="font-semibold text-lg" style={{ color: theme.palette.text.primary }}>
                      {address.customerName}
                    </h3>
                    <p className="text-sm" style={{ color: theme.palette.text.secondary }}>
                      {address.phoneNumber}
                    </p>
                  </div>
                  
                  <div className="space-y-1 mb-4">
                    <p style={{ color: theme.palette.text.primary }}>
                      {address.streetNumber} {address.addressLine1}
                      {address.addressLine2 && `, ${address.addressLine2}`}
                    </p>
                    <p style={{ color: theme.palette.text.primary }}>
                      {address.ward}, {address.city}, {address.province}
                    </p>
                    <p style={{ color: theme.palette.text.primary }}>
                      {address.countryName} {address.postcode}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-2 mt-4">
                <button
                  className="px-3 py-1.5 rounded text-white text-sm"
                  style={{ backgroundColor: theme.palette.primary.main }}
                >
                  Edit
                </button>
                
                <button
                  className="px-3 py-1.5 rounded text-white text-sm"
                  style={{ backgroundColor: theme.palette.error.main }}
                  onClick={() => handleDelete(address.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Other Addresses */}
      <div className="mb-4">
        <h3 className="text-lg font-medium mb-4" style={{ color: theme.palette.text.primary }}>Other Addresses</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {addresses.filter(address => !address.isDefault).map((address) => (
            <div 
              key={address.id}
              className="bg-white p-5 rounded-lg shadow-sm border relative"
              style={{ borderColor: theme.palette.divider }}
            >
              <div className="flex items-start">
                <div className="mr-3 mt-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"
                    style={{ color: theme.palette.text.secondary }}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                </div>
                
                <div className="flex-1">
                  <div className="mb-3">
                    <h3 className="font-semibold text-lg" style={{ color: theme.palette.text.primary }}>
                      {address.customerName}
                    </h3>
                    <p className="text-sm" style={{ color: theme.palette.text.secondary }}>
                      {address.phoneNumber}
                    </p>
                  </div>
                  
                  <div className="space-y-1 mb-4">
                    <p style={{ color: theme.palette.text.primary }}>
                      {address.streetNumber} {address.addressLine1}
                      {address.addressLine2 && `, ${address.addressLine2}`}
                    </p>
                    <p style={{ color: theme.palette.text.primary }}>
                      {address.ward}, {address.city}, {address.province}
                    </p>
                    <p style={{ color: theme.palette.text.primary }}>
                      {address.countryName} {address.postcode}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-2 mt-4">
                <button
                  className="px-3 py-1.5 rounded text-white text-sm"
                  style={{ backgroundColor: theme.palette.primary.main }}
                >
                  Edit
                </button>
                
                <button
                  className="px-3 py-1.5 rounded text-white text-sm"
                  style={{ backgroundColor: theme.palette.error.main }}
                  onClick={() => handleDelete(address.id)}
                >
                  Delete
                </button>
                
                <button
                  className="px-3 py-1.5 rounded text-sm border"
                  style={{ 
                    borderColor: theme.palette.primary.main,
                    color: theme.palette.primary.main
                  }}
                  onClick={() => handleSetDefault(address.id)}
                >
                  Set as Default
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {addresses.length === 0 && (
        <div 
          className="text-center py-8 rounded-lg border"
          style={{ 
            borderColor: theme.palette.divider,
            color: theme.palette.text.secondary
          }}
        >
          No addresses found. Add your first address!
        </div>
      )}
      
      {totalPages > 1 && (
        <div className="flex justify-center mt-8">
          <Pagination 
            count={totalPages} 
            page={currentPage} 
            onChange={handlePageChange}
            color="primary"
          />
        </div>
      )}
    </div>
  );
}
