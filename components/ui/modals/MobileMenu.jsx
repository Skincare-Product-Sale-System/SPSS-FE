"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import request from "@/utils/axios";
import { useQueries } from "@tanstack/react-query";
import useAuthStore from "@/context/authStore";
// Import MUI icons
import {
  Home as HomeIcon,
  Quiz as QuizIcon,
  ShoppingBag as ShoppingBagIcon,
  Article as BlogIcon,
  Person as PersonIcon,
  ExitToApp as LogoutIcon
} from '@mui/icons-material';

export default function MobileMenu() {
  const pathname = usePathname();
  const { isLoggedIn, setLoggedOut } = useAuthStore();

  // Fetch data sử dụng React Query
  const [categories, products] = useQueries({
    queries: [
      {
        queryKey: ["categories"],
        queryFn: async () => {
          const { data } = await request.get(
            "/product-categories?pageNumber=1&pageSize=100"
          );
          return data.data?.items || [];
        },
      },
      {
        queryKey: ["products"],
        queryFn: async () => {
          const { data } = await request.get(
            "/products?pageNumber=1&pageSize=100&sortBy=bestselling"
          );
          return data.data?.items || [];
        },
      },
    ],
  });

  // State cho skin types
  const [skinTypes, setSkinTypes] = useState([]);
  // State để theo dõi danh mục đang mở
  const [openCategories, setOpenCategories] = useState({});

  useEffect(() => {
    const fetchSkinTypes = async () => {
      try {
        const { data } = await request.get("/skin-types");
        setSkinTypes(data.data?.items || []);
      } catch (error) {
        console.error("Error fetching skin types:", error);
        setSkinTypes([]);
      }
    };
    fetchSkinTypes();
  }, []);

  const handleLogout = () => {
    setLoggedOut();
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("userRole");
    window.location.href = '/';
  };

  // Xử lý toggle danh mục
  const toggleCategory = (categoryId) => {
    setOpenCategories(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId]
    }));
  };

  // Render categories đệ quy
  const renderMobileCategories = (categoryList, level = 0) => {
    if (!categoryList || categoryList.length === 0) return null;

    return (
      <ul className={level === 0 ? "sub-nav-menu" : "sub-menu-level-2 sub-nav-menu"}>
        {categoryList.map((category, index) => (
          <li key={index}>
            {category.children?.length > 0 ? (
              <>
                <a
                  href="#"
                  className={`sub-nav-link ${openCategories[`cat-${category.id}`] ? 'active' : 'collapsed'}`}
                  onClick={(e) => {
                    e.preventDefault();
                    toggleCategory(`cat-${category.id}`);
                  }}
                >
                  <span>{category.categoryName}</span>
                  <span className={`btn-open-sub ${openCategories[`cat-${category.id}`] ? 'active' : ''}`} />
                </a>
                <div className={`collapse ${openCategories[`cat-${category.id}`] ? 'show' : ''}`}>
                  {renderMobileCategories(category.children, level + 1)}
                </div>
              </>
            ) : (
              <Link
                href={`/products?categoryId=${category.id}`}
                className="sub-nav-link"
              >
                {category.categoryName}
              </Link>
            )}
          </li>
        ))}
      </ul>
    );
  };

  return (
    <>
      {/* Mobile Menu Drawer */}
      <div className="canvas-mb offcanvas offcanvas-start" id="mobileMenu">
        <span
          className="icon-close icon-close-popup"
          data-bs-dismiss="offcanvas"
          aria-label="Close"
        />
        <div className="mb-canvas-content">
          <div className="mb-body">
            <ul className="nav-ul-mb">
              {/* Trang Chủ */}
              <li className="nav-mb-item">
                <Link href="/" className="mb-menu-link">
                  Trang Chủ
                </Link>
              </li>

              {/* Khảo Sát Da */}
              <li className="nav-mb-item">
                <Link href="/quiz" className="mb-menu-link">
                  Khảo Sát Da
                </Link>
              </li>

              {/* Sản Phẩm */}
              <li className="nav-mb-item">
                <a
                  href="#products"
                  className="collapsed mb-menu-link"
                  data-bs-toggle="collapse"
                  aria-controls="products"
                >
                  <span>Sản Phẩm</span>
                  <span className="btn-open-sub" />
                </a>
                <div id="products" className="collapse">
                  {/* Danh Mục */}
                  <div className="mb-menu-heading">Danh Mục</div>
                  <div style={{ maxHeight: '40vh', overflowY: 'auto', paddingRight: '10px', scrollbarWidth: 'thin' }} className="mobile-menu-scrollable">
                    {!categories.isLoading && renderMobileCategories(categories.data)}
                  </div>

                  {/* Loại Da */}
                  <div className="mb-menu-heading mt-3">Loại Da</div>
                  <div style={{ maxHeight: '25vh', overflowY: 'auto', paddingRight: '10px', scrollbarWidth: 'thin' }} className="mobile-menu-scrollable">
                    <ul className="sub-nav-menu">
                      {skinTypes.map((skinType, index) => (
                        <li key={`skin-${index}`}>
                          <Link
                            href={`/products?skinTypeId=${skinType.id}`}
                            className="sub-nav-link"
                          >
                            {skinType.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </li>

              {/* Blog */}
              <li className="nav-mb-item">
                <Link href="/blog" className="mb-menu-link">
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* Bottom Section */}
          <div className="mb-bottom">
            {isLoggedIn ? (
              <>
                <Link href="/my-account" className="site-nav-icon">
                  <i className="icon icon-account" />
                  Tài khoản
                </Link>
                <a href="#" onClick={handleLogout} className="site-nav-icon mt-3 text-danger">
                  <LogoutIcon fontSize="small" className="mr-2" />
                  Đăng xuất
                </a>
              </>
            ) : (
              <Link href="/login" className="site-nav-icon">
                <i className="icon icon-account" />
                Đăng Nhập
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Navigation Bar */}
      <div className="bg-white border-gray-200 border-t bottom-0 fixed left-0 md:hidden right-0 z-[900]">
        <div className="flex h-16 justify-around items-center">
          <Link
            href="/"
            className="flex flex-col text-gray-600 hover:text-primary items-center"
            style={{ color: pathname === '/' ? 'var(--primary-color)' : '' }}
          >
            <HomeIcon sx={{ fontSize: '24px', mb: 0.5 }} />
            <span className="text-xs">Trang Chủ</span>
          </Link>

          <Link
            href="/quiz"
            className="flex flex-col text-gray-600 hover:text-primary items-center"
            style={{ color: pathname === '/quiz' ? 'var(--primary-color)' : '' }}
          >
            <QuizIcon sx={{ fontSize: '24px', mb: 0.5 }} />
            <span className="text-xs">Khảo Sát</span>
          </Link>

          <Link
            href="/products"
            className="flex flex-col text-gray-600 hover:text-primary items-center"
            style={{ color: pathname.includes('/products') ? 'var(--primary-color)' : '' }}
          >
            <ShoppingBagIcon sx={{ fontSize: '24px', mb: 0.5 }} />
            <span className="text-xs">Sản Phẩm</span>
          </Link>

          <Link
            href="/blog"
            className="flex flex-col text-gray-600 hover:text-primary items-center"
            style={{ color: pathname.includes('/blog') ? 'var(--primary-color)' : '' }}
          >
            <BlogIcon sx={{ fontSize: '24px', mb: 0.5 }} />
            <span className="text-xs">Blog</span>
          </Link>

          <Link
            href={isLoggedIn ? "/my-account" : "/login"}
            className="flex flex-col text-gray-600 hover:text-primary items-center"
            style={{ color: pathname.includes('/my-account') || pathname.includes('/login') ? 'var(--primary-color)' : '' }}
          >
            <PersonIcon sx={{ fontSize: '24px', mb: 0.5 }} />
            <span className="text-xs">{isLoggedIn ? "Tài khoản" : "Đăng nhập"}</span>
          </Link>
        </div>
      </div>
    </>
  );
}