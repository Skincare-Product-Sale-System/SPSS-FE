"use client";
import {
  Box,
  Typography,
  Paper,
  Grid,
  Stepper,
  Step,
  StepLabel,
  StepContent,
} from "@mui/material";
import { useThemeColors } from "@/context/ThemeContext";
import ProductCarousel from "@/components/quiz/result/ProductCarousel";

export default function RoutineSteps({ routineSteps }) {
  const mainColor = useThemeColors();

  return (
    <Paper
      elevation={0}
      sx={{
        p: { xs: 2, md: 4 },
        mb: 6,
        maxWidth: "1000px",
        mx: "auto",
        border: `1px solid ${mainColor.lightGrey}`,
        borderRadius: 2,
      }}
    >
      <Typography
        variant="h5"
        component="h3"
        sx={{
          mb: 4,
          textAlign: "center",
          fontWeight: 600,
          color: mainColor.primary,
          fontFamily: "Playfair Display, serif",
        }}
      >
        Quy Trình Chăm Sóc Da Được Đề Xuất
      </Typography>

      <Stepper orientation="vertical">
        {routineSteps.map((step, index) => (
          <Step key={index} active={true}>
            <StepLabel
              StepIconProps={{
                sx: {
                  color: mainColor.primary,
                  "&.Mui-active": {
                    color: mainColor.primary,
                  },
                  "&.Mui-completed": {
                    color: mainColor.primary,
                  },
                },
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 600,
                  fontSize: "1.2rem",
                  color: mainColor.primary,
                  fontFamily: "Roboto, sans-serif",
                }}
              >
                {step.stepName}
              </Typography>
            </StepLabel>

            <StepContent>
              <Box sx={{ py: 2 }}>
                <Typography
                  variant="body1"
                  sx={{
                    mb: 3,
                    color: mainColor.text,
                    whiteSpace: "pre-line",
                    lineHeight: 1.7,
                    fontSize: "1rem",
                  }}
                >
                  {step.instruction}
                </Typography>

                {step.products && step.products.length > 0 && (
                  <Box sx={{ mt: 2 }}>
                    <Typography
                      variant="subtitle1"
                      sx={{
                        mb: 2,
                        fontWeight: 600,
                        color: mainColor.text,
                      }}
                    >
                      Sản phẩm đề xuất:
                    </Typography>

                    <ProductCarousel
                      products={step.products}
                      index={index}
                      mainColor={mainColor}
                    />
                  </Box>
                )}
              </Box>
            </StepContent>
          </Step>
        ))}
      </Stepper>
    </Paper>
  );
}
