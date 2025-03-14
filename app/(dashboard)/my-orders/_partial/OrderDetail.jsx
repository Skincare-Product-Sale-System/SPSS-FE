"use client";
import React from "react";
import dayjs from "dayjs";
import Image from "next/image";

export default function OrderDetail({ order, onClose }) {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const StatusTimeline = ({ statusChanges }) => {
    return (
      <div className="flow-root">
        <ul role="list" className="-mb-8">
          {statusChanges.map((status, idx) => (
            <li key={status.date}>
              <div className="relative pb-8">
                {idx !== statusChanges.length - 1 ? (
                  <span
                    className="absolute left-4 top-4 -ml-px h-full w-0.5 bg-gray-200"
                    aria-hidden="true"
                  />
                ) : null}
                <div className="relative flex space-x-3">
                  <div>
                    <span className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center ring-8 ring-white">
                      <svg
                        className="h-5 w-5 text-white"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 2a8 8 0 100 16 8 8 0 000-16zm1 11.414l4.707-4.707-1.414-1.414L11 10.586V5H9v5.586L5.707 7.293 4.293 8.707 9 13.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </span>
                  </div>
                  <div className="flex min-w-0 flex-1 justify-between items-center space-x-4">
                    <div>
                      <p className="text-sm text-gray-500">
                        Order status changed to{" "}
                        <span className="font-medium text-gray-900">
                          {status.status}
                        </span>
                      </p>
                    </div>
                    <div className="whitespace-nowrap text-right text-sm text-gray-500">
                      {dayjs(status.date).format("MMM DD, YYYY HH:mm")}
                    </div>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[900]">
      <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">Order Details</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Order Summary */}
        <div className="mb-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div>
              <p className="text-sm text-gray-500">Order ID</p>
              <p className="font-medium">#{order.id}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Date</p>
              <p className="font-medium">
                {dayjs(order.createdTime).format("MMM DD, YYYY")}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Status</p>
              <p className="font-medium">{order.status}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Total</p>
              <p className="font-medium">{formatCurrency(order.orderTotal)}</p>
            </div>
          </div>
        </div>

        {/* Order Items */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4">Order Items</h3>
          <div className="grid grid-cols-2 gap-4">
            {order.orderDetails.map((item) => (
              <div
                key={item.productId}
                className="flex items-center gap-4 border-b pb-4"
              >
                <div className="flex-shrink-0 w-20 h-20 relative">
                  <Image
                    src={item.productImage}
                    alt={item.productName}
                    fill
                    className="object-cover rounded"
                  />
                </div>
                <div className="flex-grow">
                  <h4 className="font-medium text-lg">{item.productName}</h4>
                  <p className="text-sm text-gray-500">
                    Variations: {item.variationOptionValues.join(", ")}
                  </p>
                  <p className="text-sm">
                    {formatCurrency(item.price)} x {item.quantity}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium">
                    {formatCurrency(item.price * item.quantity)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Shipping Address */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4">Shipping Address</h3>
          <div className="bg-gray-50 p-4 rounded">
            <p className="font-medium">{order.address.customerName}</p>
            <p>{order.address.phoneNumber}</p>
            <p>
              {order.address.streetNumber} {order.address.addressLine1}
              {order.address.addressLine2 && `, ${order.address.addressLine2}`}
            </p>
            <p>
              {order.address.ward}, {order.address.city},{" "}
              {order.address.province}
            </p>
            <p>
              {order.address.countryName} {order.address.postcode}
            </p>
          </div>
        </div>

        {/* Status Timeline */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Order Status History</h3>
          <StatusTimeline statusChanges={order.statusChanges} />
        </div>
      </div>
    </div>
  );
}
