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
  onWireStart: (componentId: string, terminal: string, position: { x: number; y: number }) => void
  isSimulating: boolean
}

export const GameCanvas: React.FC<GameCanvasProps> = ({
  gameState,
  onComponentPlace,
  onComponentSelect,
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

  const handleCanvasClick = (event: React.MouseEvent) => {
    if (!canvasRef.current) return

    const rect = canvasRef.current.getBoundingClientRect()
    const clickPos = {
      x: event.clientX - rect.left - CANVAS_PADDING,
      y: event.clientY - rect.top - CANVAS_PADDING,
    }

    const gridPos = pixelToGrid(clickPos)
    
    if (isValidGridPosition(gridPos, canvasSize)) {
      const pixelPos = gridToPixel(gridPos)
      
      // Check if clicking on existing component
      const clickedComponent = gameState.placedComponents.find(component => {
        const dx = Math.abs(component.position.x - pixelPos.x)
        const dy = Math.abs(component.position.y - pixelPos.y)
        return dx < GRID_SIZE / 2 && dy < GRID_SIZE / 2
      })

      if (clickedComponent) {
        onComponentSelect(clickedComponent.id)
      } else if (gameState.draggedComponent) {
        // Place new component
        onComponentPlace(gameState.draggedComponent.type as string, pixelPos)
      }
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
        position: 'relative',
        backgroundColor: theme.palette.circuit.boardBackground,
        border: `2px solid ${theme.palette.circuit.grid}`,
        borderRadius: theme.mobile.cornerRadius,
        margin: theme.spacing(1),
        overflow: 'hidden',
        cursor: isDragging ? 'grabbing' : 'default',
        userSelect: 'none',
      }}
      onClick={handleCanvasClick}
      onMouseMove={handleMouseMove}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
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

      {/* Level Source and Targets (Fixed positions) */}
      {gameState.level && (
        <>
          {/* Source - Fixed at top-left area */}
          <Box
            sx={{
              position: 'absolute',
              left: CANVAS_PADDING + GRID_SIZE,
              top: CANVAS_PADDING + GRID_SIZE,
              width: GRID_SIZE,
              height: GRID_SIZE,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: `${theme.palette.components.source.main}20`,
              border: `2px solid ${theme.palette.components.source.main}`,
              borderRadius: theme.mobile.cornerRadius / 2,
              zIndex: theme.electronicZIndex.components,
            }}
          >
            <Box
              sx={{
                color: theme.palette.components.source.main,
                fontSize: '24px',
                fontWeight: 700,
              }}
            >
              ⚡
            </Box>
          </Box>

          {/* Targets - Fixed positions based on level data */}
          {gameState.level.circuit_definition.targets.map((target, index) => (
            <Box
              key={target.id}
              sx={{
                position: 'absolute',
                right: CANVAS_PADDING + GRID_SIZE * (index + 1),
                bottom: CANVAS_PADDING + GRID_SIZE,
                width: GRID_SIZE,
                height: GRID_SIZE,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: `${theme.palette.components.led.main}20`,
                border: `2px solid ${theme.palette.components.led.main}`,
                borderRadius: theme.mobile.cornerRadius / 2,
                zIndex: theme.electronicZIndex.components,
              }}
            >
              <Box
                sx={{
                  color: theme.palette.components.led.main,
                  fontSize: '16px',
                  fontWeight: 700,
                }}
              >
                💡
              </Box>
            </Box>
          ))}
        </>
      )}

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