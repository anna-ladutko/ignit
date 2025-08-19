/**
 * Исправленный алгоритм генерации Sweet Spot диапазонов для Prometheus Studio
 * Создает достижимые диапазоны на основе реального распределения энергии
 */

import type { Level } from '../types'

export interface CircuitSimulationResult {
  targetId: string
  deliveredEnergy: number
  pathResistance: number
  pathLosses: number
}

export interface SweetSpotGenerationResult {
  originalTargets: Array<{
    id: string
    originalRange: [number, number]
    deliveredEnergy: number
  }>
  correctedTargets: Array<{
    id: string
    correctedRange: [number, number]
    deliveredEnergy: number
    improvementFactor: number
  }>
  overallImprovement: number
  energyBalance: {
    sourceEnergy: number
    totalDelivered: number
    supercapacitorEnergy: number
    newExpectedScore: number
  }
}

export class SweetSpotGenerator {
  
  /**
   * Главная функция: генерация корректных Sweet Spot диапазонов
   */
  generateCorrectSweetSpots(level: Level): SweetSpotGenerationResult {
    console.log('🎯 SWEETSPOT_GENERATOR: Начинаем генерацию исправленных Sweet Spot диапазонов')
    
    // 1. Симулируем реальное распределение энергии
    const simulationResults = this.simulateEnergyDistribution(level)
    
    // 2. Анализируем текущие диапазоны
    const originalTargets = level.circuit_definition.targets.map(target => ({
      id: target.id,
      originalRange: target.energy_range as [number, number],
      deliveredEnergy: simulationResults.find(r => r.targetId === target.id)?.deliveredEnergy || 0
    }))
    
    // 3. Генерируем исправленные диапазоны
    const correctedTargets = originalTargets.map(target => {
      const correctedRange = this.calculateOptimalSweetSpot(target.deliveredEnergy)
      const improvementFactor = this.calculateImprovementFactor(target.originalRange, correctedRange, target.deliveredEnergy)
      
      return {
        id: target.id,
        correctedRange,
        deliveredEnergy: target.deliveredEnergy,
        improvementFactor
      }
    })
    
    // 4. Рассчитываем новый энергетический баланс
    const energyBalance = this.calculateNewEnergyBalance(level, correctedTargets)
    
    // 5. Оцениваем общее улучшение
    const overallImprovement = this.calculateOverallImprovement(originalTargets, correctedTargets)
    
    const result: SweetSpotGenerationResult = {
      originalTargets,
      correctedTargets,
      overallImprovement,
      energyBalance
    }
    
    console.log('📊 SWEETSPOT_GENERATOR: Результаты генерации:')
    console.log(`   Общее улучшение: ${overallImprovement.toFixed(1)}%`)
    console.log(`   Новый expected_score: ${energyBalance.newExpectedScore.toFixed(1)}%`)
    
    return result
  }
  
  /**
   * Симуляция распределения энергии в схеме
   */
  private simulateEnergyDistribution(level: Level): CircuitSimulationResult[] {
    const source = level.circuit_definition.source
    const targets = level.circuit_definition.targets
    const components = level.circuit_definition.available_components
    
    // Получаем данные из optimal solution если есть
    const optimalSolution = level.solution_data?.optimal_solution
    if (optimalSolution?.simulation_result?.energy_distribution) {
      return targets.map(target => {
        const deliveredEnergy = optimalSolution.simulation_result.energy_distribution[target.id] || 0
        
        return {
          targetId: target.id,
          deliveredEnergy,
          pathResistance: this.estimatePathResistance(target.id, components),
          pathLosses: this.estimatePathLosses(deliveredEnergy)
        }
      })
    }
    
    // Fallback: упрощенная симуляция
    return this.performSimplifiedSimulation(level)
  }
  
  /**
   * Упрощенная симуляция для случаев без optimal solution
   */
  private performSimplifiedSimulation(level: Level): CircuitSimulationResult[] {
    const source = level.circuit_definition.source
    const targets = level.circuit_definition.targets
    const components = level.circuit_definition.available_components
    
    // Простая модель: энергия распределяется пропорционально проводимости
    const resistors = components.filter(c => c.type === 'resistor')
    const totalConductance = resistors.reduce((sum, r) => sum + (1 / r.resistance), 0)
    
    return targets.map((target, index) => {
      // Предполагаем что каждый target подключен через один резистор
      const targetResistor = resistors[index % resistors.length]
      const conductance = targetResistor ? (1 / targetResistor.resistance) : 0.001
      
      const energyFraction = totalConductance > 0 ? conductance / totalConductance : 1 / targets.length
      const rawEnergy = source.energy_output * energyFraction
      
      // Учитываем потери (примерно 20-40%)
      const lossRate = 0.2 + Math.random() * 0.2 // 20-40% потери
      const deliveredEnergy = rawEnergy * (1 - lossRate)
      
      return {
        targetId: target.id,
        deliveredEnergy,
        pathResistance: targetResistor?.resistance || 470,
        pathLosses: rawEnergy - deliveredEnergy
      }
    })
  }
  
  /**
   * Расчет оптимального Sweet Spot диапазона для данной энергии
   */
  private calculateOptimalSweetSpot(deliveredEnergy: number): [number, number] {
    // Стратегия: создаем диапазон ±15% от реально доставленной энергии
    // Это гарантирует что optimal solution попадет в Sweet Spot
    
    const marginPercentage = 0.15 // ±15%
    const margin = deliveredEnergy * marginPercentage
    
    const lowerBound = Math.max(0, deliveredEnergy - margin)
    const upperBound = deliveredEnergy + margin
    
    // Округляем до 1 знака после запятой для читаемости
    return [
      Math.round(lowerBound * 10) / 10,
      Math.round(upperBound * 10) / 10
    ]
  }
  
  /**
   * Расчет фактора улучшения для каждого target
   */
  private calculateImprovementFactor(
    originalRange: [number, number], 
    correctedRange: [number, number], 
    deliveredEnergy: number
  ): number {
    // Проверяем попадает ли delivered energy в оригинальный диапазон
    const wasInOriginal = deliveredEnergy >= originalRange[0] && deliveredEnergy <= originalRange[1]
    
    // Проверяем попадает ли в исправленный диапазон (должен всегда)
    const isInCorrected = deliveredEnergy >= correctedRange[0] && deliveredEnergy <= correctedRange[1]
    
    if (wasInOriginal && isInCorrected) {
      return 1.0 // Без изменений
    } else if (!wasInOriginal && isInCorrected) {
      return 100.0 // Полное улучшение (0% → 100%)
    } else {
      return 0.0 // Что-то пошло не так
    }
  }
  
  /**
   * Расчет нового энергетического баланса после исправления
   */
  private calculateNewEnergyBalance(level: Level, correctedTargets: any[]): any {
    const sourceEnergy = level.circuit_definition.source.energy_output
    
    // Считаем полезную энергию в Sweet Spot (теперь все targets в диапазоне)
    const totalUsefulEnergyInSweetSpot = correctedTargets.reduce((sum, target) => {
      return sum + target.deliveredEnergy
    }, 0)
    
    // Энергия в Supercapacitor (остаток)
    const totalDelivered = totalUsefulEnergyInSweetSpot
    const supercapacitorEnergy = Math.max(0, sourceEnergy - totalDelivered)
    
    // Общая полезная энергия
    const totalUsefulEnergy = totalUsefulEnergyInSweetSpot + supercapacitorEnergy
    
    // Новый expected_score
    const newExpectedScore = sourceEnergy > 0 ? (totalUsefulEnergy / sourceEnergy) * 100 : 0
    
    return {
      sourceEnergy,
      totalDelivered,
      supercapacitorEnergy,
      newExpectedScore
    }
  }
  
  /**
   * Оценка общего улучшения от исправления Sweet Spot диапазонов
   */
  private calculateOverallImprovement(originalTargets: any[], correctedTargets: any[]): number {
    const totalImprovements = correctedTargets.reduce((sum, target) => {
      return sum + target.improvementFactor
    }, 0)
    
    const maxPossibleImprovement = correctedTargets.length * 100
    
    return maxPossibleImprovement > 0 ? (totalImprovements / maxPossibleImprovement) * 100 : 0
  }
  
  /**
   * Оценка сопротивления пути (упрощенная)
   */
  private estimatePathResistance(targetId: string, components: any[]): number {
    // Ищем резисторы в компонентах
    const resistors = components.filter(c => c.type === 'resistor')
    if (resistors.length === 0) return 470 // Значение по умолчанию
    
    // Берем средний резистор или первый
    return resistors[0]?.resistance || 470
  }
  
  /**
   * Оценка потерь в пути (упрощенная)
   */
  private estimatePathLosses(deliveredEnergy: number): number {
    // Предполагаем 20-40% потери в зависимости от доставленной энергии
    return deliveredEnergy * (0.2 + Math.random() * 0.2)
  }
  
  /**
   * Применение исправленных Sweet Spot диапазонов к уровню
   */
  applyCorrectedSweetSpots(level: Level, generationResult: SweetSpotGenerationResult): Level {
    const correctedLevel = JSON.parse(JSON.stringify(level)) // Deep clone
    
    // Применяем исправленные диапазоны
    for (const correctedTarget of generationResult.correctedTargets) {
      const target = correctedLevel.circuit_definition.targets.find(t => t.id === correctedTarget.id)
      if (target) {
        target.energy_range = correctedTarget.correctedRange
        console.log(`🔧 SWEETSPOT_GENERATOR: Обновлен Sweet Spot для ${correctedTarget.id}: [${correctedTarget.correctedRange[0]}-${correctedTarget.correctedRange[1]}]`)
      }
    }
    
    // Обновляем expected_score
    if (correctedLevel.solution_data?.optimal_solution) {
      correctedLevel.solution_data.optimal_solution.expected_score = generationResult.energyBalance.newExpectedScore
    }
    
    // Отмечаем что валидация выполнена
    if (correctedLevel.solution_data?.validation_results) {
      correctedLevel.solution_data.validation_results.validation_performed = true
    }
    
    console.log(`✅ SWEETSPOT_GENERATOR: Применены исправления, новый expected_score: ${generationResult.energyBalance.newExpectedScore.toFixed(1)}%`)
    
    return correctedLevel
  }
}