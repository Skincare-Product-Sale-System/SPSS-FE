import ClientOrderDetails from '@/components/orders/ClientOrderDetails';

export const metadata = {
  title: "Chi Tiết Đơn Hàng | SPSS - Website Chăm Sóc Da",
  description: "Xem chi tiết đơn hàng của bạn tại SPSS",
};

export default function OrderDetailsPage() {
  return (
    <>
      <div className="tf-page-title">
        <div className="container-full">
          <div className="heading text-center">Chi tiết đơn hàng</div>
        </div>
      </div>
      
      <ClientOrderDetails />
    </>
  );
}
