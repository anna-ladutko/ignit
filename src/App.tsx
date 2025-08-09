import { useState } from 'react'
import { Box, Container, Typography, Button, Paper, Alert } from '@mui/material'
import { motion } from 'framer-motion'

import { CircuitSimulator } from './game/circuitSimulator'
import { loadLevel } from './utils/levelLoader'
import { LevelLoader } from './components/LevelLoader'
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

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Typography variant="h3" component="h1" gutterBottom sx={{ 
            textAlign: 'center',
            background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            Ignit Game Engine Test
          </Typography>
        </motion.div>

        <LevelLoader onLevelLoaded={handleLevelLoaded} />

        <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
          <Button variant="contained" onClick={loadTestLevel}>
            Load Sample Level
          </Button>
          <Button variant="contained" onClick={loadRealPrometheusLevel}>
            Load Prometheus Level
          </Button>
          <Button variant="outlined" onClick={loadOptimalSolution} disabled={!level}>
            Load Optimal Solution
          </Button>
          <Button variant="outlined" onClick={runSimulation} disabled={!level}>
            Run Simulation
          </Button>
        </Box>

        {level && (
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h5" gutterBottom>
              Level Information
            </Typography>
            <Typography>ID: {level.metadata.level_id}</Typography>
            <Typography>Difficulty: {level.metadata.difficulty}</Typography>
            <Typography>Archetype: {level.metadata.primary_archetype}</Typography>
            <Typography>Source: {level.circuit_definition.source.voltage}V, {level.circuit_definition.source.energy_output} EU</Typography>
            <Typography>Targets: {level.circuit_definition.targets.length}</Typography>
            <Typography>Available Components: {level.circuit_definition.available_components.length}</Typography>
          </Paper>
        )}

        {gameState && (
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h5" gutterBottom>
              Game State
            </Typography>
            <Typography>Available Components: {gameState.availableComponents.length}</Typography>
            <Typography>Placed Components: {gameState.placedComponents.length}</Typography>
            <Typography>Targets: {gameState.targets.length}</Typography>
            
            <Box sx={{ mt: 2 }}>
              <Typography variant="h6">Available Components:</Typography>
              {gameState.availableComponents.map(comp => (
                <Typography key={comp.id} variant="body2">
                  • {comp.id} ({comp.type})
                </Typography>
              ))}
            </Box>
          </Paper>
        )}

        {simulationResult && (
          <Paper sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>
              Simulation Result
            </Typography>
            
            <Alert severity={simulationResult.isComplete ? 'success' : 'warning'} sx={{ mb: 2 }}>
              {simulationResult.message}
            </Alert>

            <Typography>Targets Lit: {simulationResult.targetsLit.length}/{level?.circuit_definition.targets.length || 0}</Typography>
            <Typography>Energy Used: {simulationResult.totalEnergyUsed.toFixed(1)} EU</Typography>
            <Typography>Final Score: {simulationResult.finalScore.toFixed(1)} EU</Typography>
            <Typography>Valid: {simulationResult.isValid ? 'Yes' : 'No'}</Typography>
            
            {simulationResult.errors.length > 0 && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="h6" color="error">Errors:</Typography>
                {simulationResult.errors.map((error: string, index: number) => (
                  <Typography key={index} color="error" variant="body2">
                    • {error}
                  </Typography>
                ))}
              </Box>
            )}

            <Box sx={{ mt: 2 }}>
              <Typography variant="h6">Energy Distribution:</Typography>
              {Object.entries(simulationResult.energyDistribution).map(([targetId, energy]) => (
                <Typography key={targetId} variant="body2">
                  • {targetId}: {(energy as number).toFixed(1)} EU
                </Typography>
              ))}
            </Box>
          </Paper>
        )}
      </Box>
    </Container>
  )
}

export default App
