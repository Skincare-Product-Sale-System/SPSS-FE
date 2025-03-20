"use client";
import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Box, Typography, Container, Grid, Paper, Divider } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import RelatedBlogs from "@/components/blogs/RelatedBlogs";
import request from "@/utils/axios";

export default function Page() {
  const theme = useTheme();
  const id = usePathname().split("/")[2];
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    request.get(`/blogs/${id}`).then(({ data }) => {
      setBlog(data.data);
      setLoading(false);
    }).catch(error => {
      console.error("Error fetching blog:", error);
      setLoading(false);
    });
  }, [id]);

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 8, textAlign: 'center' }}>
        <Typography variant="h5">Loading blog content...</Typography>
      </Container>
    );
  }

  if (!blog) {
    return (
      <Container maxWidth="lg" sx={{ py: 8, textAlign: 'center' }}>
        <Typography variant="h5">Blog not found</Typography>
        <Link href="/blog" className="btn-fill mt-4 tf-btn">
          Return to Blogs
        </Link>
      </Container>
    );
  }

  // Sort sections by order
  const sortedSections = blog.sections?.sort((a, b) => a.order - b.order) || [];

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Box sx={{ mb: 6, textAlign: 'center' }}>
        <Typography 
          variant="h2" 
          component="h1" 
          sx={{ 
            mb: 3, 
            fontWeight: 600,
            color: theme.palette.text.primary
          }}
        >
          {blog.title}
        </Typography>
        
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 4, mb: 4 }}>
          <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center' }}>
            <span style={{ fontWeight: 500, marginRight: '4px' }}>By</span> {blog.author}
          </Typography>
          
          <Typography variant="body2" color="text.secondary">
            {new Date(blog.lastUpdatedAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </Typography>
        </Box>
        
        <Box sx={{ position: 'relative', height: '500px', mb: 6 }}>
          <Image
            src={blog.thumbnail}
            alt={blog.title}
            fill
            style={{ objectFit: 'cover', borderRadius: '12px' }}
            priority
          />
        </Box>
        
        <Typography 
          variant="body1" 
          sx={{ 
            fontSize: '1.1rem', 
            lineHeight: 1.8,
            color: theme.palette.text.secondary,
            maxWidth: '800px',
            margin: '0 auto',
            mb: 6
          }}
        >
          {blog.blogContent}
        </Typography>
      </Box>
      
      <Divider sx={{ mb: 6 }} />
      
      {sortedSections.map((section, index) => (
        <Box key={index} sx={{ mb: 6 }}>
          {section.contentType === 'text' && (
            <>
              {section.subtitle && (
                <Typography 
                  variant="h4" 
                  component="h2" 
                  sx={{ 
                    mb: 3, 
                    color: theme.palette.primary.main,
                    fontWeight: 600
                  }}
                >
                  {section.subtitle}
                </Typography>
              )}
              <Typography 
                variant="body1" 
                sx={{ 
                  whiteSpace: 'pre-line',
                  lineHeight: 1.8,
                  fontSize: '1.05rem'
                }}
              >
                {section.content}
              </Typography>
            </>
          )}
          
          {section.contentType === 'image' && (
            <Box sx={{ mb: 5 }}>
              <Box 
                sx={{ 
                  position: 'relative', 
                  height: '400px',
                  borderRadius: '8px',
                  overflow: 'hidden'
                }}
              >
                <Image
                  src={section.content}
                  alt="Blog image"
                  fill
                  style={{ objectFit: 'cover' }}
                />
              </Box>
              {section.subtitle && (
                <Typography 
                  variant="body2" 
                  sx={{ 
                    mt: 1.5,
                    fontStyle: 'italic',
                    color: theme.palette.text.secondary,
                    textAlign: 'center'
                  }}
                >
                  {section.subtitle}
                </Typography>
              )}
            </Box>
          )}
          
          {section.contentType === 'quote' && (
            <>
              {section.subtitle && (
                <Typography 
                  variant="h4" 
                  component="h2" 
                  sx={{ 
                    mb: 3, 
                    color: theme.palette.primary.main,
                    fontWeight: 600
                  }}
                >
                  {section.subtitle}
                </Typography>
              )}
              <Paper 
                elevation={0} 
                sx={{ 
                  p: 4, 
                  my: 4, 
                  borderLeft: `4px solid ${theme.palette.primary.main}`,
                  backgroundColor: theme.palette.background.default,
                  borderRadius: '4px'
                }}
              >
                <Typography 
                  variant="h6" 
                  component="blockquote" 
                  sx={{ 
                    fontStyle: 'italic',
                    fontWeight: 500,
                    color: theme.palette.text.primary
                  }}
                >
                  {section.content}
                </Typography>
              </Paper>
            </>
          )}
        </Box>
      ))}
      
      <Divider sx={{ my: 6 }} />
      
      <RelatedBlogs />
    </Container>
  );
}
