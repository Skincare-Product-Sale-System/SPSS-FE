"use client";
import React from "react";
import { Container, Typography } from "@mui/material";
import BlogDetailHeader from "./BlogDetailHeader";
import BlogSection from "./BlogSection";
import BlogFooter from "./BlogFooter";

export default function BlogDetailContent({ blog }) {
  if (!blog) {
    return (
      <Container maxWidth="lg" sx={{ py: 6, textAlign: 'center' }}>
        <Typography variant="h5" sx={{ fontFamily: 'Playfair Display, serif' }}>
          Không tìm thấy bài viết
        </Typography>
      </Container>
    );
  }

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