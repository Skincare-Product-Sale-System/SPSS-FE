// import Features from "@/components/common/Features";
// import ShopGram from "@/components/common/ShopGram";
// import Testimonials from "@/components/common/Testimonials";
// import Footer1 from "@/components/footers/Footer1";
// import Header1 from "@/components/headers/Header1";
// import Topbar1 from "@/components/headers/Topbar1";
// import Brands from "@/components/homes/home-1/Brands";
// import Categories from "@/components/homes/home-1/Categories";
// import Hero from "@/components/homes/home-1/Hero";
// import Lookbook from "@/components/homes/home-1/Lookbook";
// import Products from "@/components/homes/home-1/Products";
// import Marquee from "@/components/homes/home-1/Marquee";

// import Header8 from "@/components/headers/Header8";
import Categories from "@/components/homes/home-1/Categories";
import Announcement from "@/components/homes/home-skincare/Announcement";
import Banner from "@/components/homes/home-skincare/Banner";
import Feature from "@/components/homes/home-skincare/Feature";
import Hero from "@/components/homes/home-skincare/Hero";
import Marquee from "@/components/homes/home-skincare/Marquee";
import Products from "@/components/homes/home-skincare/Products";
import Products2 from "@/components/homes/home-skincare/Products2";
import SkinChange from "@/components/homes/home-skincare/SkinChange";
import Testimonials from "@/components/homes/home-skincare/Testimonials";
import Videobox from "@/components/homes/home-skincare/Videobox";
import React from "react";
import ShopGram from "@/components/homes/home-skincare/ShopGram";
import Features from "@/components/homes/home-6/Features";
import Footer1 from "@/components/footers/Footer1";
import Header2 from "@/components/headers/Header2";
import '@fontsource/roboto';

export const metadata = {
  title: "Skincare Shop",
  description: "Skincare Shop",
};

export default function Home() {
  return (
    <>
      {/* <Topbar1 />
      <Header1 />
      <Hero />
      <Marquee />
      <Categories />
      <Products />
      <Lookbook />
      <Testimonials />
      <Brands />
      <ShopGram />
      <Features />
      <Footer1 /> */}
      {/* <Announcement /> */}
      <Header2 />
      <Hero />
      <Products />
      {/* <Banner /> */}
      {/* <Marquee /> */}
      {/* <Videobox />
      <Features /> */}
      {/* <Products2 /> */}
      {/* <Categories /> */}
      {/* <Products2 /> */}
      <Testimonials />
      {/* <SkinChange /> */}
      <Features />
      {/* <ShopGram /> */}
      <Footer1 />
    </>
  );
}
