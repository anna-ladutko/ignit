/**
 * EnergyValidationSuite
 * Автоматизированная проверка энергетических расчетов в уровнях
 * Гарантирует что Total Useful Energy никогда не превышает Source Energy Output
 */

import { CircuitSimulator } from '../game/circuitSimulator'
import type { Level } from '../types'
import type { TestResult, EnergyTestScenario } from './types'

export class EnergyValidationSuite {
  private simulator: CircuitSimulator

  constructor() {
    this.simulator = new CircuitSimulator()
  }

  /**
   * Полная валидация энергетической системы уровня
   */
  validateLevel(level: Level): TestResult[] {
    const results: TestResult[] = []
    const levelId = level.registryOrder?.toString() || level.metadata.level_id

    console.log(`⚡ ENERGY_VALIDATOR: Начинаем валидацию уровня ${levelId}`)

    try {
      // Загружаем уровень в симулятор
      this.simulator.loadLevel(level)

      // 1. Проверяем базовые свойства источника энергии
      results.push(...this.validateSourceProperties(level))

      // 2. Проверяем targets и их Sweet Spot диапазоны
      results.push(...this.validateTargetProperties(level))

      // 3. Тестируем предложенное оптимальное решение
      results.push(...this.validateOptimalSolution(level))

      // 4. Проверяем закон сохранения энергии
      results.push(...this.validateEnergyConservation(level))

      // 5. Тестируем граничные случаи
      results.push(...this.validateEdgeCases(level))

    } catch (error) {
      results.push({
        passed: false,
        message: `Критическая ошибка при валидации уровня ${levelId}: ${error.message}`,
        details: { error: error.stack },
        severity: 'critical'
      })
    }

    console.log(`⚡ ENERGY_VALIDATOR: Завершена валидация уровня ${levelId}, результатов: ${results.length}`)
    return results
  }

  /**
   * Проверка свойств источника энергии
   */
  private validateSourceProperties(level: Level): TestResult[] {
    const results: TestResult[] = []
    const source = level.circuit_definition.source

    // Проверяем что energy_output > 0
    if (source.energy_output <= 0) {
      results.push({
        passed: false,
        message: `Источник имеет некорректный energy_output: ${source.energy_output} (должно быть > 0)`,
        severity: 'critical'
      })
    } else {
      results.push({
        passed: true,
        message: `Источник имеет корректный energy_output: ${source.energy_output} EU`,
        severity: 'info'
      })
    }

    // Проверяем что voltage > 0
    if (source.voltage <= 0) {
      results.push({
        passed: false,
        message: `Источник имеет некорректное напряжение: ${source.voltage} (должно быть > 0)`,
        severity: 'error'
      })
    }

    return results
  }

  /**
   * Проверка свойств targets и их Sweet Spot диапазонов
   */
  private validateTargetProperties(level: Level): TestResult[] {
    const results: TestResult[] = []
    const targets = level.circuit_definition.targets
    const sourceEnergy = level.circuit_definition.source.energy_output

    if (targets.length === 0) {
      results.push({
        passed: false,
        message: 'Уровень не содержит ни одной цели (target)',
        severity: 'critical'
      })
      return results
    }

    let totalMaxEnergyDemand = 0

    for (const target of targets) {
      // Проверяем что energy_range корректен
      if (!target.energy_range || target.energy_range.length !== 2) {
        results.push({
          passed: false,
          message: `Target ${target.id} имеет некорректный energy_range`,
          severity: 'critical'
        })
        continue
      }

      const [minEnergy, maxEnergy] = target.energy_range

      // Проверяем что min < max
      if (minEnergy >= maxEnergy) {
        results.push({
          passed: false,
          message: `Target ${target.id} имеет некорректный диапазон: min=${minEnergy}, max=${maxEnergy}`,
          severity: 'critical'
        })
      }

      // Проверяем что Sweet Spot достижим (maxEnergy не превышает source energy)
      if (maxEnergy > sourceEnergy) {
        results.push({
          passed: false,
          message: `Target ${target.id} требует больше энергии (max=${maxEnergy}) чем может дать источник (${sourceEnergy})`,
          severity: 'error'
        })
      }

      totalMaxEnergyDemand += maxEnergy
    }

    // КРИТИЧЕСКАЯ ПРОВЕРКА: Общий спрос не должен превышать источник
    if (totalMaxEnergyDemand > sourceEnergy) {
      results.push({
        passed: false,
        message: `Общий максимальный спрос targets (${totalMaxEnergyDemand.toFixed(1)} EU) превышает источник (${sourceEnergy} EU)`,
        details: {
          totalDemand: totalMaxEnergyDemand,
          sourceCapacity: sourceEnergy,
          ratio: totalMaxEnergyDemand / sourceEnergy
        },
        severity: 'warning' // Может быть нормально для puzzle-дизайна
      })
    } else {
      results.push({
        passed: true,
        message: `Энергетический баланс корректен: спрос ${totalMaxEnergyDemand.toFixed(1)} EU ≤ источник ${sourceEnergy} EU`,
        severity: 'info'
      })
    }

    return results
  }

  /**
   * Проверка оптимального решения от Prometheus
   */
  private validateOptimalSolution(level: Level): TestResult[] {
    const results: TestResult[] = []
    
    if (!level.solution_data?.optimal_solution) {
      results.push({
        passed: false,
        message: 'Уровень не содержит оптимального решения для проверки',
        severity: 'warning'
      })
      return results
    }

    try {
      // Очищаем симулятор и загружаем оптимальное решение
      this.simulator.clearAll()
      const success = this.simulator.loadOptimalSolution()

      if (!success) {
        results.push({
          passed: false,
          message: 'Не удалось загрузить оптимальное решение в симулятор',
          severity: 'error'
        })
        return results
      }

      // Запускаем симуляцию
      const simulationResult = this.simulator.simulate()

      // Проверяем результаты симуляции
      const sourceEnergy = level.circuit_definition.source.energy_output
      const expectedScore = level.solution_data.optimal_solution.expected_score

      // КРИТИЧЕСКАЯ ПРОВЕРКА: Total Useful Energy ≤ Source Energy
      if (simulationResult.finalScore > 100) {
        results.push({
          passed: false,
          message: `Эффективность превышает 100%: ${simulationResult.finalScore.toFixed(1)}% - нарушение закона сохранения энергии!`,
          details: {
            calculatedEfficiency: simulationResult.finalScore,
            sourceEnergy: sourceEnergy,
            energyDistribution: simulationResult.energyDistribution
          },
          severity: 'critical'
        })
      } else {
        results.push({
          passed: true,
          message: `Эффективность в пределах физических законов: ${simulationResult.finalScore.toFixed(1)}%`,
          severity: 'info'
        })
      }

      // Проверяем общее потребление энергии
      if (simulationResult.totalEnergyUsed > sourceEnergy * 1.01) { // 1% допуск на погрешности расчетов
        results.push({
          passed: false,
          message: `Потребление энергии (${simulationResult.totalEnergyUsed.toFixed(1)} EU) превышает источник (${sourceEnergy} EU)`,
          severity: 'critical'
        })
      }

      // Сравниваем с ожидаемым score (если указан)
      if (expectedScore > 0) {
        const scoreDifference = Math.abs(simulationResult.finalScore - expectedScore)
        if (scoreDifference > 5) { // 5% допуск
          results.push({
            passed: false,
            message: `Расчетная эффективность (${simulationResult.finalScore.toFixed(1)}%) сильно отличается от ожидаемой (${expectedScore.toFixed(1)}%)`,
            details: {
              calculated: simulationResult.finalScore,
              expected: expectedScore,
              difference: scoreDifference
            },
            severity: 'warning'
          })
        }
      }

    } catch (error) {
      results.push({
        passed: false,
        message: `Ошибка при тестировании оптимального решения: ${error.message}`,
        details: { error: error.stack },
        severity: 'error'
      })
    }

    return results
  }

  /**
   * Проверка закона сохранения энергии
   */
  private validateEnergyConservation(level: Level): TestResult[] {
    const results: TestResult[] = []

    try {
      // Тестируем несколько конфигураций
      const testConfigurations = this.generateTestConfigurations(level)
      
      for (const config of testConfigurations) {
        const conservationResult = this.testEnergyConservation(config)
        results.push(...conservationResult)
      }

    } catch (error) {
      results.push({
        passed: false,
        message: `Ошибка при проверке сохранения энергии: ${error.message}`,
        severity: 'error'
      })
    }

    return results
  }

  /**
   * Проверка граничных случаев
   */
  private validateEdgeCases(level: Level): TestResult[] {
    const results: TestResult[] = []

    try {
      // Тест 1: Пустая цепь (без компонентов)
      this.simulator.clearAll()
      const emptyResult = this.simulator.simulate()
      
      if (emptyResult.finalScore > 0) {
        results.push({
          passed: false,
          message: `Пустая цепь дает положительную эффективность: ${emptyResult.finalScore.toFixed(1)}%`,
          severity: 'error'
        })
      } else {
        results.push({
          passed: true,
          message: 'Пустая цепь корректно дает 0% эффективности',
          severity: 'info'
        })
      }

    } catch (error) {
      results.push({
        passed: false,
        message: `Ошибка при тестировании граничных случаев: ${error.message}`,
        severity: 'error'
      })
    }

    return results
  }

  /**
   * Генерация тестовых конфигураций для проверки
   */
  private generateTestConfigurations(level: Level): EnergyTestScenario[] {
    const scenarios: EnergyTestScenario[] = []

    // Простая конфигурация: один резистор к одной цели
    const components = level.circuit_definition.available_components
    const targets = level.circuit_definition.targets

    if (components.length > 0 && targets.length > 0) {
      const firstComponent = components[0]
      const firstTarget = targets[0]

      scenarios.push({
        name: 'Simple Path Test',
        description: 'Один компонент к одной цели',
        components: [{
          id: firstComponent.id,
          type: firstComponent.type,
          position: { x: 150, y: 150 },
          rotation: 0
        }],
        connections: [
          { from: 'SOURCE', to: firstComponent.id },
          { from: firstComponent.id, to: firstTarget.id }
        ],
        expectedResults: {
          totalUsefulEnergy: 0, // Будет рассчитан
          efficiency: 0, // Будет рассчитан
          targetsInSweetSpot: [],
          energyConservation: true
        }
      })
    }

    return scenarios
  }

  /**
   * Тест сохранения энергии для конкретной конфигурации
   */
  private testEnergyConservation(scenario: EnergyTestScenario): TestResult[] {
    const results: TestResult[] = []

    try {
      // Очищаем и настраиваем симулятор
      this.simulator.clearAll()

      // Размещаем компоненты
      for (const comp of scenario.components) {
        const success = this.simulator.placeComponent(comp.id, comp.position, comp.rotation || 0)
        if (!success) {
          results.push({
            passed: false,
            message: `Не удалось разместить компонент ${comp.id} в тестовом сценарии`,
            severity: 'error'
          })
          continue
        }
      }

      // Создаем соединения
      for (const conn of scenario.connections) {
        const success = this.simulator.connectComponents(conn.from, conn.to)
        if (!success) {
          results.push({
            passed: false,
            message: `Не удалось создать соединение ${conn.from} -> ${conn.to}`,
            severity: 'error'
          })
        }
      }

      // Запускаем симуляцию
      const simulationResult = this.simulator.simulate()
      
      // Получаем энергию источника
      const source = this.simulator.getSource()
      if (!source) {
        results.push({
          passed: false,
          message: 'Источник энергии не найден в симуляторе',
          severity: 'critical'
        })
        return results
      }

      const sourceEnergy = source.getAvailableEnergy()

      // Проверяем закон сохранения энергии
      // Total Energy In = Source Energy
      // Total Energy Out = Delivered Energy + Component Losses + Supercapacitor Energy

      const deliveredEnergy = Object.values(simulationResult.energyDistribution).reduce((sum, energy) => sum + energy, 0)
      const supercapacitor = this.simulator.getSupercapacitor()
      const supercapacitorEnergy = supercapacitor ? supercapacitor.getScore() : 0
      
      // Примерная проверка (точные потери зависят от реализации)
      const totalEnergyOut = deliveredEnergy + simulationResult.totalEnergyUsed + supercapacitorEnergy

      const energyBalanceError = Math.abs(sourceEnergy - totalEnergyOut)
      const tolerance = sourceEnergy * 0.01 // 1% допуск

      if (energyBalanceError > tolerance) {
        results.push({
          passed: false,
          message: `Нарушение сохранения энергии в сценарии "${scenario.name}": вход=${sourceEnergy}, выход=${totalEnergyOut.toFixed(1)}`,
          details: {
            energyIn: sourceEnergy,
            energyOut: totalEnergyOut,
            error: energyBalanceError,
            deliveredEnergy,
            componentLosses: simulationResult.totalEnergyUsed,
            supercapacitorEnergy
          },
          severity: 'critical'
        })
      } else {
        results.push({
          passed: true,
          message: `Сохранение энергии соблюдено в сценарии "${scenario.name}"`,
          details: {
            energyBalance: `${sourceEnergy} ≈ ${totalEnergyOut.toFixed(1)} (Δ=${energyBalanceError.toFixed(2)})`
          },
          severity: 'info'
        })
      }

    } catch (error) {
      results.push({
        passed: false,
        message: `Ошибка при тестировании сценария "${scenario.name}": ${error.message}`,
        severity: 'error'
      })
    }

    return results
  }
}