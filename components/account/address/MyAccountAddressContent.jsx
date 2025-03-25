"use client"
import { useState, useEffect } from "react";
import { useTheme } from "@mui/material/styles";
import Pagination from "@/components/ui/common/Pagination";
import request from "@/utils/axios";
import toast from "react-hot-toast";
import useAuthStore from "@/context/authStore";
import AddressList from "./AddressList";
import AddressForm from "./AddressForm";

export default function MyAccountAddressContent() {
  const theme = useTheme();
  const { Id } = useAuthStore();
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeEdit, setActiveEdit] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const pageSize = 5;

  useEffect(() => {
    fetchAddresses();
  }, [Id, currentPage]);

  const fetchAddresses = async () => {
    try {
      const { data } = await request.get(`/addresses/user?pageNumber=${currentPage}&pageSize=${pageSize}`);
      setAddresses(data.data.items);
      setTotalPages(data.data.totalPages);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching addresses:", error);
      toast.error("Failed to load addresses");
      setLoading(false);
    }
  };

  const handleAddAddress = () => {
    setSelectedAddress(null);
    setActiveEdit(true);
  };

  const handleEditAddress = (address) => {
    setSelectedAddress(address);
    setActiveEdit(true);
  };

  const handleDeleteAddress = async (addressId) => {
    if (window.confirm("Are you sure you want to delete this address?")) {
      try {
        await request.delete(`/addresses/${addressId}`);
        toast.success("Address deleted successfully");
        fetchAddresses();
      } catch (error) {
        toast.error("Failed to delete address");
      }
    }
  };

  const handleSetDefault = async (addressId) => {
    try {
      await request.patch(`/addresses/${addressId}/set-default`);
      toast.success("Default address updated");
      fetchAddresses();
    } catch (error) {
      toast.error("Failed to update default address");
    }
  };

  const handleFormSuccess = () => {
    fetchAddresses();
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="border-b-2 border-t-2 h-12 rounded-full w-12 animate-spin" 
             style={{ borderColor: theme.palette.primary.main }}></div>
      </div>
    );
  }

  return (
    <div className="account-address my-account-content">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold" style={{ color: theme.palette.text.primary }}>Địa chỉ của tôi</h2>
        <button
          className="rounded-md text-white hover:opacity-90 px-4 py-2 transition-all mt-2"
          style={{ backgroundColor: theme.palette.primary.main }}
          onClick={handleAddAddress}
        >
          Thêm địa chỉ mới
        </button>
      </div>

      {activeEdit && (
        <AddressForm
          open={activeEdit}
          onClose={() => setActiveEdit(false)}
          address={selectedAddress}
          onSuccess={handleFormSuccess}
        />
      )}

      <AddressList
        addresses={addresses}
        onEdit={handleEditAddress}
        onDelete={handleDeleteAddress}
        onSetDefault={handleSetDefault}
      />
      
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
