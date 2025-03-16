"use client";
import { layouts } from "@/data/shop";
import ProductGrid from "./ProductGrid";

import { useEffect, useState } from "react";
import Pagination from "../common/Pagination";
import ShopFilter from "./ShopFilter";
import Sorting from "./Sorting";
import request from "@/utlis/axios";
import { useState, useEffect } from "react";
import Pagination from "../common/Pagination";
import ShopFilter from "./ShopFilter";
import Sorting from "./Sorting";
import axios from "axios";

export default function ShopDefault() {
  const [gridItems, setGridItems] = useState(4);
  const [products, setProducts] = useState([]);
  const [finalSorted, setFinalSorted] = useState([]);
  useEffect(() => {
    (async () => {
      const { data } = await request.get("/Products/all?Page=1&PageSize=20");
      console.log(data);

      setProducts(data.data);
    })();
  }, []);

  const [pagination, setPagination] = useState({
    currentPage: 1,
    pageSize: 10,
    totalPages: 1,
    totalItems: 0
  });

  const fetchProducts = async (page = 1) => {
    try {
      const response = await axios.get(`https://localhost:44398/api/v1/Product/all?Page=${page}&PageSize=${pagination.pageSize}`);
      const { data } = response.data;
      
      // Transform API data to match your product structure
      const transformedProducts = data.results.map(item => ({
        id: item.id,
        title: item.name,
        price: item.price,
        imgSrc: item.productImages?.[0]?.imageUrl || '/placeholder.jpg',
        soldOut: item.productStatus === 'SoldOut'
      }));

      setProducts(transformedProducts);
      setFinalSorted(transformedProducts);
      setPagination({
        currentPage: data.currentPage,
        pageSize: data.pageSize,
        totalPages: data.pageCount,
        totalItems: data.rowCount
      });
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handlePageChange = (page) => {
    fetchProducts(page);
  };

  return (
    <>
      <section className="flat-spacing-2">
        <div className="container">
          <div className="tf-shop-control grid-3 align-items-center">
            <div className="tf-control-filter">
              <a
                href="#filterShop"
                data-bs-toggle="offcanvas"
                aria-controls="offcanvasLeft"
                className="tf-btn-filter"
              >
                <span className="icon icon-filter" />
                <span className="text">Filter</span>
              </a>
            </div>
            <ul className="tf-control-layout d-flex justify-content-center">
              {layouts.map((layout, index) => (
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
                <Sorting
                  setFinalSorted={setFinalSorted}
                  products={products.results}
                />
              </div>
            </div>
          </div>
          <div className="wrapper-control-shop">
            <div className="meta-filter-shop" />
            <ProductGrid allproducts={finalSorted} gridItems={gridItems} />
            {finalSorted.length > 0 && (
              <ul className="tf-pagination-wrap tf-pagination-list tf-pagination-btn">
                <Pagination 
                  currentPage={pagination.currentPage}
                  totalPages={pagination.totalPages}
                  onPageChange={handlePageChange}
                />
              </ul>
            )}
          </div>
        </div>
      </section>
      <ShopFilter setProducts={setProducts} />
    </>
  );
}
