"use client";
import { useContextElement } from "@/context/Context";
import request from "@/utils/axios";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import Rating from "../common/Rating";
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

export default function Compare() {
  const { setQuickViewItem } = useContextElement();

  const { removeFromCompareItem, compareItem, setCompareItem } =
    useContextElement();
  const [items, setItems] = useState([]);
  useEffect(() => {
    Promise.all(
      // fetch list of item data from api and set to items
      compareItem.map(async (item) => {
        const { data } = await request.get(`/products/${item}`);
        return data.data;
      })
    ).then((res) => {
      console.log("compareItem", res);
      setItems(res);
    });
  }, [compareItem]);
  console.log("compareItemAt Compare Page", items);

  return (
    <section className="flat-spacing-12">
      <div className="container">
        <div>
          <div className="tf-compare-table">
            <div className="grid grid-cols-5 gap-4 items-stretch tf-compare-grid tf-compare-row">
              <div className="d-md-block d-none tf-compare-col" 
                style={{ 
                  position: 'sticky', 
                  left: 0, 
                  zIndex: 2,
                  backgroundColor: '#fff',
                  boxShadow: '4px 0 8px rgba(0,0,0,0.05)'
                }} 
              />

              {items.map((elm, i) => (
                <div key={i} className="flex flex-col h-full justify-between tf-compare-col">
                  <div className="tf-compare-item">
                    <Link
                      className="tf-compare-image"
                      href={`/product-detail/${elm?.id}`}
                    >
                      <Image
                        className="w-full aspect-square lazyload"
                        data-src={elm?.thumbnail}
                        alt="product image"
                        width={713}
                        height={1070}
                        src={elm?.thumbnail}
                      />
                    </Link>
                    <Link
                      className="tf-compare-title"
                      href={`/product-detail/${elm?.id}`}
                    >
                      {elm?.name}
                    </Link>
                    <div className="price">
                      <span className="price-on-sale">
                        ₫{elm?.price.toLocaleString()}
                      </span>
                    </div>
                    <div className="d-flex justify-center gap-2 tf-compare-group-btns">
                      <a
                        href="#quick_view"
                        data-bs-toggle="modal"
                        className="flex btn-outline-dark gap-2 items-center px-4 py-2 radius-3 tf-btn"
                        onClick={() => setQuickViewItem(elm)}
                      >
                        <i className="icon icon-view" />
                        <span>XEM NHANH</span>
                      </a>
                      <button
                        onClick={() => removeFromCompareItem(elm?.id)}
                        className="flex btn-outline-danger justify-center w-12 items-center radius-3 tf-btn"
                        style={{
                          border: '1px solid #dc3545',
                          color: '#dc3545',
                          borderRadius: '8px',
                          transition: 'all 0.2s',
                          height: '40px'
                        }}
                        onMouseOver={(e) => {
                          e.currentTarget.style.backgroundColor = '#dc3545';
                          e.currentTarget.style.color = 'white';
                        }}
                        onMouseOut={(e) => {
                          e.currentTarget.style.backgroundColor = 'transparent';
                          e.currentTarget.style.color = '#dc3545';
                        }}
                      >
                        <DeleteOutlineIcon />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-[auto_repeat(items.length,_minmax(0,_1fr))] gap-4 tf-compare-row">
              <div className="d-md-block d-none tf-compare-col tf-compare-field"
                style={{ 
                  position: 'sticky', 
                  left: 0, 
                  zIndex: 2,
                  backgroundColor: '#fff',
                  boxShadow: '4px 0 8px rgba(0,0,0,0.05)'
                }}
              >
                <h6>Trạng thái</h6>
              </div>
              {items.map((elm, i) => (
                <div
                  className="tf-compare-col tf-compare-field tf-compare-stock"
                  style={{ flex: 1 }}
                >
                  <div className="icon">
                    <i className="icon-check" />
                  </div>
                  <span className="fw-5">{elm?.status}</span>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-[auto_repeat(items.length,_minmax(0,_1fr))] gap-4 tf-compare-row">
              <div className="d-md-block d-none tf-compare-col tf-compare-field"
                style={{ 
                  position: 'sticky', 
                  left: 0, 
                  zIndex: 2,
                  backgroundColor: '#fff',
                  boxShadow: '4px 0 8px rgba(0,0,0,0.05)'
                }}
              >
                <h6>Thương hiệu</h6>
              </div>
              {items.map((elm, i) => (
                <div
                  className="text-center tf-compare-col tf-compare-value"
                  style={{ flex: 1 }}
                >
                  {elm?.brand?.name}
                </div>
              ))}
            </div>
            
            <div className="grid grid-cols-[auto_repeat(items.length,_minmax(0,_1fr))] gap-4 tf-compare-row">
              <div className="d-md-block d-none tf-compare-col tf-compare-field"
                style={{ 
                  position: 'sticky', 
                  left: 0, 
                  zIndex: 2,
                  backgroundColor: '#fff',
                  boxShadow: '4px 0 8px rgba(0,0,0,0.05)'
                }}
              >
                <h6>Danh mục</h6>
              </div>
              {items.map((elm, i) => (
                <div
                  className="text-center tf-compare-col tf-compare-value"
                  style={{ flex: 1 }}
                >
                  {elm?.category?.categoryName}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-[auto_repeat(items.length,_minmax(0,_1fr))] gap-4 tf-compare-row">
              <div className="d-md-block d-none tf-compare-col tf-compare-field"
                style={{ 
                  position: 'sticky', 
                  left: 0, 
                  zIndex: 2,
                  backgroundColor: '#fff',
                  boxShadow: '4px 0 8px rgba(0,0,0,0.05)'
                }}
              >
                <h6>Đánh giá</h6>
              </div>
              {items.map((elm, i) => (
                <div
                  className="text-center tf-compare-col tf-compare-value"
                  style={{ flex: 1 }}
                >
                  {elm?.rating !== undefined && elm?.rating !== null ? (
                    <Rating number={elm?.rating} />
                  ) : (
                    "Chưa có đánh giá"
                  )}
                </div>              
              ))}
            </div>
            <div className="grid grid-cols-[auto_repeat(items.length,_minmax(0,_1fr))] gap-4 tf-compare-row">
              <div className="d-md-block d-none tf-compare-col tf-compare-field"
                style={{ 
                  position: 'sticky', 
                  left: 0, 
                  zIndex: 2,
                  backgroundColor: '#fff',
                  boxShadow: '4px 0 8px rgba(0,0,0,0.05)'
                }}
              >
                <h6>Loại da phù hợp</h6>
              </div>
              {items.map((elm, i) => (
                <div
                  className="text-center tf-compare-col tf-compare-value"
                  style={{ flex: 1 }}
                >
                  {elm?.specifications?.skinIssues}
                </div>
              ))}
            </div>
            {Object.keys(items[0]?.specifications || {}).map((key) => (
            <div
              key={key}
              className="grid grid-cols-[auto_repeat(items.length,_minmax(0,_1fr))] gap-4 tf-compare-row"
            >
              <div className="d-md-block d-none tf-compare-col tf-compare-field"
                style={{ 
                  position: 'sticky', 
                  left: 0, 
                  zIndex: 2,
                  backgroundColor: '#fff',
                  boxShadow: '4px 0 8px rgba(0,0,0,0.05)'
                }}
              >
                <h6>{translateSpecification(key)}</h6>
              </div>
              {items.map((elm, i) => (
                <div
                  key={i}
                  className="flex justify-center text-center items-center tf-compare-col tf-compare-value"
                  style={{ flex: 1 }}
                >
                  {elm?.specifications?.[key] || "Không có"}
                </div>
              ))}
            </div>
          ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// Thêm hàm helper để dịch các specification
function translateSpecification(key) {
  const translations = {
    skinIssues: "Vấn đề về da",
    ingredients: "Thành phần",
    usage: "Cách sử dụng",
    effect: "Công dụng",
    volume: "Dung tích",
    origin: "Xuất xứ",
    mainFunction: "Công dụng chính",
    texture: "Kết cấu",
    englishName: "Tên tiếng Anh",
    keyActiveIngredients: "Thành phần hoạt tính chính",
    fragrance: "Mùi hương",
    skinType: "Loại da phù hợp",
    productForm: "Dạng sản phẩm",
    expiryDate: "Hạn sử dụng",
    madeIn: "Nơi sản xuất",
    manufacturer: "Nhà sản xuất",
    distributor: "Nhà phân phối",
    storageConditions: "Điều kiện bảo quản",
    precautions: "Lưu ý khi sử dụng",
    benefits: "Lợi ích sản phẩm",
    suitableFor: "Phù hợp với",
    howToUse: "Hướng dẫn sử dụng",
    packageIncludes: "Bao gồm trong hộp",
    productLine: "Dòng sản phẩm",
    productionDate: "Ngày sản xuất",
    detailedIngredients: "Thành phần chi tiết",
    storageInstruction: "Hướng dẫn bảo quản",
    usageInstruction: "Hướng dẫn sử dụng"
  };
  
  // Nếu không có bản dịch, format key thành dạng có khoảng trắng
  return translations[key] || key.replace(/([A-Z])/g, " $1").toLowerCase();
}
