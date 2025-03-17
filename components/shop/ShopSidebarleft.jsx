"use client";
import { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import { layouts, sortingOptions } from "@/data/shop";
import ProductGrid from "./ProductGrid";
import Pagination from "../common/Pagination";
import { useQueries } from "@tanstack/react-query";
import request from "@/utlis/axios";
import { useRouter, useSearchParams } from "next/navigation";
import { Box, Chip, Typography } from "@mui/material";
import { useThemeColors } from "@/context/ThemeContext";

export default function ShopSidebarleft() {
  const mainColor = useThemeColors();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [gridItems, setGridItems] = useState(4);
  const [products, setProducts] = useState({ items: [], totalPages: 0, pageNumber: 1 });
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    brandId: searchParams.get("brandId") || null,
    categoryId: searchParams.get("categoryId") || null,
    skinTypeId: searchParams.get("skinTypeId") || null
  });

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

  const fetchProducts = async (page = 1, newFilters = filters) => {
    const queryParams = new URLSearchParams();
    queryParams.append("pageNumber", page);
    queryParams.append("pageSize", "20");

    if (newFilters.brandId) queryParams.append("brandId", newFilters.brandId);
    if (newFilters.categoryId) queryParams.append("categoryId", newFilters.categoryId);
    if (newFilters.skinTypeId) queryParams.append("skinTypeId", newFilters.skinTypeId);

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
    
    fetchProducts(1, newFilters);
  };

  // Remove filter chip
  const handleRemoveFilter = (type) => {
    handleFilterChange(type, null);
  };

  useEffect(() => {
    fetchProducts(currentPage);
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
            <Typography variant="subtitle1" sx={{ color: mainColor.text }}>
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
                    backgroundColor: `${mainColor.primary}20`,
                    color: mainColor.primary,
                    '& .MuiChip-deleteIcon': {
                      color: mainColor.primary
                    }
                  }}
                />
              );
            })}
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
