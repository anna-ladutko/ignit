import React from 'react'
import { Box, Typography, IconButton, useTheme } from '@mui/material'
import { Settings as SettingsIcon } from '@mui/icons-material'

interface TopBarProps {
  playerName: string
  levelsCompleted: number
  onSettingsClick: () => void
  transparent?: boolean
  noShadow?: boolean
}

export const TopBar: React.FC<TopBarProps> = ({
  playerName,
  levelsCompleted,
  onSettingsClick,
  transparent = true,
  noShadow = false,
}) => {
  const theme = useTheme()

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        p: theme.spacing(2),
        background: transparent ? 'transparent' : theme.palette.background.paper,
        borderRadius: "20px !important", // Принудительно 20px для панели
        mb: theme.spacing(3),
        boxShadow: noShadow ? 'none' : '0 4px 8px rgba(0, 0, 0, 0.3)',
      }}
    >
      {/* Left side - Player info */}
      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        <Typography variant="componentLabel" sx={{ fontSize: '14px' }}>
          {playerName}
        </Typography>
        <Typography variant="componentValue" sx={{ fontSize: '12px', opacity: 0.8 }}>
          Levels completed: {levelsCompleted}
        </Typography>
      </Box>

      {/* Right side - Settings button */}
      <IconButton
        onClick={onSettingsClick}
        sx={{
          color: '#E5DFD1',
          '&:hover': {
            backgroundColor: 'rgba(229, 223, 209, 0.1)',
          },
        }}
      >
        <SettingsIcon fontSize="large" />
      </IconButton>
    </Box>
  )
}

export default TopBar