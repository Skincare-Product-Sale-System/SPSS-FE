import React from "react";

export default function Overlay() {
  return (
    <>
      <div
        style={{
          zIndex: 1,
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
        }}
      ></div>
      <div
        style={{
          zIndex: 0,
          backgroundImage:
            "url(https://images.pexels.com/photos/31095139/pexels-photo-31095139/free-photo-of-hydrating-skincare-products-with-floral-decor.jpeg)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
        }}
      ></div>
    </>
  );
}
