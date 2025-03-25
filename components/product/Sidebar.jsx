"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { featuredProducts } from "@/data/products";
import { galleryItems } from "@/data/gallery";
// import { categories } from "@/data/categories";
import { socialLinks } from "@/data/socials";
import { useQueries } from "@tanstack/react-query";
import request from "@/utils/axios";
import { Box, List, ListItem, ListItemButton, ListItemText, Typography, Collapse } from "@mui/material";
import { useThemeColors } from "@/context/ThemeContext";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';

export default function Sidebar({ 
  brands, 
  categories, 
  skinTypes, 
  activeFilters, 
  onFilterChange 
}) {
  const mainColor = useThemeColors();
  const [expandedCategories, setExpandedCategories] = useState({});

  // Xử lý mở/đóng danh mục con
  const handleToggleCategory = (categoryId) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId]
    }));
  };

  // Render danh mục con
  const renderCategoryChildren = (category, level = 0) => {
    const hasChildren = category.children && category.children.length > 0;
    const isExpanded = expandedCategories[category.id];

    return (
      <Box key={category.id}>
        <ListItemButton
          selected={activeFilters.categoryId === category.id}
          onClick={() => onFilterChange("categoryId", category.id)}
          sx={{
            pl: level * 2 + 2,
            py: 1,
            borderRadius: '4px',
            '&.Mui-selected': {
              backgroundColor: `${mainColor.primary}20`,
              '&:hover': {
                backgroundColor: `${mainColor.primary}30`,
              }
            },
            '&:hover': {
              backgroundColor: `${mainColor.primary}10`,
            }
          }}
        >
          <ListItemText 
            primary={category.categoryName}
            sx={{
              '& .MuiTypography-root': {
                fontSize: '0.9rem',
                color: activeFilters.categoryId === category.id 
                  ? mainColor.primary 
                  : mainColor.black
              }
            }}
          />
          {hasChildren && (
            <Box 
              onClick={(e) => {
                e.stopPropagation();
                handleToggleCategory(category.id);
              }}
              sx={{ 
                display: 'flex',
                alignItems: 'center',
                color: mainColor.black
              }}
            >
              {isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </Box>
          )}
        </ListItemButton>

        {hasChildren && (
          <Collapse in={isExpanded} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {category.children.map(child => renderCategoryChildren(child, level + 1))}
            </List>
          </Collapse>
        )}
      </Box>
    );
  };

  // Render section filter
  const renderFilterSection = (title, items, type, getValue, getName) => (
    <Box sx={{ mb: 4 }}>
      <Typography 
        variant="h6" 
        sx={{ 
          color: mainColor.text,
          mb: 2,
          fontWeight: 600,
          fontSize: '1.5rem',
          textTransform: 'uppercase'
        }}
      >
        {title}
      </Typography>
      <List sx={{ 
        maxHeight: type === 'categoryId' ? 'none' : '300px', 
        overflowY: type === 'categoryId' ? 'visible' : 'auto',
        '&::-webkit-scrollbar': {
          width: '4px',
        },
        '&::-webkit-scrollbar-thumb': {
          backgroundColor: `${mainColor.primary}40`,
          borderRadius: '2px',
        }
      }}>
        {type === 'categoryId' 
          ? items
              .filter(category => !category.parentId) // Lọc ra các danh mục cha
              .map(category => renderCategoryChildren(category))
          : items.map((item) => (
              <ListItem 
                key={getValue(item)} 
                disablePadding
                sx={{ mb: 0.5 }}
              >
                <ListItemButton
                  selected={activeFilters[type] === getValue(item)}
                  onClick={() => onFilterChange(type, getValue(item))}
                  sx={{
                    borderRadius: '4px',
                    py: 1,
                    '&.Mui-selected': {
                      backgroundColor: `${mainColor.primary}20`,
                      '&:hover': {
                        backgroundColor: `${mainColor.primary}30`,
                      }
                    },
                    '&:hover': {
                      backgroundColor: `${mainColor.primary}10`,
                    }
                  }}
                >
                  <ListItemText 
                    primary={getName(item)}
                    sx={{
                      '& .MuiTypography-root': {
                        fontSize: '0.9rem',
                        color: activeFilters[type] === getValue(item) 
                          ? mainColor.primary 
                          : mainColor.black
                      }
                    }}
                  />
                </ListItemButton>
              </ListItem>
            ))}
      </List>
    </Box>
  );

  return (
    <aside className="tf-shop-sidebar wrap-sidebar-mobile">
      <div className="wd-categories widget-facet">
        <div className="mb-6">
          {renderFilterSection(
            "Danh mục sản phẩm",
            categories,
            "categoryId",
            (category) => category.id,
            (category) => category.categoryName
          )}
        </div>
        
        {/* Brands Section */}
        <div className="mb-6">
          {renderFilterSection(
            "Thương hiệu",
            brands,
            "brandId",
            (brand) => brand.id,
            (brand) => brand.name
          )}
        </div>

        {/* Skin Types Section */}
        <div className="mb-6">
          {renderFilterSection(
            "Loại da",
            skinTypes,
            "skinTypeId",
            (skinType) => skinType.id,
            (skinType) => skinType.name
          )}
        </div>
      </div>
    </aside>
  );
}
