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
    postcode = "",
    province = "",
    isDefault = false,
  } = address || {};

  // Format the full address for display
  const formattedAddress = [
    addressLine1,
    addressLine2,
    ward && `Ward: ${ward}`,
    city,
    province,
    countryName,
    postcode && `Postal Code: ${postcode}`,
  ]
    .filter(Boolean)
    .join(", ");

  return (
    <>
      <div className="flex justify-between items-start mb-2">
        <div className="flex-1">
          {/* Customer name and phone if available */}
          {(customerName || phoneNumber) && (
            <div className="mb-2 flex items-center gap-2">
              {customerName && (
                <p className="font-semibold text-gray-800">{customerName}</p>
              )}
              {phoneNumber && (
                <p className="text-gray-600 text-sm">- {phoneNumber}</p>
              )}
            </div>
          )}

          {/* Street number and address lines */}
          <div className="mb-1">
            <p className="font-medium text-gray-800">
              {streetNumber && `${streetNumber} `}
              {addressLine1}
              {addressLine2 && `, ${addressLine2}`}
            </p>
          </div>

          {/* City, ward, province, country */}
          <p className="text-gray-600 text-sm">
            {city}
            {ward && `, ${ward}`}
            {province && `, ${province}`}
            {countryName && `, ${countryName}`}
          </p>

          {/* Postal code */}
          {postcode && (
            <p className="text-gray-600 text-sm">Postal Code: {postcode}</p>
          )}
        </div>

        {/* Default badge */}
        {isDefault && (
          <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
            Default
          </span>
        )}

        {/* Selected indicator for checkout/selection contexts */}
        {isSelected && !isDefault && (
          <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">
            Selected
          </span>
        )}
      </div>

      {/* Action buttons */}
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
    </>
  );
}
