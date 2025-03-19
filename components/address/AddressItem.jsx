"use client";
import React from "react";

export default function AddressItem({
  address,
  onEdit,
  onDelete,
  onSetDefault,
  showActions = false,
  isSelected = false,
  onSelect,
  className = "",
}) {
  // Destructure address properties with fallbacks for null values
  const {
    id,
    customerName = "",
    phoneNumber = "",
    countryName = "",
    streetNumber = "",
    addressLine1 = "",
    addressLine2 = "",
    city = "",
    ward = "",
    postCode = "",
    province = "",
    isDefault = false,
  } = address || {};

  // Kiểm tra xem có phải là địa chỉ rỗng không
  const isEmpty = !customerName && !phoneNumber && !addressLine1;
  
  if (isEmpty) {
    return (
      <div className="text-center py-4">
        <p className="text-gray-500">Invalid address information</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          {/* Tên và số điện thoại */}
          <div className="mb-2">
            <p className="font-semibold text-gray-800 text-lg">{customerName}</p>
            <p className="text-gray-600">{phoneNumber}</p>
          </div>

          {/* Địa chỉ chi tiết */}
          <div className="text-gray-700">
            <p>
              {streetNumber} {addressLine1}
              {addressLine2 && addressLine2 !== "string" && `, ${addressLine2}`}
            </p>
            <p>
              {ward && ward !== "string" && `${ward}, `}
              {city && city !== "string" && `${city}, `}
              {province && province !== "string" && `${province}`}
            </p>
            <p>
              {countryName}
              {postCode && postCode !== "string" && ` - ${postCode}`}
            </p>
          </div>
        </div>

        {/* Badge hiển thị trạng thái mặc định */}
        {isDefault && (
          <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
            Default
          </span>
        )}
      </div>

      {/* Action buttons nếu cần */}
      {showActions && (
        <div className="flex justify-end space-x-3 mt-4">
          {!isDefault && onSetDefault && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onSetDefault(id);
              }}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              Set as Default
            </button>
          )}
          {onEdit && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit(address);
              }}
              className="text-sm text-gray-600 hover:text-gray-800"
            >
              Edit
            </button>
          )}
          {onDelete && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(id);
              }}
              className="text-sm text-red-600 hover:text-red-800"
            >
              Delete
            </button>
          )}
        </div>
      )}
    </div>
  );
}
