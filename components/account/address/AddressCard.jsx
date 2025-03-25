"use client"
import React from "react";
import { Box, Typography, Button, IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import LocationOnIcon from "@mui/icons-material/LocationOn";

export default function AddressCard({ address, onEdit, onDelete, onSetDefault, mainColor }) {
  const formatPhoneNumber = (phone) => {
    return phone.replace(/(\d{4})(\d{3})(\d{3})/, "$1 $2 $3");
  };

  return (
    <Box className="border rounded-lg shadow-sm overflow-hidden">
      <Box className="flex items-center justify-between p-4 bg-gray-50 border-b">
        <Box className="flex items-center gap-2">
          <LocationOnIcon sx={{ color: mainColor }} />
          <Typography 
            className="font-medium"
            sx={{ fontFamily: '"Playfair Display", serif' }}
          >
            {address.isDefault ? "Địa chỉ mặc định" : "Địa chỉ"}
          </Typography>
        </Box>
        <Box className="flex items-center gap-2">
          {!address.isDefault && (
            <Button
              variant="outlined"
              size="small"
              onClick={() => onSetDefault(address.id)}
              sx={{
                color: mainColor,
                borderColor: mainColor,
                '&:hover': {
                  borderColor: mainColor,
                  backgroundColor: `${mainColor}10`,
                },
                fontFamily: '"Roboto", sans-serif',
                textTransform: 'none'
              }}
            >
              Đặt làm mặc định
            </Button>
          )}
          <IconButton 
            size="small" 
            onClick={() => onEdit(address)}
            sx={{ color: mainColor }}
          >
            <EditIcon />
          </IconButton>
          <IconButton 
            size="small" 
            onClick={() => onDelete(address.id)}
            sx={{ color: mainColor }}
          >
            <DeleteIcon />
          </IconButton>
        </Box>
      </Box>
      
      <Box className="p-4">
        <Typography 
          className="font-medium mb-2"
          sx={{ fontFamily: '"Roboto", sans-serif' }}
        >
          {address.fullName}
        </Typography>
        <Typography 
          className="text-gray-600 mb-1"
          sx={{ fontFamily: '"Roboto", sans-serif' }}
        >
          {formatPhoneNumber(address.phoneNumber)}
        </Typography>
        <Typography 
          className="text-gray-600"
          sx={{ fontFamily: '"Roboto", sans-serif' }}
        >
          {address.addressLine}, {address.ward}, {address.district}, {address.city}
        </Typography>
      </Box>
    </Box>
  );
} 