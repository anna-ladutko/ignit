import React, { useMemo } from 'react'
import { Box, Typography, useTheme } from '@mui/material'
import { motion } from 'framer-motion'
import { 
  PlayArrow as PlayIcon, 
  Bolt as BoltIcon
} from '@mui/icons-material'
import type { Level } from '../../../../types'
import type { PlacedComponent } from '../../../../types/gameScreen'
import { ComponentButton } from '../../../electronic'
import { TouchButton } from '../../../ui'
import { ComponentType } from '../../../../types'
import { BORDER_RADIUS } from '../../../../constants/design'

interface ComponentPaletteProps {
  level: Level | null
  placedComponents: PlacedComponent[]
  selectedComponent: string | null
  draggedComponent: {
    type: ComponentType[keyof ComponentType]
    sourceId?: string
    componentId?: string // Add componentId to track specific component
  } | null
  onComponentSelect: (componentId: string) => void // Change to componentId instead of type
  // Game controls props
  gameStatus: 'loading' | 'playing' | 'complete' | 'failed'
  onSimulate: () => void
  canSimulate: boolean
  canFinishLevel: boolean
  onFinishLevel: () => void
  currentScore: number
  bestScore: number
  attemptCount: number
  energyUsed: number
}

export const ComponentPalette: React.FC<ComponentPaletteProps> = ({
  level,
  placedComponents,
  selectedComponent,
  draggedComponent,
  onComponentSelect,
  gameStatus,
  onSimulate,
  canSimulate,
  canFinishLevel,
  onFinishLevel,
  currentScore,
  bestScore,
  attemptCount,
  energyUsed,
}) => {
  const theme = useTheme()

  // Calculate remaining components (exclude preinstalled components from count)
  const getRemainingCount = useMemo(() => {
    if (!level) return () => 0
    const counts: Record<string, number> = {}
    
    level.circuit_definition.available_components.forEach(comp => {
      const usedCount = placedComponents.filter(pc => 
        pc.originalComponentId === comp.id && !pc.isPreinstalled
      ).length
      counts[comp.id] = (comp.quantity || 0) - usedCount
    })
    
    return (componentId: string) => counts[componentId] || 0
  }, [level?.circuit_definition?.available_components, placedComponents])

  if (!level) return null

  const getComponentValue = (component: any): string => {
    switch (component.type) {
      case ComponentType.RESISTOR:
        return `${component.resistance}Ω`
      case ComponentType.CAPACITOR:
        return `${component.capacitance}μF`
      case ComponentType.INDUCTOR:
        return `${component.inductance}mH`
      case ComponentType.VOLTAGE_SOURCE:
        return `${component.voltage}V`
      case ComponentType.LED:
        return component.color?.toUpperCase() || 'LED'
      case ComponentType.SWITCH:
        return component.is_closed ? 'Closed' : 'Open'
      default:
        return ''
    }
  }

  const availableComponents = level.circuit_definition.available_components.filter(
    component => getRemainingCount(component.id) > 0
  )
  
  console.log('Available components for palette:', level.circuit_definition.available_components)
  console.log('Filtered available components:', availableComponents)
  console.log('Placed components:', placedComponents)

  // Game controls logic (copied from GameControls)
  const getSimulateButtonProps = () => {
    if (gameStatus === 'loading') {
      return {
        variant: 'primary' as const,
        children: 'Loading...',
        disabled: true,
      }
    }
    
    if (attemptCount > 0) {
      return {
        variant: currentScore > 50 ? 'accent' as const : 'primary' as const,
        children: 'Simulate Again',
        disabled: !canSimulate,
      }
    }
    
    return {
      variant: 'primary' as const,
      children: 'Simulate',
      disabled: !canSimulate,
    }
  }

  const simulateProps = getSimulateButtonProps()

  return (
    <Box
      sx={{
        // Overlay positioning above Level ID with proper spacing
        position: 'absolute',
        bottom: 60, // 20px (Level ID margin) + ~20px (Level ID height) + 20px (distance) = 60px
        left: 20,
        right: 20,
        zIndex: theme.electronicZIndex.ui - 1, // Below game controls but above canvas
        
        // Creamy white with 0.2 opacity
        backgroundColor: 'rgba(229, 223, 209, 0.2)',
        backdropFilter: 'blur(8px)', // Add subtle blur for better overlay effect
        
        // Standard border radius
        borderRadius: `${BORDER_RADIUS.PANEL} !important`,
        
        // Fixed height instead of aspect ratio to prevent overlap
        height: '140px', // Fixed height
        maxHeight: '140px', // Prevent growth
        
        p: theme.spacing(2),
        overflowY: 'auto',
        
        // Box shadow for overlay effect
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
        
        // Flex layout for components and controls
        display: 'flex',
        gap: theme.spacing(2),
      }}
    >
      {/* Available Components Section - Left side */}
      <Box sx={{ flex: 1 }}>
        <Typography
          variant="componentLabel"
          sx={{
            fontSize: '12px',
            mb: 1,
            color: theme.palette.primary.main,
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
          }}
        >
          Available Components
        </Typography>
        
        <Box
          sx={{
            display: 'flex',
            gap: 1,
            flexWrap: 'wrap',
          }}
        >
          {availableComponents.length === 0 ? (
            <Typography
              variant="circuitInfo"
              sx={{
                color: theme.palette.text.secondary,
                opacity: 0.7,
                fontStyle: 'italic',
              }}
            >
              All components placed
            </Typography>
          ) : (
            availableComponents.map((component, index) => {
              const remainingCount = getRemainingCount(component.id)
              const isSelected = selectedComponent === component.id
              const isDraggedComponent = draggedComponent?.componentId === component.id
              
              return (
                <motion.div
                  key={component.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <ComponentButton
                    type={component.type as ComponentType[keyof ComponentType]}
                    value={getComponentValue(component)}
                    count={remainingCount}
                    selected={isSelected || isDraggedComponent}
                    onClick={() => onComponentSelect(component.id)}
                    sx={{
                      minWidth: 'auto',
                      transition: 'all 0.2s ease',
                      ...(isSelected && {
                        transform: 'scale(1.05)',
                        boxShadow: theme.palette.customShadows.glow,
                      }),
                      ...(isDraggedComponent && {
                        transform: 'scale(1.05)',
                        boxShadow: `0 0 12px ${theme.palette.circuit.selection}`,
                        backgroundColor: `${theme.palette.circuit.selection}30`,
                      }),
                    }}
                  />
                </motion.div>
              )
            })
          )}
        </Box>
      </Box>

      {/* Game Controls Section - Right side */}
      <Box sx={{ 
        display: 'flex',
        flexDirection: 'column',
        gap: 0.5,
        minWidth: '120px', // Increased width for energy display
        alignItems: 'stretch',
      }}>
        {/* Energy Used Display */}
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          gap: 0.5,
          mb: 0.5,
        }}>
          <BoltIcon
            sx={{
              fontSize: '14px',
              color: theme.palette.simulation.energyFlow,
            }}
          />
          <Typography
            variant="energyValue"
            sx={{
              fontSize: '12px',
              fontWeight: 700,
              color: theme.palette.simulation.energyFlow,
            }}
          >
            {(energyUsed || 0).toFixed(1)} EU
          </Typography>
        </Box>
        {/* Main Simulate Button */}
        <TouchButton
          variant={simulateProps.variant}
          size="small"
          disabled={simulateProps.disabled}
          onClick={onSimulate}
          startIcon={<PlayIcon sx={{ fontSize: '14px' }} />}
          sx={{
            minWidth: 80,
            height: 32,
            fontSize: '10px',
            fontWeight: 600,
            px: 1,
          }}
        >
          {simulateProps.children}
        </TouchButton>

        {/* Finish Level Button */}
        <TouchButton
          variant={canFinishLevel ? "accent" : "primary"}
          size="small"
          disabled={!canFinishLevel}
          onClick={onFinishLevel}
          sx={{
            minWidth: 80,
            height: 32,
            fontSize: '10px',
            fontWeight: 600,
            px: 1,
          }}
        >
          Finish Level
        </TouchButton>

      </Box>
    </Box>
  )
}

export default ComponentPalette