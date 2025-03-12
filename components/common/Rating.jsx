import React from "react";

export default function Rating({ number }) {
  // Ensure the number is a valid positive integer
  const validNumber = Number.isInteger(number) && number > 0 ? number : 0;

  return (
    <div className="rating mt-2">
      {[...Array(validNumber)].map((_, i) => (
        <i key={i} className="icon-star" />
      ))}
    </div>
  );
}
