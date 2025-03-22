"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { ProductCard } from "../shopCards/ProductCard";
import { Navigation } from "swiper/modules";
import {
  allHomepages,
  blogLinks,
  productDetailPages,
} from "@/data/menu";
import { usePathname } from "next/navigation";
import request from "@/utils/axios";
import { useQueries } from "@tanstack/react-query";

export default function Nav({ isArrow = true, textColor = "", Linkfs = "" }) {
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
  
  // Thêm state và fetch cho skin types
  const [skinTypes, setSkinTypes] = useState([]);
  
  useEffect(() => {
    const fetchSkinTypes = async () => {
      try {
        const { data } = await request.get("/skin-types");
        // Kiểm tra cấu trúc dữ liệu theo response API thực tế
        if (data && data.data && Array.isArray(data.data.items)) {
          setSkinTypes(data.data.items);
        } else {
          console.error("Skin types data is not in expected format:", data);
          setSkinTypes([]);
        }
      } catch (error) {
        console.error("Error fetching skin types:", error);
        setSkinTypes([]);
      }
    };
    
    fetchSkinTypes();
  }, []);

  const pathname = usePathname();
  const isMenuActive = (menuItem) => {
    let active = false;
    if (menuItem.href?.includes("/")) {
      if (menuItem.href?.split("/")[1] == pathname.split("/")[1]) {
        active = true;
      }
    }
    if (menuItem.length) {
      active = menuItem.some(
        (elm) => elm.href?.split("/")[1] == pathname.split("/")[1]
      );
    }
    if (menuItem.length) {
      menuItem.forEach((item) => {
        item.links?.forEach((elm2) => {
          if (elm2.href?.includes("/")) {
            if (elm2.href?.split("/")[1] == pathname.split("/")[1]) {
              active = true;
            }
          }
          if (elm2.length) {
            elm2.forEach((item2) => {
              item2?.links?.forEach((elm3) => {
                if (elm3.href.split("/")[1] == pathname.split("/")[1]) {
                  active = true;
                }
              });
            });
          }
        });
        if (item.href?.includes("/")) {
          if (item.href?.split("/")[1] == pathname.split("/")[1]) {
            active = true;
          }
        }
      });
    }

    return active;
  };
  
  // Hàm đệ quy để hiển thị danh mục và danh mục con
  const renderCategories = (categoryList, level = 0) => {
    if (!categoryList || categoryList.length === 0) return null;
    
    return (
      <ul className={level === 0 ? "menu-list" : "submenu-list"}>
        {categoryList.map((category, index) => (
          <li key={index} className={category.children?.length > 0 ? "menu-item-2" : ""}>
            <a
              href={`/products?categoryId=${category.id}`}
              className={`menu-link-text link position-relative ${
                isMenuActive({ href: `/products?categoryId=${category.id}` }) ? "activeMenu" : ""
              }`}
            >
              {category.categoryName}
            </a>
            
            {category.children?.length > 0 && (
              <div className="sub-menu submenu-default">
                {renderCategories(category.children, level + 1)}
              </div>
            )}
          </li>
        ))}
      </ul>
    );
  };

  // Thêm component con để hiển thị mũi tên
  const MenuArrow = () => (
    <i className="icon icon-arrow-down" style={{ 
      marginLeft: '4px', 
      display: 'inline-block',
      verticalAlign: 'middle'
    }} />
  );

  return (
    <>
      {" "}
      <li className="menu-item">
        <a
          href="/"
          className={`item-link ${Linkfs} ${textColor} ${
            isMenuActive(allHomepages) ? "activeMenu" : ""
          } `}
        >
          Trang Chủ
        </a>
      </li>
      <li className="menu-item">
        <a
          href="/quiz"
          className={`item-link ${Linkfs} ${textColor} ${
            isMenuActive([
              {
                href: "/quiz",
              },
            ])
              ? "activeMenu"
              : ""
          } `}
        >
          Khảo Sát Da
        </a>
      </li>
      {/* <li className="menu-item">
        <a
          href="#"
          className={`item-link ${Linkfs} ${textColor} ${
            isMenuActive(productsPages) ? "activeMenu" : ""
          } `}
        >
          Shop
          {isArrow ? <i className="icon icon-arrow-down" /> : ""}
        </a>
        <div className="mega-menu sub-menu">
          <div className="container">
            <div className="row">
              {productsPages.map((menu, index) => (
                <div className="col-lg-2" key={index}>
                  <div className="mega-menu-item">
                    <div className="menu-heading">{menu.heading}</div>
                    <ul className="menu-list">
                      {menu.links.map((link, linkIndex) => (
                        <li key={linkIndex}>
                          <Link
                            href={link.href}
                            className={`menu-link-text link ${
                              isMenuActive(link) ? "activeMenu" : ""
                            }`}
                          >
                            {link.text}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
              <div className="col-lg-3">
                <div className="collection-item hover-img">
                  <div className="collection-inner">
                    <Link
                      href={`/home-men`}
                      className="collection-image img-style"
                    >
                      <Image
                        className="lazyload"
                        data-src="/images/collections/collection-1.jpg"
                        alt="collection-demo-1"
                        src="/images/collections/collection-1.jpg"
                        width="1000"
                        height="1215"
                      />
                    </Link>
                    <div className="collection-content">
                      <Link
                        href={`/home-men`}
                        className="collection-title btn-xl fs-16 hover-icon tf-btn"
                      >
                        <span>Men</span>
                        <i className="icon icon-arrow1-top-left" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-3">
                <div className="collection-item hover-img">
                  <div className="collection-inner">
                    <Link
                      href={`/shop-women`}
                      className="collection-image img-style"
                    >
                      <Image
                        className="lazyload"
                        data-src="/images/collections/collection-2.jpg"
                        alt="collection-demo-1"
                        src="/images/collections/collection-2.jpg"
                        width="500"
                        height="607"
                      />
                    </Link>
                    <div className="collection-content">
                      <Link
                        href={`/shop-women`}
                        className="collection-title btn-xl fs-16 hover-icon tf-btn"
                      >
                        <span>Women</span>
                        <i className="icon icon-arrow1-top-left" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </li> */}
      <li className="menu-item">
        <a
          href="/products"
          className={`item-link ${Linkfs} ${textColor} ${
            isMenuActive(productDetailPages) ? "activeMenu" : ""
          }`}
        >
          Sản Phẩm<i className="icon icon-arrow-down" style={{ display: 'inline-block', width: '12px', marginLeft: '1px' }}></i>
        </a>
        <div className="mega-menu sub-menu">
          <div className="container">
            <div className="row">
              <div className="col-lg-4">
                <div className="mega-menu-item">
                  <div className="menu-heading">Danh Mục</div>
                  {!categories.isLoading && renderCategories(categories.data)}
                  
                  <div className="menu-heading mt-4">Loại Da</div>
                  <ul className="menu-list">
                    {Array.isArray(skinTypes) && skinTypes.length > 0 ? (
                      skinTypes.map((skinType, index) => (
                        <li key={`skin-${index}`}>
                          <a
                            href={`/products?skinTypeId=${skinType.id}`}
                            className={`menu-link-text link position-relative ${
                              isMenuActive({ href: `/products?skinTypeId=${skinType.id}` }) ? "activeMenu" : ""
                            }`}
                          >
                            {skinType.name}
                          </a>
                        </li>
                      ))
                    ) : (
                      <li><span className="menu-link-text">Đang tải loại da...</span></li>
                    )}
                  </ul>
                </div>
              </div>
              {/* {productDetailPages.map((menuItem, index) => (
                <div key={index} className="col-lg-2">
                  <div className="mega-menu-item">
                    <div className="menu-heading">{menuItem.heading}</div>
                    <ul className="menu-list">
                      {menuItem.links.map((linkItem, linkIndex) => (
                        <li key={linkIndex}>
                          <Link
                            href={linkItem.href}
                            className={`menu-link-text link position-relative  ${
                              isMenuActive(linkItem) ? "activeMenu" : ""
                            }`}
                          >
                            {linkItem.text}
                            {linkItem.extra}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))} */}
              <div className="col-lg-8">
                <div className="menu-heading">Sản Phẩm Bán Chạy</div>
                <div className="hover-sw-2 hover-sw-nav">
                  <Swiper
                    dir="ltr"
                    modules={[Navigation]}
                    navigation={{
                      prevEl: ".snmpn1",
                      nextEl: ".snmnn1",
                    }}
                    slidesPerView={3}
                    spaceBetween={30}
                    className="swiper tf-product-header wrap-sw-over"
                  >
                    {!products.isLoading &&
                      products.data?.slice(0, 6).map((elm, i) => (
                        <SwiperSlide key={i} className="swiper-slide">
                          <ProductCard product={elm} />
                        </SwiperSlide>
                      ))}
                  </Swiper>
                  <div className="nav-next-product-header nav-next-slider nav-sw box-icon round snmpn1 w_46">
                    <span className="icon icon-arrow-left" />
                  </div>
                  <div className="nav-prev-product-header nav-prev-slider nav-sw box-icon round snmnn1 w_46">
                    <span className="icon icon-arrow-right" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </li>
      {/* <li className="position-relative menu-item">
        <a
          href="#"
          className={`item-link ${Linkfs} ${textColor} ${
            isMenuActive(pages) ? "activeMenu" : ""
          }`}
        >
          Pages
          <i className="icon icon-arrow-down" style={{ marginLeft: '2px', position: 'relative', top: '1px' }} />
        </a>
        <div className="sub-menu submenu-default">
          <ul className="menu-list">
            {pages.map((item, index) => (
              <li key={index} className={item.links ? "menu-item-2 " : ""}>
                {item.href.includes("#") ? (
                  <a
                    href={item.href}
                    className={`${item.className} ${
                      isMenuActive(item.links) ? "activeMenu" : ""
                    }`}
                  >
                    {item.text}
                  </a>
                ) : (
                  <Link
                    href={item.href}
                    className={`${item.className}  ${
                      isMenuActive(item) ? "activeMenu" : ""
                    }`}
                    style={{ position: "relative" }}
                  >
                    {item.text}{" "}
                    {item.label && (
                      <div className="demo-label">
                        <span className="demo-new">{item.label}</span>
                      </div>
                    )}
                  </Link>
                )}

                {item.links && (
                  <div className="sub-menu submenu-default">
                    <ul className="menu-list">
                      {item.links.map((subItem, subIndex) => (
                        <li key={subIndex}>
                          <Link
                            href={subItem.href}
                            className={`${subItem.className} ${
                              isMenuActive(subItem) ? "activeMenu" : ""
                            }`}
                          >
                            {subItem.text}
                            {subItem.label && (
                              <div className="demo-label">
                                <span className="demo-new">
                                  {subItem.label}
                                </span>
                              </div>
                            )}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      </li> */}
      <li className="position-relative menu-item">
        <a
          href="/blog"
          className={`item-link ${Linkfs} ${textColor}  ${
            isMenuActive(blogLinks) ? "activeMenu" : ""
          }`}
        > 
          Blog
          {/* <div className="links-default sub-menu">
            <ul className="menu-list">
              {blogLinks.map((linkItem, index) => (
                <li key={index}>
                  <Link
                    href={linkItem.href}
                    className={`menu-link-text link text_black-2  ${
                      isMenuActive(linkItem) ? "activeMenu" : ""
                    }`}
                  >
                    {linkItem.text}
                  </Link>
                </li>
              ))}
            </ul>
          </div> */}
        </a>
      </li>
    </>
  );
}
