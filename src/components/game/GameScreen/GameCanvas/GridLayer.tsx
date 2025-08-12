import React from 'react'
import { Box, useTheme } from '@mui/material'
import { STANDARD_CANVAS_SIZE } from '../../../../types/gameScreen'

interface GridLayerProps {
  gridCols: number
  gridRows: number
  gridSize: number
  padding: number
  selectedComponent: string | null
  canvasSize: { width: number; height: number } // Still needed for centering on screen
}

export const GridLayer: React.FC<GridLayerProps> = ({
  gridCols,
  gridRows,
  gridSize,
  padding,
  selectedComponent,
  canvasSize,
}) => {
  const theme = useTheme()

  // Grid dots at intersections - align with screen corner (simplified coordinates)
  const gridDots = []
  for (let row = 0; row < gridRows; row++) {
    for (let col = 0; col < gridCols; col++) {
      // Calculate position using EXACT same logic as gridToPixel
      const dotX = col * gridSize + gridSize / 2
      const dotY = row * gridSize + gridSize / 2
      
      gridDots.push(
        <Box
          key={`dot-${row}-${col}`}
          sx={{
            position: 'absolute',
            left: dotX - 2,
            top: dotY - 2,
            width: '4px',
            height: '4px',
            backgroundColor: '#343635',
            borderRadius: '50%',
          }}
        />
      )
    }
  }

  return (
    <>
      {gridDots}
    </>
  )
}

export default GridLayer