import React from 'react'
import { Box, IconButton, useTheme } from '@mui/material'
import { ArrowBack, Settings } from '@mui/icons-material'
import { LevelGrid } from './LevelGrid'

interface LevelsScreenProps {
  onBackClick: () => void
  onSettingsClick: () => void
  onLevelClick: (levelNumber: number) => void
}

export const LevelsScreen: React.FC<LevelsScreenProps> = ({
  onBackClick,
  onSettingsClick,
  onLevelClick,
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
      {/* Фиксированный фон */}
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundImage: 'url(/theme-fire-bg2.webp)',
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
          <ArrowBack fontSize="large" />
        </IconButton>

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
          height: 'calc(100vh - 80px)', // Вычитаем высоту header
          overflowY: 'auto',
          overflowX: 'hidden',
          paddingTop: '20px',
          // Кастомные стили скроллбара
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
        {/* TODO: Overview Widget - пока пропускаем */}
        
        {/* Level Grid */}
        <LevelGrid onLevelClick={onLevelClick} />
      </Box>
    </Box>
  )
}

export default LevelsScreen