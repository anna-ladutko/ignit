import React, { useState, useEffect } from 'react'
import { Box, useTheme } from '@mui/material'
import type { Level } from '../../../types'
import { ComponentType } from '../../../types'
import type { GameScreenState, PlacedComponent } from '../../../types/gameScreen'
import { gridToPixel, STANDARD_CANVAS_SIZE } from '../../../types/gameScreen'
import { TopGameBar } from './GameUI/TopGameBar'
import { ComponentPalette } from './GameUI/ComponentPalette'
import { GameCanvas } from './GameCanvas/GameCanvas'
import { GameControls } from './GameUI/GameControls'
import { CircuitSimulator } from '../../../game/circuitSimulator'

// Helper function to create preinstalled components (sources and targets)
const createPreinstalledComponents = (level: Level): PlacedComponent[] => {
  const components: PlacedComponent[] = []
  
  // Add source component - place in safe zone (100,100 - 400,400)
  if (level.circuit_definition.source) {
    const source = level.circuit_definition.source
    const sourcePixelPos = gridToPixel({ row: 3, col: 3 }) // Safe zone: pixel (140,140)
    
    components.push({
      id: source.id,
      type: ComponentType.VOLTAGE_SOURCE,
      position: sourcePixelPos,
      rotation: 0,
      originalComponentId: source.id,
      isPreinstalled: true,
      properties: {
        voltage: source.voltage,
        energyOutput: source.energy_output,
        isSource: true
      }
    })
  }
  
  // Add target components - place in safe zone (100,100 - 400,400)
  level.circuit_definition.targets.forEach((target, index) => {
    const gridX = 6 + (index * 3) // Positions: 6, 9 (pixels: 260, 380)
    const gridY = 3 // Same row as source
    const targetPixelPos = gridToPixel({ row: gridY, col: gridX })
    
    components.push({
      id: target.id,
      type: ComponentType.LED,
      position: targetPixelPos,
      rotation: 0,
      originalComponentId: target.id,
      isPreinstalled: true,
      properties: {
        energyRange: target.energy_range,
        isTarget: true
      }
    })
  })
  
  return components
}

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
        
        const preinstalledComponents = createPreinstalledComponents(level)
        
        setGameState(prev => ({
          ...prev,
          level,
          placedComponents: preinstalledComponents,
          gameStatus: 'playing',
          score: 0,
          energyUsed: 0,
        }))
      } catch (error) {
        console.error('Failed to load level:', error)
        setGameState(prev => ({ ...prev, gameStatus: 'failed' }))
      }
    }
  }, [level])

  const handleComponentPlace = (componentType: string, position: { x: number; y: number }) => {
    if (!gameState.level || !gameState.draggedComponent) {
      return
    }

    // Check if we're moving an existing component
    if (gameState.draggedComponent.sourceId) {
      // Moving existing component - all components use pixel coordinates
      const componentToMove = gameState.placedComponents.find(pc => pc.id === gameState.draggedComponent!.sourceId)
      if (componentToMove) {
        setGameState(prev => ({
          ...prev,
          placedComponents: prev.placedComponents.map(pc => 
            pc.id === gameState.draggedComponent!.sourceId 
              ? { ...pc, position }
              : pc
          ),
          draggedComponent: null,
          selectedComponent: componentToMove.id
        }))
        return
      }
    }

    // Placing new component from palette - use componentId to find specific component
    const originalComponent = gameState.draggedComponent.componentId 
      ? gameState.level.circuit_definition.available_components.find(comp => comp.id === gameState.draggedComponent!.componentId)
      : gameState.level.circuit_definition.available_components.find(comp => comp.type === componentType)

    if (!originalComponent) {
      return
    }

    // Check if we have remaining components of this type
    const usedCount = gameState.placedComponents.filter(
      pc => pc.originalComponentId === originalComponent.id
    ).length
    
    if (usedCount >= (originalComponent.quantity || 1)) {
      return
    }

    // Create new placed component - position is in pixels for user-placed components
    const newComponent: PlacedComponent = {
      id: `placed_${originalComponent.id}_${Date.now()}`,
      type: componentType as ComponentType[keyof ComponentType],
      position, // This is pixel position from grid snap
      rotation: 0,
      originalComponentId: originalComponent.id,
      isPreinstalled: false, // Explicitly mark as user-placed
      properties: {
        resistance: originalComponent.resistance,
        capacitance: originalComponent.capacitance,
        inductance: originalComponent.inductance,
        voltage: originalComponent.voltage,
        energyOutput: originalComponent.energy_output,
        isClosed: originalComponent.is_closed
      }
    }

    // Check if more components of this type remain after placement
    const remainingAfterPlacement = (originalComponent.quantity || 1) - (usedCount + 1)
    const shouldKeepDragging = remainingAfterPlacement > 0
    
    // Add to placed components
    setGameState(prev => ({
      ...prev,
      placedComponents: [...prev.placedComponents, newComponent],
      // Keep draggedComponent if more components remain, otherwise clear it
      draggedComponent: shouldKeepDragging ? prev.draggedComponent : null,
      selectedComponent: newComponent.id // Select the newly placed component
    }))
  }

  const handleComponentSelect = (componentId: string) => {
    const existingComponent = gameState.placedComponents.find(pc => pc.id === componentId)
    
    setGameState(prev => ({
      ...prev,
      selectedComponent: componentId ? (prev.selectedComponent === componentId ? null : componentId) : null,
      selectedWire: null,
      // Allow dragging of ALL existing placed components (including preinstalled)
      draggedComponent: existingComponent ? {
        type: existingComponent.type,
        sourceId: existingComponent.id
      } : (componentId ? null : prev.draggedComponent), // Clear if clicking empty space
    }))
  }

  const handleWireStart = (componentId: string, terminal: string, position: { x: number; y: number }) => {
    // TODO: Implement wire drawing logic
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

  const handleComponentRemove = (componentId: string) => {
    const componentToRemove = gameState.placedComponents.find(pc => pc.id === componentId)
    
    // Don't allow removal of preinstalled components
    if (componentToRemove && componentToRemove.isPreinstalled) {
      return
    }
    
    setGameState(prev => ({
      ...prev,
      placedComponents: prev.placedComponents.filter(pc => pc.id !== componentId),
      selectedComponent: prev.selectedComponent === componentId ? null : prev.selectedComponent,
      draggedComponent: null
    }))
  }

  const handleReset = () => {
    setGameState(prev => ({
      ...prev,
      // Keep preinstalled components, remove only user-placed ones
      placedComponents: prev.placedComponents.filter(pc => pc.isPreinstalled),
      connections: [],
      selectedComponent: null,
      selectedWire: null,
      isSimulating: false,
      score: 0,
      energyUsed: 0,
      gameStatus: 'playing',
      draggedComponent: null
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
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
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

      {/* Main Game Area - Full screen without restrictions */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          // No overflow restrictions - allow infinite canvas
        }}
      >
        {/* Game Canvas */}
        <Box sx={{ flex: 1, position: 'relative' }}>
          <GameCanvas
            gameState={gameState}
            onComponentPlace={handleComponentPlace}
            onComponentSelect={handleComponentSelect}
            onComponentRemove={handleComponentRemove}
            onWireStart={handleWireStart}
            isSimulating={gameState.isSimulating}
          />
        </Box>

        {/* Component Palette (Bottom) */}
        <ComponentPalette
          level={gameState.level}
          placedComponents={gameState.placedComponents}
          selectedComponent={gameState.selectedComponent}
          draggedComponent={gameState.draggedComponent}
          onComponentSelect={(componentId) => {
            const selectedComponent = gameState.level?.circuit_definition.available_components.find(comp => comp.id === componentId)
            if (selectedComponent) {
              setGameState(prev => ({
                ...prev,
                draggedComponent: {
                  type: selectedComponent.type as ComponentType[keyof ComponentType],
                  sourceId: undefined,
                  componentId: componentId
                },
                selectedComponent: null
              }))
            }
          }}
        />

        {/* Game Controls (Floating) */}
        <GameControls
          gameStatus={gameState.gameStatus}
          onSimulate={handleSimulation}
          onReset={handleReset}
          onHint={() => {}}
          canSimulate={gameState.placedComponents.length > 0}
        />
      </Box>
    </Box>
  )
}

export default GameScreen