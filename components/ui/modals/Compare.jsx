"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useContextElement } from "@/context/Context";
import { allProducts } from "@/data/products";
import request from "@/utils/axios";
import { defaultProductImage } from "@/utils/default";
import { formatPrice } from "@/utils/priceFormatter";
import PriceFormatter from '@/components/ui/helpers/PriceFormatter';
import getStar from "@/utils/getStar";
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import Tooltip from '@mui/material/Tooltip';

export default function Compare() {
  const { removeFromCompareItem, compareItem, setCompareItem } =
    useContextElement();
  const [items, setItems] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      // fetch list of item data from api and set to items
      const data = await Promise.all(
        compareItem.map(async (item) => {
          const { data } = await request.get(`/products/${item}`);
          return data.data;
        })
      );
      console.log("compareItem", data);
      setItems(data);
    };
    fetchData();
  }, [compareItem]);

  // Prevent scroll issues when opening the compare modal
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const compareElement = document.getElementById('compare');
      
      if (compareElement) {
        const handleShow = () => {
          // Get current scroll position
          const scrollY = window.scrollY;
          
          // Apply the scroll restoration after the modal is fully visible
          const handleShown = () => {
            window.scrollTo(0, scrollY);
            compareElement.removeEventListener('shown.bs.offcanvas', handleShown);
          };
          
          compareElement.addEventListener('shown.bs.offcanvas', handleShown);
        };
        
        compareElement.addEventListener('show.bs.offcanvas', handleShow);
        
        // Clean up event listeners
        return () => {
          compareElement.removeEventListener('show.bs.offcanvas', handleShow);
        };
      }
    }
  }, []);

  return (
    <div className="canvas-compare offcanvas offcanvas-bottom" id="compare">
      <div className="canvas-wrapper">
        <header className="canvas-header">
          <div className="close-popup">
            <span
              className="icon-close icon-close-popup"
              data-bs-dismiss="offcanvas"
              aria-label="Đóng"
            />
          </div>
        </header>
        <div className="canvas-body">
          <div className="container">
            <div className="row">
              <div className="col-12">
                <div className="tf-compare-list">
                  <div className="tf-compare-head">
                    <div className="title">So Sánh Sản Phẩm</div>
                  </div>
                  <div className="tf-compare-offcanvas">
                    {items.map((elm, i) => (
                      <div key={i} className="tf-compare-item">
                        <div className="position-relative">
                          <Tooltip title="Xóa khỏi danh sách so sánh" arrow placement="top">
                            <div
                              className="icon"
                              style={{ 
                                cursor: "pointer", 
                                position: "absolute", 
                                right: "5px", 
                                top: "5px", 
                                zIndex: 10,
                                background: "rgba(255,255,255,0.8)",
                                borderRadius: "50%",
                                padding: "5px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center"
                              }}
                              onClick={() => removeFromCompareItem(elm?.id)}
                            >
                              <DeleteOutlineIcon style={{ color: "#df3b3b", fontSize: "18px" }} />
                            </div>
                          </Tooltip>
                          <Link href={`/product-detail/${elm?.id}`}>
                            <Image
                              className="h-[120px] aspect-square radius-3"
                              alt="image"
                              src={elm?.thumbnail || defaultProductImage}
                              style={{ objectFit: "cover" }}
                              width={720}
                              height={1005}
                            />
                          </Link>
                          <div className="text-sm text-start line-clamp-1 mt-2">
                            {elm?.name}
                          </div>
                          <div className="text-start mt-1">
                            <span className="new-price">
                              <PriceFormatter price={elm?.price} />
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="tf-compare-buttons">
                    <div className="tf-compare-buttons-wrap">
                      <Link
                        href={`/compare`}
                        className="flex-grow-1 btn-fill justify-content-center animate-hover-btn fs-14 fw-6 radius-3 tf-btn"
                      >
                        So Sánh
                      </Link>
                      <div
                        className="link tf-compapre-button-clear-all"
                        onClick={() => setCompareItem([])}
                      >
                        Xóa Tất Cả
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
