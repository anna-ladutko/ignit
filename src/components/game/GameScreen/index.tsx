import React, { useCallback } from 'react'
import { Box, useTheme } from '@mui/material'
import type { Level } from '../../../types'
import { useGameEngine } from '../../../hooks/useGameEngine.js'
import { TopGameBar } from './GameUI/TopGameBar'
import { ComponentPalette } from './GameUI/ComponentPalette'
import { GameControls } from './GameUI/GameControls'
import { LevelCompleteModal } from './UI/LevelCompleteModal'
import { DebugPanel } from './UI/DebugPanel'
import { ConnectionIndicatorsLayer } from './GameCanvas/ConnectionIndicator'

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
    if (canvasElement) {
      initializeGameEngine(canvasElement)
    }
  }, [initializeGameEngine])

  // Обработчики UI событий - просто делегируем в GameEngine
  const handleSimulate = () => {
    actions.simulateCircuit()
  }
  
  const handleReset = () => {
    actions.resetLevel()
  }

  const handleComponentFromPalette = (componentId: string) => {
    actions.addComponentFromPalette(componentId)
  }

  // Обработчики Success Modal
  const handleNextLevel = () => {
    if (_onNextLevel) {
      actions.resetForNextLevel() // Сначала сбрасываем состояние
      _onNextLevel() // Потом переходим к следующему уровню
    } else {
      console.warn('GameScreen: onNextLevel callback не предоставлен')
    }
  }

  const handleMainScreen = () => {
    actions.resetForNextLevel() // Сбрасываем состояние 
    onBackToMain() // Возвращаемся в главное меню
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
        score={gameState.currentScore}
        energyUsed={gameState.energyUsed}
        bestScore={gameState.bestScore}
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
          
          {/* Connection Indicators Layer - Green dots for magnetic connections */}
          <ConnectionIndicatorsLayer
            connectionPoints={gameState.connectionPoints || []}
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
                  color: theme.palette.primary.main,
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
          canFinishLevel={gameState.canFinishLevel}
          onFinishLevel={actions.finishLevel}
          currentScore={gameState.currentScore}
          bestScore={gameState.bestScore}
          attemptCount={gameState.attemptCount}
        />
      </Box>

      {/* Success Modal */}
      <LevelCompleteModal
        open={gameState.showSuccessModal}
        score={gameState.bestScore}
        levelTime={gameState.levelTime}
        onNextLevel={handleNextLevel}
        onMainScreen={handleMainScreen}
      />
      
      {/* Debug Panel для отображения Efficiency данных */}
      <DebugPanel isVisible={true} />
    </Box>
  )
}

export default GameScreen