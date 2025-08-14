import React from 'react'
import { Box, Card, Typography, useTheme } from '@mui/material'

interface MobilePanelProps {
  title?: string
  variant?: 'primary' | 'accent'
  elevation?: number
  children: React.ReactNode
  sx?: object
}

export const MobilePanel: React.FC<MobilePanelProps> = ({
  title,
  variant = 'primary',
  elevation = 0,
  children,
  sx = {},
}) => {
  const theme = useTheme()

  const getVariantStyles = () => {
    switch (variant) {
      case 'accent':
        return {
          background: theme.palette.circuit.boardBackground,
        }
      default:
        return {
          background: theme.palette.circuit.boardBackground,
        }
    }
  }

  return (
    <Card
      variant="mobile"
      elevation={elevation}
      sx={{
        ...getVariantStyles(),
        borderRadius: "20px !important", // Принудительно 20px для панели
        p: theme.spacing(2),
        ...sx,
      }}
    >
      {title && (
        <Typography 
          variant="componentLabel"
          sx={{ 
            mb: theme.spacing(1.5),
            color: theme.palette.primary.main,
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
          }}
        >
          {title}
        </Typography>
      )}
      
      <Box>
        {children}
      </Box>
    </Card>
  )
}

export default MobilePanel