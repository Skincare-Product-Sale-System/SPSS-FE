"use client";
import Image from "next/image";
import { slides5 } from "@/data/heroslides";
import { Autoplay, Pagination } from "swiper/modules";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";

export default function HeroSection() {
  return (
    <div className="tf-slideshow slider-effect-fade slider-skincare position-relative" style={{ fontFamily: 'Roboto, sans-serif' }}>
      <Swiper
        dir="ltr"
        slidesPerView={1}
        spaceBetween={0}
        centeredSlides={false}
        loop={true}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        speed={1000}
        className="tf-sw-slideshow"
        modules={[Pagination, Autoplay]}
        pagination={{ clickable: true, el: ".spd264" }}
      >
        {slides5.map((slide, index) => (
          <SwiperSlide key={index}>
            <div className="wrap-slider">
              <div className="image-container relative">
                <div
                  className="overlay"
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    zIndex: 1,
                    backgroundColor: "rgba(0, 0, 0, 0.5)",
                  }}
                ></div>
                <Image
                  className="lazyload banner-image"
                  data-src={slide.imgSrc}
                  alt={slide.imgAlt}
                  src={slide.imgSrc}
                  width={1800}
                  height={1013}
                  priority
                  sizes="100vw"
                  style={{
                    objectFit: "cover",
                    objectPosition: "center",
                    width: "100%",
                  }}
                />
              </div>
              <div
                className="box-content text-center"
                style={{
                  zIndex: 2,
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  width: "100%",
                  padding: "0 15px"
                }}
              >
                <div className="container">
                  <h2
                    className="fade-item fade-item-1 text-white heading banner-heading"
                  >
                    {slide.heading}
                  </h2>
                  <p
                    className="fade-item fade-item-2 text-white banner-description"
                  >
                    {slide.description}
                  </p>
                  <Link
                    href={`/products`}
                    className="fade-item fade-item-3 tf-btn btn-light-icon animate-hover-btn btn-xl radius-3 banner-button"
                  >
                    <span>Bộ sưu tập</span>
                    <i className="icon icon-arrow-right" />
                  </Link>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      <div className="wrap-pagination sw-absolute-3">
        <div className="sw-dots style-2 dots-white sw-pagination-slider justify-content-center spd264" />
      </div>
    </div>
  );
} 