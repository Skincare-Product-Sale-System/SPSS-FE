"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useContextElement } from "@/context/Context";
import { allProducts } from "@/data/products";
import request from "@/utils/axios";
import { defaultProductImage } from "@/utils/default";
import { formatPrice } from "@/utils/priceFormatter";

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
                          <div
                            className="icon"
                            style={{ cursor: "pointer" }}
                            onClick={() => removeFromCompareItem(elm?.id)}
                          >
                            <i className="icon-close" />
                          </div>
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
                          <div className="text-sm text-start line-clamp-1">
                            {elm?.name}
                          </div>
                          <div className="text-start">
                            <span className="new-price">
                              {formatPrice(elm?.price)}
                            </span>
                          </div>
                          <div className="text-start tf-compare-item-rating">
                            <span className="rating-star">
                              <i className="icon-star" />
                              <i className="icon-star" />
                              <i className="icon-star" />
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
