<div align="center">

# 🧴 SPSS Frontend

### Skincare Product Shopping System - Modern E-Commerce Web Application

[![Next.js](https://img.shields.io/badge/Next.js-15.2-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.0-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![Material UI](https://img.shields.io/badge/MUI-6.4-007FFF?style=for-the-badge&logo=mui&logoColor=white)](https://mui.com/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-3.0-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Vercel](https://img.shields.io/badge/Vercel-Deployed-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com/)

*A modern, responsive e-commerce web application for skincare products, featuring AI-powered skin analysis, personalized product recommendations, real-time chat support, and seamless checkout experience.*

[Live Demo](https://skincede-spss.vercel.app/) • [API Backend](https://spssapi-hxfzbchrcafgd2hg.southeastasia-01.azurewebsites.net/swagger) • [Report Bug](#-contributing) • [Request Feature](#-contributing)

</div>

---

## 📋 Table of Contents

- [About The Project](#-about-the-project)
- [Key Features](#-key-features)
- [Tech Stack](#️-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Component Library](#-component-library)
- [State Management](#-state-management)
- [Styling System](#-styling-system)
- [Deployment](#-deployment)
- [Contributing](#-contributing)

---

## 🎯 About The Project

**SPSS Frontend** is a cutting-edge e-commerce web application built with Next.js 15 and React 19, designed specifically for skincare product retail. The platform combines modern UI/UX design with powerful features like AI-powered skin analysis, interactive product recommendations, and real-time customer support.

### 🎓 Project Details
- **Development Period:** 4 months (9/2024 - 12/2024)
- **Team Size:** 5 Developers
- **Framework:** Next.js 15 (App Router)
- **Styling:** Material UI + TailwindCSS + SCSS
- **Lines of Code:** ~25,000+ (Frontend only)

### 💡 Problem Statement

Traditional skincare e-commerce websites often lack:
- Personalized shopping experiences
- Scientific skin type assessment tools
- Intuitive product comparison features
- Real-time customer support
- Mobile-first responsive design
- Vietnamese language support and local payment integration

### ✅ Our Solution

SPSS Frontend delivers a comprehensive skincare shopping experience:
- AI-powered skin analysis with camera integration
- Interactive quiz for skin type determination
- Smart product recommendations based on skin profile
- Real-time chat with customer support via SignalR
- Vietnamese payment gateway integration (VNPAY, VietQR)
- Fully responsive design with Vietnamese language optimization

---

## ⭐ Key Features

### 🛍️ E-Commerce Experience
- **Product catalog** - Advanced filtering, sorting, and search functionality
- **Product details** - High-quality images, zoom feature, detailed descriptions
- **Product comparison** - Side-by-side comparison of multiple products
- **Shopping cart** - Real-time cart management with quantity controls
- **Wishlist** - Save favorite products for later
- **Order tracking** - Real-time order status updates

### 🔬 AI Skin Analysis
- **Camera integration** - Take selfie directly in browser
- **AI-powered analysis** - Face++ integration for skin detection
- **Skin issue detection** - Identify acne, wrinkles, dark circles, etc.
- **Personalized results** - Detailed skin analysis report
- **Product recommendations** - AI-suggested products for your skin type
- **Analysis history** - Track skin improvement over time

### 📝 Interactive Quiz System
- **Skin type assessment** - Determine your skin type through questions
- **Personalized routine** - Get customized skincare routine recommendations
- **Product matching** - Discover products perfect for your skin
- **Result saving** - Save quiz results to your profile
- **Retake option** - Update your skin profile anytime

### 💬 Real-time Chat Support
- **Live chat widget** - Floating chat button on all pages
- **SignalR integration** - Real-time bi-directional messaging
- **Chat history** - Persistent conversation storage
- **Support queue** - Connect with available staff members
- **Typing indicators** - Real-time typing status

### 🔐 User Authentication
- **JWT authentication** - Secure token-based auth
- **Social login** - Google OAuth integration (optional)
- **Profile management** - Update personal information
- **Address book** - Manage multiple shipping addresses
- **Order history** - View past orders and receipts
- **Password management** - Secure password change flow

### 💳 Checkout & Payments
- **Multi-step checkout** - Guided checkout process
- **Address selection** - Choose from saved addresses
- **Payment options** - VNPAY, VietQR, Cash on Delivery
- **QR code payments** - Scan to pay with banking apps
- **Voucher system** - Apply discount codes
- **Order confirmation** - Email and on-screen confirmation

### 📱 Responsive Design
- **Mobile-first** - Optimized for mobile devices
- **Tablet support** - Perfect layout for tablets
- **Desktop experience** - Full-featured desktop interface
- **Touch-friendly** - Gesture support for mobile
- **Fast loading** - Optimized performance

### 📰 Content Features
- **Blog section** - Skincare tips and tutorials
- **Product reviews** - Customer reviews with images
- **Rating system** - Star ratings for products
- **Review replies** - Respond to customer reviews

### 👨‍💼 Staff Dashboard
- **Order management** - Process and update orders
- **Customer support** - Handle chat inquiries
- **Product management** - Add/edit products
- **Analytics overview** - View sales metrics

---

## 🛠️ Tech Stack

### Core Framework
| Technology | Version | Purpose |
|------------|---------|---------|
| Next.js | 15.2 | React framework with App Router |
| React | 19.0 | UI component library |
| JavaScript/JSX | ES2024 | Programming language |

### UI & Styling
| Technology | Purpose |
|------------|---------|
| Material UI (MUI) 6.4 | Component library |
| TailwindCSS | Utility-first CSS |
| SCSS/Sass | Advanced styling |
| Framer Motion | Animations and transitions |
| Swiper | Touch sliders and carousels |

### State Management
| Technology | Purpose |
|------------|---------|
| Zustand | Global state management |
| React Query (TanStack) | Server state & caching |
| React Context | Component state sharing |
| React Hook Form | Form state management |

### Data Fetching & API
| Technology | Purpose |
|------------|---------|
| Axios | HTTP client |
| TanStack React Query | Data fetching & caching |
| SignalR | Real-time WebSocket communication |

### Form & Validation
| Technology | Purpose |
|------------|---------|
| React Hook Form | Form handling |
| Zod | Schema validation |
| @hookform/resolvers | Zod integration |

### UI Components & Libraries
| Technology | Purpose |
|------------|---------|
| React Icons | Icon library |
| PhotoSwipe | Image lightbox |
| Drift Zoom | Product image zoom |
| React Compare Slider | Before/after comparisons |
| React Hot Toast | Toast notifications |
| React Countdown | Timer components |

### Development Tools
| Technology | Purpose |
|------------|---------|
| ESLint | Code linting |
| PostCSS | CSS processing |
| Autoprefixer | CSS vendor prefixes |

### Fonts & Typography
| Font | Purpose |
|------|---------|
| Playfair Display | Headings and titles |
| Be Vietnam Pro | Body text (Vietnamese optimized) |
| Roboto Mono | Prices and numbers |

---

## 📁 Project Structure

```
SPSS-FE/
├── app/                          # Next.js App Router
│   ├── (account)/               # User account pages
│   │   ├── address/             # Address management
│   │   ├── change-password/     # Password change
│   │   ├── my-account/          # Profile page
│   │   ├── order-details/       # Order details view
│   │   ├── orders/              # Order history
│   │   └── reviews/             # User reviews
│   ├── (auth)/                  # Authentication pages
│   │   ├── login/               # Login page
│   │   └── register/            # Registration page
│   ├── (checkout)/              # Checkout flow
│   │   ├── cart/                # Shopping cart
│   │   ├── checkout/            # Checkout process
│   │   └── payment/             # Payment page
│   ├── (features)/              # Feature pages
│   │   ├── blog/                # Blog listing & details
│   │   ├── quiz/                # Skin quiz
│   │   └── quiz-result/         # Quiz results
│   ├── (shop)/                  # Shop pages
│   │   ├── compare/             # Product comparison
│   │   ├── product-detail/      # Product details
│   │   └── products/            # Product catalog
│   ├── (staff)/                 # Staff dashboard
│   │   └── staff/               # Staff management pages
│   ├── layout.jsx               # Root layout
│   ├── page.jsx                 # Homepage
│   ├── loading.jsx              # Loading state
│   ├── not-found.jsx            # 404 page
│   └── providers.jsx            # Context providers
│
├── components/                   # Reusable components
│   ├── account/                 # Account-related components
│   ├── authentication/          # Auth components
│   ├── blog/                    # Blog components
│   ├── cart/                    # Cart components
│   ├── chat/                    # Chat widget components
│   ├── checkout/                # Checkout components
│   ├── compare/                 # Comparison components
│   ├── home/                    # Homepage components
│   ├── payment/                 # Payment components
│   ├── product/                 # Product components
│   ├── quiz/                    # Quiz components
│   ├── shop/                    # Shop components
│   ├── staff/                   # Staff dashboard components
│   └── ui/                      # Common UI components
│       ├── buttons/             # Button components
│       ├── cards/               # Card components
│       ├── forms/               # Form components
│       ├── helpers/             # Helper components
│       ├── modals/              # Modal components
│       └── navigation/          # Navigation components
│
├── context/                     # React Context providers
│   ├── authContext.jsx          # Authentication context
│   ├── authStore.js             # Zustand auth store
│   ├── Context.jsx              # General app context
│   ├── MuiThemeProvider.jsx     # MUI theme configuration
│   └── Providers.jsx            # Combined providers
│
├── hooks/                       # Custom React hooks
│   ├── useAuth.js               # Authentication hook
│   ├── useCart.js               # Cart management hook
│   ├── useProducts.js           # Products fetching hook
│   └── useSignalR.js            # SignalR connection hook
│
├── layouts/                     # Layout components
│   ├── MainLayout.jsx           # Main site layout
│   ├── AccountLayout.jsx        # Account pages layout
│   └── StaffLayout.jsx          # Staff dashboard layout
│
├── lib/                         # Utility libraries
│   ├── api.js                   # API client configuration
│   ├── auth.js                  # Auth utilities
│   └── utils.js                 # Helper functions
│
├── providers/                   # Provider components
│   ├── QueryProvider.jsx        # React Query provider
│   └── SignalRProvider.jsx      # SignalR provider
│
├── public/                      # Static assets
│   ├── images/                  # Image assets
│   ├── icons/                   # Icon files
│   └── fonts/                   # Font files
│
├── styles/                      # Global styles
│   ├── globals.scss             # Global SCSS
│   ├── variables.scss           # SCSS variables
│   └── mixins.scss              # SCSS mixins
│
├── utils/                       # Utility functions
│   ├── formatters.js            # Data formatters
│   ├── validators.js            # Validation helpers
│   └── constants.js             # App constants
│
├── middleware.js                # Next.js middleware
├── next.config.mjs              # Next.js configuration
├── tailwind.config.js           # Tailwind configuration
├── postcss.config.js            # PostCSS configuration
├── package.json                 # Dependencies
└── vercel.json                  # Vercel deployment config
```

---

## 🚀 Getting Started

### Prerequisites

```bash
# Required
- Node.js 18.0 or later (LTS recommended)
- npm, yarn, pnpm, or bun

# Recommended
- Visual Studio Code with ES7+ React snippets extension
- Backend API running (SPSS-BE)
```

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/SPSS.git
   cd SPSS/SPSS-FE
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   # or
   bun install
   ```

3. **Environment Configuration**
   
   Create `.env.local` file:
   ```env
   # API Configuration
   NEXT_PUBLIC_API_URL=http://localhost:5041/api
   NEXT_PUBLIC_SIGNALR_URL=http://localhost:5041
   
   # Authentication
   NEXT_PUBLIC_JWT_SECRET=your-jwt-secret
   
   # External Services (optional)
   NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id
   ```

4. **Run Development Server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   # or
   bun dev
   ```

5. **Open Browser**
   
   Navigate to: [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
# Build the application
npm run build

# Start production server
npm run start
```

---

## 🎨 Component Library

### Typography System

The website uses a standardized font system optimized for Vietnamese:

| Font | Weight | Usage |
|------|--------|-------|
| Playfair Display | 400-700 | Headings, product titles, elegant text |
| Be Vietnam Pro | 300-700 | Body text, descriptions, navigation |
| Roboto Mono | 400-700 | Prices, quantities, numeric values |

### Vietnamese Text Support

For Vietnamese text, add the `vietnamese` class for optimal rendering:

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

### Font Demo Page

Access the font demo at `/font-demo` to see all font styles in action.

---

## 🔄 State Management

### Zustand Store (Global State)

```javascript
// context/authStore.js
import { create } from 'zustand';

const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  login: (userData) => set({ user: userData, isAuthenticated: true }),
  logout: () => set({ user: null, isAuthenticated: false }),
}));
```

### React Query (Server State)

```javascript
// hooks/useProducts.js
import { useQuery } from '@tanstack/react-query';
import { getProducts } from '@/lib/api';

export const useProducts = (filters) => {
  return useQuery({
    queryKey: ['products', filters],
    queryFn: () => getProducts(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
```

### Context Providers

```javascript
// app/providers.jsx
export function Providers({ children }) {
  return (
    <QueryProvider>
      <MuiThemeProvider>
        <AuthProvider>
          <SignalRProvider>
            {children}
          </SignalRProvider>
        </AuthProvider>
      </MuiThemeProvider>
    </QueryProvider>
  );
}
```

---

## 🎨 Styling System

### TailwindCSS + MUI Integration

```jsx
// Using both TailwindCSS and MUI
<Button 
  variant="contained" 
  className="rounded-lg hover:shadow-lg transition-all"
>
  Add to Cart
</Button>
```

### SCSS Variables

```scss
// styles/variables.scss
$primary-color: #b8860b;
$secondary-color: #2c3e50;
$accent-color: #e74c3c;

// Breakpoints
$mobile: 576px;
$tablet: 768px;
$desktop: 1024px;
$wide: 1440px;
```

### Theme Configuration

```javascript
// context/MuiThemeProvider.jsx
const theme = createTheme({
  palette: {
    primary: {
      main: '#b8860b',
    },
    secondary: {
      main: '#2c3e50',
    },
  },
  typography: {
    fontFamily: '"Be Vietnam Pro", sans-serif',
    h1: {
      fontFamily: '"Playfair Display", serif',
    },
  },
});
```

---

## 📦 Deployment

### Deploy on Vercel (Recommended)

1. **Connect to Vercel**
   ```bash
   npm i -g vercel
   vercel login
   ```

2. **Deploy**
   ```bash
   vercel
   # Follow the prompts
   ```

3. **Production Deployment**
   ```bash
   vercel --prod
   ```

### Environment Variables on Vercel

Configure in Vercel Dashboard → Settings → Environment Variables:

```
NEXT_PUBLIC_API_URL=https://spssapi-hxfzbchrcafgd2hg.southeastasia-01.azurewebsites.net/api
NEXT_PUBLIC_SIGNALR_URL=https://spssapi-hxfzbchrcafgd2hg.southeastasia-01.azurewebsites.net
```

### Custom Domain

Configure in Vercel Dashboard → Settings → Domains

See detailed guide in [DEPLOY_VERCEL.md](./DEPLOY_VERCEL.md)

---

## 📱 Responsive Breakpoints

```scss
// Mobile First Approach
@media (min-width: 576px) { /* Small devices */ }
@media (min-width: 768px) { /* Tablets */ }
@media (min-width: 1024px) { /* Desktops */ }
@media (min-width: 1440px) { /* Large screens */ }
```

---

## 🔧 Configuration Files

### next.config.mjs

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['your-image-domains.com'],
  },
  experimental: {
    serverActions: true,
  },
};

export default nextConfig;
```

### tailwind.config.js

```javascript
module.exports = {
  content: [
    './app/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#b8860b',
        secondary: '#2c3e50',
      },
    },
  },
  plugins: [],
};
```

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

### How to Contribute

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Code Standards
- Use functional components with hooks
- Follow React and Next.js best practices
- Use meaningful component and variable names
- Write comments for complex logic
- Ensure responsive design on all components

---

## 📄 License

This project is developed for educational and portfolio purposes.

---

## 📊 Project Statistics

- **Development Time:** 4 months (9/2024 - 12/2024)
- **Team Size:** 5 developers
- **Lines of Code:** ~25,000+
- **Pages:** 20+ unique pages
- **Components:** 100+ reusable components
- **API Integrations:** 50+ endpoints consumed
- **Features:** AI Skin Analysis, Real-time Chat, Payment Integration

---

## 🔗 Related Projects

- **[SPSS Backend](../SPSS-BE)** - ASP.NET Core API serving this frontend

---

<div align="center">

### ⭐ If you find this project helpful, please consider giving it a star!

**Built with ❤️ by SPSS Team**

[Back to Top](#-spss-frontend)

</div>
