import React from 'react'
import { Box } from '@mui/material'
import { LevelCard } from './LevelCard'
import type { LevelState } from './LevelCard'
import { levelManager } from '../../../services/LevelManager'
import { isLevelUnlocked } from '../../../levels/level-registry'

interface LevelData {
  levelNumber: number
  state: LevelState
  bestEfficiency?: number
  bestTime?: number
}

interface LevelGridProps {
  onLevelClick: (levelNumber: number) => void
}

export const LevelGrid: React.FC<LevelGridProps> = ({ onLevelClick }) => {
  
  // Получение данных о состоянии уровней
  const getLevelData = (): LevelData[] => {
    const playerProgress = levelManager.getPlayerProgress()
    const totalLevels = levelManager.getTotalLevels()
    const levels: LevelData[] = []
    
    // Временные данные для демонстрации (пока нет реальной статистики в LevelManager)
    const mockStats = {
      1: { efficiency: 88.6, time: 183 }, // 03:03
      2: { efficiency: 88.6, time: 183 },
      3: { efficiency: 58.6, time: 183 },
      4: { efficiency: 88.6, time: 183 },
      5: { efficiency: 62.6, time: 262 }, // 04:22
      6: { efficiency: 70.6, time: 683 }, // 11:23
      7: { efficiency: 88.6, time: 262 },
    }
    
    // Создаем данные ТОЛЬКО для доступных уровней
    for (let i = totalLevels; i >= 1; i--) {
      // Проверяем доступность уровня
      const isUnlocked = isLevelUnlocked(i, playerProgress.completedLevels, playerProgress.totalScore)
      
      // Показываем только разблокированные уровни
      if (!isUnlocked) {
        continue
      }
      
      const isCompleted = playerProgress.completedLevels.includes(i)
      const isCurrent = i === playerProgress.currentLevel && !isCompleted
      const stats = mockStats[i]
      
      let state: LevelState
      if (isCurrent) {
        state = 'current'
      } else if (isCompleted) {
        // Определяем на основе efficiency: >= 85% = completed, < 85% = passed
        state = (stats?.efficiency || 0) >= 85 ? 'completed' : 'passed'
      } else {
        // Доступный но не пройденный уровень
        state = 'current'
      }
      
      levels.push({
        levelNumber: i,
        state,
        bestEfficiency: isCompleted ? stats?.efficiency : undefined,
        bestTime: isCompleted ? stats?.time : undefined,
      })
    }
    
    return levels
  }

  const levelData = getLevelData()

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '16px', // Горизонтальный и вертикальный gap
        padding: '0 20px', // Margin 125% от gap (20px = 16px * 1.25)
        paddingBottom: '40px',
      }}
    >
      {levelData.map((level) => (
        <LevelCard
          key={level.levelNumber}
          levelNumber={level.levelNumber}
          state={level.state}
          bestEfficiency={level.bestEfficiency}
          bestTime={level.bestTime}
          onClick={() => onLevelClick(level.levelNumber)}
        />
      ))}
    </Box>
  )
}

export default LevelGrid