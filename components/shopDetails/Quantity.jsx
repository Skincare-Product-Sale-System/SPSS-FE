"use client";

import { useEffect, useState } from "react";

export default function Quantity({ setQuantity, maxQuantity = 999 }) {
  const [count, setCount] = useState(1);

  const increment = () => {
    if (count < maxQuantity) {
      setCount(count + 1);
      setQuantity(count + 1);
    }
  };

  const decrement = () => {
    if (count > 1) {
      setCount(count - 1);
      setQuantity(count - 1);
    }
  };

  const handleChange = (e) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value >= 1 && value <= maxQuantity) {
      setCount(value);
      setQuantity(value);
    }
  };

  return (
    <div className="quantity-input">
      <button
        type="button"
        className="quantity-input__modifier quantity-input__modifier--left"
        onClick={decrement}
      >
        &mdash;
      </button>
      <input
        className="quantity-input__screen"
        type="text"
        value={count}
        onChange={handleChange}
        max={maxQuantity}
        min="1"
      />
      <button
        type="button"
        className="quantity-input__modifier quantity-input__modifier--right"
        onClick={increment}
      >
        &#xff0b;
      </button>
    </div>
  );
}
