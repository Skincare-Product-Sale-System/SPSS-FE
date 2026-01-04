const config = {
  baseUrl: process.env.NEXT_PUBLIC_BASE_URL || 'https://skincede-spss.vercel.app',
  api: {
    baseUrl: process.env.NEXT_PUBLIC_API_URL || 'https://spssapi-hxfzbchrcafgd2hg.southeastasia-01.azurewebsites.net/api'
  },
  vnpay: {
    returnUrls: {
      orderDetails: (orderId) => `${process.env.NEXT_PUBLIC_BASE_URL || 'https://skincede-spss.vercel.app'}/orders`,
      orderList: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://skincede-spss.vercel.app'}/orders`
    }
  }
};

export default config; 