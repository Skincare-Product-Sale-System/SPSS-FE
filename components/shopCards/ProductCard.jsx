"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useContextElement } from "@/context/Context";
import CountdownComponent from "../common/Countdown";
import { defaultProductImage } from "@/utlis/default";
export const ProductCard = ({ product }) => {
  const [currentImage, setCurrentImage] = useState(product.imgSrc);
  const { setQuickViewItem } = useContextElement();
  const {
    setQuickAddItem,
    addToWishlist,
    isAddedtoWishlist,
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
            className="lazyload img-product"
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
            className="lazyload img-hover"
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
              {/* <a
                href="#quick_add"
                onClick={() => setQuickAddItem(product.id)}
                data-bs-toggle="modal"
                className="box-icon bg_white quick-add tf-btn-loading"
              >
                <span className="icon icon-bag" />
                <span className="tooltip">Quick Add</span>
              </a> */}
              <a
                onClick={() => addToWishlist(product.id)}
                className="box-icon bg_white wishlist btn-icon-action"
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
                <span className="icon icon-delete" />
              </a>
              <a
                href="#compare"
                data-bs-toggle="offcanvas"
                aria-controls="offcanvasLeft"
                onClick={() => addToCompareItem(product.id)}
                className="box-icon bg_white compare btn-icon-action"
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
                className="box-icon bg_white quickview tf-btn-loading"
              >
                <span className="icon icon-view" />
                <span className="tooltip">Quick View</span>
              </a>
            </div>
            {product.countdown && (
              <div className="countdown-box">
                <div className="js-countdown">
                  <CountdownComponent />
                </div>
              </div>
            )}
            {product.sizes && (
              <div className="size-list">
                {product.sizes.map((size) => (
                  <span key={size}>{size}</span>
                ))}
              </div>
            )}
          </>
        )}
      </div>
      <div className="card-product-info">
        <Link href={`/product-detail/${product.id}`} className="title link">
          {product.name}
        </Link>
        <div className="text-sm text-gray-500 line-clamp-1">
          {product.description}
        </div>
        <span className="price" style={{ color: "#ff0000" }}>
          ${product.price.toLocaleString()}
          <span className="pr-8 compare-at-price strikethrough">
            ${product.marketPrice?.toLocaleString()}
          </span>
        </span>

        <div className="rating">
          <i className="icon-start" />
          <i className="icon-start" />
          <i className="icon-start" />
          <i className="icon-start" />
          <i className="icon-start" />
        </div>
        {product.colors && (
          <ul className="list-color-product">
            {product.colors.map((color, i) => (
              <li
                className={`list-color-item color-swatch ${
                  currentImage == color.imgSrc ? "active" : ""
                } `}
                key={i}
                onMouseOver={() => setCurrentImage(color.imgSrc)}
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
                  style={{
                    aspectRatio: "1/1",
                    objectFit: "cover",
                  }}
                />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};
