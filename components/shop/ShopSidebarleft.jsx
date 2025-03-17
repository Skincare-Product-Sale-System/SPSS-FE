"use client";
import { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import { layouts, sortingOptions } from "@/data/shop";
import ProductGrid from "./ProductGrid";
import Pagination from "../common/Pagination";
import { useQueries } from "@tanstack/react-query";
import request from "@/utlis/axios";
import { useRouter, useSearchParams } from "next/navigation";
import { Box, Chip, Typography, Button } from "@mui/material";
import { useThemeColors } from "@/context/ThemeContext";

export default function ShopSidebarleft() {
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
    skinTypeId: searchParams.get("skinTypeId") || null
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
    
    // Thêm tham số sortBy thay vì sort
    if (sort) queryParams.append("sortBy", sort);

    try {
      const { data } = await request.get(`/products?${queryParams.toString()}`);
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
          {/* Active Filters */}
          <Box sx={{ 
            display: 'flex', 
            gap: 1, 
            mb: 2, 
            flexWrap: 'wrap',
            alignItems: 'center' 
          }}>
            <Typography variant="subtitle1" sx={{ 
              color: mainColor.text, 
              fontWeight: 600 
            }}>
              Sản phẩm lọc theo:
            </Typography>
            {Object.entries(filters).map(([key, value]) => {
              if (!value) return null;
              return (
                <Chip
                  key={key}
                  label={`${getFilterTypeName(key)}: ${getFilterName(key, value)}`}
                  onDelete={() => handleRemoveFilter(key)}
                  sx={{
                    backgroundColor: `${mainColor.medium}`,
                    color: mainColor.text,
                    fontWeight: 500,
                    '& .MuiChip-deleteIcon': {
                      color: mainColor.text
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
            mb: 3, 
            flexWrap: 'wrap',
            alignItems: 'center',
          }}>
            <Typography variant="subtitle1" sx={{ 
              color: mainColor.text, 
              mr: 1,
              fontWeight: 600 
            }}>
              Sắp xếp:
            </Typography>
            
            {sortOptions.map((option) => (
              <Button
                key={option.value}
                onClick={() => handleSortChange(option.value)}
                variant={sortOption === option.value ? "contained" : "outlined"}
                sx={{
                  minWidth: 'auto',
                  px: 2,
                  py: 0.5,
                  textTransform: 'none',
                  borderRadius: '4px',
                  backgroundColor: sortOption === option.value ? mainColor.dark : 'transparent',
                  color: sortOption === option.value ? '#fff' : mainColor.text,
                  borderColor: sortOption === option.value ? mainColor.dark : mainColor.grey,
                  fontWeight: 500,
                  '&:hover': {
                    backgroundColor: sortOption === option.value ? mainColor.dark : mainColor.light,
                    borderColor: mainColor.dark
                  }
                }}
              >
                {option.label}
              </Button>
            ))}
          </Box>

          <div className="tf-shop-control grid-3 align-items-center">
            <div className="tf-control-filter"></div>
            <ul className="tf-control-layout d-flex justify-content-center">
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
                <ul className="tf-pagination-wrap tf-pagination-list">
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
