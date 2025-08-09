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
  onComponentSelect: (type: ComponentType[keyof ComponentType]) => void
}

export const ComponentPalette: React.FC<ComponentPaletteProps> = ({
  level,
  placedComponents,
  selectedComponent,
  onComponentSelect,
}) => {
  const theme = useTheme()

  if (!level) return null

  // Calculate remaining components
  const getRemainingCount = (componentId: string): number => {
    const originalComponent = level.circuit_definition.available_components.find(c => c.id === componentId)
    const usedCount = placedComponents.filter(pc => pc.originalComponentId === componentId).length
    return (originalComponent?.quantity || 0) - usedCount
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

  const fixedComponents = [
    // Source (always available but not placeable)
    {
      id: 'source-display',
      type: ComponentType.VOLTAGE_SOURCE,
      voltage: level.circuit_definition.source.voltage,
      energy_output: level.circuit_definition.source.energy_output,
      quantity: 1,
      isFixed: true,
    },
    // Targets (for reference)
    ...level.circuit_definition.targets.map((target, index) => ({
      id: `target-${index}`,
      type: ComponentType.LED,
      color: target.color,
      energy_range: target.energy_range,
      quantity: 1,
      isFixed: true,
    }))
  ]

  return (
    <Box
      sx={{
        backgroundColor: theme.palette.circuit.boardBackground,
        borderTop: `2px solid ${theme.palette.circuit.grid}`,
        p: theme.spacing(1),
        maxHeight: '180px',
        overflowY: 'auto',
      }}
    >
      {/* Fixed Components Section */}
      <Box sx={{ mb: 2 }}>
        <Typography
          variant="componentLabel"
          sx={{
            fontSize: '12px',
            mb: 1,
            color: theme.palette.text.secondary,
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
          }}
        >
          Level Components
        </Typography>
        
        <Box
          sx={{
            display: 'flex',
            gap: 1,
            flexWrap: 'wrap',
            mb: 1,
          }}
        >
          {fixedComponents.map((component, index) => (
            <motion.div
              key={component.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <ComponentButton
                type={component.type as ComponentType[keyof ComponentType]}
                value={getComponentValue(component)}
                disabled
                sx={{
                  minWidth: 'auto',
                  opacity: 0.7,
                  border: `1px solid ${theme.palette.circuit.grid}`,
                  '&.Mui-disabled': {
                    color: theme.palette.text.secondary,
                    opacity: 0.7,
                  },
                }}
              />
            </motion.div>
          ))}
        </Box>
      </Box>

      {/* Available Components Section */}
      <Box>
        <Typography
          variant="componentLabel"
          sx={{
            fontSize: '12px',
            mb: 1,
            color: theme.palette.electronic.primary,
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
              No components remaining
            </Typography>
          ) : (
            availableComponents.map((component, index) => {
              const remainingCount = getRemainingCount(component.id)
              const isSelected = selectedComponent === component.id
              
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
                    selected={isSelected}
                    onClick={() => onComponentSelect(component.type as ComponentType[keyof ComponentType])}
                    sx={{
                      minWidth: 'auto',
                      transition: 'all 0.2s ease',
                      ...(isSelected && {
                        transform: 'scale(1.05)',
                        boxShadow: theme.palette.customShadows.glow,
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