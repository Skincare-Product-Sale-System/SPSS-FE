"use client";
import React from "react";
import { Container } from "@mui/material";
import BlogDetailHeader from "./BlogDetailHeader";
import BlogSection from "./BlogSection";
import BlogFooter from "./BlogFooter";

export default function BlogDetailContent({ blog }) {
  // Sort sections by order
  const sortedSections = blog.sections?.sort((a, b) => a.order - b.order) || [];

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <BlogDetailHeader blog={blog} />
      
      {sortedSections.map((section, index) => (
        <BlogSection key={index} section={section} />
      ))}
      
      <BlogFooter />
    </Container>
  );
} 