"use client";

import { products5 } from "@/data/products";
import { Swiper, SwiperSlide } from "swiper/react";
import Image from "next/image";
import { useContextElement } from "@/context/Context";
import Link from "next/link";
import { Navigation, Pagination } from "swiper/modules";
import { use, useEffect, useState } from "react";
import { defaultProductImage } from "@/utils/default";
import request from "@/utils/axios";
import { useQueries } from "@tanstack/react-query";

export default function Products() {
  const {
    setQuickViewItem,
    setQuickAddItem,
    addToWishlist,
    isAddedtoWishlist,
    addToCompareItem,
    isAddedtoCompareItem,
  } = useContextElement();
  const tabs = [
    "Essentials",
    // , "Gift Sets"
  ];
  const [activeTab, setActiveTab] = useState(tabs[0]);
  const [filtered, setFiltered] = useState([]);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    request
      .get("/products?pageNumber=1&pageSize=100")
      .then(({ data }) => setProducts(data.data?.items || []));
  }, []);

  console.log("products2", products);

  return (
    <section className="bg_grey-6 flat-spacing-26 flat-spacing-9">
      <div className="container">
        <div className="flat-animate-tab flat-tab-store overflow-unset">
          <ul
            className="d-flex flex-wrap justify-content-center fadeInUp widget-tab-3 wow"
            data-wow-delay="0s"
            role="tablist"
          >
            {tabs.map((tab, index) => (
              <li
                onClick={() => setActiveTab(tab)}
                className="nav-tab-item"
                role="presentation"
                key={index}
              >
                <a className={activeTab === tab ? "active" : ""}>{tab}</a>
              </li>
            ))}
          </ul>
          <div className="tab-content">
            <div
              className="active show tab-pane"
              id="essentials"
              role="tabpanel"
            >
              <div className="wrap-carousel">
                <Swiper
                  dir="ltr"
                  spaceBetween={30}
                  slidesPerView={4}
                  breakpoints={{
                    768: { slidesPerView: 4 },
                    576: { slidesPerView: 3 },
                    0: { slidesPerView: 2 },
                  }}
                  modules={[Navigation, Pagination]}
                  navigation={{
                    prevEl: ".snbp265",
                    nextEl: ".snbn265",
                  }}
                  pagination={{ clickable: true, el: ".spd265" }}
                >
                  {products.slice(4, 8).map((product, index) => (
                    <SwiperSlide key={product.id}>
                      <div className="card-product style-skincare">
                        <div className="card-product-wrapper">
                          <a href={product.id} className="product-img">
                            <Image
                              className="img-product lazyload"
                              data-src={product.thumbnail}
                              alt="image-product"
                              src={product.thumbnail}
                              width={360}
                              height={384}
                            />
                            <Image
                              className="img-hover lazyload"
                              data-src={product.thumbnail}
                              alt="image-product"
                              src={product.thumbnail}
                              width={360}
                              height={384}
                            />
                          </a>
                          <div className="list-product-btn">
                            <a
                              onClick={() => addToWishlist(product.id)}
                              className="btn-icon-action bg_white box-icon wishlist"
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
                            {/* <a
                              href="#compare"
                              data-bs-toggle="offcanvas"
                              aria-controls="offcanvasLeft"
                              onClick={() => addToCompareItem(product.id)}
                              className="btn-icon-action bg_white box-icon compare"
                            >
                              <span
                                className={`icon icon-compare ${
                                  isAddedtoCompareItem(product.id)
                                    ? "added"
                                    : ""
                                }`}
                              />
                              <span className="tooltip">
                                {" "}
                                {isAddedtoCompareItem(product.id)
                                  ? "Already Compared"
                                  : "Add to Compare"}
                              </span>
                              <span className="icon icon-check" />
                            </a> */}
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
                        </div>
                        <div className="card-product-info text-center">
                          <Link
                            href={`/product-detail/${product.id}`}
                            className="link title"
                          >
                            {product.name}
                          </Link>
                          <span className="price">
                            {product.marketPrice && (
                              <span className="text-sale fw-4">
                                {product.marketPrice}
                              </span>
                            )}{" "}
                            <span className="text_primary">
                              ${product.price.toLocaleString()}
                            </span>
                          </span>
                          <div className="tf-size-list">
                            {["300ml", "500ml", "700ml"].map((size, i) => (
                              <span
                                key={i}
                                className="fw-6 radius-3 tf-size-list-item"
                              >
                                {size}
                              </span>
                            ))}
                            {/* {product.sizes.map((size, i) => (
                              <span
                                key={i}
                                className="fw-6 radius-3 tf-size-list-item"
                              >
                                {size}
                              </span>
                            ))} */}
                          </div>
                          <div className="tf-product-btns">
                            <a
                              href={"/product-detail/" + product.id}
                              // onClick={() => setQuickAddItem(product.id)}
                              // data-bs-toggle="modal"
                              className="btn-fill animate-hover-btn radius-3 style-3 tf-btn"
                            >
                              View detail
                            </a>
                          </div>
                        </div>
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
                <div className="nav-next-sell-1 nav-next-slider nav-sw box-icon round snbp265 style-not-line w_46">
                  <span className="icon icon-arrow-left" />
                </div>
                <div className="nav-prev-sell-1 nav-prev-slider nav-sw box-icon round snbn265 style-not-line w_46">
                  <span className="icon icon-arrow-right" />
                </div>
                <div className="justify-content-center spd265 style-2 sw-dots sw-pagination-sell-1" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
