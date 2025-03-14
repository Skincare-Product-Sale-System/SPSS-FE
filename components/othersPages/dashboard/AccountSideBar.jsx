"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Box, List, ListItem, ListItemButton, ListItemText, Divider, useTheme } from '@mui/material';
import { useThemeColors } from "@/context/ThemeContext";
import { ExitToApp as LogoutIcon } from '@mui/icons-material';

const accountLinks = [
  { href: "/my-account", label: "My Account" },
  { href: "/my-account-orders", label: "Orders" },
  { href: "/my-account-address", label: "Addresses" },
  { href: "/my-reviews", label: "My Reviews" },
  { href: "/change-password", label: "Change Password" },
];

export default function AccountSideBar() {
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
      }}
    >
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
            fontSize: '0.95rem',
            color: mainColor.text,
          },
        }}
      >
        {accountLinks.map((link, index) => (
          <ListItem key={index} disablePadding>
            <ListItemButton
              component={Link}
              href={link.href}
              selected={pathname === link.href}
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
            sx={{
              color: theme.palette.error.main,
              '&:hover': {
                bgcolor: `rgba(${theme.palette.error.main}, 0.08)`,
              },
              '& .MuiListItemText-primary': {
                color: theme.palette.error.main,
              },
            }}
          >
            <LogoutIcon sx={{ mr: 1, fontSize: '1.2rem' }} />
            <ListItemText primary="Logout" />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );
}
