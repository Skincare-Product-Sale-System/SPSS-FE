import React from "react";

export default function Rating({ number }) {
  return (
    <div className="rating mt-2">
      {[...Array(Math.ceil(number))].map((_, i) => (
        <i key={i} className="icon-star" />
      ))}
    </div>
  );
}
