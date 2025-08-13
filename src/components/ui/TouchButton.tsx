import React from 'react'
import { Button, type ButtonProps, useTheme } from '@mui/material'

interface TouchButtonProps extends Omit<ButtonProps, 'variant'> {
  variant?: 'primary' | 'accent' | 'danger'
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
      borderRadius: 10, // Кнопки всегда 10px
      fontWeight: 600,
      textTransform: 'capitalize' as const,
      transition: 'all 0.2s ease',
      boxShadow: theme.palette.customShadows.componentShadow,
    }

    switch (variant) {
      case 'accent':
        return {
          ...baseStyles,
          background: theme.palette.gradients.accentGradient,
          color: theme.palette.text.primary,
          border: 'none',
          '&:hover': {
            background: theme.palette.gradients.accentGradient,
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
          background: theme.palette.primary.main,
          color: theme.palette.background.default,
          border: 'none',
          '&:hover': {
            background: theme.palette.secondary.main,
            boxShadow: theme.palette.customShadows.glow,
          },
        }
    }
  }

  const handleClick = (event: React.MouseEvent<HTMLButtonElement> | React.TouchEvent<HTMLButtonElement>) => {
    event.preventDefault();
    if (props.onClick && !props.disabled) {
      props.onClick(event as React.MouseEvent<HTMLButtonElement>);
    }
  };

  return (
    <Button
      {...props}
      onClick={handleClick}
      onTouchEnd={handleClick}
      sx={{
        ...getSizeStyles(),
        ...getVariantStyles(),
        width: fullWidth ? '100%' : 'auto',
        touchAction: 'manipulation',
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