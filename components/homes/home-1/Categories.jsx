"use client";
import Image from "next/image";
import Link from "next/link";
import { collections } from "@/data/categories";
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { useQueries } from "@tanstack/react-query";

export default function Categories() {
  const [categories] = useQueries({
    queries: [
      {
        queryKey: ["categories"],
        queryFn: async () => {
          const { data } = await request.get(
            "/product-categories?pageNumber=1&pageSize=100"
          );
          return data.data?.items || [];
        },
      },
    ],
  });

  const categoriesImage = {
    Sunscreen:
      "https://images.pexels.com/photos/3999057/pexels-photo-3999057.jpeg",
    Toner: "https://images.pexels.com/photos/8989961/pexels-photo-8989961.jpeg",
    Mask: "https://images.pexels.com/photos/15327097/pexels-photo-15327097/free-photo-of-woman-with-beauty-product-on-face-recommending-cosmetics.jpeg",
    "Face Foaming":
      "https://images.pexels.com/photos/2587177/pexels-photo-2587177.jpeg",
  };

  return (
    <section className="flat-spacing-4 flat-categorie">
      <div className="container-full">
        <div className="flat-title-v2">
          <div className="box-sw-navigation">
            <div className="nav-sw nav-next-slider snbp1 nav-next-collection snbp107">
              <span className="icon icon-arrow-left" />
            </div>
            <div className="nav-sw nav-prev-slider snbn1 nav-prev-collection snbn107">
              <span className="icon icon-arrow-right" />
            </div>
          </div>
          <span
            className="text-3 fw-7 text-uppercase title wow fadeInUp"
            data-wow-delay="0s"
          >
            SHOP BY CATEGORIES
          </span>
        </div>
        <div className="row">
          <div className="col-xl-9 col-lg-8 col-md-8">
            <Swiper
              dir="ltr"
              className="swiper tf-sw-collection"
              spaceBetween={15}
              modules={[Navigation]}
              navigation={{
                prevEl: ".snbp107",
                nextEl: ".snbn107",
              }}
              breakpoints={{
                1024: {
                  slidesPerView: 4,
                  spaceBetween: 30,
                },
                768: {
                  slidesPerView: 2,
                  spaceBetween: 30,
                },
                640: {
                  slidesPerView: 2,
                },
              }}
            >
              {!categories.isLoading &&
                categories.data.map((item, index) => (
                  <SwiperSlide className="swiper-slide" key={index}>
                    <div className="collection-item style-left hover-img">
                      <div className="collection-inner">
                        <Link
                          href={`/shop-default`}
                          className="collection-image img-style"
                        >
                          <Image
                            className="lazyload"
                            data-src={categoriesImage[item.categoryName]}
                            alt={item.altText}
                            src={categoriesImage[item.categoryName]}
                            width="600"
                            height="721"
                            style={{
                              aspectRatio: "1/1",
                              objectFit: "cover",
                            }}
                          />
                        </Link>
                        <div className="collection-content">
                          <Link
                            href={`/shop-default`}
                            className="tf-btn collection-title hover-icon fs-15"
                          >
                            <span>{item.categoryName}</span>
                            <i className="icon icon-arrow1-top-left" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
            </Swiper>
          </div>
          <div className="col-xl-3 col-lg-4 col-md-4">
            <div className="discovery-new-item">
              <h5>Discovery all new items</h5>
              <Link href={`/shop-collection-list`}>
                <i className="icon-arrow1-top-left" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
