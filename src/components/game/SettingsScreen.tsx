import React from 'react'
import { Box, Typography, IconButton, useTheme, Switch, FormControlLabel } from '@mui/material'
import { ArrowBack as ArrowBackIcon, VolumeUp, Email, Language, GitHub } from '@mui/icons-material'
import { motion } from 'framer-motion'
import { MobilePanel, TouchButton } from '../ui'
import { getSoundEnabled, setSoundEnabled } from '../../utils/soundSettings'

interface SettingsScreenProps {
  onBackClick: () => void
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({
  onBackClick,
}) => {
  const theme = useTheme()
  const [soundEnabled, setSoundEnabledState] = React.useState(getSoundEnabled())

  // Handle sound toggle using utility
  const handleSoundToggle = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.checked
    setSoundEnabled(newValue)
    setSoundEnabledState(newValue)
  }

  const handleLinkClick = (url: string) => {
    window.open(url, '_blank')
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: 'background.default',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
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
        {/* Back Button */}
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

        {/* Settings Title */}
        <Typography 
          variant="electronicTitle" 
          sx={{ 
            fontSize: '24px',
            color: '#E5DFD1',
            fontWeight: 600,
          }}
        >
          SETTINGS
        </Typography>

        {/* Empty space for balance */}
        <Box sx={{ width: 48 }} />
      </Box>

      {/* Settings Content */}
      <Box 
        sx={{ 
          flex: 1, 
          p: '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
        }}
      >
        {/* Audio Settings Panel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <MobilePanel variant="primary">
            <Box sx={{ p: '20px' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <VolumeUp sx={{ color: '#D84205', fontSize: '28px', mr: 2 }} />
                <Typography variant="componentLabel" sx={{ fontSize: '18px' }}>
                  AUDIO SETTINGS
                </Typography>
              </Box>
              
              <FormControlLabel
                control={
                  <Switch
                    checked={soundEnabled}
                    onChange={handleSoundToggle}
                    sx={{
                      '& .MuiSwitch-switchBase.Mui-checked': {
                        color: '#D84205',
                      },
                      '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                        backgroundColor: '#D84205',
                      },
                      '& .MuiSwitch-track': {
                        backgroundColor: '#343635',
                      },
                    }}
                  />
                }
                label={
                  <Typography variant="body1" sx={{ color: '#E5DFD1', fontSize: '16px' }}>
                    Enable Sound Effects
                  </Typography>
                }
                sx={{ ml: 0 }}
              />
            </Box>
          </MobilePanel>
        </motion.div>

        {/* Links & Contacts Panel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <MobilePanel variant="primary">
            <Box sx={{ p: '20px' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Language sx={{ color: '#D84205', fontSize: '28px', mr: 2 }} />
                <Typography variant="componentLabel" sx={{ fontSize: '18px' }}>
                  LINKS & CONTACTS
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <TouchButton
                  variant="accent"
                  fullWidth
                  onClick={() => handleLinkClick('mailto:support@ignit-game.com')}
                  sx={{
                    justifyContent: 'flex-start',
                    pl: 2,
                  }}
                >
                  <Email sx={{ mr: 2 }} />
                  Contact Support
                </TouchButton>
                
                <TouchButton
                  variant="accent"
                  fullWidth
                  onClick={() => handleLinkClick('https://ignit-game.com')}
                  sx={{
                    justifyContent: 'flex-start',
                    pl: 2,
                  }}
                >
                  <Language sx={{ mr: 2 }} />
                  Visit Website
                </TouchButton>
                
                <TouchButton
                  variant="accent"
                  fullWidth
                  onClick={() => handleLinkClick('https://github.com/ignit-game')}
                  sx={{
                    justifyContent: 'flex-start',
                    pl: 2,
                  }}
                >
                  <GitHub sx={{ mr: 2 }} />
                  GitHub Repository
                </TouchButton>
              </Box>
            </Box>
          </MobilePanel>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Box sx={{ mt: 2, textAlign: 'center' }}>
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