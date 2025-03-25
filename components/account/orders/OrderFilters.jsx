"use client"
import React from "react";
import { useThemeColors } from "@/context/ThemeContext";
import { 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  Box
} from '@mui/material';

export default function OrderFilters({ 
  sortOrder, 
  statusFilter, 
  onSortChange, 
  onStatusChange 
}) {
  const mainColor = useThemeColors();

  return (
    <Box className="flex flex-col justify-end gap-4 items-center mb-8 md:flex-row">
      <FormControl size="small" sx={{ minWidth: 200 }}>
        <InputLabel>Sort By Date</InputLabel>
        <Select
          value={sortOrder}
          label="Sort By Date"
          onChange={onSortChange}
          sx={{ 
            '& .MuiSelect-select': { py: 1.8, px: 2, mt: 1 },
            '& .MuiOutlinedInput-notchedOutline': { borderRadius: 1 },
            '& .MuiInputLabel-root': {
              fontFamily: '"Roboto", sans-serif'
            },
            '& .MuiInputBase-input': {
              fontFamily: '"Roboto", sans-serif'
            }
          }}
        >
          <MenuItem value="desc">Mới nhất</MenuItem>
          <MenuItem value="asc">Cũ nhất</MenuItem>
        </Select>
      </FormControl>
      
      <FormControl size="small" sx={{ minWidth: 220 }}>
        <InputLabel>Status</InputLabel>
        <Select
          value={statusFilter}  
          label="Status"
          onChange={onStatusChange}
          sx={{ 
            '& .MuiSelect-select': { py: 1.8, px: 2, mt: 1 },
            '& .MuiOutlinedInput-notchedOutline': { borderRadius: 1 },
            '& .MuiInputLabel-root': {
              fontFamily: '"Roboto", sans-serif'
            },
            '& .MuiInputBase-input': {
              fontFamily: '"Roboto", sans-serif'
            }
          }}
        >
          <MenuItem value="all">Tất cả trạng thái</MenuItem>
          <MenuItem value="processing">Đang xử lý</MenuItem>
          <MenuItem value="delivered">Đã giao</MenuItem>
          <MenuItem value="cancelled">Đã hủy</MenuItem>
          <MenuItem value="awaiting payment">Chờ thanh toán</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
} 