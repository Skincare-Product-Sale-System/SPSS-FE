"use client";

import React, { useState } from "react";
import AccountSideBar from "@/components/othersPages/dashboard/AccountSideBar";
import { Box, IconButton, Drawer } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

export default function ResponsiveLayoutWrapper({ children }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <section className="flat-spacing-11">
      <div className="container">
        <div className="row">
          <Box
            sx={{
              display: { xs: 'flex', lg: 'none' },
              justifyContent: 'flex-end',
              width: '100%',
              mb: 2
            }}
          >
            <IconButton
              color="primary"
              aria-label="open sidebar"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                bgcolor: 'white',
                border: '1px solid #eee'
              }}
            >
              <MenuIcon />
            </IconButton>
          </Box>

          <div className="col-lg-3 d-lg-block d-none">
            <AccountSideBar onClose={() => {}} />
          </div>

          <Drawer
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{
              keepMounted: true,
            }}
            sx={{
              display: { xs: 'block', lg: 'none' },
              '& .MuiDrawer-paper': { 
                boxSizing: 'border-box', 
                width: 280,
                pt: 2,
                pb: 2
              },
            }}
          >
            <AccountSideBar onClose={handleDrawerToggle} />
          </Drawer>

          <div className="col-12 col-lg-9">
            {children}
          </div>
        </div>
      </div>
    </section>
  );
} 