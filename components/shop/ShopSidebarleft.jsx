"use client";
import { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import { layouts, sortingOptions } from "@/data/shop";
import ProductGrid from "./ProductGrid";
import Pagination from "../common/Pagination";
import Sorting from "./Sorting";
import { products1 } from "@/data/products";
import { useQueries } from "@tanstack/react-query";
import request from "@/utlis/axios";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";

export default function ShopSidebarleft() {
  const [gridItems, setGridItems] = useState(4);
  const [finalSorted, setFinalSorted] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [products, setProducts] = useState([]);

  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);

  useEffect(() => {
    (async () => {
      const categoryId = params.get("categoryId");
      const { data } = await request.get(
        `/products${categoryId ? `/by-category/${categoryId}` : ""}?pageSize=20`
      );
      setProducts(data.data);
    })();
  }, []);

  const fetchProducts = async (page) => {
    const categoryId = params.get("categoryId");
    const { data } = await request.get(
      `/products${
        categoryId ? `/by-category/${categoryId}` : ""
      }?pageSize=20&pageNumber=${page}`
    );
    setProducts(data.data);
  };

  // make it fetch products when categoryId changes
  useEffect(() => {
    fetchProducts(currentPage);
  }, [searchParams]);

  return (
    <>
      <section className="flat-spacing-1">
        <div className="container">
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
            <div className="tf-control-sorting d-flex justify-content-end">
              <div className="tf-dropdown-sort" data-bs-toggle="dropdown">
                <Sorting setFinalSorted={setFinalSorted} products={products1} />
              </div>
            </div>
          </div>
          <div className="tf-row-flex">
            <Sidebar />
            <div className="tf-shop-content">
              <ProductGrid
                allproducts={products.items || []}
                gridItems={gridItems}
              />
              {/* pagination */}{" "}
              {finalSorted.length ? (
                <ul className="tf-pagination-wrap tf-pagination-list">
                  <Pagination
                    currentPage={products.pageNumber}
                    totalPages={products.totalPages}
                    // totalPages={products.totalPages}
                    onPageChange={(newPage) => {
                      setCurrentPage(newPage);
                      fetchProducts(newPage);
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    queryKey="page"
                  />
                </ul>
              ) : (
                ""
              )}
            </div>
          </div>
        </div>
      </section>
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
