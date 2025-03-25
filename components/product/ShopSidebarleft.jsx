"use client";
import { useEffect, useState, Suspense } from "react";
import Sidebar from "./Sidebar";
import { layouts, sortingOptions } from "@/data/shop";
import ProductGrid from "./ProductGrid";
import Pagination from "@/components/ui/common/Pagination";
import { useQueries } from "@tanstack/react-query";
import request from "@/utils/axios";
import { useRouter, useSearchParams } from "next/navigation";
import { Box, Chip, Typography, Button } from "@mui/material";
import { useThemeColors } from "@/context/ThemeContext";

// Loading component
const ShopLoading = () => (
  <div className="container py-8">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {[...Array(8)].map((_, i) => (
        <div key={i} className="rounded-lg bg-gray-100 p-4 animate-pulse">
          <div className="h-48 bg-gray-200 rounded-md mb-3"></div>
          <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="h-8 bg-gray-200 rounded w-1/3 mt-4"></div>
        </div>
      ))}
    </div>
  </div>
);

// Main component with inner implementation
function InnerShopSidebar() {
  const mainColor = useThemeColors();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [gridItems, setGridItems] = useState(4);
  const [products, setProducts] = useState({ items: [], totalPages: 0, pageNumber: 1 });
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOption, setSortOption] = useState(searchParams.get("sort") || "newest");
  const [filters, setFilters] = useState({
    brandId: searchParams.get("brandId") || null,
    categoryId: searchParams.get("categoryId") || null,
    skinTypeId: searchParams.get("skinTypeId") || null,
    name: searchParams.get("name") || ""
  });

  // Định nghĩa các tùy chọn sắp xếp
  const sortOptions = [
    { value: "newest", label: "Mới nhất" },
    { value: "bestselling", label: "Bán chạy" },
    { value: "price_asc", label: "Giá thấp đến cao" },
    { value: "price_desc", label: "Giá cao đến thấp" }
  ];

  // Fetch filters data
  const [brands, categories, skinTypes] = useQueries({
    queries: [
      {
        queryKey: ["brands"],
        queryFn: async () => {
          const { data } = await request.get("/brands?pageNumber=1&pageSize=100");
          return data.data?.items || [];
        },
      },
      {
        queryKey: ["categories"],
        queryFn: async () => {
          const { data } = await request.get("/product-categories?pageNumber=1&pageSize=100");
          return data.data?.items || [];
        },
      },
      {
        queryKey: ["skinTypes"],
        queryFn: async () => {
          const { data } = await request.get("/skin-types?pageNumber=1&pageSize=100");
          return data.data?.items || [];
        },
      },
    ],
  });

  const fetchProducts = async (page = 1, newFilters = filters, sort = sortOption) => {
    const queryParams = new URLSearchParams();
    queryParams.append("pageNumber", page);
    queryParams.append("pageSize", "20");
    
    
    if (newFilters.brandId) queryParams.append("brandId", newFilters.brandId);
    if (newFilters.categoryId) queryParams.append("categoryId", newFilters.categoryId);
    if (newFilters.skinTypeId) queryParams.append("skinTypeId", newFilters.skinTypeId);
    if (newFilters.name) queryParams.append("name", newFilters.name);
    
    if (sort) queryParams.append("sortBy", sort);

    try {
      const { data } = await request.get(`/products?${queryParams.toString()}`);
      console.log("Ahihi",queryParams.toString());
      
      setProducts(data.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  // Handle filter changes
  const handleFilterChange = (type, value) => {
    const newFilters = { ...filters, [type]: value };
    setFilters(newFilters);
    setCurrentPage(1);
    
    // Update URL
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(type, value);
    } else {
      params.delete(type);
    }
    router.push(`/products?${params.toString()}`);
    
    fetchProducts(1, newFilters, sortOption);
  };

  // Handle sort change
  const handleSortChange = (sort) => {
    setSortOption(sort);
    
    // Update URL
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", sort);
    router.push(`/products?${params.toString()}`);
    
    fetchProducts(currentPage, filters, sort);
  };

  // Remove filter chip
  const handleRemoveFilter = (type) => {
    handleFilterChange(type, null);
  };

  useEffect(() => {
    const sort = searchParams.get("sort") || "newest";
    setSortOption(sort);
    fetchProducts(currentPage, filters, sort);
  }, [searchParams]);

  // Get filter names for display
  const getFilterName = (type, id) => {
    if (!id) return "";
    switch (type) {
      case "brandId":
        return brands.data?.find(b => b.id === id)?.name || "";
      case "categoryId":
        // Tìm kiếm category trong tất cả categories (bao gồm cả category con)
        const findCategoryById = (categories, id) => {
          if (!categories) return "";
          
          // Tìm trực tiếp trong mảng categories
          const directMatch = categories.find(c => c.id === id);
          if (directMatch) return directMatch.categoryName;
          
          // Tìm trong các category con
          for (const category of categories) {
            if (category.children && category.children.length > 0) {
              const childMatch = findCategoryById(category.children, id);
              if (childMatch) return childMatch;
            }
          }
          
          return "";
        };
        
        return findCategoryById(categories.data, id);
      case "skinTypeId":
        return skinTypes.data?.find(s => s.id === id)?.name || "";
      default:
        return "";
    }
  };

  // Hàm chuyển đổi tên filter sang tiếng Việt
  const getFilterTypeName = (type) => {
    switch (type) {
      case "brandId":
        return "Thương hiệu";
      case "categoryId":
        return "Danh mục";
      case "skinTypeId":
        return "Loại da";
      default:
        return type.replace('Id', '');
    }
  };

  return (
    <>
      <section className="flat-spacing-1">
        <div className="container">
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            gap: 2,
            mb: 3 
          }}>
            {/* Left Column - Filters & Sort */}
            <Box sx={{ flex: 1 }}>
              {/* Active Filters */}
              <Box sx={{ 
                display: 'flex', 
                gap: 1, 
                mb: 2, 
                flexWrap: 'wrap',
                alignItems: 'center',
                py: 1,
                borderBottom: `1px solid ${mainColor.medium}30`
              }}>
                <Typography variant="subtitle1" sx={{ 
                  color: mainColor.text, 
                  fontWeight: 600,
                  fontSize: '1rem',
                  mr: 1,
                  position: 'relative',
                  '&:after': {
                    content: '""',
                    position: 'absolute',
                    bottom: -8,
                    left: 0,
                    width: '70%',
                    height: 2,
                    backgroundColor: mainColor.dark,
                  }
                }}>
                  Sản phẩm lọc theo:
                </Typography>
                {Object.entries(filters).map(([key, value]) => {
                  if (!value || key === 'name') return null;
                  return (
                    <Chip
                      key={key}
                      label={`${getFilterTypeName(key)}: ${getFilterName(key, value)}`}
                      onDelete={() => handleRemoveFilter(key)}
                      sx={{
                        backgroundColor: `${mainColor.dark}95`,
                        color: mainColor.white,
                        fontWeight: 500,
                        border: `1px solid ${mainColor.dark}50`,
                        py: 0.5,
                        boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                        '&:hover': {
                          backgroundColor: `${mainColor.dark}`,
                        },
                        '& .MuiChip-deleteIcon': {
                          color: mainColor.dark,
                          '&:hover': {
                            color: 'red',
                          }
                        }
                      }}
                    />
                  );
                })}
              </Box>

              {/* Sort Options */}
              <Box sx={{ 
                display: 'flex', 
                gap: 1, 
                flexWrap: 'wrap',
                alignItems: 'center',
                py: 2,
                borderRadius: 1,
                mb: 2
              }}>
                <Typography variant="subtitle1" sx={{ 
                  color: mainColor.text, 
                  mr: 1,
                  fontWeight: 600,
                  fontSize: '1rem'
                }}>
                  Sắp xếp:
                </Typography>
                {sortOptions.map((option) => (
                  <Button
                    key={option.value}
                    onClick={() => handleSortChange(option.value)}
                    sx={{
                      color: sortOption === option.value ? '#fff' : mainColor.text,
                      borderColor: sortOption === option.value ? mainColor.dark : mainColor.grey,
                      backgroundColor: sortOption === option.value ? mainColor.dark : 'transparent',
                      border: '1px solid',
                      textTransform: 'none',
                      minWidth: 'auto',
                      px: 2,
                      py: 0.7,
                      fontWeight: 500,
                      fontSize: '0.9rem',
                      boxShadow: sortOption === option.value ? 2 : 'none',
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        borderColor: mainColor.dark,
                        backgroundColor: sortOption === option.value ? mainColor.dark : `${mainColor.medium}30`,
                        transform: 'translateY(-2px)',
                      }
                    }}
                  >
                    {option.label}
                  </Button>
                ))}
              </Box>
            </Box>

            {/* Right Column - Search */}
            <Box sx={{ 
              flex: 1,
              maxWidth: '400px'
            }}>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Tìm kiếm sản phẩm..."
                  value={filters.name || ""}
                  onChange={(e) => handleFilterChange("name", e.target.value)}
                  className="border rounded-md w-full pl-10 px-4 py-2.5"
                  style={{
                    borderColor: mainColor.medium,
                    color: mainColor.text,
                    outline: 'none',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                    fontSize: '0.95rem',
                    transition: 'all 0.2s ease',
                  }}
                  onFocus={(e) => e.target.style.borderColor = mainColor.dark}
                  onBlur={(e) => e.target.style.borderColor = mainColor.medium}
                />
                <div 
                  className="translate-y-1/2 absolute left-3 top-1/4 transform"
                  style={{ color: mainColor.grey }}
                >
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    width="18" 
                    height="18" 
                    fill="currentColor" 
                    className="bi bi-search" 
                    viewBox="0 0 16 16"
                  >
                    <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
                  </svg>
                </div>
              </div>
            </Box>
          </Box>

          <div className="grid-3 align-items-center tf-shop-control">
            <div className="tf-control-filter"></div>
            <ul className="d-flex justify-content-center tf-control-layout">
              {layouts.slice(0, 4).map((layout, index) => (
                <li
                  key={index}
                  className={`tf-view-layout-switch ${layout.className} ${
                    gridItems == layout.dataValueGrid ? "active" : ""
                  }`}
                  onClick={() => setGridItems(layout.dataValueGrid)}
                  style={{
                    transition: 'all 0.3s ease',
                    transform: gridItems == layout.dataValueGrid ? 'translateY(-3px)' : 'translateY(0)',
                    boxShadow: gridItems == layout.dataValueGrid 
                      ? '0 4px 8px rgba(0, 0, 0, 0.1)' 
                      : 'none',
                  }}
                >
                  <div className="item">
                    <span className={`icon ${layout.iconClass}`} />
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div className="tf-row-flex">
            <Sidebar 
              brands={brands.data || []}
              categories={categories.data || []}
              skinTypes={skinTypes.data || []}
              activeFilters={filters}
              onFilterChange={handleFilterChange}
            />
            
            <div className="tf-shop-content">
              <ProductGrid
                allproducts={products.items || []}
                gridItems={gridItems}
              />
              
              {products.items?.length > 0 && (
                <ul className="tf-pagination-list tf-pagination-wrap">
                  <Pagination
                    currentPage={products.pageNumber}
                    totalPages={products.totalPages}
                    onPageChange={(newPage) => {
                      setCurrentPage(newPage);
                      fetchProducts(newPage);
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                  />
                </ul>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Mobile sidebar button */}
      <div className="btn-sidebar-style2">
        <button
          data-bs-toggle="offcanvas"
          data-bs-target="#sidebarmobile"
          aria-controls="offcanvas"
        >
          <i className="icon icon-sidebar-2" />
        </button>
      </div>
    </>
  );
}

// Wrapper component with Suspense
export default function ShopSidebarleft() {
  return (
    <Suspense fallback={<ShopLoading />}>
      <InnerShopSidebar />
    </Suspense>
  );
}
