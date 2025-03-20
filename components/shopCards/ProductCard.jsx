"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useContextElement } from "@/context/Context";
import { defaultProductImage } from "@/utils/default";
import { formatPrice } from "@/utils/priceFormatter";

export const ProductCard = ({ product }) => {
  const [currentImage, setCurrentImage] = useState(product.imgSrc);
  const { setQuickViewItem } = useContextElement();
  const {
    addToCompareItem,
    isAddedtoCompareItem,
  } = useContextElement();

  useEffect(() => {
    setCurrentImage(defaultProductImage);
  }, [product]);

  return (
    <div className="card-product fl-item" key={product.id}>
      <div className="card-product-wrapper">
        <Link href={`/product-detail/${product.id}`} className="product-img">
          <Image
            className="img-product lazyload"
            data-src={product.thumbnail}
            src={product.thumbnail}
            alt="image-product"
            width={720}
            height={1005}
            style={{
              aspectRatio: "1/1",
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
          <Image
            className="img-hover lazyload"
            data-src={product.thumbnail}
            src={product.thumbnail}
            alt="image-product"
            width={720}
            height={1005}
            style={{
              aspectRatio: "1/1",
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        </Link>
        {product.soldOut ? (
          <div className="sold-out">
            <span>Sold out</span>
          </div>
        ) : (
          <>
            <div className="list-product-btn">
              <a
                href="#compare"
                data-bs-toggle="offcanvas"
                aria-controls="offcanvasLeft"
                onClick={() => addToCompareItem(product.id)}
                className="btn-icon-action bg_white box-icon compare"
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
                <span className="icon icon-check" />
              </a>
              <a
                href="#quick_view"
                onClick={() => setQuickViewItem(product)}
                data-bs-toggle="modal"
                className="bg_white box-icon quickview tf-btn-loading"
              >
                <span className="icon icon-view" />
                <span className="tooltip">Quick View</span>
              </a>
            </div>
          </>
        )}
      </div>
      <div className="card-product-info">
        <Link href={`/product-detail/${product.id}`} className="link title">
          {product.name}
        </Link>
        <div className="text-gray-500 text-sm line-clamp-1">
          {product.description}
        </div>
        <div className="flex justify-between items-center">
          <span className="price" style={{ color: "#ff0000" }}>
            {formatPrice(product.price)}
            <span className="compare-at-price pr-8 strikethrough">
              {product.marketPrice && formatPrice(product.marketPrice)}
            </span>
          </span>
          <span className="text-gray-500 text-xs" style={{ fontFamily: 'Roboto, sans-serif' }}>
            Đã bán: {product.soldCount?.toLocaleString('vi-VN') || 0}
          </span>
        </div>
      </div>
    </div>
  );
};
