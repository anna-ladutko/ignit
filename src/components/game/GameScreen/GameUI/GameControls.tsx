import React from 'react'
import { Box, useTheme } from '@mui/material'
import { 
  PlayArrow as PlayIcon, 
  Refresh as RefreshIcon, 
  Lightbulb as HintIcon 
} from '@mui/icons-material'
import { motion } from 'framer-motion'
import { TouchButton } from '../../../ui'
import { GameSounds } from '../../../../utils/gameAudio'

interface GameControlsProps {
  gameStatus: 'loading' | 'playing' | 'complete' | 'failed'
  onSimulate: () => void
  onReset: () => void
  onHint: () => void
  canSimulate: boolean
  // Новые пропы для Two-Button System
  canFinishLevel: boolean
  onFinishLevel: () => void
  currentScore: number
  bestScore: number
  attemptCount: number
}

export const GameControls: React.FC<GameControlsProps> = ({
  gameStatus,
  onSimulate,
  onReset,
  onHint,
  canSimulate,
  canFinishLevel,
  onFinishLevel,
  currentScore,
  bestScore,
  attemptCount,
}) => {
  const theme = useTheme()

  const getSimulateButtonProps = () => {
    // Кнопка Simulate всегда остается для экспериментов
    if (gameStatus === 'loading') {
      return {
        variant: 'primary' as const,
        children: 'Loading...',
        disabled: true,
      }
    }
    
    if (attemptCount > 0) {
      // После попыток - показываем "Simulate Again"
      return {
        variant: currentScore > 50 ? 'accent' as const : 'primary' as const,
        children: 'Simulate Again',
        disabled: !canSimulate,
      }
    }
    
    // Первая попытка
    return {
      variant: 'primary' as const,
      children: 'Simulate',
      disabled: !canSimulate,
    }
  }

  const simulateProps = getSimulateButtonProps()

  // Handle simulate button click with sound
  const handleSimulateClick = () => {
    GameSounds.simulate()
    onSimulate()
  }

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
            onClick={handleSimulateClick}
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

        {/* Finish Level Button - всегда видна, но может быть disabled */}
        <motion.div
          whileHover={canFinishLevel ? { scale: 1.05 } : {}}
          whileTap={canFinishLevel ? { scale: 0.95 } : {}}
        >
          <TouchButton
            variant={canFinishLevel ? "accent" : "primary"}
            size="large"
            disabled={!canFinishLevel}
            onClick={onFinishLevel}
            sx={{
              minWidth: 140,
              fontWeight: 700,
              fontSize: '16px',
              boxShadow: theme.palette.customShadows.componentShadow,
              ...(canFinishLevel && {
                background: theme.palette.gradients.accentGradient,
              }),
            }}
          >
            Finish Level
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