import React from 'react'
import { Button, type ButtonProps, useTheme } from '@mui/material'

interface TouchButtonProps extends Omit<ButtonProps, 'variant'> {
  variant?: 'primary' | 'secondary' | 'accent' | 'danger'
  size?: 'small' | 'medium' | 'large'
  fullWidth?: boolean
}

export const TouchButton: React.FC<TouchButtonProps> = ({
  variant = 'primary',
  size = 'medium',
  fullWidth = false,
  children,
  sx = {},
  ...props
}) => {
  const theme = useTheme()

  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return {
          minHeight: theme.mobile.touchTarget * 0.8,
          fontSize: '14px',
          px: theme.spacing(2),
        }
      case 'large':
        return {
          minHeight: theme.mobile.touchTarget * 1.2,
          fontSize: '18px',
          px: theme.spacing(4),
        }
      default:
        return {
          minHeight: theme.mobile.touchTarget,
          fontSize: '16px',
          px: theme.spacing(3),
        }
    }
  }

  const getVariantStyles = () => {
    const baseStyles = {
      borderRadius: theme.mobile.cornerRadius,
      fontWeight: 600,
      textTransform: 'capitalize' as const,
      transition: 'all 0.2s ease',
      boxShadow: theme.palette.customShadows.componentShadow,
    }

    switch (variant) {
      case 'secondary':
        return {
          ...baseStyles,
          background: 'transparent',
          color: theme.palette.electronic.primary,
          border: `2px solid ${theme.palette.electronic.primary}`,
          '&:hover': {
            background: `${theme.palette.electronic.primary}15`,
          },
        }
      case 'accent':
        return {
          ...baseStyles,
          background: theme.palette.gradients.accentTopRight,
          color: theme.palette.text.primary,
          border: 'none',
          '&:hover': {
            background: theme.palette.gradients.accentBottomLeft,
            boxShadow: theme.palette.customShadows.glow,
          },
        }
      case 'danger':
        return {
          ...baseStyles,
          background: theme.palette.error.main,
          color: theme.palette.text.primary,
          border: 'none',
          '&:hover': {
            background: theme.palette.error.dark,
          },
        }
      default:
        return {
          ...baseStyles,
          background: theme.palette.electronic.primary,
          color: theme.palette.electronic.background,
          border: 'none',
          '&:hover': {
            background: theme.palette.electronic.secondary,
            boxShadow: theme.palette.customShadows.glow,
          },
        }
    }
  }

  return (
    <Button
      {...props}
      sx={{
        ...getSizeStyles(),
        ...getVariantStyles(),
        width: fullWidth ? '100%' : 'auto',
        '&:active': {
          transform: 'scale(0.98)',
        },
        '&:disabled': {
          opacity: 0.6,
          transform: 'none',
        },
        ...sx,
      }}
    >
      {children}
    </Button>
  )
}

export default TouchButton