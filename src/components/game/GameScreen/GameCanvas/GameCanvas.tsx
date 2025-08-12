import React, { useRef, useEffect, useState } from 'react'
import { Box, useTheme } from '@mui/material'
import type { GameScreenState } from '../../../../types/gameScreen'
import { GridLayer } from './GridLayer'
import { ComponentsLayer } from './ComponentsLayer'
import { WiresLayer } from './WiresLayer'
import { GRID_SIZE, GRID_COLS, GRID_ROWS, CANVAS_PADDING, MIN_TOUCH_AREA, pixelToGrid, gridToPixel, isValidGridPosition } from '../../../../types/gameScreen'

interface GameCanvasProps {
  gameState: GameScreenState
  onComponentPlace: (componentType: string, position: { x: number; y: number }) => void
  onComponentSelect: (componentId: string) => void
  onComponentRemove: (componentId: string) => void
  onWireStart: (componentId: string, terminal: string, position: { x: number; y: number }) => void
  isSimulating: boolean
}

export const GameCanvas: React.FC<GameCanvasProps> = ({
  gameState,
  onComponentPlace,
  onComponentSelect,
  onComponentRemove,
  onWireStart,
  isSimulating,
}) => {
  const theme = useTheme()
  const canvasRef = useRef<HTMLDivElement>(null)
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragPosition, setDragPosition] = useState({ x: -1000, y: -1000 }) // Initialize off-screen
  
  // Helper function to get coordinates from mouse/touch events
  const getEventCoords = (event: React.MouseEvent | React.TouchEvent) => {
    return 'touches' in event 
      ? event.touches[0] || event.changedTouches[0]
      : event
  }

  // Update canvas size on resize
  useEffect(() => {
    const updateCanvasSize = () => {
      if (canvasRef.current) {
        const rect = canvasRef.current.getBoundingClientRect()
        setCanvasSize({
          width: rect.width - CANVAS_PADDING * 2,
          height: rect.height - CANVAS_PADDING * 2,
        })
      }
    }

    updateCanvasSize()
    window.addEventListener('resize', updateCanvasSize)
    return () => window.removeEventListener('resize', updateCanvasSize)
  }, [])

  const handleCanvasClick = (event: React.MouseEvent | React.TouchEvent) => {
    if (!canvasRef.current) return

    const rect = canvasRef.current.getBoundingClientRect()
    const coords = getEventCoords(event)
    
    const clickPos = {
      x: coords.clientX - rect.left - CANVAS_PADDING,
      y: coords.clientY - rect.top - CANVAS_PADDING,
    }

    const gridPos = pixelToGrid(clickPos)
    const isValidPosition = isValidGridPosition(gridPos)
    
    if (isValidPosition) {
      const pixelPos = gridToPixel(gridPos)
      
      // Check if clicking on existing component - all components use pixel coordinates now
      const clickedComponent = gameState.placedComponents.find(component => {
        const dx = Math.abs(component.position.x - pixelPos.x)
        const dy = Math.abs(component.position.y - pixelPos.y)
        return dx < GRID_SIZE / 2 && dy < GRID_SIZE / 2
      })

      if (clickedComponent) {
        // If we have a dragged component from the same source, this is a move operation
        if (gameState.draggedComponent && gameState.draggedComponent.sourceId === clickedComponent.id) {
          return
        }
        onComponentSelect(clickedComponent.id)
      } else if (gameState.draggedComponent) {
        // Place new component or move existing one
        onComponentPlace(gameState.draggedComponent.type as string, pixelPos)
      } else {
        // Clear selection when clicking on empty space
        onComponentSelect('')
      }
    } else {
      // Click outside valid grid - if dragging a non-preinstalled component, remove it (return to palette)
      if (gameState.draggedComponent && gameState.draggedComponent.sourceId) {
        const draggedComponentData = gameState.placedComponents.find(pc => pc.id === gameState.draggedComponent!.sourceId)
        // Only remove if it's not a preinstalled component
        if (draggedComponentData && !draggedComponentData.isPreinstalled) {
          onComponentRemove(gameState.draggedComponent.sourceId)
        }
      }
      // Clear any active dragging
      onComponentSelect('')
    }
  }

  const handleMouseMove = (event: React.MouseEvent) => {
    if (!isDragging || !canvasRef.current) return

    const rect = canvasRef.current.getBoundingClientRect()
    const mousePos = {
      x: event.clientX - rect.left - CANVAS_PADDING,
      y: event.clientY - rect.top - CANVAS_PADDING,
    }

    const gridPos = pixelToGrid(mousePos)
    if (isValidGridPosition(gridPos)) {
      const snapPos = gridToPixel(gridPos)
      setDragPosition(snapPos)
    }
  }

  const handleMouseDown = (_event: React.MouseEvent) => {
    if (gameState.draggedComponent) {
      setIsDragging(true)
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  // Use constants for grid dimensions

  return (
    <Box
      ref={canvasRef}
      sx={{
        width: '100%',
        height: '100%',
        minHeight: `${MIN_TOUCH_AREA}px`,
        position: 'relative',
        backgroundColor: '#202221', // Dark background for magnetic grid
        cursor: isDragging ? 'grabbing' : gameState.draggedComponent ? 'crosshair' : 'default',
        userSelect: 'none',
        touchAction: 'none',
        WebkitTouchCallout: 'none',
        WebkitUserSelect: 'none',
      }}
      onClick={handleCanvasClick}
      onTouchEnd={handleCanvasClick}
      onMouseMove={handleMouseMove}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* Grid Layer - Background grid for placement */}
      <GridLayer
        gridCols={GRID_COLS}
        gridRows={GRID_ROWS}
        gridSize={GRID_SIZE}
        padding={CANVAS_PADDING}
        selectedComponent={gameState.selectedComponent}
        canvasSize={canvasSize}
      />

      {/* Wires Layer - Connection wires between components */}
      <WiresLayer
        connections={gameState.connections}
        placedComponents={gameState.placedComponents}
        isSimulating={isSimulating}
        selectedWire={gameState.selectedWire}
        wireStartPoint={gameState.wireStartPoint}
        isDrawingWire={gameState.isDrawingWire}
      />

      {/* Components Layer - Placed electronic components */}
      <ComponentsLayer
        placedComponents={gameState.placedComponents}
        selectedComponent={gameState.selectedComponent}
        draggedComponent={gameState.draggedComponent}
        dragPosition={dragPosition}
        isSimulating={isSimulating}
        onComponentSelect={onComponentSelect}
        onWireStart={onWireStart}
      />


      {/* Visual feedback for invalid drop areas */}
      {isDragging && (
        <Box
          sx={{
            position: 'absolute',
            left: dragPosition.x - GRID_SIZE / 2,
            top: dragPosition.y - GRID_SIZE / 2,
            width: GRID_SIZE,
            height: GRID_SIZE,
            border: `2px dashed ${theme.palette.circuit.selection}`,
            borderRadius: theme.mobile.cornerRadius / 2,
            backgroundColor: `${theme.palette.circuit.selection}20`,
            zIndex: theme.electronicZIndex.dragging,
            pointerEvents: 'none',
          }}
        />
      )}
    </Box>
  )
}

export default GameCanvas