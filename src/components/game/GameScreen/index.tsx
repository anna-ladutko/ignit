import React, { useRef, useCallback } from 'react'
import { Box, useTheme } from '@mui/material'
import type { Level } from '../../../types'
import { useGameEngine } from '../../../hooks/useGameEngine.js'
import { TopGameBar } from './GameUI/TopGameBar'
import { ComponentPalette } from './GameUI/ComponentPalette'
import { GameControls } from './GameUI/GameControls'

/**
 * GameScreen - Чистый UI Shell
 * React управляет только UI структурой и данными
 * Вся игровая механика делегирована в GameEngine (Vanilla JS)
 */

interface GameScreenProps {
  level: Level
  onBackToMain: () => void
  onNextLevel?: () => void
}

export const GameScreen: React.FC<GameScreenProps> = ({
  level,
  onBackToMain,
  onNextLevel: _onNextLevel,
}) => {
  const theme = useTheme()
  
  // Используем чистый игровой движок через хук
  const { gameState, actions, initializeGameEngine } = useGameEngine(level)
  
  // Callback ref - инициализирует GameEngine когда canvas готов
  const canvasRef = useCallback((canvasElement: HTMLDivElement | null) => {
    console.log('🔄 GAMESCREEN: Canvas ref callback triggered. Element:', !!canvasElement)
    
    if (canvasElement) {
      console.log('✅ GAMESCREEN: Canvas элемент смонтирован, инициализируем GameEngine...')
      initializeGameEngine(canvasElement)
    } else {
      console.log('❌ GAMESCREEN: Canvas элемент размонтирован')
    }
  }, [initializeGameEngine])

  // Обработчики UI событий - просто делегируем в GameEngine
  const handleSimulate = () => {
    actions.simulateCircuit()
  }
  
  const handleReset = () => {
    actions.resetLevel()
  }

  const handleComponentFromPalette = (componentType: string) => {
    actions.addComponentFromPalette(componentType)
  }

  // Failed state - показываем только при критических ошибках
  if (gameState.gameStatus === 'failed') {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          backgroundColor: 'background.default',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Box
          sx={{
            color: theme.palette.error.main,
            fontSize: '24px',
            textAlign: 'center',
          }}
        >
          ❌ Level Failed to Load
          <Box sx={{ fontSize: '14px', color: 'text.secondary', mt: 1 }}>
            Check console for details
          </Box>
        </Box>
      </Box>
    )
  }

  return (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
      }}
    >
      {/* Top Game Bar - Статичный UI */}
      <TopGameBar
        level={level}
        score={gameState.score}
        energyUsed={gameState.energyUsed}
        gameStatus={gameState.gameStatus}
        onBackClick={onBackToMain}
      />

      {/* Main Game Area */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
        }}
      >
        {/* Game Canvas - ВСЕГДА монтируется для callback ref */}
        <Box sx={{ flex: 1, position: 'relative' }}>
          <div
            ref={canvasRef}
            id="game-canvas"
            data-testid="game-canvas"
            style={{
              width: '100%',
              height: '100%',
              backgroundColor: '#202221',
              position: 'relative',
              overflow: 'hidden'
            }}
          />
          
          {/* Loading Overlay - показывается поверх canvas */}
          {gameState.gameStatus === 'loading' && (
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(32, 34, 33, 0.9)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 1000,
              }}
            >
              <Box
                sx={{
                  color: theme.palette.electronic.primary,
                  fontSize: '24px',
                  textAlign: 'center',
                }}
              >
                Loading Level...
                <Box sx={{ fontSize: '14px', color: 'text.secondary', mt: 1 }}>
                  Initializing GameEngine...
                </Box>
              </Box>
            </Box>
          )}
        </Box>

        {/* Component Palette - Статичный UI */}
        <ComponentPalette
          level={level}
          placedComponents={gameState.placedComponents}
          selectedComponent={null}
          draggedComponent={null}
          onComponentSelect={handleComponentFromPalette}
        />

        {/* Game Controls - Статичный UI */}
        <GameControls
          gameStatus={gameState.gameStatus}
          onSimulate={handleSimulate}
          onReset={handleReset}
          onHint={() => {}}
          canSimulate={gameState.placedComponents.length > 0}
        />
      </Box>
    </Box>
  )
}

export default GameScreen