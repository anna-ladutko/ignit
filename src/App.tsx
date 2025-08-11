import { useState } from 'react'
import { Box, Container, Typography, Button, Paper, Alert, Tab, Tabs } from '@mui/material'
import { motion } from 'framer-motion'

import { CircuitSimulator } from './game/circuitSimulator'
import { loadLevel } from './utils/levelLoader'
import { LevelLoader } from './components/LevelLoader'
import { ThemeDemo } from './components/ThemeDemo'
import { MainScreen, SettingsScreen, GameScreen } from './components/game'
import { levelManager } from './services/LevelManager'
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
  const [currentScreen, setCurrentScreen] = useState<'main' | 'settings' | 'game'>('main')
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

  const runSimulation = () => {
    const result = simulator.simulate()
    setSimulationResult(result)
  }

  const loadOptimalSolution = () => {
    simulator.loadOptimalSolution()
    setGameState(simulator.getGameState())
  }

  if (currentTab === 0) {
    // Game tab - full screen without container
    return (
      <Box sx={{ 
        minHeight: '100vh',
        backgroundColor: 'background.default',
      }}>
        {currentScreen === 'main' ? (
          <MainScreen
            playerName="Hello Stranger"
            levelsCompleted={7}
            onPlayClick={async () => {
              // Load first level from Prometheus Studio export
              try {
                const firstLevel = await levelManager.loadLevelByOrder(1)
                if (firstLevel) {
                  setTestLevel(firstLevel)
                  setCurrentScreen('game')
                } else {
                  // Fallback to sample level if no exported levels found
                  console.warn('No exported levels found, using sample level')
                  const loadedLevel = await loadLevel(sampleLevelData)
                  setTestLevel(loadedLevel)
                  setCurrentScreen('game')
                }
              } catch (error) {
                console.error('Failed to load first level:', error)
                // Try fallback to sample level
                try {
                  const loadedLevel = await loadLevel(sampleLevelData)
                  setTestLevel(loadedLevel)
                  setCurrentScreen('game')
                } catch (fallbackError) {
                  console.error('Failed to load fallback level:', fallbackError)
                }
              }
            }}
            onSettingsClick={() => setCurrentScreen('settings')}
            onDevModeClick={() => setCurrentTab(1)}
          />
        ) : currentScreen === 'settings' ? (
          <SettingsScreen
            onBackClick={() => setCurrentScreen('main')}
          />
        ) : currentScreen === 'game' && testLevel ? (
          <GameScreen
            level={testLevel}
            onBackToMain={() => setCurrentScreen('main')}
            onNextLevel={() => console.log('Next level not implemented')}
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
        </Box>
      </Container>
    </Box>
  )
}

export default App