// import Features from "@/components/common/Features";
// import ShopGram from "@/components/common/ShopGram";
// import Testimonials from "@/components/common/Testimonials";
// import Footer1 from "@/components/footers/Footer1";
// import Header1 from "@/components/headers/Header1";
// import Topbar1 from "@/components/headers/Topbar1";
// import Brands from "@/components/homes/home-1/Brands";
// import Hero from "@/components/homes/home-1/Hero";
// import Lookbook from "@/components/homes/home-1/Lookbook";
// import Products from "@/components/homes/home-1/Products";
// import Marquee from "@/components/homes/home-1/Marquee";

// import Header8 from "@/components/headers/Header8";
import Hero from "@/components/homes/home-skincare/Hero";
import Products from "@/components/homes/home-skincare/Products";
import React from "react";
import Features from "@/components/homes/home-skincare/Features";
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
      <Header2 />
      <Hero />
      <Products />
      <Features />
      <Footer1 />
    </>
  );
}
