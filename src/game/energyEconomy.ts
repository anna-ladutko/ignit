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
    console.log(`🔗 ENERGY: addConnection вызвана: ${fromId} -> ${toId}`)
    
    // Create bidirectional connections in the Map
    // Add fromId -> toId
    if (!this.connections.has(fromId)) {
      this.connections.set(fromId, [])
      console.log(`🆕 ENERGY: Создана новая запись в connections для ${fromId}`)
    }
    
    const fromConnections = this.connections.get(fromId)!
    if (!fromConnections.includes(toId)) {
      fromConnections.push(toId)
      console.log(`➕ ENERGY: Добавлен connection: ${fromId} -> ${toId}`)
    } else {
      console.log(`⚠️ ENERGY: Connection ${fromId} -> ${toId} уже существует`)
    }

    // Add toId -> fromId (bidirectional)
    if (!this.connections.has(toId)) {
      this.connections.set(toId, [])
      console.log(`🆕 ENERGY: Создана новая запись в connections для ${toId}`)
    }
    
    const toConnections = this.connections.get(toId)!
    if (!toConnections.includes(fromId)) {
      toConnections.push(fromId)
      console.log(`➕ ENERGY: Добавлен bidirectional connection: ${toId} -> ${fromId}`)
    } else {
      console.log(`⚠️ ENERGY: Bidirectional connection ${toId} -> ${fromId} уже существует`)
    }

    // Update component connections
    const fromComponent = this.components.get(fromId)
    const toComponent = this.components.get(toId)
    
    console.log(`🧩 ENERGY: fromComponent (${fromId}):`, fromComponent ? `${fromComponent.type} НАЙДЕН` : 'НЕ НАЙДЕН')
    console.log(`🧩 ENERGY: toComponent (${toId}):`, toComponent ? `${toComponent.type} НАЙДЕН` : 'НЕ НАЙДЕН')
    
    if (fromComponent && toComponent) {
      fromComponent.connect(toId)
      toComponent.connect(fromId)
      console.log(`✅ ENERGY: Bidirectional component connection установлен между ${fromId} и ${toId}`)
    } else {
      console.log(`❌ ENERGY: НЕ удалось установить bidirectional component connection`)
    }
    
    // Debug: показать текущее состояние connections Map для обеих сторон
    console.log(`📋 ENERGY: Connections для ${fromId}: [${this.connections.get(fromId)?.join(', ')}]`)
    console.log(`📋 ENERGY: Connections для ${toId}: [${this.connections.get(toId)?.join(', ')}]`)
  }

  removeConnection(fromId: string, toId: string): void {
    // Remove fromId -> toId
    const fromConnections = this.connections.get(fromId)
    if (fromConnections) {
      const index = fromConnections.indexOf(toId)
      if (index > -1) {
        fromConnections.splice(index, 1)
        console.log(`➖ ENERGY: Удален connection: ${fromId} -> ${toId}`)
      }
    }

    // Remove toId -> fromId (bidirectional)
    const toConnections = this.connections.get(toId)
    if (toConnections) {
      const index = toConnections.indexOf(fromId)
      if (index > -1) {
        toConnections.splice(index, 1)
        console.log(`➖ ENERGY: Удален bidirectional connection: ${toId} -> ${fromId}`)
      }
    }

    // Update component connections
    const fromComponent = this.components.get(fromId)
    const toComponent = this.components.get(toId)
    
    if (fromComponent && toComponent) {
      fromComponent.disconnect(toId)
      toComponent.disconnect(fromId)
      console.log(`✅ ENERGY: Bidirectional component disconnection между ${fromId} и ${toId}`)
    }
  }

  simulate(): EnergyFlowResult {
    const errors: string[] = []
    const energyDistribution: Record<string, number> = {}
    const targetsLit: string[] = []
    
    console.log(`🔋 ENERGY: simulate() начинается`)
    console.log(`🔋 ENERGY: Доступно компонентов в Map:`, this.components.size)
    console.log(`🔋 ENERGY: Доступно connections:`, this.connections.size)
    
    // Debug: показать содержимое connections Map
    console.log(`🔋 ENERGY: Содержимое connections Map:`)
    for (const [fromId, toIds] of this.connections) {
      console.log(`  ${fromId} -> [${toIds.join(', ')}]`)
    }
    
    // Debug: показать содержимое components Map
    console.log(`🔋 ENERGY: Содержимое components Map:`)
    for (const [id, component] of this.components) {
      console.log(`  ${id} -> ${component.type} (${component.constructor.name})`)
    }
    
    try {
      // Reset all components
      this.resetSimulation()
      
      // Find all paths from source to targets
      const pathsToTargets = this.findPathsToTargets()
      console.log(`🔋 ENERGY: Найдено путей к целям:`, pathsToTargets.length)
      pathsToTargets.forEach((path, index) => {
        console.log(`  Путь ${index + 1}: ${path.join(' -> ')}`)
      })
      
      if (pathsToTargets.length === 0) {
        errors.push('No valid paths found from source to any target')
        return this.createErrorResult(errors)
      }

      // НОВАЯ ЛОГИКА: Распределение энергии согласно Product Owner спецификации
      // Шаг 1: Рассчитать сопротивления путей и распределить энергию источника
      const pathResistances = this.calculatePathResistances(pathsToTargets)
      const energyDistributionByPath = this.distributeSourceEnergy(pathsToTargets, pathResistances)
      
      console.log('🔋 ENERGY DISTRIBUTION: Распределение энергии по путям:', energyDistributionByPath)
      
      // Шаг 2: Обработать каждый путь с выделенной ему энергией
      let totalEnergyUsed = 0
      
      for (let i = 0; i < pathsToTargets.length; i++) {
        const path = pathsToTargets[i]
        const pathEnergyBudget = energyDistributionByPath[i]
        
        const pathResult = this.calculatePathEnergyWithBudget(path, pathEnergyBudget)
        totalEnergyUsed += pathResult.energyUsed
        
        const targetId = path[path.length - 1]
        const target = this.components.get(targetId) as GameLED
        
        if (target && pathResult.energyDelivered > 0) {
          target.setEnergy(pathResult.energyDelivered)
          energyDistribution[targetId] = pathResult.energyDelivered
          
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

      // НОВАЯ ЛОГИКА: Строгие sweet spot правила от Product Owner
      // Efficiency (%) = (Total Useful Energy / Source Energy Output) * 100
      // Total Useful Energy = только энергия в sweet spot диапазонах + Energy in Supercapacitor
      
      const sourceEnergyOutput = this.source.getAvailableEnergy()
      let totalUsefulEnergy = 0
      
      console.log(`🎯 SWEET SPOT CHECK: Проверка энергии в sweet spot диапазонах...`)
      
      // Проверяем каждую цель на соответствие sweet spot
      for (const targetId of Object.keys(energyDistribution)) {
        const deliveredEnergy = energyDistribution[targetId]
        const target = this.components.get(targetId) as GameLED
        
        if (target && target.energyRange) {
          const [minEnergy, maxEnergy] = target.energyRange
          const isInSweetSpot = deliveredEnergy >= minEnergy && deliveredEnergy <= maxEnergy
          
          if (isInSweetSpot) {
            totalUsefulEnergy += deliveredEnergy
            console.log(`🎯 SWEET SPOT: ${targetId} получил ${deliveredEnergy.toFixed(1)} EU в диапазоне [${minEnergy}-${maxEnergy}] ✅ ПОЛЕЗНО`)
          } else {
            console.log(`🎯 SWEET SPOT: ${targetId} получил ${deliveredEnergy.toFixed(1)} EU вне диапазона [${minEnergy}-${maxEnergy}] ❌ HEAT LOSS`)
          }
        }
      }
      
      // Энергия в суперконденсаторе всегда полезна
      const supercapacitorEnergy = this.supercapacitor.getScore()
      totalUsefulEnergy += supercapacitorEnergy
      
      const finalScore = sourceEnergyOutput > 0 ? (totalUsefulEnergy / sourceEnergyOutput) * 100 : 0
      
      console.log(`🎯 EFFICIENCY CALC: Полезная энергия в sweet spots: ${totalUsefulEnergy - supercapacitorEnergy} EU`)
      console.log(`🎯 EFFICIENCY CALC: Энергия в суперконденсаторе: ${supercapacitorEnergy} EU`)
      console.log(`🎯 EFFICIENCY CALC: Общая полезная энергия: ${totalUsefulEnergy} EU`)
      console.log(`🎯 EFFICIENCY CALC: Энергия источника: ${sourceEnergyOutput} EU`)
      console.log(`🎯 EFFICIENCY CALC: Efficiency: ${finalScore.toFixed(1)}%`)
      
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
    console.log(`🛤️ PATH: Ищем путь от ${fromId} к ${targetId}, visited: [${Array.from(visited).join(', ')}]`)
    
    if (fromId === targetId) {
      console.log(`🎯 PATH: Достигли цели ${targetId}`)
      return [targetId]
    }
    
    if (visited.has(fromId)) {
      console.log(`🔄 PATH: ${fromId} уже посещен, возвращаем пустой путь`)
      return []
    }
    
    visited.add(fromId)
    
    const connections = this.connections.get(fromId) || []
    console.log(`🔗 PATH: От ${fromId} доступны соединения: [${connections.join(', ')}]`)
    
    for (const nextId of connections) {
      const component = this.components.get(nextId)
      console.log(`🧩 PATH: Проверяем компонент ${nextId}: ${component ? `${component.type} (${component.constructor.name})` : 'НЕ НАЙДЕН'}`)
      
      // Check if component conducts (for switches)
      if (component?.type === ComponentType.SWITCH) {
        const switchComp = component as GameSwitch
        if (!switchComp.conducts()) {
          console.log(`🚫 PATH: Switch ${nextId} не проводит, пропускаем`)
          continue
        }
      }
      
      const path = this.findPathToTarget(nextId, targetId, new Set(visited))
      if (path.length > 0) {
        console.log(`✅ PATH: Найден путь через ${nextId}: [${fromId}, ...${path.join(' -> ')}]`)
        return [fromId, ...path]
      }
    }
    
    console.log(`❌ PATH: Из ${fromId} пути к ${targetId} не найдено`)
    return []
  }

  // НОВЫЕ МЕТОДЫ для корректного распределения энергии
  private calculatePathResistances(paths: string[][]): number[] {
    console.log('⚡ RESISTANCE CALC: Расчет сопротивлений путей...')
    
    return paths.map((path, index) => {
      let totalResistance = 0
      
      // Суммируем сопротивления всех компонентов в пути (кроме источника и цели)
      for (let i = 1; i < path.length - 1; i++) {
        const componentId = path[i]
        const component = this.components.get(componentId)
        
        if (component?.type === ComponentType.RESISTOR) {
          const resistor = component as GameResistor
          totalResistance += resistor.actualValue
          console.log(`⚡ RESISTANCE CALC: ${componentId}: ${resistor.actualValue}Ω`)
        }
      }
      
      console.log(`⚡ RESISTANCE CALC: Путь ${index + 1} [${path.join(' -> ')}]: ${totalResistance}Ω`)
      return totalResistance
    })
  }
  
  private distributeSourceEnergy(paths: string[][], resistances: number[]): number[] {
    const sourceEnergy = this.source.getAvailableEnergy()
    console.log(`⚡ ENERGY SPLIT: Распределение ${sourceEnergy} EU между ${paths.length} путями`)
    
    // Энергия распределяется обратно пропорционально сопротивлению
    // E1/E2 = R2/R1 (меньшее сопротивление получает больше энергии)
    
    // Рассчитываем коэффициенты (обратные сопротивлениям)
    const conductances = resistances.map(r => r > 0 ? 1/r : 1) // избегаем деления на 0
    const totalConductance = conductances.reduce((sum, c) => sum + c, 0)
    
    // Распределяем энергию пропорционально проводимостям
    const energyDistribution = conductances.map(conductance => {
      const energyShare = (conductance / totalConductance) * sourceEnergy
      return energyShare
    })
    
    console.log('⚡ ENERGY SPLIT: Сопротивления:', resistances)
    console.log('⚡ ENERGY SPLIT: Проводимости:', conductances)
    console.log('⚡ ENERGY SPLIT: Распределение энергии:', energyDistribution)
    
    return energyDistribution
  }
  
  private calculatePathEnergyWithBudget(path: string[], energyBudget: number): { energyUsed: number; energyDelivered: number } {
    console.log(`💰 PATH ENERGY: Расчет для пути [${path.join(' -> ')}] с бюджетом ${energyBudget.toFixed(1)} EU`)
    
    if (path.length < 2) {
      console.log(`💰 PATH ENERGY: Путь слишком короткий`)
      return { energyUsed: 0, energyDelivered: 0 }
    }

    let energyFlow = energyBudget
    let totalLoss = 0

    // Рассчитываем потери через каждый компонент в пути
    for (let i = 1; i < path.length - 1; i++) {
      const componentId = path[i]
      const component = this.components.get(componentId)
      
      if (!component) {
        console.log(`💰 PATH ENERGY: Компонент ${componentId} не найден`)
        continue
      }

      const loss = this.calculateComponentLoss(component, energyFlow)
      console.log(`💰 PATH ENERGY: Потери через ${componentId}: ${loss.toFixed(1)} EU`)
      totalLoss += loss
      energyFlow -= loss
      console.log(`💰 PATH ENERGY: Остаток после ${componentId}: ${energyFlow.toFixed(1)} EU`)
    }

    const energyDelivered = Math.max(0, energyFlow)
    const energyUsed = totalLoss
    
    console.log(`💰 PATH ENERGY: Итого - потеряно: ${energyUsed.toFixed(1)} EU, доставлено: ${energyDelivered.toFixed(1)} EU`)
    return { energyUsed, energyDelivered }
  }

  // УСТАРЕВШИЙ МЕТОД - заменен на calculatePathEnergyWithBudget
  private calculatePathEnergy(path: string[]): { energyUsed: number; energyDelivered: number } {
    console.log(`💰 ENERGY CALC: calculatePathEnergy для пути: [${path.join(' -> ')}]`)
    
    if (path.length < 2) {
      console.log(`💰 ENERGY CALC: Путь слишком короткий, возвращаем 0`)
      return { energyUsed: 0, energyDelivered: 0 }
    }

    const sourceEnergy = this.source.getAvailableEnergy()
    console.log(`💰 ENERGY CALC: Начальная энергия источника: ${sourceEnergy} EU`)
    
    // ИСПРАВЛЕНИЕ: Каждый путь получает полную энергию от источника (параллельные цепи)
    // В параллельных цепях каждая ветвь имеет доступ к полному напряжению источника
    let energyFlow = sourceEnergy
    console.log(`💰 ENERGY CALC: Энергия для данного пути: ${energyFlow} EU (полная от источника)`)
    
    let totalLoss = 0

    // Calculate losses through each component in the path
    console.log(`💰 ENERGY CALC: Расчет потерь через компоненты...`)
    for (let i = 1; i < path.length - 1; i++) {
      const componentId = path[i]
      const component = this.components.get(componentId)
      
      if (!component) {
        console.log(`💰 ENERGY CALC: Компонент ${componentId} не найден, пропускаем`)
        continue
      }

      const loss = this.calculateComponentLoss(component, energyFlow)
      console.log(`💰 ENERGY CALC: Потери через ${componentId} (${component.type}): ${loss} EU`)
      totalLoss += loss
      energyFlow -= loss
      console.log(`💰 ENERGY CALC: Остаток энергии после ${componentId}: ${energyFlow} EU`)
    }

    const energyDelivered = Math.max(0, energyFlow)
    const energyUsed = totalLoss // Используется только то, что потеряно в компонентах
    
    console.log(`💰 ENERGY CALC: Итого - потеряно в компонентах: ${energyUsed} EU, доставлено: ${energyDelivered} EU`)
    return { energyUsed, energyDelivered }
  }

  private calculateComponentLoss(component: GameComponent, energyIn: number): number {
    switch (component.type) {
      case ComponentType.RESISTOR:
        const resistor = component as GameResistor
        // Game-balanced percentage-based losses instead of I²R formula
        // Higher resistance = higher percentage loss
        const resistance = resistor.actualValue
        let lossPercentage = 0
        
        if (resistance <= 100) {
          lossPercentage = 0.05 // 5% loss for low resistance
        } else if (resistance <= 300) {
          lossPercentage = 0.10 // 10% loss for medium-low resistance  
        } else if (resistance <= 500) {
          lossPercentage = 0.20 // 20% loss for medium resistance
        } else if (resistance <= 700) {
          lossPercentage = 0.30 // 30% loss for medium-high resistance
        } else {
          lossPercentage = 0.40 // 40% loss for high resistance
        }
        
        const loss = energyIn * lossPercentage
        console.log(`⚡ RESISTOR: ${resistor.id} (${resistance}Ω) → ${(lossPercentage*100).toFixed(0)}% loss = ${loss.toFixed(1)} EU from ${energyIn.toFixed(1)} EU`)
        return loss

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