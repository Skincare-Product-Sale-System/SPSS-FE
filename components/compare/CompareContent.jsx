"use client";
import { useContextElement } from "@/context/Context";
import request from "@/utils/axios";
import { useEffect, useState } from "react";
import CompareProductsList from "./CompareProductsList";
import CompareSpecifications from "./CompareSpecifications";

export default function CompareContent() {
  const contextData = useContextElement() || {};
  const { removeFromCompareItem, compareItem = [] } = contextData;
  const [items, setItems] = useState([]);

  useEffect(() => {
    if (!compareItem || compareItem.length === 0) return;
    
    const fetchCompareItems = async () => {
      try {
        const results = await Promise.all(
          compareItem.map(async (itemId) => {
            const { data } = await request.get(`/products/${itemId}`);
            return data.data;
          })
        );
        setItems(results);
      } catch (error) {
        console.error("Error fetching compare items:", error);
      }
    };

    fetchCompareItems();
  }, [compareItem]);
  
  // Determine all unique specification keys from all items
  const specKeys = items.length > 0 
    ? [...new Set(items.flatMap(item => Object.keys(item?.specifications || {})))]
    : [];

  const handleRemoveItem = (id) => {
    if (removeFromCompareItem) {
      removeFromCompareItem(id);
    }
  };

  return (
    <section className="flat-spacing-12">
      <div className="container">
        <div>
          <div className="tf-compare-table">
            {/* Product List Row */}
            <CompareProductsList 
              items={items} 
              onRemoveItem={handleRemoveItem} 
            />
            
            {/* Status Row */}
            <CompareSpecifications 
              title="Trạng thái"
              items={items}
              renderValue={(item) => (
                <div className="tf-compare-col tf-compare-field tf-compare-stock" style={{ flex: 1 }}>
                  <div className="icon">
                    <i className="icon-check" />
                  </div>
                  <span className="fw-5">{item?.status}</span>
                </div>
              )}
            />
            
            {/* Brand Row */}
            <CompareSpecifications 
              title="Thương hiệu"
              items={items}
              renderValue={(item) => (
                <div className="text-center tf-compare-col tf-compare-value" style={{ flex: 1 }}>
                  {item?.brand?.name}
                </div>
              )}
            />
            
            {/* Category Row */}
            <CompareSpecifications 
              title="Danh mục"
              items={items}
              renderValue={(item) => (
                <div className="text-center tf-compare-col tf-compare-value" style={{ flex: 1 }}>
                  {item?.category?.categoryName}
                </div>
              )}
            />
            
            {/* Rating Row */}
            <CompareSpecifications 
              title="Đánh giá"
              items={items}
              renderValue={(item) => (
                <div className="text-center tf-compare-col tf-compare-value" style={{ flex: 1 }}>
                  {item?.rating !== undefined && item?.rating !== null ? (
                    <div>
                      <div className="d-flex justify-center mb-1">
                        {[...Array(5)].map((_, i) => (
                          <span 
                            key={i} 
                            style={{ 
                              color: i < item.rating ? '#FFD700' : '#e0e0e0',
                              fontSize: '18px',
                              margin: '0 1px'
                            }}
                          >
                            ★
                          </span>
                        ))}
                      </div>
                      <div className="fs-14 fw-medium">
                        {item.rating.toFixed(1)} / 5
                      </div>
                    </div>
                  ) : (
                    "Chưa có đánh giá"
                  )}
                </div>              
              )}
            />
            
            {/* Sold Count Row */}
            <CompareSpecifications 
              title="Đã bán"
              items={items}
              renderValue={(item) => (
                <div className="text-center tf-compare-col tf-compare-value" style={{ flex: 1 }}>
                  {item?.soldCount || 0} sản phẩm
                </div>              
              )}
            />
            
            {/* Skin Type Row */}
            <CompareSpecifications 
              title="Loại da phù hợp"
              items={items}
              renderValue={(item) => (
                <div className="text-center tf-compare-col tf-compare-value" style={{ flex: 1 }}>
                  {item?.specifications?.skinIssues}
                </div>
              )}
            />
            
            {/* Dynamic Specifications */}
            {specKeys.filter(key => key !== 'skinIssues').map(key => (
              <CompareSpecifications 
                key={key}
                title={translateSpecification(key)}
                items={items}
                renderValue={(item) => (
                  <div className="flex justify-center text-center items-center tf-compare-col tf-compare-value" style={{ flex: 1 }}>
                    {item?.specifications?.[key] || "Không có"}
                  </div>
                )}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// Helper function to translate specification keys
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
  
  // If no translation found, format key to have spaces
  return translations[key] || key.replace(/([A-Z])/g, " $1").toLowerCase();
} 