"use client";
import dynamic from 'next/dynamic';
import Overlay from "@/components/common/Overlay";

const ClientShopWrapper = dynamic(
  () => import('./ClientShopWrapper'),
  {
    ssr: false,
    loading: () => (
      <div className="container py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="rounded-lg bg-gray-100 p-4 animate-pulse">
              <div className="h-48 bg-gray-200 rounded-md mb-3"></div>
              <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="h-8 bg-gray-200 rounded w-1/3 mt-4"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }
);

export default function ProductsContent() {
  return (
    <>
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
    </>
  );
} 