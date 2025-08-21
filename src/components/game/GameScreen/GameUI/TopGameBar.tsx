import React from 'react'
import { Box, Typography, IconButton, useTheme } from '@mui/material'
import { ArrowBack as ArrowBackIcon, RestartAltRounded as RestartAltRoundedIcon } from '@mui/icons-material'
import { motion } from 'framer-motion'
import type { Level } from '../../../../types'

interface TopGameBarProps {
  level: Level | null
  score: number
  energyUsed: number
  bestScore: number
  gameStatus: 'loading' | 'playing' | 'complete' | 'failed'
  onBackClick: () => void
  onReset: () => void
}

export const TopGameBar: React.FC<TopGameBarProps> = ({
  level,
  score,
  energyUsed,
  bestScore,
  gameStatus,
  onBackClick,
  onReset,
}) => {
  const theme = useTheme()


  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '16px 20px',
        backgroundColor: 'transparent',
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
            '&:hover': {
              backgroundColor: 'rgba(229, 223, 209, 0.1)',
            },
          }}
        >
          <ArrowBackIcon fontSize="large" />
        </IconButton>

        <Box sx={{ ml: 1.5 }}>
          <Box>
            <Typography
              variant="componentLabel"
              sx={{
                fontSize: '18px',
                fontWeight: 700,
                color: '#D84205', // ignit smolder color
                lineHeight: 1,
              }}
            >
              {level ? `lvl.${String(level.registryOrder || 1).padStart(4, '0')}` : 'lvl.0001'}
            </Typography>
            <Typography
              sx={{
                fontSize: '12px',
                fontWeight: 500, // Medium
                color: '#E5DFD1', // creamy white
                lineHeight: 1,
                fontFamily: 'Montserrat, sans-serif',
              }}
            >
              Best Score: <Box component="span" sx={{ fontWeight: 600 }}>{(bestScore || 0).toFixed(1)}</Box>
            </Typography>
          </Box>
        </Box>
      </Box>


      {/* Right side - Current score and restart button */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
        {/* Current Score - symmetrical to level info */}
        <Box sx={{ textAlign: 'right' }}>
          <motion.div
            animate={gameStatus === 'complete' ? { scale: [1, 1.2, 1] } : {}}
            transition={{ duration: 0.5 }}
          >
            <Typography
              sx={{
                fontSize: '18px',
                fontWeight: 700,
                color: '#D84205', // ignit smolder color to match level number
                lineHeight: 1,
              }}
            >
              {(score || 0).toFixed(1)}
            </Typography>
          </motion.div>
          <Typography
            sx={{
              fontSize: '12px',
              fontWeight: 500, // Medium
              color: '#E5DFD1', // creamy white
              lineHeight: 1,
              fontFamily: 'Montserrat, sans-serif',
            }}
          >
            Current Score
          </Typography>
        </Box>

        {/* Restart button in far right */}
        <IconButton
          onClick={onReset}
          sx={{
            color: '#E5DFD1',
            '&:hover': {
              backgroundColor: 'rgba(229, 223, 209, 0.1)',
            },
          }}
        >
          <RestartAltRoundedIcon fontSize="large" />
        </IconButton>
      </Box>
    </Box>
  )
}

export default TopGameBar