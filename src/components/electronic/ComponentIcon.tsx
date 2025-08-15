import React from 'react'
import { ComponentType, ComponentState } from '../../types'
import { getComponentStateColor } from '../../utils/componentColors'
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
  componentState?: ComponentState
  isSelected?: boolean
  switchState?: boolean // For switches
  className?: string
  onClick?: () => void
  // NEW: State-based coloring instead of type-based
}

const ComponentIconMemoized: React.FC<ComponentIconProps> = ({
  type,
  componentState = ComponentState.DISCONNECTED,
  isSelected = false,
  switchState = false,
  className,
  onClick,
  // NEW: Uses state-based coloring
}) => {

  const getSize = () => {
    // All symbols now use magnetic style with fixed size for proper magnetic point alignment
    return {
      width: '100px',
      height: '40px',
    }
  }

  const getColor = () => {
    // NEW: State-based color system
    // Override for selected state
    const effectiveState = isSelected ? ComponentState.SELECTED : componentState
    return getComponentStateColor(effectiveState)
  }

  const getSymbol = () => {
    const sizeConfig = getSize()
    const iconProps = {
      sx: { 
        ...sizeConfig,  // Use fixed width/height for all magnetic symbols
        color: getColor(),
        cursor: onClick ? 'pointer' : 'default',
        filter: componentState === ComponentState.CONNECTED || componentState === ComponentState.SOURCE 
          ? `drop-shadow(0 0 6px ${getColor()})` : 'none',
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