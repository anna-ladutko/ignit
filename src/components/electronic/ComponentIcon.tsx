import React from 'react'
import { useTheme } from '@mui/material/styles'
import { ComponentType } from '../../types'
import {
  ResistorMagneticSymbol,
  CapacitorMagneticSymbol,
  InductorMagneticSymbol,
  LEDMagneticSymbol,
  VoltageSourceMagneticSymbol,
  SwitchMagneticSymbol,
  SupercapacitorMagneticSymbol,
} from '../symbols/magnetic'

interface ComponentIconProps {
  type: ComponentType[keyof ComponentType]
  size?: 'small' | 'medium' | 'large'
  isActive?: boolean
  isSelected?: boolean
  switchState?: boolean // For switches
  className?: string
  onClick?: () => void
  // useMagneticStyle removed - now only uses magnetic symbols
}

const ComponentIconMemoized: React.FC<ComponentIconProps> = ({
  type,
  size = 'medium',
  isActive = false,
  isSelected = false,
  switchState = false,
  className,
  onClick,
  // useMagneticStyle removed
}) => {
  const theme = useTheme()

  const getSize = () => {
    // All symbols now use magnetic style with fixed size for proper magnetic point alignment
    return {
      width: '100px',
      height: '40px',
    }
  }

  const getColor = () => {
    if (isSelected) {
      return '#ffffff' // White color for selected components
    }
    
    switch (type) {
      case ComponentType.RESISTOR:
        return isActive 
          ? theme.palette.electronicsComponents.resistor.active 
          : theme.palette.electronicsComponents.resistor.main
      case ComponentType.CAPACITOR:
        return isActive 
          ? theme.palette.electronicsComponents.capacitor.active 
          : theme.palette.electronicsComponents.capacitor.main
      case ComponentType.INDUCTOR:
        return isActive 
          ? theme.palette.electronicsComponents.inductor.active 
          : theme.palette.electronicsComponents.inductor.main
      case ComponentType.LED:
        return isActive 
          ? theme.palette.electronicsComponents.led.active 
          : theme.palette.electronicsComponents.led.main
      case ComponentType.VOLTAGE_SOURCE:
        return isActive 
          ? theme.palette.electronicsComponents.source.active 
          : theme.palette.electronicsComponents.source.main
      case ComponentType.SWITCH:
        return isActive 
          ? theme.palette.electronicsComponents.switch.active 
          : theme.palette.electronicsComponents.switch.main
      case ComponentType.SUPERCAPACITOR:
        return isActive 
          ? theme.palette.electronicsComponents.capacitor.active 
          : theme.palette.electronicsComponents.capacitor.main
      default:
        return theme.palette.text.secondary
    }
  }

  const getSymbol = () => {
    const sizeConfig = getSize()
    const iconProps = {
      sx: { 
        ...sizeConfig,  // Use fixed width/height for all magnetic symbols
        color: getColor(),
        cursor: onClick ? 'pointer' : 'default',
        filter: isActive ? `drop-shadow(0 0 6px ${getColor()})` : 'none',
        transition: 'all 0.2s ease',
        '&:hover': onClick ? {
          filter: `drop-shadow(0 0 8px ${getColor()})`,
          transform: 'scale(1.05)',
        } : {},
      },
      className,
      onClick,
    }

    // All components now use magnetic symbols
    switch (type) {
      case ComponentType.RESISTOR:
        return <ResistorMagneticSymbol {...iconProps} />
      case ComponentType.CAPACITOR:
        return <CapacitorMagneticSymbol {...iconProps} />
      case ComponentType.INDUCTOR:
        return <InductorMagneticSymbol {...iconProps} />
      case ComponentType.LED:
        return <LEDMagneticSymbol {...iconProps} />
      case ComponentType.VOLTAGE_SOURCE:
        return <VoltageSourceMagneticSymbol {...iconProps} />
      case ComponentType.SWITCH:
        return <SwitchMagneticSymbol {...iconProps} isOpen={!switchState} />
      case ComponentType.SUPERCAPACITOR:
        return <SupercapacitorMagneticSymbol {...iconProps} />
      default:
        return null
    }
  }

  return getSymbol()
}

// Memoized version for performance
export const ComponentIcon = React.memo(ComponentIconMemoized)
export default ComponentIcon