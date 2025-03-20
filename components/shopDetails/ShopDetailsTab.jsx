"use client";

import request from "@/utils/axios";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Box, Typography, Divider, Paper } from "@mui/material";

const tabs = [
  { title: "Description", active: true },
  { title: "Shipping", active: false },
  { title: "Return Policies", active: false },
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
                      fontFamily: '"Poppins", sans-serif',
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
                      <Typography variant="body2" className="text-neutral-700 mb-3">
                        {product.description}
                      </Typography>
                    )}
                    
                    {/* Specifications Table */}
                    {product?.specifications && Object.values(product.specifications).some(value => value) && (
                      <div className="border-top mt-4 pt-3 specifications-section">
                        <Typography variant="subtitle1" className="font-medium fs-16 mb-2">Product Specifications</Typography>
                        
                        <div className="specifications-table">
                          <table className="border-collapse w-100">
                            <tbody>
                              {Object.entries(product.specifications).map(([key, value]) => {
                                if (!value) return null;
                                
                                // Format the key for display
                                const formattedKey = key.replace(/([A-Z])/g, ' $1')
                                  .replace(/^./, str => str.toUpperCase())
                                  .replace(/([a-z])([A-Z])/g, '$1 $2');
                                
                                return (
                                  <tr key={key} className="border-bottom" style={{ borderBottom: '1px solid #f0f0f0' }}>
                                    <td className="bg-gray-50 text-gray-600 fs-14 px-3 py-2" style={{ width: '40%' }}>{formattedKey}</td>
                                    <td className="text-gray-800 fs-14 px-3 py-2">{value}</td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                      <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center' }}>
                        <span style={{ marginRight: '8px', fontWeight: 500 }}>Rating:</span> 
                        <span>{product.ratingDisplay}</span>
                        <Box sx={{ display: 'flex', ml: 1 }}>
                          {/* Stars */}
                          <i className="icon-start" />
                          <i className="icon-start" />
                          <i className="icon-start" />
                          <i className="icon-start" />
                          <i className="icon-start" />
                        </Box>
                      </Typography>
                      
                      <Box component="span" sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        color: '#666',
                        '&::before': {
                          content: '""',
                          display: 'inline-block',
                          width: '4px',
                          height: '4px',
                          borderRadius: '50%',
                          backgroundColor: '#999',
                          margin: '0 8px'
                        }
                      }}>
                        Đã bán: <span style={{ color: '#ff0000', fontWeight: 500, marginLeft: '4px' }}>{product.soldCount?.toLocaleString('vi-VN')}</span>
                      </Box>
                    </Box>
                  </div>
                </div>
                
                {/* Shipping tab content */}
                <div
                  className={`widget-content-inner ${
                    currentTab == 2 ? "active" : ""
                  } `}
                >
                  <div className="tf-page-privacy-policy">
                    <Typography variant="subtitle1" component="div" className="text-primary-800 font-serif mb-3">
                      Shipping Policy
                    </Typography>
                    <Typography variant="body2" className="text-neutral-700 mb-2">
                      We strive to deliver your skincare products as quickly and safely as possible. All orders are processed within 1-2 business days.
                    </Typography>
                    <Typography variant="body2" className="text-neutral-700 mb-2">
                      Shipping times:
                    </Typography>
                    <ul className="list-disc text-neutral-700 mb-3 pl-4">
                      <li className="fs-14 mb-1">Domestic (Vietnam): 1-3 business days</li>
                      <li className="fs-14 mb-1">International: 7-14 business days</li>
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
                    <Typography variant="subtitle1" component="div" className="text-primary-800 font-serif mb-3">
                      Return Policy
                    </Typography>
                    <Typography variant="body2" className="text-neutral-700 mb-2">
                      We accept returns within 30 days of delivery for a full refund or exchange.
                    </Typography>
                    <Typography variant="body2" className="text-neutral-700 mb-2">
                      To be eligible for a return, your item must be:
                    </Typography>
                    <ul className="list-disc text-neutral-700 mb-3 pl-4">
                      <li className="fs-14 mb-1">Unused and in the same condition</li>
                      <li className="fs-14 mb-1">In the original packaging</li>
                      <li className="fs-14 mb-1">With receipt or proof of purchase</li>
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
