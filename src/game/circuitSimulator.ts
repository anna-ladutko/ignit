import type { Level } from '../types'
import { GameComponent, GameVoltageSource, GameLED, GameSupercapacitor } from './components'
import { createGameComponentsFromLevel } from './componentFactory'
import type { EnergyFlowResult } from './energyEconomy'
import { EnergyCalculator } from './energyEconomy'

export interface GameState {
  level: Level
  source: GameVoltageSource
  targets: GameLED[]
  availableComponents: GameComponent[]
  placedComponents: GameComponent[]
  supercapacitor: GameSupercapacitor
  energyCalculator: EnergyCalculator
}

export interface SimulationResult extends EnergyFlowResult {
  isComplete: boolean
  score: number
  message: string
}

export class CircuitSimulator {
  private gameState: GameState | null = null

  loadLevel(level: Level): void {
    const gameComponents = createGameComponentsFromLevel(
      level.circuit_definition.source,
      level.circuit_definition.targets,
      level.circuit_definition.available_components
    )

    this.gameState = {
      level,
      source: gameComponents.source,
      targets: gameComponents.targets,
      availableComponents: gameComponents.availableComponents,
      placedComponents: [],
      supercapacitor: gameComponents.supercapacitor,
      energyCalculator: new EnergyCalculator(
        gameComponents.source,
        gameComponents.targets,
        gameComponents.supercapacitor
      )
    }
  }

  getGameState(): GameState | null {
    return this.gameState
  }

  placeComponent(componentId: string, position: { x: number; y: number }, rotation: number = 0): boolean {
    if (!this.gameState) return false

    console.log(`🔧 SIMULATOR: placeComponent вызван с componentId="${componentId}", position=`, position, `rotation=${rotation}`)

    const component = this.gameState.availableComponents.find(c => c.id === componentId)
    console.log(`🔧 SIMULATOR: Найден компонент в availableComponents:`, component ? `YES (id=${component.id})` : `NO`)
    
    if (!component) {
      console.log(`❌ SIMULATOR: Компонент ${componentId} не найден в availableComponents`)
      console.log(`🔧 SIMULATOR: Доступные компоненты:`, this.gameState.availableComponents.map(c => c.id))
      return false
    }

    // Remove from available components
    this.gameState.availableComponents = this.gameState.availableComponents.filter(c => c.id !== componentId)
    
    // Set position and rotation, then add to placed components
    component.setPosition(position)
    component.setRotation(rotation)
    this.gameState.placedComponents.push(component)
    
    console.log(`✅ SIMULATOR: Компонент ${componentId} размещен. Placed components теперь:`, this.gameState.placedComponents.map(c => c.id))
    
    // Add to energy calculator
    this.gameState.energyCalculator.addComponent(component)

    return true
  }

  removeComponent(componentId: string): boolean {
    if (!this.gameState) return false

    const componentIndex = this.gameState.placedComponents.findIndex(c => c.id === componentId)
    if (componentIndex === -1) return false

    const component = this.gameState.placedComponents[componentIndex]
    
    // Remove all connections to this component
    this.removeAllConnectionsTo(componentId)
    
    // Remove from placed components
    this.gameState.placedComponents.splice(componentIndex, 1)
    
    // Add back to available components
    this.gameState.availableComponents.push(component)

    return true
  }

  connectComponents(fromId: string, toId: string): boolean {
    if (!this.gameState) return false

    console.log(`🔌 CIRCUIT: connectComponents вызван: ${fromId} -> ${toId}`)

    const fromComponent = this.findComponent(fromId)
    const toComponent = this.findComponent(toId)

    console.log(`🔌 CIRCUIT: fromComponent (${fromId}):`, fromComponent ? `FOUND (id=${fromComponent.id})` : 'NOT FOUND')
    console.log(`🔌 CIRCUIT: toComponent (${toId}):`, toComponent ? `FOUND (id=${toComponent.id})` : 'NOT FOUND')

    if (!fromComponent || !toComponent) {
      console.warn(`❌ CIRCUIT: Не найден компонент для соединения ${fromId} -> ${toId}`)
      console.warn(`🔍 CIRCUIT: Available components:`)
      console.warn(`  - SOURCE: ${this.gameState.source?.id || 'none'}`)
      console.warn(`  - TARGETS: [${this.gameState.targets?.map(t => t.id).join(', ') || 'none'}]`)
      console.warn(`  - PLACED: [${this.gameState.placedComponents?.map(p => p.id).join(', ') || 'none'}]`)
      return false
    }
    if (fromId === toId) {
      console.warn(`❌ CIRCUIT: Попытка соединить компонент сам с собой: ${fromId}`)
      return false
    }

    // Add connection to energy calculator
    this.gameState.energyCalculator.addConnection(fromId, toId)
    console.log(`✅ CIRCUIT: Соединение успешно добавлено в EnergyCalculator: ${fromId} -> ${toId}`)

    return true
  }

  disconnectComponents(fromId: string, toId: string): boolean {
    if (!this.gameState) return false

    this.gameState.energyCalculator.removeConnection(fromId, toId)
    return true
  }

  simulate(): SimulationResult {
    if (!this.gameState) {
      return {
        isValid: false,
        isComplete: false,
        targetsLit: [],
        totalEnergyUsed: 0,
        energyDistribution: {},
        finalScore: 0,
        score: 0,
        errors: ['No level loaded'],
        message: 'No level loaded'
      }
    }

    const result = this.gameState.energyCalculator.simulate()
    
    const isComplete = result.targetsLit.length === this.gameState.targets.length
    const score = result.finalScore
    
    let message = ''
    if (isComplete) {
      message = `Level completed! Score: ${score.toFixed(1)} EU`
    } else if (result.targetsLit.length === 0) {
      message = 'No targets are lit. Check your circuit connections.'
    } else {
      message = `${result.targetsLit.length}/${this.gameState.targets.length} targets lit. Keep going!`
    }

    return {
      ...result,
      isComplete,
      score,
      message
    }
  }

  loadOptimalSolution(): boolean {
    if (!this.gameState) return false

    const optimalSolution = this.gameState.level.solution_data.optimal_solution
    
    // Clear current placement
    this.clearAll()
    
    // Place components used in optimal solution
    for (const componentId of optimalSolution.components_used) {
      const component = this.gameState.availableComponents.find(c => c.id === componentId)
      if (component) {
        // Place at a default position - in a real game, this would use the solution's positions
        this.placeComponent(componentId, { x: 100, y: 100 })
      }
    }
    
    // Create connections from optimal solution
    for (const connection of optimalSolution.connections) {
      this.connectComponents(connection.from, connection.to)
    }
    
    return true
  }

  clearAll(): void {
    if (!this.gameState) return

    // Move all placed components back to available
    this.gameState.availableComponents.push(...this.gameState.placedComponents)
    this.gameState.placedComponents = []
    
    // Reset energy calculator
    this.gameState.energyCalculator = new EnergyCalculator(
      this.gameState.source,
      this.gameState.targets,
      this.gameState.supercapacitor
    )
  }

  private findComponent(componentId: string): GameComponent | undefined {
    if (!this.gameState) return undefined

    // Check source
    if (this.gameState.source.id === componentId) {
      return this.gameState.source
    }
    
    // Check targets
    const target = this.gameState.targets.find(t => t.id === componentId)
    if (target) return target
    
    // Check supercapacitor
    if (this.gameState.supercapacitor.id === componentId) {
      return this.gameState.supercapacitor
    }
    
    // Check placed components
    return this.gameState.placedComponents.find(c => c.id === componentId)
  }

  private removeAllConnectionsTo(componentId: string): void {
    if (!this.gameState) return

    // Get all connections and remove those involving this component
    const connections = this.gameState.energyCalculator.getConnections()
    
    for (const [fromId, toIds] of connections) {
      if (fromId === componentId) {
        // Remove all outgoing connections
        for (const toId of [...toIds]) {
          this.gameState.energyCalculator.removeConnection(fromId, toId)
        }
      } else {
        // Remove incoming connections
        if (toIds.includes(componentId)) {
          this.gameState.energyCalculator.removeConnection(fromId, componentId)
        }
      }
    }
  }

  getLevelInfo(): { title: string; difficulty: number; archetype: string } | null {
    if (!this.gameState) return null

    const level = this.gameState.level
    return {
      title: `Level ${level.metadata.level_id.substring(0, 8)}`,
      difficulty: level.metadata.difficulty,
      archetype: level.metadata.primary_archetype
    }
  }

  getAvailableComponents(): GameComponent[] {
    return this.gameState?.availableComponents || []
  }

  getPlacedComponents(): GameComponent[] {
    return this.gameState?.placedComponents || []
  }

  getTargets(): GameLED[] {
    return this.gameState?.targets || []
  }

  getSource(): GameVoltageSource | null {
    return this.gameState?.source || null
  }

  getSupercapacitor(): GameSupercapacitor | null {
    return this.gameState?.supercapacitor || null
  }
}