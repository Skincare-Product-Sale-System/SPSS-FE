"use client";

import React from "react";
import HeroSection from "./HeroSection";
import ProductsSection from "./ProductsSection";
import FeaturesSection from "./FeaturesSection";
import QRCodeSection from "./QRCodeSection";

export default function HomeContent() {
  return (
    <>
      <HeroSection />
      <ProductsSection />
      <FeaturesSection />
      <QRCodeSection />
    </>
  );
} 