import React from "react";
import Link from "next/link";

export default function Banner() {
  return (
    <section className="tf-slideshow slider-video position-relative">
      <div className="banner-wrapper relative">
        <div
          className="banner-overlay"
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
        <img
          className="lazyload w-full h-full object-cover"
          src="https://images.pexels.com/photos/2442898/pexels-photo-2442898.jpeg"
          alt="image-collection"
          style={{
            aspectRatio: "16/8",
          }}
        />
        <div
          className="box-content text-center"
          style={{
            zIndex: 2,
          }}
        >
          <div className="container">
            <p className="subheading text-white fw-7">ULTRA-PREMIUM SILK</p>
            <h1 className="heading text-white">Silk Blouses Shirts</h1>
            <p className="description text-white">
              Shop our luxury silk button-up blouses made with ultra-soft,
              washable silk.
            </p>
            <div className="wow fadeInUp" data-wow-delay="0s">
              <Link
                href={`/shop-collection-sub`}
                className="tf-btn btn-md btn-light-icon btn-icon radius-3 animate-hover-btn"
              >
                <span>Shop collection</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
