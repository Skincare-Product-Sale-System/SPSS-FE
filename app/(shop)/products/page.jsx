import dynamic from 'next/dynamic';
import ProductsPage from '@/pages/ProductsPage';

export const metadata = {
  title: "Skincare Shop",
  description: "Skincare Shop",
};

export default function Page() {
  return <ProductsPage />;
}
