"use client";
import { useRouter, useSearchParams } from "next/navigation";
import React from "react";

export default function Pagination({
  totalPages = 1,
  currentPage = 1,
  onPageChange,
  queryKey = "page",
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handlePageClick = (pageNumber) => {
    // Create new URLSearchParams object from current params
    const params = new URLSearchParams(searchParams);

    // Update or add the page parameter
    params.set(queryKey, pageNumber.toString());

    // Update URL with new query string
    router.push(`?${params.toString()}`);

    // Call the callback if provided
    if (onPageChange) {
      onPageChange(pageNumber);
    }
  };

  // Generate array of page numbers
  const getPageNumbers = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
    return pages;
  };

  // Handle next page
  const handleNext = () => {
    if (currentPage < totalPages) {
      handlePageClick(currentPage + 1);
    }
  };

  // Handle previous page
  const handlePrev = () => {
    if (currentPage > 1) {
      handlePageClick(currentPage - 1);
    }
  };

  return (
    <ul className="pagination">
      {/* Previous button */}
      <li className={currentPage === 1 ? "disabled" : ""}>
        <a
          className="pagination-link animate-hover-btn"
          onClick={handlePrev}
          style={{ cursor: currentPage === 1 ? "not-allowed" : "pointer" }}
        >
          <span className="icon icon-arrow-left" />
        </a>
      </li>

      {/* Page numbers */}
      {getPageNumbers().map((pageNumber) => (
        <li
          key={pageNumber}
          className={currentPage === pageNumber ? "active" : ""}
        >
          <a
            className="pagination-link animate-hover-btn"
            onClick={() => handlePageClick(pageNumber)}
          >
            {pageNumber}
          </a>
        </li>
      ))}

      {/* Next button */}
      <li className={currentPage === totalPages ? "disabled" : ""}>
        <a
          className="pagination-link animate-hover-btn"
          onClick={handleNext}
          style={{
            cursor: currentPage === totalPages ? "not-allowed" : "pointer",
          }}
        >
          <span className="icon icon-arrow-right" />
        </a>
      </li>
    </ul>
  );
}
