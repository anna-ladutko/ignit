/**
 * PrometheusValidator
 * Валидатор для уровней сгенерированных Prometheus Studio
 * Выявляет проблемы в генерации и предлагает исправления
 */

import type { Level } from '../types'

export interface PrometheusValidationResult {
  isValid: boolean
  errors: string[]
  warnings: string[]
  suggestions: string[]
  energyAnalysis: EnergyAnalysis
}

export interface EnergyAnalysis {
  sourceEnergy: number
  totalMaxDemand: number
  energyBalance: number
  pathAnalysis: PathAnalysis[]
  sweetSpotIssues: SweetSpotIssue[]
}

export interface PathAnalysis {
  targetId: string
  deliveredEnergy: number
  sweetSpotRange: [number, number]
  isInSweetSpot: boolean
  resistance: number
  losses: number
}

export interface SweetSpotIssue {
  targetId: string
  deliveredEnergy: number
  sweetSpotRange: [number, number]
  suggestedRange: [number, number]
  severity: 'critical' | 'warning'
}

export class PrometheusValidator {
  /**
   * Полная валидация уровня сгенерированного Prometheus
   */
  validateLevel(level: Level): PrometheusValidationResult {
    console.log(`🔍 PROMETHEUS_VALIDATOR: Валидация уровня ${level.metadata.level_id}`)

    const result: PrometheusValidationResult = {
      isValid: true,
      errors: [],
      warnings: [],
      suggestions: [],
      energyAnalysis: this.analyzeEnergyDistribution(level)
    }

    // 1. Проверяем expected_score
    this.validateExpectedScore(level, result)

    // 2. Проверяем validation_performed
    this.validateValidationStatus(level, result)

    // 3. Анализируем Sweet Spot диапазоны
    this.validateSweetSpotRanges(level, result)

    // 4. Проверяем энергетический баланс
    this.validateEnergyBalance(level, result)

    // 5. Проверяем optimal solution
    this.validateOptimalSolution(level, result)

    result.isValid = result.errors.length === 0

    console.log(`📊 PROMETHEUS_VALIDATOR: Результат валидации - ${result.isValid ? 'PASSED' : 'FAILED'}`)
    console.log(`   Ошибки: ${result.errors.length}, Предупреждения: ${result.warnings.length}`)

    return result
  }

  /**
   * Анализ энергетического распределения в уровне
   */
  private analyzeEnergyDistribution(level: Level): EnergyAnalysis {
    const sourceEnergy = level.circuit_definition.source.energy_output
    const targets = level.circuit_definition.targets
    const components = level.circuit_definition.available_components

    // Рассчитываем максимальный спрос всех targets
    const totalMaxDemand = targets.reduce((sum, target) => {
      return sum + (target.energy_range ? target.energy_range[1] : 0)
    }, 0)

    // Анализируем пути для каждой цели
    const pathAnalysis: PathAnalysis[] = []
    const sweetSpotIssues: SweetSpotIssue[] = []

    // Получаем данные из optimal solution если есть
    const optimalSolution = level.solution_data?.optimal_solution
    if (optimalSolution?.energy_distribution) {
      for (const target of targets) {
        const deliveredEnergy = optimalSolution.energy_distribution[target.id] || 0
        const sweetSpotRange = target.energy_range as [number, number]
        const isInSweetSpot = deliveredEnergy >= sweetSpotRange[0] && deliveredEnergy <= sweetSpotRange[1]

        pathAnalysis.push({
          targetId: target.id,
          deliveredEnergy,
          sweetSpotRange,
          isInSweetSpot,
          resistance: this.calculatePathResistance(target.id, components, optimalSolution),
          losses: this.calculatePathLosses(deliveredEnergy)
        })

        // Если не в Sweet Spot, добавляем как проблему
        if (!isInSweetSpot) {
          sweetSpotIssues.push({
            targetId: target.id,
            deliveredEnergy,
            sweetSpotRange,
            suggestedRange: this.calculateCorrectSweetSpot(deliveredEnergy),
            severity: 'critical'
          })
        }
      }
    }

    return {
      sourceEnergy,
      totalMaxDemand,
      energyBalance: sourceEnergy - totalMaxDemand,
      pathAnalysis,
      sweetSpotIssues
    }
  }

  /**
   * Проверка expected_score
   */
  private validateExpectedScore(level: Level, result: PrometheusValidationResult): void {
    const expectedScore = level.solution_data?.optimal_solution?.expected_score

    if (expectedScore === undefined || expectedScore === null) {
      result.errors.push('Отсутствует expected_score в optimal_solution')
      return
    }

    // expected_score близко к нулю указывает на проблемы
    if (Math.abs(expectedScore) < 0.01) {
      result.errors.push(`expected_score слишком низкий: ${expectedScore} (близко к 0)`)
      result.suggestions.push('Prometheus генерирует недостижимые Sweet Spot диапазоны')
    }

    // expected_score больше 100 нарушает физику
    if (expectedScore > 100) {
      result.errors.push(`expected_score больше 100%: ${expectedScore}% (нарушение физики)`)
    }
  }

  /**
   * Проверка статуса валидации
   */
  private validateValidationStatus(level: Level, result: PrometheusValidationResult): void {
    const validationPerformed = level.solution_data?.validation_results?.validation_performed

    if (validationPerformed === false || validationPerformed === undefined) {
      result.warnings.push('validation_performed = false - Prometheus не проверил свое решение')
      result.suggestions.push('Включить валидацию в Prometheus Studio перед экспортом')
    }
  }

  /**
   * Валидация Sweet Spot диапазонов
   */
  private validateSweetSpotRanges(level: Level, result: PrometheusValidationResult): void {
    const { sweetSpotIssues } = result.energyAnalysis

    for (const issue of sweetSpotIssues) {
      result.errors.push(
        `Target ${issue.targetId}: энергия ${issue.deliveredEnergy.toFixed(1)} EU ВНЕ Sweet Spot [${issue.sweetSpotRange[0].toFixed(1)}-${issue.sweetSpotRange[1].toFixed(1)}]`
      )
      
      result.suggestions.push(
        `Исправить Sweet Spot для ${issue.targetId}: [${issue.suggestedRange[0].toFixed(1)}-${issue.suggestedRange[1].toFixed(1)}] EU`
      )
    }

    if (sweetSpotIssues.length === 0) {
      result.suggestions.push('✅ Все Sweet Spot диапазоны корректны')
    }
  }

  /**
   * Проверка энергетического баланса
   */
  private validateEnergyBalance(level: Level, result: PrometheusValidationResult): void {
    const { sourceEnergy, totalMaxDemand, energyBalance } = result.energyAnalysis

    // Предупреждение если спрос превышает источник
    if (totalMaxDemand > sourceEnergy) {
      result.warnings.push(
        `Общий максимальный спрос (${totalMaxDemand.toFixed(1)} EU) превышает источник (${sourceEnergy} EU)`
      )
      result.suggestions.push('Это может быть нормально для puzzle-дизайна, но проверьте достижимость')
    }

    // Ошибка если энергетический дисбаланс критичен
    if (energyBalance < -sourceEnergy * 0.5) {
      result.errors.push(
        `Критический энергетический дисбаланс: дефицит ${Math.abs(energyBalance).toFixed(1)} EU`
      )
    }
  }

  /**
   * Проверка optimal solution
   */
  private validateOptimalSolution(level: Level, result: PrometheusValidationResult): void {
    const optimalSolution = level.solution_data?.optimal_solution

    if (!optimalSolution) {
      result.errors.push('Отсутствует optimal_solution')
      return
    }

    // Проверяем что все используемые компоненты существуют
    const availableComponentIds = level.circuit_definition.available_components.map(c => c.id)
    const usedComponents = optimalSolution.components_used || []

    for (const componentId of usedComponents) {
      if (!availableComponentIds.includes(componentId)) {
        result.errors.push(`Optimal solution использует несуществующий компонент: ${componentId}`)
      }
    }

    // Проверяем что solution_result соответствует expected_score
    const simulationResult = optimalSolution.simulation_result
    if (simulationResult) {
      const targetsCount = level.circuit_definition.targets.length
      const satisfiedCount = Object.values(simulationResult.targets_satisfied).filter(Boolean).length

      if (satisfiedCount === 0 && optimalSolution.expected_score > 0.01) {
        result.warnings.push('Ни одна цель не удовлетворена, но expected_score > 0')
      }
    }
  }

  /**
   * Расчет правильного Sweet Spot диапазона
   */
  private calculateCorrectSweetSpot(deliveredEnergy: number): [number, number] {
    // Генерируем диапазон ±15% от реально доставленной энергии
    const margin = deliveredEnergy * 0.15
    return [
      Math.max(0, deliveredEnergy - margin),
      deliveredEnergy + margin
    ]
  }

  /**
   * Расчет сопротивления пути (упрощенный)
   */
  private calculatePathResistance(targetId: string, components: any[], optimalSolution: any): number {
    // Упрощенный расчет - ищем резисторы в пути к цели
    // В реальности нужен полный анализ соединений
    return 470 // Placeholder
  }

  /**
   * Расчет потерь в пути (упрощенный)
   */
  private calculatePathLosses(deliveredEnergy: number): number {
    // Упрощенный расчет потерь
    return deliveredEnergy * 0.2 // Предполагаем 20% потери
  }

  /**
   * Генерация исправленного уровня
   */
  generateCorrectedLevel(originalLevel: Level, validationResult: PrometheusValidationResult): Level {
    const correctedLevel = JSON.parse(JSON.stringify(originalLevel)) // Deep clone

    // Исправляем Sweet Spot диапазоны
    for (const issue of validationResult.energyAnalysis.sweetSpotIssues) {
      const target = correctedLevel.circuit_definition.targets.find(t => t.id === issue.targetId)
      if (target) {
        target.energy_range = issue.suggestedRange
        console.log(`🔧 PROMETHEUS_VALIDATOR: Исправлен Sweet Spot для ${issue.targetId}: [${issue.suggestedRange[0].toFixed(1)}-${issue.suggestedRange[1].toFixed(1)}]`)
      }
    }

    // Пересчитываем expected_score
    const newExpectedScore = this.calculateCorrectExpectedScore(correctedLevel, validationResult)
    if (correctedLevel.solution_data?.optimal_solution) {
      correctedLevel.solution_data.optimal_solution.expected_score = newExpectedScore
    }

    // Отмечаем что валидация выполнена
    if (correctedLevel.solution_data?.validation_results) {
      correctedLevel.solution_data.validation_results.validation_performed = true
    }

    return correctedLevel
  }

  /**
   * Расчет правильного expected_score
   */
  private calculateCorrectExpectedScore(level: Level, validationResult: PrometheusValidationResult): number {
    const { pathAnalysis, sourceEnergy } = validationResult.energyAnalysis

    let totalUsefulEnergy = 0

    // Считаем полезную энергию в Sweet Spot диапазонах
    for (const path of pathAnalysis) {
      if (path.isInSweetSpot) {
        totalUsefulEnergy += path.deliveredEnergy
      }
    }

    // Добавляем энергию остающуюся в Supercapacitor
    const totalDelivered = pathAnalysis.reduce((sum, path) => sum + path.deliveredEnergy, 0)
    const supercapacitorEnergy = Math.max(0, sourceEnergy - totalDelivered)
    totalUsefulEnergy += supercapacitorEnergy

    // Рассчитываем эффективность
    const efficiency = sourceEnergy > 0 ? (totalUsefulEnergy / sourceEnergy) * 100 : 0

    console.log(`📊 PROMETHEUS_VALIDATOR: Пересчитанная эффективность: ${efficiency.toFixed(1)}%`)
    
    return efficiency
  }
}