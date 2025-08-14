import React from 'react'
import { Box, Typography, IconButton, useTheme } from '@mui/material'
import { Settings as SettingsIcon } from '@mui/icons-material'

interface TopBarProps {
  playerName: string
  levelsCompleted: number
  onSettingsClick: () => void
}

export const TopBar: React.FC<TopBarProps> = ({
  playerName,
  levelsCompleted,
  onSettingsClick,
}) => {
  const theme = useTheme()

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        p: theme.spacing(2),
        background: theme.palette.circuit.boardBackground,
        borderRadius: "20px !important", // Принудительно 20px для панели
        mb: theme.spacing(3),
        boxShadow: theme.palette.customShadows.softShadow,
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
          color: theme.palette.primary.main,
          backgroundColor: `${theme.palette.primary.main}15`,
          width: theme.mobile.touchTarget,
          height: theme.mobile.touchTarget,
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
        <SettingsIcon />
      </IconButton>
    </Box>
  )
}

export default TopBar