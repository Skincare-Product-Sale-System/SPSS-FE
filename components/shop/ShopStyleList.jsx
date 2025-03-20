import React from "react";
import Pagination from "../common/Pagination";

export default function ShopStyleList() {
  return (
    <section className="flat-spacing-1">
      <div className="container">
        <div className="grid-layout" data-grid="grid-list">
        </div>
        {/* pagination */}
        <ul className="tf-pagination-list tf-pagination-wrap">
          <Pagination />
        </ul>
      </div>
    </section>
  );
}
