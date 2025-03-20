"use client";
import dynamic from 'next/dynamic';
import Header2 from "@/components/headers/Header2";
import Footer1 from "@/components/footers/Footer1";
import Overlay from "@/components/common/Overlay";

const ClientShopWrapper = dynamic(
  () => import('./ClientShopWrapper'),
  {
    ssr: false,
    loading: () => (
      <div className="container text-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
        <div className="mt-4">Đang tải sản phẩm...</div>
      </div>
    )
  }
);

export default function ProductsContent() {
  return (
    <>
      <Header2 />
      <div className="tf-page-title" style={{ position: "relative" }}>
        <Overlay />
        <div className="container-full">
          <div className="row">
            <div className="col-12" style={{ zIndex: 3, color: "white" }}>
              <div className="heading text-center" style={{ fontFamily: '"Playfair Display", serif', fontSize: '2.5rem', fontWeight: 600 }}>
                Sản Phẩm Mới
              </div>
              <p className="text-center text-2 mt_5" style={{ fontFamily: '"Playfair Display", serif', fontSize: '1.125rem' }}>
                Khám phá bộ sưu tập mới nhất của chúng tôi
              </p>
            </div>
          </div>
        </div>
      </div>
      <ClientShopWrapper />
      <Footer1 />
    </>
  );
} 