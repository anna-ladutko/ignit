import React, { useState, useEffect } from 'react'
import { Box, useTheme } from '@mui/material'
import type { Level } from '../../../types'
import type { GameScreenState } from '../../../types/gameScreen'
import { TopGameBar } from './GameUI/TopGameBar'
import { ComponentPalette } from './GameUI/ComponentPalette'
import { GameCanvas } from './GameCanvas/GameCanvas'
import { GameControls } from './GameUI/GameControls'
import { CircuitSimulator } from '../../../game/circuitSimulator'

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
  const [simulator] = useState(() => new CircuitSimulator())
  
  const [gameState, setGameState] = useState<GameScreenState>({
    level: null,
    placedComponents: [],
    connections: [],
    selectedComponent: null,
    selectedWire: null,
    isSimulating: false,
    score: 0,
    energyUsed: 0,
    gameStatus: 'loading',
    draggedComponent: null,
    isDrawingWire: false,
    wireStartPoint: null,
  })

  // Load level on mount
  useEffect(() => {
    if (level) {
      try {
        simulator.loadLevel(level)
        simulator.getGameState()
        
        setGameState(prev => ({
          ...prev,
          level,
          gameStatus: 'playing',
          score: 0,
          energyUsed: 0,
        }))
      } catch (error) {
        console.error('Failed to load level:', error)
        setGameState(prev => ({ ...prev, gameStatus: 'failed' }))
      }
    }
  }, [level, simulator])

  const handleComponentPlace = (componentType: string, position: { x: number; y: number }) => {
    // TODO: Implement component placement logic
    console.log('Place component:', componentType, 'at:', position)
  }

  const handleComponentSelect = (componentId: string) => {
    setGameState(prev => ({
      ...prev,
      selectedComponent: prev.selectedComponent === componentId ? null : componentId,
      selectedWire: null,
    }))
  }

  const handleWireStart = (componentId: string, terminal: string, position: { x: number; y: number }) => {
    // TODO: Implement wire drawing logic
    console.log('Start wire from:', componentId, terminal, 'at:', position)
  }

  const handleSimulation = () => {
    if (!gameState.level) return
    
    try {
      const result = simulator.simulate()
      setGameState(prev => ({
        ...prev,
        score: result.finalScore,
        energyUsed: result.totalEnergyUsed,
        gameStatus: result.isValid ? 'complete' : 'playing',
        isSimulating: true,
      }))
      
      // Reset simulation state after animation
      setTimeout(() => {
        setGameState(prev => ({ ...prev, isSimulating: false }))
      }, 2000)
    } catch (error) {
      console.error('Simulation failed:', error)
    }
  }

  const handleReset = () => {
    setGameState(prev => ({
      ...prev,
      placedComponents: [],
      connections: [],
      selectedComponent: null,
      selectedWire: null,
      isSimulating: false,
      score: 0,
      energyUsed: 0,
      gameStatus: 'playing',
    }))
  }

  if (gameState.gameStatus === 'loading') {
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
            color: theme.palette.electronic.primary,
            fontSize: '24px',
            textAlign: 'center',
          }}
        >
          Loading Level...
        </Box>
      </Box>
    )
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
      {/* Top Game Bar */}
      <TopGameBar
        level={gameState.level}
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
          overflow: 'hidden',
        }}
      >
        {/* Game Canvas */}
        <Box sx={{ flex: 1, position: 'relative' }}>
          <GameCanvas
            gameState={gameState}
            onComponentPlace={handleComponentPlace}
            onComponentSelect={handleComponentSelect}
            onWireStart={handleWireStart}
            isSimulating={gameState.isSimulating}
          />
        </Box>

        {/* Component Palette (Bottom) */}
        <ComponentPalette
          level={gameState.level}
          placedComponents={gameState.placedComponents}
          selectedComponent={gameState.selectedComponent}
          onComponentSelect={(type) => console.log('Select component type:', type)}
        />

        {/* Game Controls (Floating) */}
        <GameControls
          gameStatus={gameState.gameStatus}
          onSimulate={handleSimulation}
          onReset={handleReset}
          onHint={() => console.log('Show hint')}
          canSimulate={gameState.placedComponents.length > 0}
        />
      </Box>
    </Box>
  )
}

export default GameScreen