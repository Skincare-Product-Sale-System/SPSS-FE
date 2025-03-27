import ProductDetailPage from "@/pages/ProductDetailPage";
import request from "@/utils/axios";
import { formatPrice } from "@/utils/priceFormatter";

export const metadata = {
  title: "Product Details | Skincare Store",
  description: "Discover high-quality skincare products",
};

export default function ProductPage({ params }) {
  return <ProductDetailPage id={params.id} />;
}
