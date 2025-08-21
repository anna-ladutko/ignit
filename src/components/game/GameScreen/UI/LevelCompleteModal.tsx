import React from 'react'
import { Box, Typography, Button, Modal, useTheme } from '@mui/material'
import { motion } from 'framer-motion'
import { BORDER_RADIUS } from '../../../../constants/design'

interface LevelCompleteModalProps {
  open: boolean
  score: number
  levelTime: number // время в секундах
  onNextLevel: () => void
  onMainScreen: () => void
}

export const LevelCompleteModal: React.FC<LevelCompleteModalProps> = ({
  open,
  score,
  levelTime,
  onNextLevel,
  onMainScreen,
}) => {
  const theme = useTheme()

  // Форматирование времени в MM:SS
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  return (
    <Modal
      open={open}
      onClose={() => {}} // Нельзя закрыть кликом вне модала
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(32, 34, 33, 0.9)', // #202221 с opacity 0.9
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          gap: 4,
        }}
      >
        {/* Success заголовок */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Typography
            variant="electronicTitle"
            sx={{
              fontSize: '64px',
              fontWeight: 700,
              background: theme.palette.gradients.accentGradient,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              textAlign: 'center',
              textTransform: 'uppercase',
            }}
          >
            Success!
          </Typography>
        </motion.div>

        {/* Основная карточка */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Box
            sx={{
              backgroundColor: '#6B6B6B', // Серый фон карточки как на макете
              borderRadius: BORDER_RADIUS.PANEL,
              padding: theme.spacing(4),
              minWidth: '280px',
              textAlign: 'center',
            }}
          >
            {/* Score */}
            <Typography
              variant="componentLabel"
              sx={{
                fontSize: '18px',
                fontWeight: 600,
                color: theme.palette.text.primary,
                mb: 1,
              }}
            >
              Score: {score.toFixed(1)}
            </Typography>

            {/* Time */}
            <Typography
              variant="componentLabel"
              sx={{
                fontSize: '16px',
                fontWeight: 400,
                color: theme.palette.text.secondary,
                opacity: 0.8,
              }}
            >
              Time: {formatTime(Math.floor(levelTime))}
            </Typography>
          </Box>
        </motion.div>

        {/* Next Level кнопка */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}
        >
          <Button
            variant="electronicPrimary"
            onClick={onNextLevel}
            sx={{
              minWidth: '200px',
              minHeight: '48px',
              fontSize: '18px',
              fontWeight: 600,
              textTransform: 'none',
            }}
          >
            Next Level
          </Button>

          {/* To levels list текст */}
          <Typography
            variant="componentValue"
            onClick={onMainScreen}
            sx={{
              fontSize: '14px',
              color: '#818181',
              cursor: 'pointer',
              '&:hover': {
                color: '#999',
              },
              transition: 'color 0.2s ease',
            }}
          >
            To levels list
          </Typography>
        </motion.div>
      </Box>
    </Modal>
  )
}

export default LevelCompleteModal