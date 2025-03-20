 
import Banner from "@/components/homes/home-skincare/Banner";
import Hero from "@/components/homes/home-skincare/Hero";
import Marquee from "@/components/homes/home-skincare/Marquee";
import Products from "@/components/homes/home-skincare/Products";
import SkinChange from "@/components/homes/home-skincare/SkinChange";
import Testimonials from "@/components/homes/home-skincare/Testimonials";
import Videobox from "@/components/homes/home-skincare/Videobox";
import React from "react";
import Features from "@/components/homes/home-6/Features";
import Footer1 from "@/components/footers/Footer1";

export const metadata = {
  title: "Home Skincare || Ecomus - Ultimate Nextjs Ecommerce Template",
  description: "Ecomus - Ultimate Nextjs Ecommerce Template",
};
export default function page() {
  return (
    <>
      <Hero />
      <Products />
      <Banner />
      <Marquee />
      <Videobox />
      <Features />
      <Products />
      <Testimonials />
      <SkinChange />
      <Features />
      <Footer1 />
    </>
  );
}
