# SPSS Skincare Store Frontend

## Font Standardization

The website uses a standardized font system:

1. **Playfair Display** - Elegant serif font for headings and product titles
   - Weights: 400, 500, 600, 700
   - Used for: Titles, headings, product names, and other prominent text
   - Full Vietnamese language support

2. **Be Vietnam Pro** - Modern sans-serif font for body text
   - Weights: 300, 400, 500, 600, 700
   - Used for: Body text, descriptions, navigation, buttons
   - Excellent Vietnamese language support
   
3. **Roboto Mono** - Monospace font for prices and numbers
   - Weights: 400, 500, 700
   - Used for: Prices, discounts, quantities, and other numeric values
   - Ensures consistent number alignment and readability

### Vietnamese Text Support

For Vietnamese text, add the `vietnamese` class to enable specific text rendering optimizations:

```jsx
<Typography className="vietnamese">
  Sản Phẩm Bán Chạy
</Typography>
```

### Price Formatting

Use the `PriceFormatter` component for consistent price display:

```jsx
import PriceFormatter from '@/components/ui/helpers/PriceFormatter';

// Basic price
<PriceFormatter price={499000} />

// With original price (shows discount)
<PriceFormatter price={399000} originalPrice={499000} />

// With custom variant
<PriceFormatter price={499000} variant="h5" />
```

## Additional Documentation

The font demo page is available at `/font-demo` and showcases all font styles and usages.

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
