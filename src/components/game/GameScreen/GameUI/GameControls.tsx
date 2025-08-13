import React from 'react'
import { Box, useTheme } from '@mui/material'
import { 
  PlayArrow as PlayIcon, 
  Refresh as RefreshIcon, 
  Lightbulb as HintIcon 
} from '@mui/icons-material'
import { motion } from 'framer-motion'
import { TouchButton } from '../../../ui'

interface GameControlsProps {
  gameStatus: 'loading' | 'playing' | 'complete' | 'failed'
  onSimulate: () => void
  onReset: () => void
  onHint: () => void
  canSimulate: boolean
}

export const GameControls: React.FC<GameControlsProps> = ({
  gameStatus,
  onSimulate,
  onReset,
  onHint,
  canSimulate,
}) => {
  const theme = useTheme()

  const getSimulateButtonProps = () => {
    switch (gameStatus) {
      case 'complete':
        return {
          variant: 'accent' as const,
          children: 'Success!',
          disabled: false,
        }
      case 'failed':
        return {
          variant: 'danger' as const,
          children: 'Try Again',
          disabled: false,
        }
      default:
        return {
          variant: 'primary' as const,
          children: 'Simulate',
          disabled: !canSimulate || gameStatus === 'loading',
        }
    }
  }

  const simulateProps = getSimulateButtonProps()

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Box
        sx={{
          position: 'absolute',
          bottom: theme.spacing(2),
          right: theme.spacing(2),
          display: 'flex',
          flexDirection: 'column',
          gap: 1,
          zIndex: theme.electronicZIndex.ui,
        }}
      >
        {/* Main Simulate Button */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <TouchButton
            variant={simulateProps.variant}
            size="large"
            disabled={simulateProps.disabled}
            onClick={onSimulate}
            startIcon={<PlayIcon />}
            sx={{
              minWidth: 140,
              fontWeight: 700,
              fontSize: '16px',
              boxShadow: theme.palette.customShadows.componentShadow,
              ...(gameStatus === 'complete' && {
                background: theme.palette.gradients.accentTopLeft,
                animation: 'pulse 2s infinite',
                '@keyframes pulse': {
                  '0%': {
                    boxShadow: `0 0 0 0 ${theme.palette.simulation.success}40`,
                  },
                  '70%': {
                    boxShadow: `0 0 0 10px ${theme.palette.simulation.success}00`,
                  },
                  '100%': {
                    boxShadow: `0 0 0 0 ${theme.palette.simulation.success}00`,
                  },
                },
              }),
            }}
          >
            {simulateProps.children}
          </TouchButton>
        </motion.div>

        {/* Secondary Control Buttons */}
        <Box sx={{ display: 'flex', gap: 1 }}>
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <TouchButton
              variant="primary"
              size="small"
              onClick={onReset}
              disabled={gameStatus === 'loading'}
              sx={{
                minWidth: 44,
                width: 44,
                height: 44,
                padding: 0,
                borderRadius: '50%',
              }}
            >
              <RefreshIcon sx={{ fontSize: '20px' }} />
            </TouchButton>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <TouchButton
              variant="primary"
              size="small"
              onClick={onHint}
              disabled={gameStatus === 'loading' || gameStatus === 'complete'}
              sx={{
                minWidth: 44,
                width: 44,
                height: 44,
                padding: 0,
                borderRadius: '50%',
              }}
            >
              <HintIcon sx={{ fontSize: '20px' }} />
            </TouchButton>
          </motion.div>
        </Box>
      </Box>
    </motion.div>
  )
}

export default GameControls