"use client";

import { products5 } from "@/data/products";
import { Swiper, SwiperSlide } from "swiper/react";
import Image from "next/image";
import { useContextElement } from "@/context/Context";
import Link from "next/link";
import { Navigation, Pagination } from "swiper/modules";
import { useEffect, useState } from "react";
import { defaultProductImage } from "@/utlis/default";
import request from "@/utlis/axios";

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
    (async () => {
      const { data } = await request.get("/Product/all?Page=1&PageSize=200");
      // console.log("data?.data?.results", data?.data?.results);

      setFiltered(data?.data?.results);
      // setProducts(data?.data?.results);
      // setFiltered(
      //   data?.data?.results.filter((el) =>
      //     el.filterCategories.includes(activeTab)
      //   )
      // );
    })();
  }, [activeTab, products]);

  return (
    <section className="flat-spacing-9 bg_grey-6 flat-spacing-26">
      <div className="container">
        <div className="flat-tab-store flat-animate-tab overflow-unset">
          <ul
            className="widget-tab-3 d-flex justify-content-center flex-wrap wow fadeInUp"
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
              className="tab-pane active show"
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
                  {filtered.map((product, index) => (
                    <SwiperSlide key={index}>
                      <div className="card-product style-skincare">
                        <div className="card-product-wrapper">
                          <a href={product.id} className="product-img">
                            <Image
                              className="lazyload img-product"
                              data-src={defaultProductImage}
                              alt="image-product"
                              src={defaultProductImage}
                              width={360}
                              height={384}
                            />
                            <Image
                              className="lazyload img-hover"
                              data-src={defaultProductImage}
                              alt="image-product"
                              src={defaultProductImage}
                              width={360}
                              height={384}
                            />
                          </a>
                          <div className="list-product-btn">
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
                            {/* <a
                              href="#compare"
                              data-bs-toggle="offcanvas"
                              aria-controls="offcanvasLeft"
                              onClick={() => addToCompareItem(product.id)}
                              className="box-icon bg_white compare btn-icon-action"
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
                              className="box-icon bg_white quickview tf-btn-loading"
                            >
                              <span className="icon icon-view" />
                              <span className="tooltip">Quick View</span>
                            </a>
                          </div>
                        </div>
                        <div className="card-product-info text-center">
                          <Link
                            href={`/product-detail/${product.id}`}
                            className="title link"
                          >
                            {product.name}
                          </Link>
                          <span className="price">
                            {product.marketPrice && (
                              <span className="fw-4 text-sale">
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
                                className="tf-size-list-item fw-6 radius-3"
                              >
                                {size}
                              </span>
                            ))}
                            {/* {product.sizes.map((size, i) => (
                              <span
                                key={i}
                                className="tf-size-list-item fw-6 radius-3"
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
                              className="tf-btn style-3 radius-3 btn-fill animate-hover-btn"
                            >
                              View detail
                            </a>
                          </div>
                        </div>
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
                <div className="nav-sw style-not-line nav-next-slider nav-next-sell-1 box-icon w_46 round snbp265">
                  <span className="icon icon-arrow-left" />
                </div>
                <div className="nav-sw style-not-line nav-prev-slider nav-prev-sell-1 box-icon w_46 round snbn265">
                  <span className="icon icon-arrow-right" />
                </div>
                <div className="sw-dots style-2 sw-pagination-sell-1 justify-content-center spd265" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
