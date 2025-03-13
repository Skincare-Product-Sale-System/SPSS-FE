"use client";
import { useContextElement } from "@/context/Context";
import { allProducts, products1 } from "@/data/products";
import request from "@/utlis/axios";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import Rating from "../common/Rating";

export default function Compare() {
  const { setQuickViewItem } = useContextElement();
  const { setQuickAddItem } = useContextElement();

  const { removeFromCompareItem, compareItem, setCompareItem } =
    useContextElement();
  const [items, setItems] = useState([]);
  useEffect(() => {
    Promise.all(
      // fetch list of item data from api and set to items
      compareItem.map(async (item) => {
        const { data } = await request.get(`/products/${item}`);
        return data.data;
      })
    ).then((res) => {
      console.log("compareItem", res);
      setItems(res);
    });
  }, [compareItem]);
  console.log("compareItemAt Compare Page", items);

  return (
    <section className="flat-spacing-12">
      <div className="container">
        <div>
          <div className="tf-compare-table">
            <div className="tf-compare-row tf-compare-grid">
              <div className="tf-compare-col d-md-block d-none" />

              {items.map((elm, i) => (
                <div key={i} className="tf-compare-col">
                  <div className="tf-compare-item">
                    <div
                      className="tf-compare-remove link"
                      onClick={() => removeFromCompareItem(elm?.id)}
                    >
                      Remove
                    </div>
                    <Link
                      className="tf-compare-image"
                      href={`/product-detail/${elm?.id}`}
                    >
                      <Image
                        className="lazyload aspect-square w-full"
                        data-src={elm?.productImageUrls[0]}
                        alt="product image"
                        width={713}
                        height={1070}
                        src={elm?.productImageUrls[0]}
                      />
                    </Link>
                    <Link
                      className="tf-compare-title"
                      href={`/product-detail/${elm?.id}`}
                    >
                      {elm?.name}
                    </Link>
                    <div className="price">
                      <span className="price-on-sale">
                        ${elm?.price.toLocaleString()}
                      </span>
                    </div>
                    <div className="tf-compare-group-btns d-flex gap-10">
                      <a
                        href="#quick_view"
                        data-bs-toggle="modal"
                        className="tf-btn btn-outline-dark radius-3"
                        onClick={() => setQuickViewItem(elm)}
                      >
                        <i className="icon icon-view" />
                        <span>QUICK VIEW</span>
                      </a>
                      <a
                        href="#quick_add"
                        data-bs-toggle="modal"
                        className="tf-btn btn-outline-dark radius-3"
                        onClick={() => setQuickAddItem(elm?.id)}
                      >
                        <i className="icon icon-bag" />
                        <span>QUICK ADD</span>
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="tf-compare-row tf-compare-grid">
              <div className="tf-compare-col tf-compare-field d-md-block d-none">
                <h6>Status</h6>
              </div>
              {items.map((elm, i) => (
                <div
                  className="tf-compare-col tf-compare-field tf-compare-stock"
                  style={{ flex: 1 }}
                >
                  <div className="icon">
                    <i className="icon-check" />
                  </div>
                  <span className="fw-5">{elm?.status}</span>
                </div>
              ))}
            </div>
            <div className="tf-compare-row">
              <div className="tf-compare-col tf-compare-field d-md-block d-none">
                <h6>Price</h6>
              </div>
              {items.map((elm, i) => (
                <div className="tf-compare-col tf-compare-value text-center">
                  ${elm?.price.toLocaleString()}
                </div>
              ))}
            </div>
            <div className="tf-compare-row">
              <div className="tf-compare-col tf-compare-field d-md-block d-none">
                <h6>Rating</h6>
              </div>
              {items.map((elm, i) => (
                <div className="tf-compare-col tf-compare-value text-center">
                  {elm?.rating > 1 ? (
                    <Rating number={elm?.rating} />
                  ) : (
                    "No rating"
                  )}
                </div>
              ))}
            </div>
            <div className="tf-compare-row">
              <div className="tf-compare-col tf-compare-field d-md-block d-none">
                <h6>Type</h6>
              </div>
              {items.map((elm, i) => (
                <div
                  className="tf-compare-col tf-compare-value text-center"
                  style={{ flex: 1 }}
                >
                  {elm?.category?.categoryName}
                </div>
              ))}
            </div>
            <div className="tf-compare-row">
              <div className="tf-compare-col tf-compare-field d-md-block d-none">
                <h6>Function</h6>
              </div>
              {items.map((elm, i) => (
                <div
                  className="tf-compare-col tf-compare-value text-center"
                  style={{ flex: 1 }}
                >
                  {elm?.specifications?.mainFunction}
                </div>
              ))}
            </div>
            <div className="tf-compare-row">
              <div className="tf-compare-col tf-compare-field d-md-block d-none">
                <h6>For skin type</h6>
              </div>
              {items.map((elm, i) => (
                <div
                  className="tf-compare-col tf-compare-value text-center"
                  style={{ flex: 1 }}
                >
                  {elm?.specifications?.skinIssues}
                </div>
              ))}
            </div>
            <div className="tf-compare-row">
              <div className="tf-compare-col tf-compare-field d-md-block d-none">
                <h6>Ingredients</h6>
              </div>
              {items.map((elm, i) => (
                <div
                  className="tf-compare-col tf-compare-value text-center"
                  style={{ flex: 1 }}
                >
                  {elm?.specifications?.keyActiveIngredients}
                </div>
              ))}
            </div>

            <div className="tf-compare-row">
              <div className="tf-compare-col tf-compare-field d-md-block d-none">
                <h6>Brand</h6>
              </div>
              {items.map((elm, i) => (
                <div className="tf-compare-col tf-compare-value text-center">
                  {elm?.brand?.name}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
