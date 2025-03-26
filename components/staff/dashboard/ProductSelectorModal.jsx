import React from 'react';
import { 
  Box, Typography, Paper, List, CircularProgress,
  Dialog, DialogTitle, DialogContent, DialogActions, 
  InputAdornment, TextField, Button
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { formatPrice } from "@/utils/priceFormatter";

/**
 * Modal chọn sản phẩm cho staff chat
 */
const ProductSelectorModal = ({ 
  open, 
  onClose, 
  products, 
  loadingProducts, 
  selectedProduct, 
  onSelectProduct, 
  onSearch, 
  searchValue, 
  onSend,
  mainColor
}) => {
  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle>Chọn sản phẩm</DialogTitle>
      <DialogContent dividers sx={{ height: '60vh', display: 'flex', flexDirection: 'column' }}>
        <TextField
          fullWidth
          placeholder="Tìm kiếm sản phẩm..."
          value={searchValue}
          onChange={onSearch}
          margin="normal"
          variant="outlined"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
        
        <Box sx={{ 
          flexGrow: 1, 
          overflow: 'auto', 
          position: 'relative',
          mt: 2,
          display: 'flex',
          flexDirection: 'column'
        }}>
          {loadingProducts && (
            <Box sx={{ 
              position: 'absolute', 
              top: 0, 
              left: 0, 
              right: 0, 
              bottom: 0, 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              backgroundColor: 'rgba(255, 255, 255, 0.7)',
              zIndex: 2
            }}>
              <CircularProgress size={40} />
            </Box>
          )}
          
          <List sx={{ width: '100%', p: 0 }}>
            {products.length === 0 ? (
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                p: 4, 
                height: '300px' 
              }}>
                <Typography variant="body2" sx={{ textAlign: 'center', color: 'text.secondary' }}>
                  Không tìm thấy sản phẩm
                </Typography>
              </Box>
            ) : (
              products.map((product) => (
                <Paper
                  key={product.id}
                  elevation={0}
                  onClick={() => onSelectProduct(product)}
                  sx={{
                    mb: 2,
                    border: '1px solid',
                    borderColor: selectedProduct?.id === product.id 
                      ? mainColor.primary 
                      : 'divider',
                    borderRadius: 2,
                    overflow: 'hidden',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      borderColor: selectedProduct?.id === product.id 
                        ? mainColor.primary 
                        : mainColor.primary + '80',
                      boxShadow: '0 4px 8px rgba(0,0,0,0.05)',
                      transform: 'translateY(-2px)'
                    }
                  }}
                >
                  <Box sx={{ display: 'flex', p: 1 }}>
                    <Box sx={{ width: 80, height: 80, position: 'relative', flexShrink: 0 }}>
                      <img
                        src={product.thumbnail || '/images/placeholder.jpg'}
                        alt={product.name}
                        style={{ 
                          width: '100%', 
                          height: '100%', 
                          objectFit: 'cover',
                          borderRadius: 8
                        }}
                      />
                    </Box>
                    <Box sx={{ ml: 2, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', width: '100%' }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 500, mb: 0.5 }}>
                        {product.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                        {product.categoryName || 'Chăm sóc da'}
                      </Typography>
                      <Typography variant="subtitle2" sx={{ color: mainColor.primary, fontWeight: 600 }}>
                        {formatPrice(product.salePrice || product.price, '₫')}
                      </Typography>
                    </Box>
                  </Box>
                </Paper>
              ))
            )}
          </List>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Hủy</Button>
        <Button 
          onClick={onSend} 
          variant="contained" 
          disabled={!selectedProduct}
          color="primary"
        >
          Gửi sản phẩm
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ProductSelectorModal; 