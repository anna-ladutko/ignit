import React from 'react'
import { Box, Typography, useTheme } from '@mui/material'
import { motion } from 'framer-motion'
import type { Level } from '../../../../types'
import type { PlacedComponent } from '../../../../types/gameScreen'
import { ComponentButton } from '../../../electronic'
import { ComponentType } from '../../../../types'

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
}

export const ComponentPalette: React.FC<ComponentPaletteProps> = ({
  level,
  placedComponents,
  selectedComponent,
  draggedComponent,
  onComponentSelect,
}) => {
  const theme = useTheme()

  if (!level) return null

  // Calculate remaining components (exclude preinstalled components from count)
  const getRemainingCount = (componentId: string): number => {
    const originalComponent = level.circuit_definition.available_components.find(c => c.id === componentId)
    const usedCount = placedComponents.filter(pc => 
      pc.originalComponentId === componentId && !pc.isPreinstalled
    ).length
    const remaining = (originalComponent?.quantity || 0) - usedCount
    console.log(`getRemainingCount for ${componentId}:`, {
      originalComponent: originalComponent,
      quantity: originalComponent?.quantity,
      usedCount,
      remaining,
      placedComponentsForThisId: placedComponents.filter(pc => pc.originalComponentId === componentId)
    })
    return remaining
  }

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

  return (
    <Box
      sx={{
        backgroundColor: theme.palette.circuit.boardBackground,
        p: theme.spacing(1),
        maxHeight: '180px',
        overflowY: 'auto',
      }}
    >
      {/* Available Components Section */}
      <Box sx={{ mb: 1 }}>
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
    </Box>
  )
}

export default ComponentPalette