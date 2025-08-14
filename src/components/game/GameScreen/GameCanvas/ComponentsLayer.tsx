import React from 'react'
import { Box, useTheme } from '@mui/material'
import { motion } from 'framer-motion'
import { BORDER_RADIUS } from '../../../../constants/design'
import type { PlacedComponent, GameScreenState } from '../../../../types/gameScreen'
import { ComponentIcon } from '../../../electronic'
import { GRID_SIZE } from '../../../../types/gameScreen'

interface ComponentsLayerProps {
  placedComponents: PlacedComponent[]
  selectedComponent: string | null
  draggedComponent: GameScreenState['draggedComponent']
  dragPosition: { x: number; y: number }
  isSimulating: boolean
  isDragging: boolean
  dragComponentId: string | null
  dragCurrentPosition: { x: number; y: number } | null
  onWireStart: (componentId: string, terminal: string, position: { x: number; y: number }) => void
  onComponentTap: (componentId: string) => void
  onDragStart: (componentId: string, position: { x: number; y: number }) => void
  onDragMove: (componentId: string, position: { x: number; y: number }) => void
  onDragEnd: (componentId: string, position: { x: number; y: number }) => void
}

export const ComponentsLayer: React.FC<ComponentsLayerProps> = ({
  placedComponents,
  selectedComponent,
  draggedComponent,
  dragPosition,
  isSimulating,
  dragComponentId,
  dragCurrentPosition,
  onWireStart,
  onComponentTap,
  onDragStart,
  onDragMove,
  onDragEnd,
}) => {
  const theme = useTheme()
  const [touchStartPosition, setTouchStartPosition] = React.useState<{x: number, y: number} | null>(null)
  
  // Direct drag refs for ultra-performance
  const isDraggingRef = React.useRef(false)
  const dragElementRef = React.useRef<HTMLElement | null>(null)
  const startTouchRef = React.useRef<{x: number, y: number} | null>(null)
  const dragStartTimeRef = React.useRef<number>(0)

  // NATIVE EVENTS: Register touch events with preventDefault capability
  React.useEffect(() => {
    const handleNativeTouchMove = (event: TouchEvent) => {
      if (isDraggingRef.current && dragElementRef.current && startTouchRef.current) {
        // WORKS: preventDefault in native event listener
        event.preventDefault()
        event.stopPropagation()
        
        const touch = event.touches[0]
        if (!touch) return

        // Direct transform without React delays
        const deltaX = touch.clientX - startTouchRef.current.x
        const deltaY = touch.clientY - startTouchRef.current.y
        
        dragElementRef.current.style.transform = `translate3d(${deltaX}px, ${deltaY}px, 0)`
      }
    }

    // Register with passive: false to enable preventDefault
    document.addEventListener('touchmove', handleNativeTouchMove, { passive: false })
    
    return () => {
      document.removeEventListener('touchmove', handleNativeTouchMove)
    }
  }, [])

  const handleTouchStart = React.useCallback((event: React.TouchEvent, componentId: string) => {
    const touch = event.touches[0]
    if (!touch) return

    const startPos = { x: touch.clientX, y: touch.clientY }
    setTouchStartPosition(startPos)
    dragStartTimeRef.current = Date.now()
    
    // Cache element and start position for direct manipulation
    const element = (event.target as HTMLElement).closest('[data-component-id]') as HTMLElement
    if (element) {
      dragElementRef.current = element
      startTouchRef.current = startPos
      isDraggingRef.current = true
      
      // Apply white color INSTANTLY
      element.classList.add('dragging')
      element.style.willChange = 'transform'
      element.style.zIndex = '1000'
    }
    
    // Still call parent for position updates at the end
    onDragStart(componentId, startPos)
  }, [onDragStart])

  const handleTouchMove = React.useCallback((event: React.TouchEvent, componentId: string) => {
    // Native event handler does the actual work - this is just for compatibility
    const touch = event.touches[0]
    if (!touch) return

    // Still call parent for coordinate updates (non-blocking)
    onDragMove(componentId, { x: touch.clientX, y: touch.clientY })
  }, [onDragMove])

  const handleTouchEnd = React.useCallback((event: React.TouchEvent, componentId: string) => {
    if (!touchStartPosition) return

    const touch = event.changedTouches[0]
    if (!touch) return

    const dragDuration = Date.now() - dragStartTimeRef.current
    const deltaX = touch.clientX - touchStartPosition.x
    const deltaY = touch.clientY - touchStartPosition.y
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY)

    // Clean up direct refs
    if (dragElementRef.current) {
      dragElementRef.current.classList.remove('dragging')
      dragElementRef.current.style.transform = ''
      dragElementRef.current.style.willChange = 'auto'
      dragElementRef.current.style.zIndex = ''
    }
    
    isDraggingRef.current = false
    dragElementRef.current = null
    startTouchRef.current = null

    // IMPROVED LOGIC: Prevent accidental rotations during drag
    const isTap = distance < 10 && dragDuration < 200 // Increased threshold and time limit
    
    if (isTap) {
      // Genuine tap - rotate component
      onComponentTap(componentId)
    } else {
      // Drag movement - end drag operation
      onDragEnd(componentId, { x: touch.clientX, y: touch.clientY })
    }

    setTouchStartPosition(null)
  }, [touchStartPosition, onComponentTap, onDragEnd])

  return (
    <>
      {/* Placed Components */}
      {placedComponents.map((component) => {
        const isSelected = selectedComponent === component.id
        const isActive = isSimulating && Math.random() > 0.5 // TODO: Replace with actual simulation state
        const isPreinstalled = component.isPreinstalled
        // Note: White color is now handled via CSS .dragging class for instant response
        
        // Always use original position - drag position is handled via direct DOM manipulation
        const pixelPosition = component.position

        return (
          <Box
            key={component.id}
            data-component-id={component.id}
            sx={{
              position: 'absolute',
              left: pixelPosition.x - GRID_SIZE / 2,
              top: pixelPosition.y - GRID_SIZE / 2,
              opacity: 1,
              width: GRID_SIZE,
              height: GRID_SIZE,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: isPreinstalled ? 'move' : 'pointer',
              zIndex: theme.electronicZIndex.components,
              transform: `rotate(${component.rotation}deg)`,
              transition: 'transform 0.2s ease',
              // GPU optimization now handled via .dragging class
              // Different border style for preinstalled components
              ...(isPreinstalled && {
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  inset: -2,
                  border: `2px dashed ${theme.palette.primary.main}40`,
                  borderRadius: "10px", // Половина от BORDER_RADIUS.PANEL
                },
              }),
            }}
            onTouchStart={(e) => handleTouchStart(e, component.id)}
            onTouchMove={(e) => handleTouchMove(e, component.id)}
            onTouchEnd={(e) => handleTouchEnd(e, component.id)}
          >
            <ComponentIcon
              type={component.type}
              size="large"
              isActive={isActive}
              isSelected={false} // White color now handled via CSS .dragging class
              switchState={component.properties.isClosed}
              useMagneticStyle={true}
            />

            {/* Connection points removed for cleaner interface */}

            {/* Component value label */}
            {(component.properties.resistance || component.properties.capacitance || component.properties.inductance) && (
              <Box
                sx={{
                  position: 'absolute',
                  bottom: -20,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  backgroundColor: theme.palette.background.paper,
                  border: `1px solid ${theme.palette.circuit.grid}`,
                  borderRadius: BORDER_RADIUS.SMALL, // 5px
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
                  backgroundColor: theme.palette.background.paper,
                  border: `1px solid ${theme.palette.circuit.grid}`,
                  borderRadius: BORDER_RADIUS.SMALL, // 5px
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
                    color: theme.palette.primary.main,
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
                  backgroundColor: theme.palette.background.paper,
                  border: `1px solid ${theme.palette.circuit.grid}`,
                  borderRadius: BORDER_RADIUS.SMALL, // 5px
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
        )
      })}

      {/* Preview of dragged component from palette */}
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
              useMagneticStyle={true}
            />
          </Box>
        </motion.div>
      )}
    </>
  )
}

export default ComponentsLayer