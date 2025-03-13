import React from "react";
import Overlay from "@/components/common/Overlay";
import BlogGrid from "./_partials/BlogGrid";

export default function page() {
  return (
    <>
      <div
        className="tf-page-title"
        style={{
          position: "relative",
        }}
      >
        <Overlay />
        <div className="container-full">
          <div className="row">
            <div
              className="col-12"
              style={{
                zIndex: 3,
                color: "white",
              }}
            >
              <div className="heading text-center" style={{}}>
                Blog
              </div>
              <p className="text-center text-2 mt_5">
                Get the tips and tricks for your skin care routine
              </p>
            </div>
          </div>
        </div>
      </div>
      <BlogGrid />
    </>
  );
}
