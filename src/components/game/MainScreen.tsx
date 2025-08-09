import React from 'react'
import { Box, Typography, useTheme } from '@mui/material'
import { motion } from 'framer-motion'
import { TopBar } from './TopBar'
import { TouchButton } from '../ui'
import { MobilePanel } from '../ui'

interface MainScreenProps {
  playerName?: string
  levelsCompleted?: number
  onPlayClick?: () => void
  onSettingsClick: () => void
  onDevModeClick?: () => void
}

export const MainScreen: React.FC<MainScreenProps> = ({
  playerName = "Hello Stranger",
  levelsCompleted = 0,
  onPlayClick,
  onSettingsClick,
  onDevModeClick,
}) => {
  const theme = useTheme()

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: 'background.default',
        p: theme.spacing(2),
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Top Bar */}
      <TopBar
        playerName={playerName}
        levelsCompleted={levelsCompleted}
        onSettingsClick={onSettingsClick}
      />

      {/* Main Content */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: theme.spacing(4),
        }}
      >
        {/* Game Title */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <Typography variant="electronicTitle" sx={{ textAlign: 'center', mb: 2 }}>
            IGNIT
          </Typography>
          <Typography
            variant="circuitInfo"
            sx={{
              textAlign: 'center',
              color: 'text.secondary',
              fontSize: '16px',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
            }}
          >
            Electronic Circuit Puzzle
          </Typography>
        </motion.div>

        {/* Game Logo/Visual Element */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1, delay: 0.3, ease: 'easeOut' }}
        >
          <MobilePanel variant="accent" sx={{ p: 4, textAlign: 'center', maxWidth: '300px', mx: 'auto' }}>
            <motion.div
              animate={{ 
                rotate: [0, 360],
                scale: [1, 1.05, 1]
              }}
              transition={{ 
                rotate: { duration: 20, repeat: Infinity, ease: 'linear' },
                scale: { duration: 2, repeat: Infinity, ease: 'easeInOut' }
              }}
            >
              <Box
                sx={{
                  width: 120,
                  height: 120,
                  borderRadius: '50%',
                  background: theme.palette.gradients.accentTopLeft,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mb: 2,
                  mx: 'auto',
                  position: 'relative',
                  boxShadow: theme.palette.customShadows.glow,
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    inset: 4,
                    borderRadius: '50%',
                    background: theme.palette.circuit.boardBackground,
                  },
                }}
              >
                {/* Circuit symbol in center */}
                <Box
                  sx={{
                    position: 'relative',
                    zIndex: 1,
                    color: theme.palette.electronic.primary,
                    fontSize: '48px',
                    fontWeight: 700,
                    filter: `drop-shadow(0 0 8px ${theme.palette.electronic.primary})`,
                  }}
                >
                  ⚡
                </Box>
              </Box>
            </motion.div>
            <Typography variant="componentLabel" sx={{ fontSize: '14px' }}>
              Ready to start?
            </Typography>
          </MobilePanel>
        </motion.div>

        {/* Play Button */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6, ease: 'easeOut' }}
          style={{ width: '100%', maxWidth: '280px' }}
        >
          <TouchButton
            variant="primary"
            size="large"
            fullWidth
            onClick={onPlayClick}
            disabled={!onPlayClick}
            sx={{
              py: theme.spacing(2),
              fontSize: '20px',
              fontWeight: 700,
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
              position: 'relative',
              overflow: 'hidden',
              ...(onPlayClick && {
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: '-100%',
                  width: '100%',
                  height: '100%',
                  background: `linear-gradient(90deg, transparent, ${theme.palette.electronic.primary}40, transparent)`,
                  animation: 'shimmer 2s infinite',
                },
                '@keyframes shimmer': {
                  '0%': { left: '-100%' },
                  '100%': { left: '100%' },
                },
              }),
            }}
          >
            {onPlayClick ? 'Play' : 'Coming Soon'}
          </TouchButton>
        </motion.div>

        {/* Status Message */}
        {!onPlayClick && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 1 }}
          >
            <Typography
              variant="circuitInfo"
              sx={{
                textAlign: 'center',
                color: 'text.secondary',
                opacity: 0.7,
                fontSize: '14px',
              }}
            >
              Game functionality is in development
            </Typography>
          </motion.div>
        )}

        {/* Developer Mode Button */}
        {onDevModeClick && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 1.2 }}
            style={{ position: 'fixed', bottom: 20, left: 20 }}
          >
            <TouchButton
              variant="secondary"
              size="small"
              onClick={onDevModeClick}
              sx={{
                minWidth: 'auto',
                width: 44,
                height: 44,
                borderRadius: '50%',
                opacity: 0.7,
                fontSize: '12px',
                fontWeight: 600,
                '&:hover': {
                  opacity: 1,
                },
              }}
            >
              DEV
            </TouchButton>
          </motion.div>
        )}
      </Box>
    </Box>
  )
}

export default MainScreen