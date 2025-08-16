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
  onLevelsClick?: () => void
  onSettingsClick: () => void
  onDevModeClick?: () => void
}

export const MainScreen: React.FC<MainScreenProps> = ({
  playerName = "Hello Stranger",
  levelsCompleted = 0,
  onPlayClick,
  onLevelsClick,
  onSettingsClick,
  onDevModeClick,
}) => {
  const theme = useTheme()

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: 'background.default',
        p: '20px',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Top Bar */}
      <TopBar
        playerName={playerName}
        levelsCompleted={levelsCompleted}
        onSettingsClick={onSettingsClick}
        noShadow={true}
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
                  background: `linear-gradient(90deg, transparent, ${theme.palette.primary.main}40, transparent)`,
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

        {/* Levels Button */}
        {onLevelsClick && (
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.8, ease: 'easeOut' }}
            style={{ width: '100%', maxWidth: '280px' }}
          >
            <TouchButton
              variant="secondary"
              size="large"
              fullWidth
              onClick={onLevelsClick}
              sx={{
                py: theme.spacing(1.5),
                fontSize: '18px',
                fontWeight: 600,
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
                mt: 2,
              }}
            >
              Levels
            </TouchButton>
          </motion.div>
        )}

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
              variant="primary"
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