import React from 'react'
import { Box, Typography, IconButton, useTheme } from '@mui/material'
import { Settings } from '@mui/icons-material'
import { motion } from 'framer-motion'
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
        width: '100vw',
        height: '100vh',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Fixed Background */}
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundImage: 'url(/theme-fire-bg1.webp)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          zIndex: -1,
        }}
      />

      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '16px 20px',
          backgroundColor: 'transparent',
        }}
      >
        {/* Player Info */}
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <Typography
            variant="electronicTitle"
            sx={{
              fontSize: '18px',
              fontWeight: 600,
              color: '#E5DFD1',
              lineHeight: 1,
            }}
          >
            {playerName}
          </Typography>
          <Typography
            variant="componentValue"
            sx={{
              fontSize: '12px',
              color: '#E5DFD1',
              opacity: 0.7,
              lineHeight: 1,
              mt: 0.25,
            }}
          >
            {levelsCompleted} levels completed
          </Typography>
        </Box>

        {/* Settings Button */}
        <IconButton
          onClick={onSettingsClick}
          sx={{
            color: '#E5DFD1',
            '&:hover': {
              backgroundColor: 'rgba(229, 223, 209, 0.1)',
            },
          }}
        >
          <Settings fontSize="large" />
        </IconButton>
      </Box>

      {/* Scrollable Content */}
      <Box
        sx={{
          height: 'calc(100vh - 80px)',
          overflowY: 'auto',
          overflowX: 'hidden',
          paddingTop: '20px',
          // Custom scrollbar styles
          '&::-webkit-scrollbar': {
            width: '6px',
          },
          '&::-webkit-scrollbar-track': {
            backgroundColor: 'transparent',
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: 'rgba(229, 223, 209, 0.3)',
            borderRadius: '3px',
            '&:hover': {
              backgroundColor: 'rgba(229, 223, 209, 0.5)',
            },
          },
        }}
      >
        {/* Main Content */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: theme.spacing(4),
            minHeight: 'calc(100vh - 120px)',
            px: '20px',
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
    </Box>
  )
}

export default MainScreen