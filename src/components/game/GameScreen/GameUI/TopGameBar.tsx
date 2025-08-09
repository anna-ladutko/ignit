import React from 'react'
import { Box, Typography, IconButton, useTheme } from '@mui/material'
import { ArrowBack as ArrowBackIcon, Bolt as BoltIcon } from '@mui/icons-material'
import { motion } from 'framer-motion'
import type { Level } from '../../../../types'

interface TopGameBarProps {
  level: Level | null
  score: number
  energyUsed: number
  gameStatus: 'loading' | 'playing' | 'complete' | 'failed'
  onBackClick: () => void
}

export const TopGameBar: React.FC<TopGameBarProps> = ({
  level,
  score,
  energyUsed,
  gameStatus,
  onBackClick,
}) => {
  const theme = useTheme()

  const getStatusColor = () => {
    switch (gameStatus) {
      case 'complete':
        return theme.palette.simulation.success
      case 'failed':
        return theme.palette.simulation.error
      case 'loading':
        return theme.palette.simulation.warning
      default:
        return theme.palette.electronic.primary
    }
  }

  const getStatusText = () => {
    switch (gameStatus) {
      case 'complete':
        return 'Level Complete!'
      case 'failed':
        return 'Circuit Failed'
      case 'loading':
        return 'Loading...'
      default:
        return 'Building Circuit'
    }
  }

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        p: theme.spacing(2),
        background: theme.palette.gradients.backgroundModule1,
        borderBottom: `1px solid ${theme.palette.circuit.grid}`,
        boxShadow: theme.palette.customShadows.softShadow,
        minHeight: theme.mobile.touchTarget + theme.spacing(2),
      }}
    >
      {/* Left side - Back button and level info */}
      <Box sx={{ display: 'flex', alignItems: 'center', flex: 1 }}>
        <IconButton
          onClick={onBackClick}
          sx={{
            color: theme.palette.electronic.primary,
            backgroundColor: `${theme.palette.electronic.primary}15`,
            width: theme.mobile.touchTarget,
            height: theme.mobile.touchTarget,
            mr: theme.spacing(1.5),
            '&:hover': {
              backgroundColor: `${theme.palette.electronic.primary}25`,
            },
          }}
        >
          <ArrowBackIcon />
        </IconButton>

        <Box>
          <Typography
            variant="componentLabel"
            sx={{
              fontSize: '14px',
              fontWeight: 600,
              color: theme.palette.text.primary,
            }}
          >
            {level?.metadata.level_id || 'Unknown Level'}
          </Typography>
          <Typography
            variant="componentValue"
            sx={{
              fontSize: '11px',
              color: getStatusColor(),
              fontWeight: 500,
            }}
          >
            {getStatusText()}
          </Typography>
        </Box>
      </Box>

      {/* Center - Level difficulty and archetype */}
      {level && (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            flex: 1,
            justifyContent: 'center',
            px: 1,
          }}
        >
          <Box
            sx={{
              px: 1.5,
              py: 0.5,
              backgroundColor: `${theme.palette.components.led.main}20`,
              borderRadius: theme.mobile.cornerRadius / 2,
              border: `1px solid ${theme.palette.components.led.main}40`,
            }}
          >
            <Typography
              variant="componentValue"
              sx={{
                fontSize: '10px',
                fontWeight: 600,
                color: theme.palette.components.led.main,
                textTransform: 'uppercase',
              }}
            >
              Lv.{level.metadata.difficulty}
            </Typography>
          </Box>
          <Box
            sx={{
              px: 1.5,
              py: 0.5,
              backgroundColor: `${theme.palette.components.capacitor.main}20`,
              borderRadius: theme.mobile.cornerRadius / 2,
              border: `1px solid ${theme.palette.components.capacitor.main}40`,
            }}
          >
            <Typography
              variant="componentValue"
              sx={{
                fontSize: '10px',
                fontWeight: 600,
                color: theme.palette.components.capacitor.main,
                textTransform: 'uppercase',
              }}
            >
              {level.metadata.primary_archetype}
            </Typography>
          </Box>
        </Box>
      )}

      {/* Right side - Energy and score info */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          flex: 1,
          justifyContent: 'flex-end',
          gap: 1.5,
        }}
      >
        <Box sx={{ textAlign: 'right' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 0.5 }}>
            <BoltIcon
              sx={{
                fontSize: '16px',
                color: theme.palette.simulation.energyFlow,
              }}
            />
            <Typography
              variant="energyValue"
              sx={{
                fontSize: '14px',
                fontWeight: 700,
                color: theme.palette.simulation.energyFlow,
              }}
            >
              {energyUsed.toFixed(1)} EU
            </Typography>
          </Box>
          <Typography
            variant="componentValue"
            sx={{
              fontSize: '10px',
              color: theme.palette.text.secondary,
            }}
          >
            Used
          </Typography>
        </Box>

        <Box sx={{ textAlign: 'right' }}>
          <motion.div
            animate={gameStatus === 'complete' ? { scale: [1, 1.2, 1] } : {}}
            transition={{ duration: 0.5 }}
          >
            <Typography
              variant="energyValue"
              sx={{
                fontSize: '16px',
                fontWeight: 700,
                color: gameStatus === 'complete' 
                  ? theme.palette.simulation.success
                  : theme.palette.electronic.primary,
              }}
            >
              {score.toFixed(1)}
            </Typography>
          </motion.div>
          <Typography
            variant="componentValue"
            sx={{
              fontSize: '10px',
              color: theme.palette.text.secondary,
            }}
          >
            Score
          </Typography>
        </Box>
      </Box>
    </Box>
  )
}

export default TopGameBar