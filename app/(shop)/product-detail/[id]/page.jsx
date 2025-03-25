import ProductDetailPage from "@/pages/ProductDetailPage";
import Link from "next/link";
import request from "@/utils/axios";
import { formatPrice } from "@/utils/priceFormatter";

export const metadata = {
  title: "Product Details | Skincare Store",
  description: "Discover high-quality skincare products",
};

export default async function page({ params }) {
  const { id } = await params;
  
  try {
    // Thêm log để kiểm tra ID
    console.log("Fetching product with ID:", id);
    
    let response = await request.get(`/products/${id}`);
    let { data } = response;
    const product = data.data;
    
    // Log dữ liệu nhận được
    console.log("API response successful, product name:", product.name);

    // Định dạng lại dữ liệu sản phẩm để phù hợp với components
    const formattedProduct = {
      ...product,
      title: product.name,
      price: formatPrice(product.price),
      oldPrice: product.marketPrice !== product.price ? formatPrice(product.marketPrice) : null,
      imgSrc: product.thumbnail,
      images: product.thumbnail,
      imgHoverSrc: product.thumbnail,
      colors: product.productItems?.filter(item => 
        item.configurations?.some(config => config.variationName === "Color")
      ).map(item => {
        const colorConfig = item.configurations.find(config => config.variationName === "Color");
        const imageUrl = (item.imageUrl && item.imageUrl !== "string") 
          ? item.imageUrl 
          : product.thumbnail;
        
        return {
          name: colorConfig?.optionName || "",
          colorClass: `bg_${colorConfig?.optionName?.toLowerCase() || ""}`,
          imgSrc: imageUrl
        };
      }) || [],
      sizes: [...new Set(product.productItems?.filter(item => 
        item.configurations?.some(config => config.variationName === "Size")
      ).map(item => {
        const sizeConfig = item.configurations.find(config => config.variationName === "Size");
        return sizeConfig?.optionName || "";
      }).filter(Boolean))] || [],
      // Add additional formatted data
      brand: product.brand,
      category: product.category,
      skinTypes: product.skinTypes || [],
      specifications: product.specifications || {},
      soldCount: product.soldCount || 0,
      ratingDisplay: product.rating ? `${product.rating.toFixed(1)}/5` : "0/5",
      rating: product.rating || 0,
      status: product.status,
      description: product.description
    };

    return <ProductDetailPage product={formattedProduct} />;
  } catch (error) {
    console.error("Error fetching product:", error);
    
    // Hiển thị trang lỗi thân thiện
    return (
      <>
        <div className="container text-center my-12 py-8">
          <h2 className="text-2xl font-medium mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
            Không thể tải thông tin sản phẩm
          </h2>
          <p className="mb-6" style={{ fontFamily: 'Roboto, sans-serif' }}>
            Đã xảy ra lỗi khi tải thông tin sản phẩm. Vui lòng thử lại sau.
          </p>
          <p className="text-gray-600 text-sm mb-6" style={{ fontFamily: 'Roboto, sans-serif' }}>
            Chi tiết lỗi: {error.message}
          </p>
          <Link href="/products" className="btn-primary tf-btn">
            Quay lại cửa hàng
          </Link>
        </div>
      </>
    );
  }
}
