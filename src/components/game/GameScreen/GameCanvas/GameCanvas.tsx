import React, { useRef, useEffect, useState } from 'react'
import { Box, useTheme } from '@mui/material'
import type { GameScreenState } from '../../../../types/gameScreen'
import { GridLayer } from './GridLayer'
import { ComponentsLayer } from './ComponentsLayer'
import { WiresLayer } from './WiresLayer'
import { GRID_SIZE, CANVAS_PADDING, pixelToGrid, gridToPixel, isValidGridPosition } from '../../../../types/gameScreen'

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
  const [dragPosition, setDragPosition] = useState({ x: 0, y: 0 })

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
    console.log('Canvas clicked:', { event: event.type, gameState: { draggedComponent: gameState.draggedComponent, placedComponents: gameState.placedComponents.length } })
    
    if (!canvasRef.current) return

    const rect = canvasRef.current.getBoundingClientRect()
    
    // Handle both mouse and touch events
    let clientX: number, clientY: number
    if ('touches' in event) {
      // Touch event
      const touch = event.touches[0] || event.changedTouches[0]
      clientX = touch.clientX
      clientY = touch.clientY
    } else {
      // Mouse event
      clientX = event.clientX
      clientY = event.clientY
    }
    
    const clickPos = {
      x: clientX - rect.left - CANVAS_PADDING,
      y: clientY - rect.top - CANVAS_PADDING,
    }

    const gridPos = pixelToGrid(clickPos)
    const isValidPosition = isValidGridPosition(gridPos, canvasSize)
    
    if (isValidPosition) {
      const pixelPos = gridToPixel(gridPos)
      
      // Check if clicking on existing component
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
    if (isValidGridPosition(gridPos, canvasSize)) {
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

  // Calculate grid dimensions
  const gridCols = Math.floor(canvasSize.width / GRID_SIZE)
  const gridRows = Math.floor(canvasSize.height / GRID_SIZE)

  return (
    <Box
      ref={canvasRef}
      sx={{
        width: '100%',
        height: '100%',
        minHeight: '300px', // Ensure minimum touch area
        position: 'relative',
        backgroundColor: theme.palette.circuit.boardBackground,
        border: `1px solid ${theme.palette.circuit.grid}`,
        borderRadius: theme.mobile.cornerRadius,
        margin: theme.spacing(1),
        overflow: 'hidden',
        cursor: isDragging ? 'grabbing' : gameState.draggedComponent ? 'crosshair' : 'default',
        userSelect: 'none',
      }}
      onClick={handleCanvasClick}
      onTouchEnd={(e) => {
        handleCanvasClick(e);
      }}
      onTouchStart={(e) => {
        // Don't prevent default here to avoid passive event listener errors
      }}
      onMouseMove={handleMouseMove}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      style={{ 
        touchAction: 'none',
        WebkitTouchCallout: 'none',
        WebkitUserSelect: 'none',
        userSelect: 'none'
      }} // Disable default touch actions
    >
      {/* Grid Layer - Background grid for placement */}
      <GridLayer
        gridCols={gridCols}
        gridRows={gridRows}
        gridSize={GRID_SIZE}
        padding={CANVAS_PADDING}
        selectedComponent={gameState.selectedComponent}
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