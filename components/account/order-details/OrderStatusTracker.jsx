import React from 'react';

export default function OrderStatusTracker({ order, currentStep, lastValidStep, getStatusCircleColor, getStatusBorderColor, getStatusIcon, translateStatus, reason, isStatusBefore }) {
  return (
    <>
      <div className="mb-4">
        <div className="relative">
          <div className="flex justify-between items-center mb-2">
            <div 
              className="h-1 rounded-full -z-5 absolute left-12 right-12 top-4"
              style={{
                background: currentStep === -1 
                  ? `linear-gradient(to right, 
                      #14b8a6 ${((lastValidStep - 1) / 2) * 100}%, 
                      #ef4444 ${((lastValidStep - 1) / 2) * 100}%, 
                      #ef4444 100%
                    )`
                  : `linear-gradient(to right, 
                      #14b8a6 ${((currentStep - 1) / 3) * 100}%, 
                      #e5e7eb ${((currentStep - 1) / 3) * 100}%
                    )`
              }}
            />

            <div className="flex justify-between w-full items-center relative z-10">
              {currentStep === -1 ? (
                ['Đặt hàng', 'Xử lý', 'Đã hủy'].map((label, index) => (
                  <div key={index} className="flex flex-col items-center">
                    <div
                      className={`w-8 h-8 flex items-center justify-center rounded-full transition-all duration-300 ${
                        index === 2 
                          ? "bg-red-500 text-white shadow-lg shadow-red-200"
                          : index + 1 <= lastValidStep
                            ? "bg-teal-500 text-white shadow-lg shadow-teal-200"
                            : "bg-gray-200"
                      }`}
                    >
                      <span className="text-xs">{(index + 1).toString().padStart(2, '0')}</span>
                    </div>
                    <span className="text-xs mt-1">{label}</span>
                  </div>
                ))
              ) : (
                ['Đặt hàng', 'Xử lý', 'Đang giao', 'Đã giao'].map((label, index) => (
                  <div key={index} className="flex flex-col items-center">
                    <div
                      className={`w-8 h-8 flex items-center justify-center rounded-full transition-all duration-300 ${
                        index + 1 <= currentStep
                          ? "bg-teal-500 text-white shadow-lg shadow-teal-200"
                          : "bg-gray-200"
                      }`}
                    >
                      <span className="text-xs">{(index + 1).toString().padStart(2, '0')}</span>
                    </div>
                    <span className="text-xs mt-1">{label}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {order.statusChanges && order.statusChanges.length > 0 && (
        <div className="border-t mt-4 pt-3">
          <h4 className="text-gray-700 text-xs font-semibold mb-2 uppercase">
            LỊCH SỬ ĐƠN HÀNG
          </h4>
          <div className="flow-root">
            <ul role="list" className="-mb-4">
              {order.statusChanges.map((statusChange, idx) => (
                <li key={idx}>
                  <div className="pb-4 relative">
                    {idx !== order.statusChanges.length - 1 ? (
                      <span
                        className="bg-gray-200 h-full w-0.5 -ml-px absolute left-3 top-3"
                        aria-hidden="true"
                      />
                    ) : null}
                    <div className="flex relative space-x-3">
                      <div>
                        <span
                          className={`h-8 w-8 rounded-full flex items-center justify-center ring-4 ring-white
                            ${
                              ["Delivered", "Completed", "Cancelled"].includes(statusChange.status) || 
                              isStatusBefore(statusChange.status, order.status)
                                ? `${getStatusCircleColor(statusChange.status)} text-white`
                                
                                : statusChange.status === order.status
                                  ? `bg-white border-2 border-dashed ${getStatusBorderColor(statusChange.status)}`
                                  
                                  : "bg-gray-200"
                            }
                          `}
                        >
                          <div className={
                            ["Delivered", "Completed", "Cancelled"].includes(statusChange.status) || 
                            isStatusBefore(statusChange.status, order.status)
                              ? "text-white" 
                              : statusChange.status === order.status
                                ? getStatusBorderColor(statusChange.status).replace("border-", "text-")
                                : "text-gray-500"
                          }>
                            {getStatusIcon(statusChange.status)}
                          </div>
                        </span>
                      </div>
                      <div className="flex flex-1 justify-between items-center min-w-0 space-x-2">
                        <div>
                          <p className="text-gray-600 text-sm">
                            Trạng thái:{" "}
                            <span className="text-gray-900 font-medium">
                              {translateStatus(statusChange.status)}
                            </span>
                            {statusChange.status === "Cancelled" && <div>(Lý do: {reason})</div>}
                          </p>
                        </div>
                        <div className="text-gray-500 text-right text-xs whitespace-nowrap">
                          {new Date(statusChange.date).toLocaleString('vi-VN', {
                            month: 'short',
                            day: '2-digit',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </>
  );
} 