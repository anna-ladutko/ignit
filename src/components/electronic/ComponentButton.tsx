import React from 'react'
import { Button, Typography, Box, useTheme } from '@mui/material'
import { ComponentType } from '../../types'
import { ComponentIcon } from './ComponentIcon'

interface ComponentButtonProps {
  type: ComponentType[keyof ComponentType]
  label?: string
  value?: string
  count?: number
  selected?: boolean
  disabled?: boolean
  onClick?: () => void
  sx?: object
}

export const ComponentButton: React.FC<ComponentButtonProps> = ({
  type,
  label,
  value,
  count,
  selected = false,
  disabled = false,
  onClick,
  sx = {},
}) => {
  const theme = useTheme()

  const getDisplayName = () => {
    switch (type) {
      case ComponentType.RESISTOR:
        return label || 'Resistor'
      case ComponentType.CAPACITOR:
        return label || 'Capacitor'
      case ComponentType.INDUCTOR:
        return label || 'Inductor'
      case ComponentType.LED:
        return label || 'LED'
      case ComponentType.VOLTAGE_SOURCE:
        return label || 'Source'
      case ComponentType.SWITCH:
        return label || 'Switch'
      case ComponentType.SUPERCAPACITOR:
        return label || 'Supercapacitor'
      default:
        return label || 'Component'
    }
  }

  const handleClick = (event: React.MouseEvent | React.TouchEvent) => {
    event.preventDefault();
    if (onClick && !disabled) {
      onClick();
    }
  };

  return (
    <Button
      variant="component"
      onClick={handleClick}
      onTouchEnd={handleClick}
      disabled={disabled}
      sx={{
        touchAction: 'manipulation', // Enable fast touch response
        ...sx,
        flexDirection: 'column',
        p: theme.spacing(1),
        minWidth: theme.mobile.touchTarget,
        minHeight: theme.mobile.touchTarget,
        border: selected 
          ? `2px solid ${theme.palette.circuit.selection}` 
          : `1px solid ${theme.palette.circuit.grid}`,
        background: selected 
          ? `${theme.palette.circuit.selection}15` 
          : 'transparent',
        '&:hover': {
          border: `1px solid ${theme.palette.circuit.selection}`,
          background: `${theme.palette.circuit.selection}10`,
        },
        '&:disabled': {
          border: `1px solid ${theme.palette.circuit.grid}`,
          background: 'transparent',
          opacity: 0.5,
        },
      }}
    >
      <Box sx={{ position: 'relative' }}>
        <ComponentIcon
          type={type}
          size="medium"
          isSelected={selected}
        />
        
        {count !== undefined && count > 0 && (
          <Box
            sx={{
              position: 'absolute',
              top: -4,
              right: -4,
              background: theme.palette.primary.main,
              color: theme.palette.background.default,
              borderRadius: '50%',
              minWidth: 16,
              minHeight: 16,
              fontSize: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              px: 0.5,
            }}
          >
            {count}
          </Box>
        )}
      </Box>

      <Typography 
        variant="componentLabel"
        sx={{ 
          mt: 0.5,
          textAlign: 'center',
          fontSize: '10px',
          maxWidth: '100%',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}
      >
        {getDisplayName()}
      </Typography>

      {value && (
        <Typography 
          variant="componentValue"
          sx={{ 
            mt: 0.25,
            color: theme.palette.text.secondary,
            fontSize: '8px',
          }}
        >
          {value}
        </Typography>
      )}
    </Button>
  )
}

export default ComponentButton