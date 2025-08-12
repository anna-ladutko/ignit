import React from 'react'
import { Box, useTheme } from '@mui/material'
import { motion } from 'framer-motion'
import type { PlacedComponent, GameScreenState } from '../../../../types/gameScreen'
import { ComponentIcon } from '../../../electronic'
import { GRID_SIZE } from '../../../../types/gameScreen'

interface ComponentsLayerProps {
  placedComponents: PlacedComponent[]
  selectedComponent: string | null
  draggedComponent: GameScreenState['draggedComponent']
  dragPosition: { x: number; y: number }
  isSimulating: boolean
  onComponentSelect: (componentId: string) => void
  onWireStart: (componentId: string, terminal: string, position: { x: number; y: number }) => void
}

export const ComponentsLayer: React.FC<ComponentsLayerProps> = ({
  placedComponents,
  selectedComponent,
  draggedComponent,
  dragPosition,
  isSimulating,
  onComponentSelect,
  onWireStart,
}) => {
  const theme = useTheme()

  
  return (
    <>
      {/* Placed Components */}
      {placedComponents.map((component) => {
        const isSelected = selectedComponent === component.id
        const isActive = isSimulating && Math.random() > 0.5 // TODO: Replace with actual simulation state
        const isPreinstalled = component.isPreinstalled
        
        // All components use pixel coordinates - simple and clean!
        const pixelPosition = component.position

        return (
          <motion.div
            key={component.id}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'backOut' }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Box
              sx={{
                position: 'absolute',
                left: pixelPosition.x - GRID_SIZE / 2,
                top: pixelPosition.y - GRID_SIZE / 2,
                width: GRID_SIZE,
                height: GRID_SIZE,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: isPreinstalled ? 'move' : 'pointer', // Different cursor for preinstalled
                zIndex: theme.electronicZIndex.components,
                transform: `rotate(${component.rotation}deg)`,
                transition: 'transform 0.2s ease',
                // Different border style for preinstalled components
                ...(isPreinstalled && {
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    inset: -2,
                    border: `2px dashed ${theme.palette.electronic.primary}40`,
                    borderRadius: theme.mobile.cornerRadius / 2,
                  },
                }),
                ...(isSelected && {
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    inset: -4,
                    border: `2px solid ${theme.palette.circuit.selection}`,
                    borderRadius: theme.mobile.cornerRadius / 2,
                    animation: 'pulse 1s infinite',
                    '@keyframes pulse': {
                      '0%': {
                        opacity: 1,
                        transform: 'scale(1)',
                      },
                      '50%': {
                        opacity: 0.7,
                        transform: 'scale(1.05)',
                      },
                      '100%': {
                        opacity: 1,
                        transform: 'scale(1)',
                      },
                    },
                  },
                }),
              }}
              onClick={() => onComponentSelect(component.id)}
              onTouchEnd={(e) => {
                e.preventDefault()
                onComponentSelect(component.id)
              }}
            >
              <ComponentIcon
                type={component.type}
                size="large"
                isActive={isActive}
                isSelected={isSelected}
                switchState={component.properties.isClosed}
                useMagneticStyle={true}
              />

              {/* Connection points for wiring */}
              {isSelected && (
                <>
                  {/* Left terminal */}
                  <Box
                    sx={{
                      position: 'absolute',
                      left: -6,
                      top: '50%',
                      width: 12,
                      height: 12,
                      backgroundColor: theme.palette.circuit.connectionPoint,
                      border: `2px solid ${theme.palette.circuit.selection}`,
                      borderRadius: '50%',
                      transform: 'translateY(-50%)',
                      cursor: 'crosshair',
                      zIndex: 1,
                      '&:hover': {
                        backgroundColor: theme.palette.circuit.connectionPointActive,
                        transform: 'translateY(-50%) scale(1.2)',
                      },
                    }}
                    onClick={(e) => {
                      e.stopPropagation()
                      onWireStart(component.id, 'left', {
                        x: pixelPosition.x - GRID_SIZE / 2,
                        y: pixelPosition.y,
                      })
                    }}
                  />

                  {/* Right terminal */}
                  <Box
                    sx={{
                      position: 'absolute',
                      right: -6,
                      top: '50%',
                      width: 12,
                      height: 12,
                      backgroundColor: theme.palette.circuit.connectionPoint,
                      border: `2px solid ${theme.palette.circuit.selection}`,
                      borderRadius: '50%',
                      transform: 'translateY(-50%)',
                      cursor: 'crosshair',
                      zIndex: 1,
                      '&:hover': {
                        backgroundColor: theme.palette.circuit.connectionPointActive,
                        transform: 'translateY(-50%) scale(1.2)',
                      },
                    }}
                    onClick={(e) => {
                      e.stopPropagation()
                      onWireStart(component.id, 'right', {
                        x: pixelPosition.x + GRID_SIZE / 2,
                        y: pixelPosition.y,
                      })
                    }}
                  />
                </>
              )}

              {/* Component value label */}
              {(component.properties.resistance || component.properties.capacitance || component.properties.inductance) && (
                <Box
                  sx={{
                    position: 'absolute',
                    bottom: -20,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    backgroundColor: theme.palette.electronic.surface,
                    border: `1px solid ${theme.palette.circuit.grid}`,
                    borderRadius: theme.mobile.cornerRadius / 4,
                    px: 0.5,
                    py: 0.25,
                    minWidth: 'max-content',
                    zIndex: 1,
                  }}
                >
                  <Box
                    sx={{
                      fontSize: '8px',
                      fontWeight: 600,
                      color: theme.palette.text.primary,
                      textAlign: 'center',
                      lineHeight: 1,
                    }}
                  >
                    {component.properties.resistance && `${component.properties.resistance}Ω`}
                    {component.properties.capacitance && `${component.properties.capacitance}μF`}
                    {component.properties.inductance && `${component.properties.inductance}mH`}
                  </Box>
                </Box>
              )}

              {/* Energy range for targets */}
              {isPreinstalled && component.properties.energyRange && (
                <Box
                  sx={{
                    position: 'absolute',
                    bottom: -20,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    backgroundColor: theme.palette.electronic.surface,
                    border: `1px solid ${theme.palette.circuit.grid}`,
                    borderRadius: theme.mobile.cornerRadius / 4,
                    px: 0.5,
                    py: 0.25,
                    minWidth: 'max-content',
                    zIndex: 1,
                  }}
                >
                  <Box
                    sx={{
                      fontSize: '8px',
                      fontWeight: 600,
                      color: theme.palette.electronic.primary,
                      textAlign: 'center',
                      lineHeight: 1,
                    }}
                  >
                    {`${component.properties.energyRange[0]}-${component.properties.energyRange[1]} EU`}
                  </Box>
                </Box>
              )}

              {/* Voltage label for sources */}
              {isPreinstalled && component.properties.voltage && (
                <Box
                  sx={{
                    position: 'absolute',
                    bottom: -20,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    backgroundColor: theme.palette.electronic.surface,
                    border: `1px solid ${theme.palette.circuit.grid}`,
                    borderRadius: theme.mobile.cornerRadius / 4,
                    px: 0.5,
                    py: 0.25,
                    minWidth: 'max-content',
                    zIndex: 1,
                  }}
                >
                  <Box
                    sx={{
                      fontSize: '8px',
                      fontWeight: 600,
                      color: theme.palette.simulation.energyFlow,
                      textAlign: 'center',
                      lineHeight: 1,
                    }}
                  >
                    {`${component.properties.voltage}V`}
                  </Box>
                </Box>
              )}
            </Box>
          </motion.div>
        )
      })}

      {/* Preview of dragged component */}
      {draggedComponent && dragPosition.x > -500 && (
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              left: dragPosition.x - GRID_SIZE / 2,
              top: dragPosition.y - GRID_SIZE / 2,
              width: GRID_SIZE,
              height: GRID_SIZE,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              opacity: 0.7,
              zIndex: theme.electronicZIndex.dragging,
              pointerEvents: 'none',
            }}
          >
            <ComponentIcon
              type={draggedComponent.type}
              size="large"
              isActive={false}
              isSelected={true}
              useMagneticStyle={true} // Enable magnetic symbols with connection points
            />
          </Box>
        </motion.div>
      )}
    </>
  )
}

export default ComponentsLayer