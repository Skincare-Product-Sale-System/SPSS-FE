import React from 'react';
import { Box, Typography, Container, Paper, Grid, Divider, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip } from '@mui/material';
import PriceFormatter from '../helpers/PriceFormatter';

const FontExample = () => {
  return (
    <Container maxWidth="lg" sx={{ my: 6 }}>
      <Paper elevation={0} sx={{ p: 4, backgroundColor: 'var(--light-grey)' }}>
        <Box mb={4}>
          <Typography variant="h2" className="font-heading mb-2">
            Playfair Display - Font Heading
          </Typography>
          <Typography variant="body1" className="font-body">
            Be Vietnam Pro - Font Body
          </Typography>
          <Typography variant="body1" className="font-mono mt-2">
            Roboto Mono - Font Prices & Numbers
          </Typography>
        </Box>

        <Divider sx={{ my: 4 }} />

        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Box>
              <Typography variant="h1" className="font-heading mb-2 vietnamese">
                Tiêu đề lớn H1
              </Typography>
              <Typography variant="h2" className="font-heading mb-2 vietnamese">
                Tiêu đề H2
              </Typography>
              <Typography variant="h3" className="font-heading mb-2 vietnamese">
                Tiêu đề H3
              </Typography>
              <Typography variant="h4" className="font-heading mb-2 vietnamese">
                Tiêu đề H4
              </Typography>
              <Typography variant="h5" className="font-heading mb-2 vietnamese">
                Tiêu đề H5
              </Typography>
              <Typography variant="h6" className="font-heading mb-2 vietnamese">
                Tiêu đề H6
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <Box>
              <Typography variant="body1" className="font-body fw-light mb-2 vietnamese">
                Văn bản light - Chăm sóc da là điều cần thiết để duy trì làn da khỏe mạnh.
              </Typography>
              <Typography variant="body1" className="font-body fw-normal mb-2 vietnamese">
                Văn bản regular - Các sản phẩm của chúng tôi được sản xuất từ các thành phần tự nhiên.
              </Typography>
              <Typography variant="body1" className="font-body fw-medium mb-2 vietnamese">
                Văn bản medium - Bảo vệ da khỏi tác hại của ánh nắng mặt trời là rất quan trọng.
              </Typography>
              <Typography variant="body1" className="font-body fw-semibold mb-2 vietnamese">
                Văn bản semibold - Sử dụng kem chống nắng hàng ngày giúp ngăn ngừa lão hóa sớm.
              </Typography>
              <Typography variant="body1" className="font-body fw-bold mb-2 vietnamese">
                Văn bản bold - Uống đủ nước là chìa khóa để có làn da đẹp và khỏe mạnh.
              </Typography>
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ my: 4 }} />

        <Box>
          <Typography variant="h4" className="product-title mb-2 vietnamese">
            Serum Dưỡng Ẩm Chuyên Sâu
          </Typography>
          <PriceFormatter price={750000} variant="h5" className="mb-3" />
          <button className="btn btn-primary vietnamese">Thêm vào giỏ hàng</button>
        </Box>

        <Divider sx={{ my: 4 }} />

        <Box>
          <Typography variant="h5" className="mb-3 font-heading">
            Price Examples with PriceFormatter
          </Typography>
          
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <TableContainer component={Paper} elevation={0}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Product</TableCell>
                      <TableCell className="price-cell">Price</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell>Serum Vitamin C</TableCell>
                      <TableCell className="price-cell">
                        <PriceFormatter price={499000} />
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Kem Chống Nắng SPF50</TableCell>
                      <TableCell className="price-cell">
                        <PriceFormatter price={289000} />
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Mặt Nạ Dưỡng Ẩm (5 miếng)</TableCell>
                      <TableCell className="price-cell">
                        <PriceFormatter price={129000} />
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell><strong>Total</strong></TableCell>
                      <TableCell className="price-cell">
                        <PriceFormatter price={917000} sx={{ fontWeight: 'bold' }} />
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Box>
                <Box mb={2} display="flex" alignItems="center">
                  <Typography variant="body1" className="mr-2">Original price:</Typography>
                  <PriceFormatter price={1200000} />
                </Box>
                
                <Box mb={2} display="flex" alignItems="center">
                  <Typography variant="body1" className="mr-2">Discount price:</Typography>
                  <PriceFormatter price={899000} originalPrice={1200000} />
                </Box>
                
                <Box mb={2} display="flex" alignItems="center">
                  <Typography variant="body1" className="mr-2">Sale price:</Typography>
                  <Chip 
                    label={<PriceFormatter price={899000} sx={{ color: 'inherit' }} />} 
                    color="primary" 
                    variant="price"
                    className="font-mono"
                  />
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Container>
  );
};

export default FontExample; 