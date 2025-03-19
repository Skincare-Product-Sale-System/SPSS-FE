"use client";
import { useState } from "react";
import React from "react";
import Image from "next/image";
import { useContextElement } from "@/context/Context";
import { useThemeColors } from "@/context/ThemeContext";
export default function Productcard23({ product }) {
  const [currentImage, setCurrentImage] = useState(product.imgSrc);
  const { setQuickViewItem } = useContextElement();
  const {
    setQuickAddItem,
    addToWishlist,
    isAddedtoWishlist,
    addToCompareItem,
    isAddedtoCompareItem,
  } = useContextElement();
  const mainColor = useThemeColors();
  return (
    <div
      className="card-product list-layout"
      style={{
        transition: "all 0.3s ease",
        "&:hover": {
          transform: "translateY(-3px)",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)"
        }
      }}
    >
      <div className="card-product-wrapper">
        <a href="#" className="product-img">
          <Image
            className="lazyload img-product"
            alt="image-product"
            src={product.thumbnail}
            width={720}
            height={1005}
          />
          <Image
            className="lazyload img-hover"
            alt="image-product"
            src={product.thumbnail}
            width={720}
            height={1005}
          />
        </a>
      </div>
      <div className="card-product-info">
        <a href="#" className="title link">
          {product.name}
        </a>
        <span className="price">${product.price.toLocaleString()}</span>
        <p className="description">{product.description}</p>
        {/* {product.colors && (
          <ul className="list-color-product">
            {product.colors.map((color) => (
              <li
                className={`list-color-item color-swatch ${
                  currentImage == color.imgSrc ? "active" : ""
                } `}
                onMouseOver={() => setCurrentImage(color.imgSrc)}
                key={color.name}
              >
                <span className="tooltip">{color.name}</span>
                <span className={`swatch-value ${color.colorClass}`} />
                <Image
                  className="lazyload"
                  data-src={color.imgSrc}
                  src={color.imgSrc}
                  alt="image-product"
                  width={720}
                  height={1005}
                />
              </li>
            ))}
          </ul>
        )} */}
        {product.sizes && (
          <div className="size-list">
            {product.sizes.map((size) => (
              <span key={size}>{size}</span>
            ))}
          </div>
        )}
        <div className="list-product-btn">
          <a
            href="#quick_add"
            onClick={() => setQuickAddItem(product.id)}
            data-bs-toggle="modal"
            className="box-icon quick-add style-3 hover-tooltip"
          >
            <span className="icon icon-bag" />
            <span className="tooltip">Quick add</span>
          </a>
          <a
            onClick={() => addToWishlist(product.id)}
            className="box-icon wishlist style-3 hover-tooltip"
          >
            <span
              className={`icon icon-heart ${
                isAddedtoWishlist(product.id) ? "added" : ""
              }`}
            />
            <span className="tooltip">
              {isAddedtoWishlist(product.id)
                ? "Already Wishlisted"
                : "Add to Wishlist"}
            </span>
          </a>

          <a
            href="#compare"
            data-bs-toggle="offcanvas"
            aria-controls="offcanvasLeft"
            onClick={() => addToCompareItem(product.id)}
            className="box-icon compare style-3 hover-tooltip"
          >
            <span
              className={`icon icon-compare ${
                isAddedtoCompareItem(product.id) ? "added" : ""
              }`}
            />
            <span className="tooltip">
              {" "}
              {isAddedtoCompareItem(product.id)
                ? "Already Compared"
                : "Add to Compare"}
            </span>
          </a>
          <a
            href="#quick_view"
            onClick={() => setQuickViewItem(product)}
            data-bs-toggle="modal"
            className="box-icon quickview style-3 hover-tooltip"
          >
            <span className="icon icon-view" />
            <span className="tooltip">Quick view</span>
          </a>
        </div>
      </div>
    </div>
  );
}
