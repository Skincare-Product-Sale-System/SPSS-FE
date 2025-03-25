"use client";
import React from "react";
import BlogTextSection from "./BlogTextSection";
import BlogImageSection from "./BlogImageSection";
import BlogQuoteSection from "./BlogQuoteSection";

export default function BlogSection({ section }) {
  switch (section.contentType) {
    case 'text':
      return <BlogTextSection section={section} />;
    case 'image':
      return <BlogImageSection section={section} />;
    case 'quote':
      return <BlogQuoteSection section={section} />;
    default:
      return null;
  }
} 