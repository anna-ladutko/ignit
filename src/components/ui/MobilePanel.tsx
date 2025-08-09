import React from 'react'
import { Box, Card, Typography, useTheme } from '@mui/material'

interface MobilePanelProps {
  title?: string
  variant?: 'primary' | 'secondary' | 'accent'
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
      case 'secondary':
        return {
          background: theme.palette.electronic.surface,
          border: `1px solid ${theme.palette.circuit.grid}`,
        }
      case 'accent':
        return {
          background: theme.palette.gradients.backgroundModule1,
          border: `1px solid ${theme.palette.circuit.selection}30`,
        }
      default:
        return {
          background: theme.palette.circuit.boardBackground,
          border: `2px solid ${theme.palette.circuit.grid}`,
        }
    }
  }

  return (
    <Card
      variant="mobile"
      elevation={elevation}
      sx={{
        ...getVariantStyles(),
        borderRadius: theme.mobile.cornerRadius,
        p: theme.spacing(2),
        ...sx,
      }}
    >
      {title && (
        <Typography 
          variant="componentLabel"
          sx={{ 
            mb: theme.spacing(1.5),
            color: theme.palette.electronic.primary,
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