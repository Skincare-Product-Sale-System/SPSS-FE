"use client"
import { useTheme } from "@mui/material/styles";

export default function AddressList({ addresses, onEdit, onDelete, onSetDefault }) {
  const theme = useTheme();

  return (
    <>
      {/* Default Address */}
      {addresses.filter(address => address.isDefault).length > 0 && (
        <div className="mb-8">
          <h3 className="text-lg font-medium mb-4" style={{ color: theme.palette.text.primary }}>Địa chỉ mặc định</h3>
          {addresses.filter(address => address.isDefault).map((address) => (
            <div 
              key={address.id}
              className="bg-white border-2 p-6 rounded-lg shadow-md relative"
              style={{ 
                borderColor: theme.palette.primary.main,
                backgroundColor: `${theme.palette.primary.light}10` 
              }}
            >
              <div className="rounded-full text-sm absolute font-medium px-3 py-1 right-4 top-4"
                style={{ 
                  backgroundColor: theme.palette.primary.main,
                  color: theme.palette.primary.contrastText
                }}
              >
                Địa chỉ mặc định
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
                    <h3 className="text-lg font-semibold" style={{ color: theme.palette.text.primary }}>
                      {address.customerName}
                    </h3>
                    <p className="text-sm" style={{ color: theme.palette.text.secondary }}>
                      {address.phoneNumber}
                    </p>
                  </div>
                  
                  <div className="mb-4 space-y-1">
                    <p style={{ color: theme.palette.text.primary }}>
                      {address.streetNumber} {address.addressLine1}
                      {address.addressLine2 && `, ${address.addressLine2}`}
                    </p>
                    <p style={{ color: theme.palette.text.primary }}>
                      {address.ward}, {address.city}, {address.province}
                    </p>
                    <p style={{ color: theme.palette.text.primary }}>
                      {address.countryName} {address.postCode}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-2 mt-4">
                <button
                  className="rounded text-sm text-white px-3 py-1.5"
                  style={{ backgroundColor: theme.palette.primary.main }}
                  onClick={() => onEdit(address)}
                >
                  Chỉnh sửa
                </button>
                
                <button
                  className="rounded text-sm text-white px-3 py-1.5"
                  style={{ backgroundColor: theme.palette.error.main }}
                  onClick={() => onDelete(address.id)}
                >
                  Xóa
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Other Addresses */}
      <div className="mb-4">
        <h3 className="text-lg font-medium mb-4" style={{ color: theme.palette.text.primary }}>Địa chỉ khác</h3>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {addresses.filter(address => !address.isDefault).map((address) => (
            <div 
              key={address.id}
              className="bg-white border p-5 rounded-lg shadow-sm relative"
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
                    <h3 className="text-lg font-semibold" style={{ color: theme.palette.text.primary }}>
                      {address.customerName}
                    </h3>
                    <p className="text-sm" style={{ color: theme.palette.text.secondary }}>
                      {address.phoneNumber}
                    </p>
                  </div>
                  
                  <div className="mb-4 space-y-1">
                    <p style={{ color: theme.palette.text.primary }}>
                      {address.streetNumber} {address.addressLine1}
                      {address.addressLine2 && `, ${address.addressLine2}`}
                    </p>
                    <p style={{ color: theme.palette.text.primary }}>
                      {address.ward}, {address.city}, {address.province}
                    </p>
                    <p style={{ color: theme.palette.text.primary }}>
                      {address.countryName} {address.postCode}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-2 mt-4">
                <button
                  className="rounded text-sm text-white px-3 py-1.5"
                  style={{ backgroundColor: theme.palette.primary.main }}
                  onClick={() => onEdit(address)}
                >
                  Chỉnh sửa
                </button>
                
                <button
                  className="rounded text-sm text-white px-3 py-1.5"
                  style={{ backgroundColor: theme.palette.error.main }}
                  onClick={() => onDelete(address.id)}
                >
                  Xóa
                </button>
                
                <button
                  className="border rounded text-sm px-3 py-1.5"
                  style={{ 
                    borderColor: theme.palette.primary.main,
                    color: theme.palette.primary.main
                  }}
                  onClick={() => onSetDefault(address.id)}
                >
                  Đặt làm mặc định
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {addresses.length === 0 && (
        <div 
          className="border rounded-lg text-center py-8"
          style={{ 
            borderColor: theme.palette.divider,
            color: theme.palette.text.secondary,
            fontFamily: '"Roboto", sans-serif'
          }}
        >
          Không tìm thấy địa chỉ nào. Hãy thêm địa chỉ đầu tiên của bạn!
        </div>
      )}
    </>
  );
} 