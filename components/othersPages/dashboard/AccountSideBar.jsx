"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Box, List, ListItem, ListItemButton, ListItemText, Divider, useTheme, IconButton } from '@mui/material';
import { useThemeColors } from "@/context/ThemeContext";
import { ExitToApp as LogoutIcon, Close as CloseIcon } from '@mui/icons-material';

const accountLinks = [
  { href: "/my-account", label: "Tài Khoản" },
  { href: "/my-account-orders", label: "Đơn Hàng" },
  { href: "/my-account-address", label: "Sổ Địa Chỉ" },
  { href: "/my-reviews", label: "Đánh Giá" },
  { href: "/change-password", label: "Đổi Mật Khẩu" },
];

export default function AccountSideBar({ onClose }) {
  const pathname = usePathname();
  const mainColor = useThemeColors();
  const theme = useTheme();

  return (
    <Box
      sx={{
        width: '100%',
        maxWidth: 280,
        bgcolor: 'background.paper',
        borderRadius: 3,
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
        overflow: 'hidden',
        border: `1px solid ${mainColor.lightGrey}`,
        position: 'relative',
      }}
    >
      {/* Nút đóng trên mobile */}
      {onClose && (
        <Box 
          sx={{ 
            display: { xs: 'flex', lg: 'none' },
            justifyContent: 'flex-end',
            p: 1,
            position: 'absolute',
            top: 0,
            right: 0,
            zIndex: 10
          }}
        >
          <IconButton 
            onClick={onClose}
            size="small"
            sx={{ color: mainColor.text }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>
      )}

      <List
        sx={{
          padding: 0,
          '& .MuiListItemButton-root': {
            py: 2,
            px: 3,
            transition: 'all 0.3s ease',
            '&:hover': {
              bgcolor: `${mainColor.light}`,
            },
          },
          '& .MuiListItemText-primary': {
            fontWeight: 500,
            fontSize: { xs: '0.9rem', sm: '0.95rem' },
            color: mainColor.text,
            fontFamily: '"Roboto", sans-serif',
          },
        }}
      >
        {accountLinks.map((link, index) => (
          <ListItem key={index} disablePadding>
            <ListItemButton
              component={Link}
              href={link.href}
              selected={pathname === link.href}
              onClick={onClose} // Đóng drawer khi click vào menu item trên mobile
              sx={{
                bgcolor: pathname === link.href ? mainColor.light : 'transparent',
                borderLeft: pathname === link.href ? `4px solid ${mainColor.primary}` : '4px solid transparent',
                '&.Mui-selected': {
                  bgcolor: mainColor.light,
                  '&:hover': {
                    bgcolor: mainColor.light,
                  },
                  '& .MuiListItemText-primary': {
                    color: mainColor.primary,
                    fontWeight: 600,
                    fontFamily: '"Roboto", sans-serif',
                  },
                },
              }}
            >
              <ListItemText primary={link.label} />
            </ListItemButton>
          </ListItem>
        ))}
        <Divider sx={{ my: 1, borderColor: mainColor.lightGrey }} />
        <ListItem disablePadding>
          <ListItemButton
            component={Link}
            href="/login"
            onClick={onClose} // Đóng drawer khi đăng xuất trên mobile
            sx={{
              color: theme.palette.error.main,
              '&:hover': {
                bgcolor: `rgba(${theme.palette.error.main}, 0.08)`,
              },
              '& .MuiListItemText-primary': {
                color: theme.palette.error.main,
                fontFamily: '"Roboto", sans-serif',
              },
            }}
          >
            <LogoutIcon sx={{ mr: 1, fontSize: '1.2rem' }} />
            <ListItemText primary="Đăng Xuất" />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );
}
