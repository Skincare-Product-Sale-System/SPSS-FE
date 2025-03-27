"use client";
import { useContextElement } from "@/context/Context";
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { formatPrice } from "@/utils/priceFormatter";
import { defaultProductImage } from "@/utils/default";
import PriceFormatter from '@/components/ui/helpers/PriceFormatter';

export default function CompareProductsList({ items, onRemoveItem }) {
  const contextData = useContextElement() || {};
  const { setQuickViewItem, removeFromCompareItem } = contextData;
  
  const handleQuickView = (product) => {
    if (setQuickViewItem) {
      setQuickViewItem(product);
    }
  };

  // Dynamically generate grid template based on items count
  const gridTemplateColumns = items.length > 0 
    ? `auto repeat(${items.length}, minmax(0, 1fr))` 
    : '1fr';

  if (items.length === 0) {
    return (
      <div className="text-center py-5">
        <p className="mb-4">Không có sản phẩm nào để so sánh.</p>
        <Link 
          href="/products" 
          className="btn btn-primary"
          style={{ fontFamily: 'var(--font-primary, "Roboto"), sans-serif' }}
        >
          Tiếp tục mua sắm
        </Link>
      </div>
    );
  }

  return (
    <div 
      className="grid gap-4 items-stretch tf-compare-grid tf-compare-row"
      style={{ gridTemplateColumns }}
    >
      <div 
        className="d-md-block d-none tf-compare-col" 
        style={{ 
          position: 'sticky', 
          left: 0, 
          zIndex: 2,
          backgroundColor: '#fff',
          boxShadow: '4px 0 8px rgba(0,0,0,0.05)'
        }} 
      />

      {items.map((product, index) => (
        <div key={index} className="flex flex-col h-full justify-between tf-compare-col">
          <div className="tf-compare-item">
            <Link
              className="tf-compare-image"
              href={`/product-detail?id=${product?.id}`}
            >
              <Image
                className="w-full aspect-square lazyload"
                data-src={product?.thumbnail}
                alt={product?.name || "Product image"}
                width={713}
                height={1070}
                src={product?.thumbnail}
              />
            </Link>
            <Link
              className="tf-compare-title"
              href={`/product-detail?id=${product?.id}`}
            >
              {product?.name}
            </Link>
            <div className="price">
              <span className="price-on-sale">
                <PriceFormatter price={product?.price} />
              </span>
            </div>
            <div className="d-flex justify-center gap-2 tf-compare-group-btns">
              <a
                href="#quick_view"
                data-bs-toggle="modal"
                className="flex btn-outline-dark gap-2 items-center px-4 py-2 radius-3 tf-btn"
                onClick={() => handleQuickView(product)}
              >
                <i className="icon icon-view" />
                <span>XEM NHANH</span>
              </a>
              <button
                onClick={() => onRemoveItem ? onRemoveItem(product?.id) : removeFromCompareItem(product?.id)}
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
  );
} 