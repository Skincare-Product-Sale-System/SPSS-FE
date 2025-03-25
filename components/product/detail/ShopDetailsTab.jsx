"use client";

import request from "@/utils/axios";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Box, Typography, Divider, Paper } from "@mui/material";

const tabs = [
  { title: "Mô tả", active: true },
  { title: "Vận chuyển", active: false },
  { title: "Chính sách đổi trả", active: false },
];

export default function ShopDetailsTab({ product }) {
  const [currentTab, setCurrentTab] = useState(1);
  const searchParams = useSearchParams();

  // Check if specifications exist
  const specs = product?.specifications || {};

  return (
    <section
      className="bg-neutral-50 flat-spacing-10 pt_0"
      style={{ maxWidth: "100vw", overflow: "clip" }}
    >
      <div className="container">
        <div className="row">
          <div className="col-12">
            <Paper elevation={0} className="rounded-lg overflow-hidden style-has-border widget-tabs">
              <Box className="widget-menu-tab" sx={{ 
                display: 'flex', 
                borderBottom: '1px solid #e5e7eb',
                backgroundColor: '#fff'
              }}>
                {tabs.map((elm, i) => (
                  <Box
                    key={i}
                    onClick={() => setCurrentTab(i + 1)}
                    className={`item-title ${
                      currentTab == i + 1 ? "active" : ""
                    }`}
                    sx={{
                      cursor: 'pointer',
                      padding: '0.75rem 1.25rem',
                      position: 'relative',
                      fontFamily: '"Roboto", sans-serif',
                      fontWeight: 500,
                      fontSize: '14px',
                      color: currentTab == i + 1 ? '#4ECDC4' : '#64748b',
                      '&::after': currentTab == i + 1 ? {
                        content: '""',
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        width: '100%',
                        height: '2px',
                        backgroundColor: '#4ECDC4'
                      } : {}
                    }}
                  >
                    <span className="inner">{elm.title}</span>
                  </Box>
                ))}
              </Box>
              <div className="bg-white p-4 widget-content-tab">
                <div
                  className={`widget-content-inner ${
                    currentTab == 1 ? "active" : ""
                  } `}
                >
                  <div className="">
                    {product.description && (
                      <Typography variant="body2" className="text-neutral-700 mb-3" style={{ fontFamily: '"Roboto", sans-serif' }}>
                        {product.description}
                      </Typography>
                    )}
                    
                    {/* Specifications Table */}
                    {product?.specifications && Object.values(product.specifications).some(value => value) && (
                      <div className="border-top mt-4 pt-3 specifications-section">
                        <Typography variant="subtitle1" className="font-medium fs-16 mb-2" style={{ fontFamily: '"Roboto", sans-serif' }}>
                          Thông số sản phẩm
                        </Typography>
                        
                        <div className="specifications-table">
                          <table className="border-collapse w-100">
                            <tbody>
                              {Object.entries(product.specifications).map(([key, value]) => {
                                if (!value) return null;
                                
                                // Dịch các trường thông số sang tiếng Việt
                                let translatedKey = key;
                                switch(key) {
                                  case "detailedIngredients":
                                    translatedKey = "Thành phần chi tiết";
                                    break;
                                  case "mainFunction":
                                    translatedKey = "Công dụng chính";
                                    break;
                                  case "texture":
                                    translatedKey = "Kết cấu";
                                    break;
                                  case "englishName":
                                    translatedKey = "Tên tiếng Anh";
                                    break;
                                  case "keyActiveIngredients":
                                    translatedKey = "Thành phần hoạt chất chính";
                                    break;
                                  case "storageInstruction":
                                    translatedKey = "Hướng dẫn bảo quản";
                                    break;
                                  case "usageInstruction":
                                    translatedKey = "Hướng dẫn sử dụng";
                                    break;
                                  case "expiryDate":
                                    translatedKey = "Hạn sử dụng";
                                    break;
                                  case "skinIssues":
                                    translatedKey = "Vấn đề về da";
                                    break;
                                  default:
                                    // Nếu không phải các trường đã định nghĩa, vẫn format theo cách cũ
                                    translatedKey = key.replace(/([A-Z])/g, ' $1')
                                      .replace(/^./, str => str.toUpperCase())
                                      .replace(/([a-z])([A-Z])/g, '$1 $2');
                                }
                                
                                return (
                                  <tr key={key} className="border-bottom" style={{ borderBottom: '1px solid #f0f0f0' }}>
                                    <td className="bg-gray-50 text-gray-600 fs-14 px-3 py-2" style={{ width: '40%', fontFamily: '"Roboto", sans-serif' }}>
                                      {translatedKey}
                                    </td>
                                    <td className="text-gray-800 fs-14 px-3 py-2" style={{ fontFamily: '"Roboto", sans-serif' }}>
                                      {value}
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Shipping tab content */}
                <div
                  className={`widget-content-inner ${
                    currentTab == 2 ? "active" : ""
                  } `}
                >
                  <div className="tf-page-privacy-policy">
                    <Typography variant="subtitle1" component="div" className="text-primary-800 font-serif mb-3" style={{ fontFamily: '"Playfair Display", serif' }}>
                      Chính sách vận chuyển
                    </Typography>
                    <Typography variant="body2" className="text-neutral-700 mb-2" style={{ fontFamily: '"Roboto", sans-serif' }}>
                      Chúng tôi cố gắng giao sản phẩm chăm sóc da của bạn nhanh chóng và an toàn nhất có thể. Tất cả đơn hàng được xử lý trong vòng 1-2 ngày làm việc.
                    </Typography>
                    <Typography variant="body2" className="text-neutral-700 mb-2" style={{ fontFamily: '"Roboto", sans-serif' }}>
                      Thời gian vận chuyển:
                    </Typography>
                    <ul className="list-disc text-neutral-700 mb-3 pl-4">
                      <li className="fs-14 mb-1" style={{ fontFamily: '"Roboto", sans-serif' }}>Nội địa (Việt Nam): 1-3 ngày làm việc</li>
                      <li className="fs-14 mb-1" style={{ fontFamily: '"Roboto", sans-serif' }}>Quốc tế: 7-14 ngày làm việc</li>
                    </ul>
                  </div>
                </div>
                
                {/* Return Policies tab content */}
                <div
                  className={`widget-content-inner ${
                    currentTab == 3 ? "active" : ""
                  } `}
                >
                  <div className="tf-page-privacy-policy">
                    <Typography variant="subtitle1" component="div" className="text-primary-800 font-serif mb-3" style={{ fontFamily: '"Playfair Display", serif' }}>
                      Chính sách đổi trả
                    </Typography>
                    <Typography variant="body2" className="text-neutral-700 mb-2" style={{ fontFamily: '"Roboto", sans-serif' }}>
                      Chúng tôi chấp nhận đổi trả trong vòng 30 ngày kể từ ngày giao hàng để hoàn tiền đầy đủ hoặc đổi sản phẩm.
                    </Typography>
                    <Typography variant="body2" className="text-neutral-700 mb-2" style={{ fontFamily: '"Roboto", sans-serif' }}>
                      Để đủ điều kiện đổi trả, sản phẩm của bạn phải:
                    </Typography>
                    <ul className="list-disc text-neutral-700 mb-3 pl-4">
                      <li className="fs-14 mb-1" style={{ fontFamily: '"Roboto", sans-serif' }}>Chưa sử dụng và trong tình trạng như ban đầu</li>
                      <li className="fs-14 mb-1" style={{ fontFamily: '"Roboto", sans-serif' }}>Còn nguyên bao bì gốc</li>
                      <li className="fs-14 mb-1" style={{ fontFamily: '"Roboto", sans-serif' }}>Có hóa đơn hoặc bằng chứng mua hàng</li>
                    </ul>
                  </div>
                </div>
              </div>
            </Paper>
          </div>
        </div>
      </div>
    </section>
  );
}
