"use client";
import ShopDetailsTab from "@/components/product/detail/ShopDetailsTab";
import ProductReviews from "@/components/product/detail/ProductReviews";
import DetailsOuterZoom from "@/components/product/detail/DetailsOuterZoom";

export default function ProductDetail({ product }) {
  if (!product) {
    return (
      <div className="container text-center my-12 py-8">
        <h2 className="text-2xl font-medium mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
          Không thể tải thông tin sản phẩm
        </h2>
        <p className="mb-6" style={{ fontFamily: 'Roboto, sans-serif' }}>
          Đã xảy ra lỗi khi tải thông tin sản phẩm. Vui lòng thử lại sau.
        </p>
      </div>
    );
  }

  return (product &&
    <div className="md:pt-8 pt-6">
      <DetailsOuterZoom product={product} />
      <ShopDetailsTab product={product} />
      <ProductReviews productId={product.id} />
    </div>
  );
} 