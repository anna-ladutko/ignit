import { useState } from 'react'
import { Box, Container, Typography, Button, Paper, Alert, Tab, Tabs } from '@mui/material'
import { motion } from 'framer-motion'

import { CircuitSimulator } from './game/circuitSimulator'
import { loadLevel } from './utils/levelLoader'
import { LevelLoader } from './components/LevelLoader'
import { ThemeDemo } from './components/ThemeDemo'
import { SemanticThemeDemo } from './components/SemanticThemeDemo'
import { ModalDemo } from './components/ModalDemo'
import { MainScreen, SettingsScreen, LevelsScreen, GameScreen } from './components/game'
import { levelManager } from './services/LevelManager'
import ColorPalette from './pages/ColorPalette'
import type { Level } from './types'

// Sample level data from Prometheus for testing
const sampleLevelData = {
  "metadata": {
    "level_id": "test-level-001",
    "difficulty": 2,
    "primary_archetype": "splitter",
    "secondary_archetype": null,
    "mutator": null,
    "generation_timestamp": "2025-08-09T12:00:00Z",
    "generator_version": "1.0.0"
  },
  "circuit_definition": {
    "source": {
      "id": "SOURCE",
      "voltage": 12.0,
      "energy_output": 120.0,
      "is_stable": true,
      "position": [0, 0]
    },
    "targets": [
      {
        "id": "TARGET_LED_1",
        "type": "led",
        "energy_range": [13.5, 16.5],
        "color": "red",
        "position": [300, 300]
      },
      {
        "id": "TARGET_LED_2", 
        "type": "led",
        "energy_range": [18.0, 22.0],
        "color": "red",
        "position": [400, 300]
      }
    ],
    "available_components": [
      {
        "id": "R_DIV_1",
        "type": "resistor", 
        "nominal_value": 470,
        "actual_value": 470,
        "quantity": 1,
        "is_red_herring": false,
        "position": [0, 0],
        "resistance": 470
      },
      {
        "id": "R_DIV_2",
        "type": "resistor",
        "nominal_value": 680, 
        "actual_value": 680,
        "quantity": 1,
        "is_red_herring": false,
        "position": [0, 0],
        "resistance": 680
      }
    ],
    "board_layout": {
      "width": 800,
      "height": 600,
      "connection_points": []
    }
  },
  "solution_data": {
    "optimal_solution": {
      "components_used": ["R_DIV_1", "R_DIV_2"],
      "connections": [
        {
          "from": "SOURCE",
          "to": "R_DIV_1", 
          "from_terminal": "out",
          "to_terminal": "in"
        }
      ],
      "expected_score": 71.725,
      "simulation_result": {
        "targets_satisfied": {
          "TARGET_LED_1": true,
          "TARGET_LED_2": true
        },
        "energy_distribution": {
          "TARGET_LED_1": 16.5,
          "TARGET_LED_2": 22.0
        },
        "total_losses": 9.775
      }
    },
    "validation_results": {
      "validation_performed": false
    }
  }
}

function App() {
  const [simulator] = useState(() => new CircuitSimulator())
  const [level, setLevel] = useState<Level | null>(null)
  const [gameState, setGameState] = useState(simulator.getGameState())
  const [simulationResult, setSimulationResult] = useState<any>(null)
  const [currentTab, setCurrentTab] = useState(0)
  const [currentScreen, setCurrentScreen] = useState<'main' | 'settings' | 'levels' | 'game'>('main')
  const [testLevel, setTestLevel] = useState<Level | null>(null)

  const loadTestLevel = async () => {
    try {
      const loadedLevel = await loadLevel(sampleLevelData)
      simulator.loadLevel(loadedLevel)
      setLevel(loadedLevel)
      setGameState(simulator.getGameState())
    } catch (error) {
      console.error('Error loading level:', error)
    }
  }

  const loadRealPrometheusLevel = async () => {
    try {
      const response = await fetch('/test-level.json')
      const levelData = await response.json()
      const loadedLevel = await loadLevel(levelData)
      simulator.loadLevel(loadedLevel)
      setLevel(loadedLevel)
      setGameState(simulator.getGameState())
    } catch (error) {
      console.error('Error loading Prometheus level:', error)
    }
  }

  const handleLevelLoaded = (loadedLevel: Level) => {
    simulator.loadLevel(loadedLevel)
    setLevel(loadedLevel)
    setGameState(simulator.getGameState())
  }

  const handleNextLevel = async (score: number = 100) => {
    if (!testLevel) return
    
    // Получить номер текущего играемого уровня
    const currentLevelOrder = testLevel.registryOrder || 1
    console.log('🎮 APP: handleNextLevel вызвана, текущий уровень:', currentLevelOrder, 'score:', score)
    
    try {
      // Отметить текущий уровень как завершенный с реальным score
      levelManager.completeLevelWithScore(currentLevelOrder, score)
      console.log('✅ APP: Уровень', currentLevelOrder, 'отмечен как завершенный с score', score)
      
      // Получить следующий доступный уровень через LevelManager
      const nextLevelOrder = levelManager.getNextAvailableLevel(currentLevelOrder)
      console.log('🔄 APP: LevelManager предлагает следующий уровень:', nextLevelOrder)
      
      if (nextLevelOrder) {
        const nextLevel = await levelManager.loadLevelByOrder(nextLevelOrder)
        
        if (nextLevel) {
          console.log('✅ APP: Следующий уровень загружен:', nextLevel.metadata)
          setTestLevel(nextLevel)
        } else {
          console.error('❌ APP: Не удалось загрузить уровень', nextLevelOrder)
          alert('Ошибка загрузки следующего уровня')
        }
      } else {
        console.log('🏁 APP: Следующий уровень не найден - все уровни пройдены')
        alert('Поздравляем! Все уровни пройдены!')
        setCurrentScreen('main')
      }
    } catch (error) {
      console.error('❌ APP: Ошибка загрузки следующего уровня:', error)
      alert('Ошибка загрузки следующего уровня: ' + error.message)
    }
  }

  const handleLevelSelect = async (levelNumber: number) => {
    console.log('🎮 APP: handleLevelSelect вызвана для уровня:', levelNumber)
    
    try {
      const selectedLevel = await levelManager.loadLevelByOrder(levelNumber)
      
      if (selectedLevel) {
        console.log('✅ APP: Уровень', levelNumber, 'загружен для игры:', selectedLevel.metadata)
        setTestLevel(selectedLevel)
        setCurrentScreen('game')
      } else {
        console.error('❌ APP: Не удалось загрузить уровень', levelNumber)
        alert('Ошибка: уровень недоступен')
      }
    } catch (error) {
      console.error('❌ APP: Ошибка загрузки уровня', levelNumber, ':', error)
      alert('Ошибка загрузки уровня: ' + error.message)
    }
  }

  const runSimulation = () => {
    const result = simulator.simulate()
    setSimulationResult(result)
  }

  const loadOptimalSolution = () => {
    simulator.loadOptimalSolution()
    setGameState(simulator.getGameState())
  }

  if (currentTab === 0) {
    // Game tab - completely full screen without any containers or limitations
    return (
      <Box sx={{ 
        width: '100vw',
        height: '100vh',
        position: 'fixed',
        top: 0,
        left: 0,
        backgroundColor: 'background.default',
        overflow: 'hidden', // Prevent scrolling on game screens
      }}>
        {currentScreen === 'main' ? (
          <MainScreen
            playerName="Hello Stranger"
            levelsCompleted={7}
            onPlayClick={async () => {
              console.log('🎮 APP: Play button clicked, loading current progression level...')
              
              try {
                // Получить текущий уровень из прогрессии игрока
                const playerProgress = levelManager.getPlayerProgress()
                console.log('🔄 APP: Player progress:', playerProgress)
                
                const currentLevel = await levelManager.loadLevelByOrder(playerProgress.currentLevel)
                
                if (currentLevel) {
                  console.log('✅ APP: Current level loaded successfully:', currentLevel.metadata)
                  setTestLevel(currentLevel)
                  setCurrentScreen('game')
                } else {
                  console.error('❌ APP: Failed to load current level:', playerProgress.currentLevel)
                  console.log('🔄 APP: Fallback to level 1...')
                  const fallbackLevel = await levelManager.loadLevelByOrder(1)
                  
                  if (fallbackLevel) {
                    console.log('✅ APP: Fallback level 1 loaded:', fallbackLevel.metadata)
                    setTestLevel(fallbackLevel)
                    setCurrentScreen('game')
                  } else {
                    console.log('🔄 APP: Final fallback to sample data...')
                    const loadedLevel = await loadLevel(sampleLevelData)
                    console.log('✅ APP: Sample data loaded:', loadedLevel.metadata)
                    setTestLevel(loadedLevel)
                    setCurrentScreen('game')
                  }
                }
              } catch (error) {
                console.error('❌ APP: Error loading level:', error)
                
                try {
                  console.log('🔄 APP: Emergency fallback to sample data...')
                  const loadedLevel = await loadLevel(sampleLevelData)
                  console.log('✅ APP: Emergency fallback successful:', loadedLevel.metadata)
                  setTestLevel(loadedLevel)
                  setCurrentScreen('game')
                } catch (fallbackError) {
                  console.error('❌ APP: Critical error - emergency fallback failed:', fallbackError)
                  alert('Critical error loading level: ' + fallbackError.message)
                }
              }
            }}
            onLevelsClick={() => setCurrentScreen('levels')}
            onSettingsClick={() => setCurrentScreen('settings')}
            onDevModeClick={() => setCurrentTab(1)}
          />
        ) : currentScreen === 'settings' ? (
          <SettingsScreen
            onBackClick={() => setCurrentScreen('main')}
          />
        ) : currentScreen === 'levels' ? (
          <LevelsScreen
            onBackClick={() => setCurrentScreen('main')}
            onSettingsClick={() => setCurrentScreen('settings')}
            onLevelClick={handleLevelSelect}
          />
        ) : currentScreen === 'game' && testLevel ? (
          <GameScreen
            level={testLevel}
            onBackToMain={() => setCurrentScreen('main')}
            onNextLevel={handleNextLevel}
          />
        ) : null}
      </Box>
    )
  }

  // Development tabs - with container and navigation
  return (
    <Box sx={{ 
      minHeight: '100vh',
      backgroundColor: 'background.default',
    }}>
      <Container maxWidth="lg">
        <Box sx={{ py: 4 }}>
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Typography variant="electronicTitle" sx={{ mb: 3 }}>
              IGNIT GAME ENGINE
            </Typography>
          </motion.div>

          <Tabs 
            value={currentTab} 
            onChange={(_, newValue) => {
              setCurrentTab(newValue)
              if (newValue === 0) {
                setCurrentScreen('main') // Reset to main when going to Game tab
              }
            }}
            sx={{ 
              mb: 3,
              '& .MuiTab-root': {
                color: 'text.secondary',
                '&.Mui-selected': {
                  color: 'electronic.primary'
                }
              },
              '& .MuiTabs-indicator': {
                backgroundColor: 'electronic.primary'
              }
            }}
          >
            <Tab label="Game" />
            <Tab label="Game Engine" />
            <Tab label="Theme Demo" />
            <Tab label="NEW THEME" />
            <Tab label="Color Palette" />
            <Tab label="Modal Demo" />
          </Tabs>

          {currentTab === 1 && (
            <>
              <LevelLoader onLevelLoaded={handleLevelLoaded} />

              <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
                <Button variant="electronicPrimary" onClick={loadTestLevel}>
                  Load Sample Level
                </Button>
                <Button variant="electronicPrimary" onClick={loadRealPrometheusLevel}>
                  Load Prometheus Level
                </Button>
                <Button variant="electronicSecondary" onClick={loadOptimalSolution} disabled={!level}>
                  Load Optimal Solution
                </Button>
                <Button variant="electronicSecondary" onClick={runSimulation} disabled={!level}>
                  Run Simulation
                </Button>
              </Box>

              {level && (
                <Paper variant="infoPanel" sx={{ p: 3, mb: 3 }}>
                  <Typography variant="componentLabel" gutterBottom sx={{ fontSize: '16px' }}>
                    Level Information
                  </Typography>
                  <Typography variant="circuitInfo">ID: {level.metadata.level_id}</Typography>
                  <Typography variant="circuitInfo">Difficulty: {level.metadata.difficulty}</Typography>
                  <Typography variant="circuitInfo">Archetype: {level.metadata.primary_archetype}</Typography>
                  <Typography variant="circuitInfo">Source: {level.circuit_definition.source.voltage}V, {level.circuit_definition.source.energy_output} EU</Typography>
                  <Typography variant="circuitInfo">Targets: {level.circuit_definition.targets.length}</Typography>
                  <Typography variant="circuitInfo">Available Components: {level.circuit_definition.available_components.length}</Typography>
                </Paper>
              )}

              {gameState && (
                <Paper variant="componentCard" sx={{ p: 3, mb: 3 }}>
                  <Typography variant="componentLabel" gutterBottom sx={{ fontSize: '16px' }}>
                    Game State
                  </Typography>
                  <Typography variant="circuitInfo">Available Components: {gameState.availableComponents.length}</Typography>
                  <Typography variant="circuitInfo">Placed Components: {gameState.placedComponents.length}</Typography>
                  <Typography variant="circuitInfo">Targets: {gameState.targets.length}</Typography>
                  
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="componentLabel">Available Components:</Typography>
                    {gameState.availableComponents.map(comp => (
                      <Typography key={comp.id} variant="circuitInfo">
                        • {comp.id} ({comp.type})
                      </Typography>
                    ))}
                  </Box>
                </Paper>
              )}

              {simulationResult && (
                <Paper variant="circuitBoard" sx={{ p: 3 }}>
                  <Typography variant="componentLabel" gutterBottom sx={{ fontSize: '16px' }}>
                    Simulation Result
                  </Typography>
                  
                  <Alert severity={simulationResult.isComplete ? 'success' : 'warning'} sx={{ mb: 2 }}>
                    {simulationResult.message}
                  </Alert>

                  <Typography variant="energyValue">Targets Lit: {simulationResult.targetsLit.length}/{level?.circuit_definition.targets.length || 0}</Typography>
                  <Typography variant="energyValue">Energy Used: {simulationResult.totalEnergyUsed.toFixed(1)} EU</Typography>
                  <Typography variant="energyValue">Final Score: {simulationResult.finalScore.toFixed(1)} EU</Typography>
                  <Typography variant="circuitInfo">Valid: {simulationResult.isValid ? 'Yes' : 'No'}</Typography>
                  
                  {simulationResult.errors.length > 0 && (
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="componentLabel" color="error">Errors:</Typography>
                      {simulationResult.errors.map((error: string, index: number) => (
                        <Typography key={index} color="error" variant="circuitInfo">
                          • {error}
                        </Typography>
                      ))}
                    </Box>
                  )}

                  <Box sx={{ mt: 2 }}>
                    <Typography variant="componentLabel">Energy Distribution:</Typography>
                    {Object.entries(simulationResult.energyDistribution).map(([targetId, energy]) => (
                      <Typography key={targetId} variant="circuitInfo">
                        • {targetId}: {(energy as number).toFixed(1)} EU
                      </Typography>
                    ))}
                  </Box>
                </Paper>
              )}
            </>
          )}

          {currentTab === 2 && <ThemeDemo />}
          
          {currentTab === 3 && <SemanticThemeDemo />}
          
          {currentTab === 4 && <ColorPalette />}

          {currentTab === 5 && <ModalDemo />}
        </Box>
      </Container>
    </Box>
  )
}

export default App