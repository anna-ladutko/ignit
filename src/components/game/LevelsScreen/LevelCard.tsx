import React from 'react'
import { Box, Typography, useTheme } from '@mui/material'
import { PlayArrow } from '@mui/icons-material'
import { BORDER_RADIUS } from '../../../constants/design'

export type LevelState = 'current' | 'passed' | 'completed'

interface LevelCardProps {
  levelNumber: number
  state: LevelState
  bestEfficiency?: number // В процентах (0-100)
  bestTime?: number // В секундах
  onClick: () => void
}

export const LevelCard: React.FC<LevelCardProps> = ({
  levelNumber,
  state,
  bestEfficiency,
  bestTime,
  onClick,
}) => {
  const theme = useTheme()

  // Форматирование времени в MM:SS
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  // Определение стилей для каждого состояния
  const getCardStyles = () => {
    switch (state) {
      case 'current':
        return {
          backgroundColor: '#D84205', // Оранжевый фон
          border: 'none',
          showPlayIcon: true,
        }
      case 'passed':
        return {
          backgroundColor: 'transparent',
          border: '1px solid rgba(52, 54, 53, 0.4)', // #343635 (surface) opacity 0.4
          showPlayIcon: false,
        }
      case 'completed':
        return {
          backgroundColor: 'rgba(32, 34, 33, 0.4)', // #202221 (background) opacity 0.4
          border: '1px solid rgba(32, 34, 33, 0.6)', // #202221 (background) opacity 0.6
          showPlayIcon: false,
        }
      default:
        return {
          backgroundColor: 'transparent',
          border: 'none',
          showPlayIcon: false,
        }
    }
  }

  const cardStyles = getCardStyles()
  const showStats = state !== 'current' && bestEfficiency !== undefined

  return (
    <Box
      onClick={onClick}
      sx={{
        width: '100%', // Заполняет колонку grid
        aspectRatio: '1', // Квадратная карточка
        borderRadius: `${BORDER_RADIUS.PANEL}px !important`,
        backgroundColor: cardStyles.backgroundColor,
        border: cardStyles.border,
        cursor: 'pointer',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        padding: '12px',
        transition: 'all 0.2s ease',
        '&:hover': {
          transform: 'scale(1.02)',
        },
        '&:active': {
          transform: 'scale(0.98)',
        },
      }}
    >
      {/* Номер уровня */}
      <Typography
        sx={{
          color: state === 'current' ? '#E5DFD1' : '#D84205',
          fontSize: '16px',
          fontWeight: 500,
          fontFamily: 'Montserrat',
          lineHeight: 1,
        }}
      >
        {levelNumber.toString().padStart(3, '0')}
      </Typography>

      {/* Статистика (для passed и completed) */}
      {showStats && (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            gap: '2px',
          }}
        >
          {/* Best Efficiency */}
          <Typography
            sx={{
              color: '#E5DFD1',
              fontSize: '18px',
              fontWeight: 700,
              fontFamily: 'Montserrat',
              lineHeight: 1,
            }}
          >
            {bestEfficiency?.toFixed(1)}%
          </Typography>
          
          {/* Time */}
          {bestTime !== undefined && (
            <Typography
              sx={{
                color: '#E5DFD1',
                fontSize: '12px',
                fontWeight: 400,
                fontFamily: 'Montserrat',
                lineHeight: 1,
              }}
            >
              {formatTime(bestTime)}
            </Typography>
          )}
        </Box>
      )}

      {/* Play иконка (только для current) */}
      {cardStyles.showPlayIcon && (
        <PlayArrow
          sx={{
            position: 'absolute',
            bottom: '12px',
            right: '12px',
            color: '#E5DFD1',
            fontSize: '24px',
          }}
        />
      )}
    </Box>
  )
}

export default LevelCard