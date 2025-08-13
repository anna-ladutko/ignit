import React from 'react'
import { Box, Typography, IconButton, useTheme } from '@mui/material'
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material'
import { motion } from 'framer-motion'
import { MobilePanel } from '../ui'

interface SettingsScreenProps {
  onBackClick: () => void
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({
  onBackClick,
}) => {
  const theme = useTheme()

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: 'background.default',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Top Bar with Back Button */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          p: theme.spacing(2),
          background: theme.palette.circuit.boardBackground,
          boxShadow: theme.palette.customShadows.softShadow,
        }}
      >
        <IconButton
          onClick={onBackClick}
          sx={{
            color: theme.palette.primary.main,
            backgroundColor: `${theme.palette.primary.main}15`,
            width: theme.mobile.touchTarget,
            height: theme.mobile.touchTarget,
            mr: theme.spacing(2),
            '&:hover': {
              backgroundColor: `${theme.palette.primary.main}25`,
              transform: 'scale(1.05)',
            },
            '&:active': {
              transform: 'scale(0.95)',
            },
            transition: 'all 0.2s ease',
          }}
        >
          <ArrowBackIcon />
        </IconButton>

        <Typography variant="electronicTitle" sx={{ fontSize: '24px' }}>
          SETTINGS
        </Typography>
      </Box>

      {/* Settings Content */}
      <Box sx={{ flex: 1, p: theme.spacing(2) }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <MobilePanel variant="primary" sx={{ textAlign: 'center', py: 4 }}>
            <Box
              sx={{
                color: theme.palette.primary.main,
                fontSize: '64px',
                mb: 2,
              }}
            >
              ⚙️
            </Box>
            <Typography variant="componentLabel" sx={{ fontSize: '18px', mb: 2 }}>
              Settings
            </Typography>
            <Typography
              variant="circuitInfo"
              sx={{
                color: 'text.secondary',
                opacity: 0.8,
              }}
            >
              Settings functionality will be implemented here.
              <br />
              This could include:
            </Typography>
            <Box sx={{ mt: 3, textAlign: 'left', maxWidth: '300px', mx: 'auto' }}>
              <Typography variant="circuitInfo" sx={{ mb: 1, opacity: 0.7 }}>
                • Sound & Music settings
              </Typography>
              <Typography variant="circuitInfo" sx={{ mb: 1, opacity: 0.7 }}>
                • Display preferences
              </Typography>
              <Typography variant="circuitInfo" sx={{ mb: 1, opacity: 0.7 }}>
                • Difficulty options
              </Typography>
              <Typography variant="circuitInfo" sx={{ mb: 1, opacity: 0.7 }}>
                • Account management
              </Typography>
              <Typography variant="circuitInfo" sx={{ mb: 1, opacity: 0.7 }}>
                • About & Help
              </Typography>
            </Box>
          </MobilePanel>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Box sx={{ mt: 4, textAlign: 'center' }}>
            <Typography
              variant="componentValue"
              sx={{
                color: 'text.secondary',
                opacity: 0.6,
                fontSize: '12px',
              }}
            >
              IGNIT v1.0.0 • Electronic Circuit Puzzle Game
            </Typography>
          </Box>
        </motion.div>
      </Box>
    </Box>
  )
}

export default SettingsScreen