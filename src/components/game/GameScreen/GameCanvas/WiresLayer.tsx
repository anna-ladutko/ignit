import React from 'react'
import { Box, useTheme } from '@mui/material'
import { motion } from 'framer-motion'
import type { WireConnection, PlacedComponent, GameScreenState } from '../../../../types/gameScreen'

interface WiresLayerProps {
  connections: WireConnection[]
  placedComponents: PlacedComponent[]
  isSimulating: boolean
  selectedWire: string | null
  wireStartPoint: GameScreenState['wireStartPoint']
  isDrawingWire: boolean
}

export const WiresLayer: React.FC<WiresLayerProps> = ({
  connections,
  placedComponents,
  isSimulating,
  selectedWire,
  wireStartPoint,
  isDrawingWire,
}) => {
  const theme = useTheme()

  const getComponentPosition = (componentId: string) => {
    const component = placedComponents.find(c => c.id === componentId)
    return component ? component.position : { x: 0, y: 0 }
  }

  const drawWire = (connection: WireConnection) => {
    const fromPos = getComponentPosition(connection.fromComponent)
    const toPos = getComponentPosition(connection.toComponent)
    
    if (!fromPos || !toPos) return null

    const isSelected = selectedWire === connection.id
    const isValid = connection.isValid !== false
    const hasEnergyFlow = isSimulating && connection.energyFlow && connection.energyFlow > 0

    // Calculate wire path (simple straight line for now)
    const dx = toPos.x - fromPos.x
    const dy = toPos.y - fromPos.y
    const length = Math.sqrt(dx * dx + dy * dy)
    const angle = Math.atan2(dy, dx) * (180 / Math.PI)

    const wireColor = isValid
      ? hasEnergyFlow
        ? theme.palette.circuit.wireActive
        : theme.palette.circuit.wire
      : theme.palette.circuit.wireError

    return (
      <motion.div
        key={connection.id}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {/* Main wire line */}
        <Box
          sx={{
            position: 'absolute',
            left: fromPos.x,
            top: fromPos.y,
            width: length,
            height: theme.mobile.wireThickness,
            backgroundColor: wireColor,
            transformOrigin: '0 50%',
            transform: `rotate(${angle}deg)`,
            borderRadius: theme.mobile.wireThickness / 2,
            zIndex: theme.electronicZIndex.wires,
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            ...(isSelected && {
              height: theme.mobile.wireThicknessActive,
              boxShadow: `0 0 8px ${wireColor}`,
            }),
          }}
        />

        {/* Energy flow animation */}
        {hasEnergyFlow && (
          <motion.div
            animate={{
              x: [0, dx],
              y: [0, dy],
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              ease: 'linear',
            }}
          >
            <Box
              sx={{
                position: 'absolute',
                left: fromPos.x - 3,
                top: fromPos.y - 3,
                width: 6,
                height: 6,
                backgroundColor: theme.palette.simulation.energyFlow,
                borderRadius: '50%',
                boxShadow: `0 0 8px ${theme.palette.simulation.energyFlow}`,
                zIndex: theme.electronicZIndex.wires + 1,
              }}
            />
          </motion.div>
        )}

        {/* Connection points */}
        <Box
          sx={{
            position: 'absolute',
            left: fromPos.x - 4,
            top: fromPos.y - 4,
            width: 8,
            height: 8,
            backgroundColor: theme.palette.circuit.connectionPoint,
            border: `2px solid ${wireColor}`,
            borderRadius: '50%',
            zIndex: theme.electronicZIndex.wires + 1,
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            left: toPos.x - 4,
            top: toPos.y - 4,
            width: 8,
            height: 8,
            backgroundColor: theme.palette.circuit.connectionPoint,
            border: `2px solid ${wireColor}`,
            borderRadius: '50%',
            zIndex: theme.electronicZIndex.wires + 1,
          }}
        />
      </motion.div>
    )
  }

  return (
    <>
      {/* Existing connections */}
      {connections.map(connection => drawWire(connection))}

      {/* Preview wire while drawing */}
      {isDrawingWire && wireStartPoint && (
        <motion.div
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1, repeat: Infinity }}
        >
          <Box
            sx={{
              position: 'absolute',
              left: wireStartPoint.position.x - 2,
              top: wireStartPoint.position.y - 2,
              width: 4,
              height: 4,
              backgroundColor: theme.palette.circuit.selection,
              borderRadius: '50%',
              zIndex: theme.electronicZIndex.wires,
            }}
          />
        </motion.div>
      )}
    </>
  )
}

export default WiresLayer