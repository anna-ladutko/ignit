import React from 'react'
import { useTheme } from '@mui/material/styles'
import { ComponentType } from '../../types'
import {
  ResistorSymbol,
  CapacitorSymbol,
  InductorSymbol,
  LEDSymbol,
  VoltageSourceSymbol,
  SwitchSymbol,
  SupercapacitorSymbol,
} from '../symbols'

interface ComponentIconProps {
  type: ComponentType[keyof ComponentType]
  size?: 'small' | 'medium' | 'large'
  isActive?: boolean
  isSelected?: boolean
  switchState?: boolean // For switches
  className?: string
  onClick?: () => void
}

export const ComponentIcon: React.FC<ComponentIconProps> = ({
  type,
  size = 'medium',
  isActive = false,
  isSelected = false,
  switchState = false,
  className,
  onClick,
}) => {
  const theme = useTheme()

  const getSize = () => {
    switch (size) {
      case 'small':
        return theme.componentSizes.icon.small
      case 'large':
        return theme.componentSizes.icon.large
      default:
        return theme.componentSizes.icon.medium
    }
  }

  const getColor = () => {
    if (isSelected) {
      return theme.palette.circuit.selection
    }
    
    switch (type) {
      case ComponentType.RESISTOR:
        return isActive 
          ? theme.palette.components.resistor.active 
          : theme.palette.components.resistor.main
      case ComponentType.CAPACITOR:
        return isActive 
          ? theme.palette.components.capacitor.active 
          : theme.palette.components.capacitor.main
      case ComponentType.INDUCTOR:
        return isActive 
          ? theme.palette.components.inductor.active 
          : theme.palette.components.inductor.main
      case ComponentType.LED:
        return isActive 
          ? theme.palette.components.led.active 
          : theme.palette.components.led.main
      case ComponentType.VOLTAGE_SOURCE:
        return isActive 
          ? theme.palette.components.source.active 
          : theme.palette.components.source.main
      case ComponentType.SWITCH:
        return isActive 
          ? theme.palette.components.switch.active 
          : theme.palette.components.switch.main
      case ComponentType.SUPERCAPACITOR:
        return isActive 
          ? theme.palette.components.capacitor.active 
          : theme.palette.components.capacitor.main
      default:
        return theme.palette.text.secondary
    }
  }

  const getSymbol = () => {
    const iconProps = {
      sx: { 
        fontSize: getSize(),
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

    switch (type) {
      case ComponentType.RESISTOR:
        return <ResistorSymbol {...iconProps} />
      case ComponentType.CAPACITOR:
        return <CapacitorSymbol {...iconProps} />
      case ComponentType.INDUCTOR:
        return <InductorSymbol {...iconProps} />
      case ComponentType.LED:
        return <LEDSymbol {...iconProps} />
      case ComponentType.VOLTAGE_SOURCE:
        return <VoltageSourceSymbol {...iconProps} />
      case ComponentType.SWITCH:
        return <SwitchSymbol {...iconProps} isOpen={!switchState} />
      case ComponentType.SUPERCAPACITOR:
        return <SupercapacitorSymbol {...iconProps} />
      default:
        return null
    }
  }

  return getSymbol()
}

export default ComponentIcon