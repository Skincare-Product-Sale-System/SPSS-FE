"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { useQueries } from "@tanstack/react-query";
import request from "@/utlis/axios";
import { Box, List, ListItem, ListItemText, Collapse, Typography } from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { useThemeColors } from "@/context/ThemeContext";

export default function Categories() {
  const mainColor = useThemeColors();
  const [expandedCategories, setExpandedCategories] = useState({});
  
  const [categories] = useQueries({
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
    ],
  });

  const categoriesImage = {
    "Kem chống nắng": "https://images.pexels.com/photos/3999057/pexels-photo-3999057.jpeg",
    "Mặt nạ": "https://images.pexels.com/photos/15327097/pexels-photo-15327097/free-photo-of-woman-with-beauty-product-on-face-recommending-cosmetics.jpeg",
    "Dưỡng ẩm": "https://images.pexels.com/photos/3762879/pexels-photo-3762879.jpeg",
    "Đặc trị": "https://images.pexels.com/photos/3785147/pexels-photo-3785147.jpeg",
    "Làm sạch da": "https://images.pexels.com/photos/2587177/pexels-photo-2587177.jpeg",
    "Toner": "https://images.pexels.com/photos/8989961/pexels-photo-8989961.jpeg",
    "Sữa rửa mặt": "https://images.pexels.com/photos/3736399/pexels-photo-3736399.jpeg",
    "Nước tẩy trang": "https://images.pexels.com/photos/3737594/pexels-photo-3737594.jpeg",
    "Tẩy tế bào chết": "https://images.pexels.com/photos/3997989/pexels-photo-3997989.jpeg",
    "Gel / Kem / Dầu Dưỡng": "https://images.pexels.com/photos/3762879/pexels-photo-3762879.jpeg",
    "Lotion / Sữa Dưỡng": "https://images.pexels.com/photos/3737586/pexels-photo-3737586.jpeg",
    "Xịt Khoáng": "https://images.pexels.com/photos/3737592/pexels-photo-3737592.jpeg",
    "Trị mụn": "https://images.pexels.com/photos/3764013/pexels-photo-3764013.jpeg",
    "Serum / Tinh Chất": "https://images.pexels.com/photos/3785147/pexels-photo-3785147.jpeg",
  };

  // Lấy ảnh cho danh mục, nếu không có thì dùng ảnh mặc định
  const getCategoryImage = (categoryName) => {
    return categoriesImage[categoryName] || "https://images.pexels.com/photos/3737586/pexels-photo-3737586.jpeg";
  };

  // Xử lý mở/đóng danh mục
  const handleToggleCategory = (categoryId) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId]
    }));
  };

  // Hiển thị danh mục dạng cây
  const renderCategoryTree = (category, level = 0) => {
    const hasChildren = category.children && category.children.length > 0;
    const isExpanded = expandedCategories[category.id];
    
    return (
      <React.Fragment key={category.id}>
        <ListItem 
          sx={{ 
            pl: level * 2, 
            py: 0.5,
            cursor: 'pointer',
            position: 'relative',
            '&:hover': {
              '& > .submenu-default': {
                display: 'block'
              },
              backgroundColor: `${mainColor.primary}10`
            }
          }}
          className={hasChildren ? "menu-item-2" : ""}
        >
          <Link 
            href={`/products?categoryId=${category.id}`}
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              width: '100%',
              color: level === 0 ? mainColor.primary : mainColor.text,
              textDecoration: 'none'
            }}
            className="menu-link-text"
          >
            <ListItemText 
              primary={category.categoryName} 
              sx={{ 
                '& .MuiTypography-root': { 
                  fontWeight: level === 0 ? 600 : 400,
                  fontSize: level === 0 ? '1rem' : '0.9rem'
                } 
              }}
            />
            {hasChildren && (
              <Box 
                component="i"
                className="icon icon-arrow-down"
                sx={{
                  marginLeft: '4px',
                  fontSize: '12px',
                  display: 'inline-block',
                  verticalAlign: 'middle'
                }}
              />
            )}
          </Link>

          {hasChildren && (
            <div className="sub-menu submenu-default" style={{
              position: level === 0 ? 'absolute' : 'relative',
              left: level === 0 ? '100%' : '0',
              top: level === 0 ? '0' : 'auto',
              display: 'none',
              backgroundColor: '#fff',
              boxShadow: level === 0 ? '0 2px 8px rgba(0,0,0,0.1)' : 'none',
              minWidth: '200px',
              zIndex: 100
            }}>
              <List component="ul" className="menu-list" disablePadding>
                {category.children.map(child => (
                  <ListItem 
                    key={child.id}
                    sx={{ 
                      p: 0,
                      '&:hover': {
                        backgroundColor: `${mainColor.primary}10`
                      }
                    }}
                  >
                    <Link
                      href={`/products?categoryId=${child.id}`}
                      style={{
                        display: 'block',
                        padding: '8px 16px',
                        color: mainColor.text,
                        textDecoration: 'none',
                        width: '100%'
                      }}
                      className="menu-link-text"
                    >
                      {child.categoryName}
                    </Link>
                  </ListItem>
                ))}
              </List>
            </div>
          )}
        </ListItem>
      </React.Fragment>
    );
  };

  return (
    <section className="flat-spacing-4 flat-categorie">
      <div className="container-full">
        <div className="flat-title-v2">
          <div className="box-sw-navigation">
            <div className="nav-sw nav-next-slider snbp1 nav-next-collection snbp107">
              <span className="icon icon-arrow-left" />
            </div>
            <div className="nav-sw nav-prev-slider snbn1 nav-prev-collection snbn107">
              <span className="icon icon-arrow-right" />
            </div>
          </div>
          <span
            className="text-3 fw-7 text-uppercase title wow fadeInUp"
            data-wow-delay="0s"
          >
            SHOP BY CATEGORIES
          </span>
        </div>
        <div className="row">
          <div className="col-xl-3 col-lg-4 col-md-4">
            <div className="category-tree-container" 
              style={{ 
                backgroundColor: '#fff', 
                borderRadius: '8px', 
                padding: '20px', 
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                maxHeight: '600px',
                overflowY: 'auto'
              }}
            >
              <Typography variant="h6" sx={{ mb: 2, color: mainColor.primary, fontWeight: 600 }}>
                All Categories
              </Typography>
              
              <List component="nav" aria-label="category tree">
                {!categories.isLoading && categories.data
                  .filter(category => category.parentId === null)
                  .map(category => renderCategoryTree(category))}
              </List>
            </div>
            
            <div className="discovery-new-item mt-4">
              <h5>Discover New Products</h5>
              <Link href={`/products`}>
                <i className="icon-arrow1-top-left" />
              </Link>
            </div>
          </div>
          
          <div className="col-xl-9 col-lg-8 col-md-8">
            <Swiper
              dir="ltr"
              className="swiper tf-sw-collection"
              spaceBetween={15}
              modules={[Navigation]}
              navigation={{
                prevEl: ".snbp107",
                nextEl: ".snbn107",
              }}
              breakpoints={{
                1024: {
                  slidesPerView: 3,
                  spaceBetween: 30,
                },
                768: {
                  slidesPerView: 2,
                  spaceBetween: 30,
                },
                640: {
                  slidesPerView: 2,
                },
              }}
            >
              {!categories.isLoading &&
                categories.data
                  .filter(category => category.parentId === null)
                  .map((item, index) => (
                    <SwiperSlide className="swiper-slide" key={index}>
                      <div className="collection-item style-left hover-img">
                        <div className="collection-inner">
                          <Link
                            href={`/products?categoryId=${item.id}`}
                            className="collection-image img-style"
                          >
                            <Image
                              className="lazyload"
                              data-src={getCategoryImage(item.categoryName)}
                              alt={item.categoryName}
                              src={getCategoryImage(item.categoryName)}
                              width="600"
                              height="721"
                              style={{
                                aspectRatio: "1/1",
                                objectFit: "cover",
                              }}
                            />
                          </Link>
                          <div className="collection-content">
                            <div className="category-info">
                              <Link
                                href={`/products?categoryId=${item.id}`}
                                className="tf-btn collection-title hover-icon fs-15"
                              >
                                <span>{item.categoryName}</span>
                                <i className="icon icon-arrow1-top-left" />
                              </Link>
                              {item.children && item.children.length > 0 && (
                                <div className="subcategories mt-2">
                                  {item.children.slice(0, 3).map((child, idx) => (
                                    <Link
                                      key={idx}
                                      href={`/products?categoryId=${child.id}`}
                                      className="subcategory-link"
                                      style={{
                                        display: 'block',
                                        fontSize: '0.85rem',
                                        color: mainColor.text,
                                        marginTop: '4px',
                                        textDecoration: 'none',
                                        '&:hover': {
                                          color: mainColor.primary
                                        }
                                      }}
                                    >
                                      {child.categoryName}
                                    </Link>
                                  ))}
                                  {item.children.length > 3 && (
                                    <span style={{ fontSize: '0.8rem', color: mainColor.primary }}>
                                      +{item.children.length - 3} more
                                    </span>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </SwiperSlide>
                  ))}
            </Swiper>
          </div>
        </div>
      </div>
    </section>
  );
}
