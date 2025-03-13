"use client";
import BlogDetails from "@/components/blogs/BlogDetails";
import RelatedBlogs from "@/components/blogs/RelatedBlogs";
import Footer1 from "@/components/footers/Footer1";
import Header2 from "@/components/headers/Header2";
import { allBlogs } from "@/data/blogs";
import request from "@/utlis/axios";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

export default function page() {
  const id = usePathname().split("/")[2];
  console.log("id", id);
  const [blog, setBlog] = useState(null);

  useEffect(() => {
    request.get(`/blogs/${id}`).then(({ data }) => {
      setBlog(data.data);
    });
  }, [id]);

  // const { id } = await params;
  // const blog = allBlogs.filter((elm) => elm.id == id)[0] || allBlogs[0];
  return (
    <>
      <BlogDetails blog={blog} />
      <RelatedBlogs />
    </>
  );
}
