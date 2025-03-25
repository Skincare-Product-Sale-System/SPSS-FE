# Price Formatting Guide for SPSS-FE

This guide explains how to implement consistent price formatting across the SPSS Skincare Store website.

## Font Usage

The website uses Roboto font throughout for better readability and user experience:

- **Roboto**: Clean, modern sans-serif font
  - Weights: 300 (Light), 400 (Regular), 500 (Medium), 700 (Bold)
  - Used for all text elements including headings, body text, and prices
  - Excellent support for Vietnamese characters

## PriceFormatter Component

The `PriceFormatter` component is the standardized way to display prices throughout the application. It ensures:

- Consistent number formatting with proper thousand separators (.)
- Vietnamese currency symbol (₫)
- Clean, readable presentation using Roboto font
- Support for displaying original/discounted prices

### Basic Usage

```jsx
import PriceFormatter from '@/components/ui/helpers/PriceFormatter';

// Simple price display
<PriceFormatter price={499000} />

// With original price (shows discount)
<PriceFormatter price={399000} originalPrice={499000} />

// With custom variant
<PriceFormatter price={499000} variant="h5" />

// With custom styling
<PriceFormatter price={499000} sx={{ fontWeight: 'bold', color: 'red' }} />
```

### Component Props

| Prop | Type | Description |
|------|------|-------------|
| `price` | number | The price to display |
| `originalPrice` | number | Optional original price to show discount |
| `currencySymbol` | string | Currency symbol (defaults to '₫') |
| `variant` | string | MUI Typography variant (defaults to 'body1') |
| `className` | string | Additional CSS classes |
| `sx` | object | MUI styling props |

## Custom Price Formatting Hook

For more complex price display requirements, we offer a custom hook that integrates with the ThemeContext:

```jsx
import usePriceFormatter from '@/hooks/usePriceFormatter';

function YourComponent() {
  const { format, getDiscountPercent, getPriceStyle, formatNumberOnly } = usePriceFormatter();
  
  // Format a price with currency symbol
  const formattedPrice = format(499000); // "499.000₫"
  
  // Calculate discount percentage
  const discount = getDiscountPercent(599000, 499000); // 17
  
  // Get theme-aware styling
  const priceStyle = getPriceStyle(true); // For discounted price
  
  // Format number only (no currency)
  const numberOnly = formatNumberOnly(499000); // "499.000"
  
  return (
    <Typography sx={priceStyle}>
      {formattedPrice}
    </Typography>
  );
}
```

## State Management

We use Context API for state management across the application. The `useContextElement` hook provides access to the global context which includes:
- Cart functionality
- Wishlist management
- Compare items
- Quick view state

```jsx
import { useContextElement } from "@/context/Context";

export default function YourComponent() {
  const { 
    addProductToCart, 
    isAddedToCartProducts,
    addToCompareItem,
    isAddedtoCompareItem,
    setQuickViewItem
  } = useContextElement();
  
  // Use context functions for state management
}
```

## MUI Theme Integration

The theme has been configured to properly style price elements:

- Custom variant for price chips: `<Chip variant="price" />`
- Custom className for table cells: `<TableCell className="price-cell" />`

## CSS Classes

The following CSS classes are available for styling:

- `.price`, `.product-price`, `.item-price`, etc. - Applies consistent price styling
- `.font-base` - Utility class to ensure Roboto font usage

## Legacy Price Formatting

For cases where you need to format prices as strings (not as React components), use:

```js
import { formatPrice } from "@/utils/priceFormatter";

// Format a price
const formattedPrice = formatPrice(499000); // Returns "499.000₫"
```

## Example Component

Check out the `PriceFormatExample` component in `components/ui/examples/PriceFormatExample.jsx` for a comprehensive demonstration of all price formatting methods.

## Implementation Checklist

Places where prices should be displayed using the PriceFormatter:

- [x] ProductCard component
- [x] QuickView modal
- [x] ShopCart modal
- [x] Compare modal/page
- [x] OrderCard component
- [x] Product detail page
- [x] Checkout pages
- [x] Quiz result product recommendations
- [ ] Cart summary components
- [ ] Payment forms
- [ ] Invoice/receipts
- [ ] Pricing tables

Remember to add the `vietnamese` class to text elements containing Vietnamese language. 