"use client";

import React from "react";
import { Box, Typography, Container } from "@mui/material";
import Image from "next/image";
import { useThemeColors } from "@/context/ThemeContext";

export default function QRCodeSection() {
  const colors = useThemeColors();
  
  return (
    <Box
      sx={{
        backgroundColor: colors.lightGrey,
        py: 6,
        borderTop: `1px solid ${colors.grey}`,
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            gap: 3,
          }}
        >
          <Typography
            variant="h4"
            component="h2"
            sx={{
              color: colors.text,
              fontWeight: 600,
              mb: 1,
            }}
          >
            Tải Ứng Dụng Mobile
          </Typography>
          
          <Typography
            variant="body1"
            sx={{
              color: colors.darkGrey,
              maxWidth: 600,
              lineHeight: 1.6,
            }}
          >
            Quét mã QR để tải xuống ứng dụng di động của chúng tôi và trải nghiệm mua sắm tiện lợi mọi lúc, mọi nơi
          </Typography>
          
          <Box
            sx={{
              position: "relative",
              width: 200,
              height: 200,
              borderRadius: 2,
              overflow: "hidden",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              backgroundColor: colors.white,
              p: 2,
            }}
          >
            <Image
              src="/images/qr-code-app-download.png"
              alt="QR Code để tải ứng dụng APK"
              fill
              style={{ 
                objectFit: "contain",
                padding: "8px"
              }}
            />
          </Box>
          
          <Typography
            variant="body2"
            sx={{
              color: colors.darkGrey,
              fontStyle: "italic",
              mt: 1,
            }}
          >
            * Quét mã QR để tải file APK về thiết bị của bạn
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
