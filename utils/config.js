const config = {
  baseUrl: process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000',
  api: {
    baseUrl: process.env.NEXT_PUBLIC_API_URL || 'https://localhost:44358/api'
  },
  vnpay: {
    returnUrls: {
      orderDetails: (orderId) => `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/orders`,
      orderList: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/orders`
    }
  }
};

export default config; 