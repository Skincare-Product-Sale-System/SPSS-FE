"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { TextField, Button, Box, Typography, Alert, CircularProgress } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import request from "@/utlis/axios";
import toast from "react-hot-toast";

// Password validation schema
const passwordSchema = z.object({
  currentPassword: z.string().min(6, { message: "Current password is required" }),
  newPassword: z.string().min(6, { message: "Password must be at least 6 characters" }),
  confirmPassword: z.string().min(6, { message: "Confirm password is required" }),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export default function ChangePassword() {
  const theme = useTheme();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(passwordSchema),
    mode: "onChange",
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await request.post("/user/change-password", {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });
      
      setSuccess(true);
      toast.success("Password changed successfully");
      reset();
      
      // Reset success message after 3 seconds
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to change password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box 
      className="my-account-content"
      sx={{
        backgroundColor: theme.palette.background.paper,
        borderRadius: 2,
        p: 3,
        boxShadow: "0 4px 6px rgba(0,0,0,0.05)"
      }}
    >
      <Typography 
        variant="h5" 
        component="h2" 
        sx={{ 
          mb: 3, 
          fontWeight: 500,
          color: theme.palette.text.primary
        }}
      >
        Change Password
      </Typography>
      
      {success && (
        <Alert 
          severity="success" 
          sx={{ mb: 3 }}
        >
          Your password has been updated successfully.
        </Alert>
      )}
      
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box sx={{ mb: 3 }}>
          <TextField
            fullWidth
            type="password"
            label="Current Password"
            variant="outlined"
            autoComplete="current-password"
            {...register("currentPassword")}
            error={!!errors.currentPassword}
            helperText={errors.currentPassword?.message}
            sx={{
              mb: 2,
              '& .MuiOutlinedInput-root': {
                '&:hover fieldset': {
                  borderColor: theme.palette.primary.main,
                },
              },
            }}
          />
          
          <TextField
            fullWidth
            type="password"
            label="New Password"
            variant="outlined"
            autoComplete="new-password"
            {...register("newPassword")}
            error={!!errors.newPassword}
            helperText={errors.newPassword?.message}
            sx={{
              mb: 2,
              '& .MuiOutlinedInput-root': {
                '&:hover fieldset': {
                  borderColor: theme.palette.primary.main,
                },
              },
            }}
          />
          
          <TextField
            fullWidth
            type="password"
            label="Confirm New Password"
            variant="outlined"
            autoComplete="new-password"
            {...register("confirmPassword")}
            error={!!errors.confirmPassword}
            helperText={errors.confirmPassword?.message}
            sx={{
              mb: 2,
              '& .MuiOutlinedInput-root': {
                '&:hover fieldset': {
                  borderColor: theme.palette.primary.main,
                },
              },
            }}
          />
        </Box>
        
        <Button
          type="submit"
          variant="contained"
          disabled={loading}
          sx={{
            backgroundColor: theme.palette.primary.main,
            color: "#fff",
            py: 1.5,
            px: 4,
            borderRadius: "24px",
            '&:hover': {
              backgroundColor: theme.palette.primary.dark,
            },
            textTransform: "none",
            fontWeight: 500,
            boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
          }}
          className="tf-btn w-full md:w-auto radius-3 btn-fill animate-hover-btn justify-content-center"
        >
          {loading ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            "Update Password"
          )}
        </Button>
      </form>
    </Box>
  );
}
