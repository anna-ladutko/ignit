import {
  GameComponent,
  GameVoltageSource,
  GameLED,
  GameResistor,
  GameSwitch,
  GameSupercapacitor
} from './components'
import { ComponentType } from '../types'

export interface EnergyFlowResult {
  isValid: boolean
  targetsLit: string[]
  totalEnergyUsed: number
  energyDistribution: Record<string, number>
  finalScore: number
  errors: string[]
}

export interface CircuitNode {
  id: string
  component: GameComponent
  voltage: number
  current: number
  energyIn: number
  energyOut: number
}

export class EnergyCalculator {
  private components: Map<string, GameComponent>
  private connections: Map<string, string[]>
  private source: GameVoltageSource
  private targets: GameLED[]
  private supercapacitor: GameSupercapacitor

  constructor(
    source: GameVoltageSource,
    targets: GameLED[],
    supercapacitor: GameSupercapacitor
  ) {
    this.source = source
    this.targets = targets
    this.supercapacitor = supercapacitor
    this.components = new Map()
    this.connections = new Map()

    // Add source and targets to components map
    this.components.set(source.id, source)
    this.supercapacitor.reset()
    this.components.set(supercapacitor.id, supercapacitor)
    
    targets.forEach(target => {
      this.components.set(target.id, target)
    })
  }

  addComponent(component: GameComponent): void {
    this.components.set(component.id, component)
  }

  addConnection(fromId: string, toId: string): void {
    if (!this.connections.has(fromId)) {
      this.connections.set(fromId, [])
    }
    
    const connections = this.connections.get(fromId)!
    if (!connections.includes(toId)) {
      connections.push(toId)
    }

    // Update component connections
    const fromComponent = this.components.get(fromId)
    const toComponent = this.components.get(toId)
    
    if (fromComponent && toComponent) {
      fromComponent.connect(toId)
      toComponent.connect(fromId)
    }
  }

  removeConnection(fromId: string, toId: string): void {
    const connections = this.connections.get(fromId)
    if (connections) {
      const index = connections.indexOf(toId)
      if (index > -1) {
        connections.splice(index, 1)
      }
    }

    // Update component connections
    const fromComponent = this.components.get(fromId)
    const toComponent = this.components.get(toId)
    
    if (fromComponent && toComponent) {
      fromComponent.disconnect(toId)
      toComponent.disconnect(fromId)
    }
  }

  simulate(): EnergyFlowResult {
    const errors: string[] = []
    const energyDistribution: Record<string, number> = {}
    const targetsLit: string[] = []
    
    try {
      // Reset all components
      this.resetSimulation()
      
      // Find all paths from source to targets
      const pathsToTargets = this.findPathsToTargets()
      
      if (pathsToTargets.length === 0) {
        errors.push('No valid paths found from source to any target')
        return this.createErrorResult(errors)
      }

      // Calculate energy distribution for each path
      let totalEnergyUsed = 0
      
      for (const path of pathsToTargets) {
        const pathEnergy = this.calculatePathEnergy(path)
        totalEnergyUsed += pathEnergy.energyUsed
        
        const targetId = path[path.length - 1]
        const target = this.components.get(targetId) as GameLED
        
        if (target && pathEnergy.energyDelivered > 0) {
          target.setEnergy(pathEnergy.energyDelivered)
          energyDistribution[targetId] = pathEnergy.energyDelivered
          
          if (target.isLit()) {
            targetsLit.push(targetId)
          }
        }
      }

      // Calculate remaining energy goes to supercapacitor
      const remainingEnergy = this.source.getAvailableEnergy() - totalEnergyUsed
      if (remainingEnergy > 0) {
        this.supercapacitor.store(remainingEnergy)
      }

      const finalScore = this.supercapacitor.getScore()
      const isValid = targetsLit.length === this.targets.length

      return {
        isValid,
        targetsLit,
        totalEnergyUsed,
        energyDistribution,
        finalScore,
        errors
      }

    } catch (error) {
      errors.push(`Simulation error: ${error}`)
      return this.createErrorResult(errors)
    }
  }

  private resetSimulation(): void {
    this.supercapacitor.reset()
    this.targets.forEach(target => target.setEnergy(0))
  }

  private findPathsToTargets(): string[][] {
    const paths: string[][] = []
    
    for (const target of this.targets) {
      const path = this.findPathToTarget(this.source.id, target.id, new Set())
      if (path.length > 0) {
        paths.push(path)
      }
    }
    
    return paths
  }

  private findPathToTarget(fromId: string, targetId: string, visited: Set<string>): string[] {
    if (fromId === targetId) {
      return [targetId]
    }
    
    if (visited.has(fromId)) {
      return []
    }
    
    visited.add(fromId)
    
    const connections = this.connections.get(fromId) || []
    
    for (const nextId of connections) {
      const component = this.components.get(nextId)
      
      // Check if component conducts (for switches)
      if (component?.type === ComponentType.SWITCH) {
        const switchComp = component as GameSwitch
        if (!switchComp.conducts()) {
          continue
        }
      }
      
      const path = this.findPathToTarget(nextId, targetId, new Set(visited))
      if (path.length > 0) {
        return [fromId, ...path]
      }
    }
    
    return []
  }

  private calculatePathEnergy(path: string[]): { energyUsed: number; energyDelivered: number } {
    if (path.length < 2) {
      return { energyUsed: 0, energyDelivered: 0 }
    }

    let energyFlow = this.source.getAvailableEnergy()
    let totalLoss = 0

    // Calculate losses through each component in the path
    for (let i = 1; i < path.length - 1; i++) {
      const componentId = path[i]
      const component = this.components.get(componentId)
      
      if (!component) continue

      const loss = this.calculateComponentLoss(component, energyFlow)
      totalLoss += loss
      energyFlow -= loss
    }

    const energyDelivered = Math.max(0, energyFlow)
    const energyUsed = this.source.getAvailableEnergy() - energyDelivered

    return { energyUsed, energyDelivered }
  }

  private calculateComponentLoss(component: GameComponent, energyIn: number): number {
    switch (component.type) {
      case ComponentType.RESISTOR:
        const resistor = component as GameResistor
        // Simple loss calculation: higher resistance = more loss
        const current = energyIn / 10 // Simplified current calculation
        return resistor.calculateEnergyLoss(current)

      case ComponentType.CAPACITOR:
        // Capacitors have minimal loss in our simplified model
        return energyIn * 0.01

      case ComponentType.INDUCTOR:
        // Inductors have minimal loss in our simplified model
        return energyIn * 0.01

      case ComponentType.SWITCH:
        const switchComp = component as GameSwitch
        return switchComp.conducts() ? 0 : energyIn // All energy lost if switch is open

      default:
        return 0
    }
  }

  private createErrorResult(errors: string[]): EnergyFlowResult {
    return {
      isValid: false,
      targetsLit: [],
      totalEnergyUsed: 0,
      energyDistribution: {},
      finalScore: 0,
      errors
    }
  }

  getComponents(): Map<string, GameComponent> {
    return new Map(this.components)
  }

  getConnections(): Map<string, string[]> {
    return new Map(this.connections)
  }
}