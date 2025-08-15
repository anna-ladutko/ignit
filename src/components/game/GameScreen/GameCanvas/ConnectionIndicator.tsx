import React from 'react'
import { Box } from '@mui/material'
import { motion, AnimatePresence } from 'framer-motion'

interface ConnectionIndicatorProps {
  position: { x: number; y: number }
  isVisible: boolean
}

export const ConnectionIndicator: React.FC<ConnectionIndicatorProps> = ({
  position,
  isVisible
}) => {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key={`connection-${position.x}-${position.y}`}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          transition={{ 
            type: "spring", 
            stiffness: 400, 
            damping: 25,
            duration: 0.2 
          }}
          style={{
            position: 'absolute',
            left: position.x - 5, // Центрируем круг (радиус 5px)
            top: position.y - 5,
            width: 10,
            height: 10,
            borderRadius: '50%',
            backgroundColor: '#00ff00', // Яркий зеленый
            border: '1px solid #ffffff',
            boxShadow: '0 0 6px rgba(0, 255, 0, 0.6)',
            zIndex: 1000, // Поверх всех компонентов
            pointerEvents: 'none'
          }}
        />
      )}
    </AnimatePresence>
  )
}

interface ConnectionIndicatorsLayerProps {
  connectionPoints: Array<{ x: number; y: number }>
}

export const ConnectionIndicatorsLayer: React.FC<ConnectionIndicatorsLayerProps> = ({
  connectionPoints
}) => {
  return (
    <Box
      sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 1000
      }}
    >
      {connectionPoints.map((point, index) => (
        <ConnectionIndicator
          key={`${point.x}-${point.y}-${index}`}
          position={point}
          isVisible={true}
        />
      ))}
    </Box>
  )
}

export default ConnectionIndicator