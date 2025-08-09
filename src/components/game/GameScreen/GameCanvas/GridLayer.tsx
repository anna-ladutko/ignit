import React from 'react'
import { Box, useTheme } from '@mui/material'

interface GridLayerProps {
  gridCols: number
  gridRows: number
  gridSize: number
  padding: number
  selectedComponent: string | null
}

export const GridLayer: React.FC<GridLayerProps> = ({
  gridCols,
  gridRows,
  gridSize,
  padding,
  selectedComponent,
}) => {
  const theme = useTheme()

  const gridLines = []

  // Vertical lines
  for (let i = 0; i <= gridCols; i++) {
    gridLines.push(
      <Box
        key={`v-${i}`}
        sx={{
          position: 'absolute',
          left: padding + i * gridSize,
          top: padding,
          width: '1px',
          height: gridRows * gridSize,
          backgroundColor: theme.palette.circuit.grid,
          opacity: 0.3,
        }}
      />
    )
  }

  // Horizontal lines
  for (let i = 0; i <= gridRows; i++) {
    gridLines.push(
      <Box
        key={`h-${i}`}
        sx={{
          position: 'absolute',
          left: padding,
          top: padding + i * gridSize,
          width: gridCols * gridSize,
          height: '1px',
          backgroundColor: theme.palette.circuit.grid,
          opacity: 0.3,
        }}
      />
    )
  }

  // Grid dots at intersections
  const gridDots = []
  for (let row = 0; row <= gridRows; row++) {
    for (let col = 0; col <= gridCols; col++) {
      gridDots.push(
        <Box
          key={`dot-${row}-${col}`}
          sx={{
            position: 'absolute',
            left: padding + col * gridSize - 1,
            top: padding + row * gridSize - 1,
            width: '2px',
            height: '2px',
            backgroundColor: theme.palette.circuit.grid,
            borderRadius: '50%',
            opacity: selectedComponent ? 0.6 : 0.4,
          }}
        />
      )
    }
  }

  return (
    <>
      {gridLines}
      {gridDots}
    </>
  )
}

export default GridLayer