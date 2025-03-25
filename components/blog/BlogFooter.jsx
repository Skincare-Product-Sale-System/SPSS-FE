"use client";
import React from "react";
import { Box, Divider } from "@mui/material";
import RelatedBlogs from "@/components/blog/RelatedBlogs";

export default function BlogFooter() {
  return (
    <>
      <Divider sx={{ my: 6 }} />
      <RelatedBlogs />
    </>
  );
} 