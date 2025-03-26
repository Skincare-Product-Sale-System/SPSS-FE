"use client";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import BlogDetailContent from "@/components/blog/BlogDetailContent";
import request from "@/utils/axios";
import { Container, Typography } from "@mui/material";
import Link from "next/link";

export default function BlogDetailPage({ blog }) {
  return <BlogDetailContent blog={blog} />;
} 