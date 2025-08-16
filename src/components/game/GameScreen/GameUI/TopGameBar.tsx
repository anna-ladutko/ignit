import React from 'react'
import { Box, Typography, IconButton, useTheme } from '@mui/material'
import { ArrowBack as ArrowBackIcon, Bolt as BoltIcon } from '@mui/icons-material'
import { motion } from 'framer-motion'
import type { Level } from '../../../../types'

interface TopGameBarProps {
  level: Level | null
  score: number
  energyUsed: number
  bestScore: number
  gameStatus: 'loading' | 'playing' | 'complete' | 'failed'
  onBackClick: () => void
}

export const TopGameBar: React.FC<TopGameBarProps> = ({
  level,
  score,
  energyUsed,
  bestScore,
  gameStatus,
  onBackClick,
}) => {
  const theme = useTheme()


  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        px: theme.spacing(2),
        py: theme.spacing(1),
        background: theme.palette.circuit.boardBackground,
        boxShadow: theme.palette.customShadows.softShadow,
        minHeight: theme.mobile.touchTarget,
      }}
    >
      {/* Left side - Back button and level info */}
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <IconButton
          onClick={onBackClick}
          sx={{
            color: '#E5DFD1',
            mr: theme.spacing(1.5),
            '&:hover': {
              backgroundColor: 'rgba(229, 223, 209, 0.1)',
            },
          }}
        >
          <ArrowBackIcon fontSize="large" />
        </IconButton>

        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <Typography
            variant="componentLabel"
            sx={{
              fontSize: '14px',
              fontWeight: 600,
              color: theme.palette.text.primary,
              lineHeight: 1,
            }}
          >
            {level ? `lvl.${String(level.registryOrder || 1).padStart(4, '0')}` : 'lvl.0001'}
          </Typography>
          <Typography
            variant="componentValue"
            sx={{
              fontSize: '9px',
              color: theme.palette.text.secondary,
              opacity: 0.7,
              fontFamily: 'monospace',
              letterSpacing: '-0.5px',
              wordBreak: 'break-all',
              maxWidth: '140px',
              lineHeight: 1,
              mt: 0.25,
            }}
          >
            {level?.metadata.level_id || 'Unknown Level'}
          </Typography>
        </Box>
      </Box>


      {/* Right side - Energy and score info */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
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
              {(energyUsed || 0).toFixed(1)} EU
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
                  : theme.palette.primary.main,
              }}
            >
              {(score || 0).toFixed(1)}
            </Typography>
          </motion.div>
          <Typography
            variant="componentValue"
            sx={{
              fontSize: '10px',
              color: theme.palette.text.secondary,
            }}
          >
            Current
          </Typography>
        </Box>

        {/* Best Score - показывается всегда */}
        <Box sx={{ textAlign: 'right' }}>
          <Typography
            variant="energyValue"
            sx={{
              fontSize: '16px',
              fontWeight: 700,
              color: (bestScore || 0) > (score || 0) 
                ? theme.palette.simulation.success 
                : theme.palette.primary.main,
            }}
          >
            {(bestScore || 0).toFixed(1)}
          </Typography>
          <Typography
            variant="componentValue"
            sx={{
              fontSize: '10px',
              color: theme.palette.text.secondary,
            }}
          >
            Best
          </Typography>
        </Box>
      </Box>
    </Box>
  )
}

export default TopGameBar