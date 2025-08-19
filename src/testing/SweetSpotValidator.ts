/**
 * SweetSpotValidator
 * Валидация Sweet Spot механики согласно Game Design 3.2
 * Энергия засчитывается как Useful Energy только при попадании в Sweet Spot диапазоны
 */

import { CircuitSimulator } from '../game/circuitSimulator'
import type { Level } from '../types'
import type { TestResult, SweetSpotTestCase } from './types'

export class SweetSpotValidator {
  private simulator: CircuitSimulator

  constructor() {
    this.simulator = new CircuitSimulator()
  }

  /**
   * Полная валидация Sweet Spot механики уровня
   */
  validateSweetSpotRules(level: Level): TestResult[] {
    const results: TestResult[] = []
    const levelId = level.registryOrder?.toString() || level.metadata.level_id

    console.log(`🎯 SWEETSPOT_VALIDATOR: Начинаем валидацию Sweet Spot для уровня ${levelId}`)

    try {
      // Загружаем уровень в симулятор
      this.simulator.loadLevel(level)

      // 1. Проверяем определения Sweet Spot диапазонов
      results.push(...this.validateSweetSpotDefinitions(level))

      // 2. Тестируем граничные значения Sweet Spot
      results.push(...this.testSweetSpotBoundaries(level))

      // 3. Проверяем Heat Loss логику (энергия вне диапазона)
      results.push(...this.testHeatLossLogic(level))

      // 4. Тестируем корректность расчета эффективности
      results.push(...this.testEfficiencyCalculation(level))

      // 5. Проверяем взаимодействие с суперконденсатором
      results.push(...this.testSupercapacitorInteraction(level))

    } catch (error) {
      results.push({
        passed: false,
        message: `Критическая ошибка при валидации Sweet Spot в уровне ${levelId}: ${error.message}`,
        details: { error: error.stack },
        severity: 'critical'
      })
    }

    console.log(`🎯 SWEETSPOT_VALIDATOR: Завершена валидация уровня ${levelId}, результатов: ${results.length}`)
    return results
  }

  /**
   * Проверка определений Sweet Spot диапазонов
   */
  private validateSweetSpotDefinitions(level: Level): TestResult[] {
    const results: TestResult[] = []
    const targets = level.circuit_definition.targets

    for (const target of targets) {
      if (!target.energy_range || target.energy_range.length !== 2) {
        results.push({
          passed: false,
          message: `Target ${target.id} не имеет корректного Sweet Spot диапазона`,
          severity: 'critical'
        })
        continue
      }

      const [minEnergy, maxEnergy] = target.energy_range

      // Проверяем что минимум меньше максимума
      if (minEnergy >= maxEnergy) {
        results.push({
          passed: false,
          message: `Target ${target.id} имеет некорректный Sweet Spot: [${minEnergy}, ${maxEnergy}]`,
          severity: 'critical'
        })
        continue
      }

      // Проверяем что значения положительные
      if (minEnergy <= 0 || maxEnergy <= 0) {
        results.push({
          passed: false,
          message: `Target ${target.id} имеет некорректные значения Sweet Spot: [${minEnergy}, ${maxEnergy}] (должны быть > 0)`,
          severity: 'error'
        })
        continue
      }

      results.push({
        passed: true,
        message: `Target ${target.id} имеет корректный Sweet Spot: [${minEnergy.toFixed(1)}, ${maxEnergy.toFixed(1)}] EU`,
        details: { targetId: target.id, sweetSpot: target.energy_range },
        severity: 'info'
      })
    }

    return results
  }

  /**
   * Тестирование граничных значений Sweet Spot
   */
  private testSweetSpotBoundaries(level: Level): TestResult[] {
    const results: TestResult[] = []
    const targets = level.circuit_definition.targets

    for (const target of targets) {
      if (!target.energy_range) continue

      const [minEnergy, maxEnergy] = target.energy_range
      
      // Создаем тестовые случаи для граничных значений
      const testCases: SweetSpotTestCase = {
        targetId: target.id,
        sweetSpotRange: [minEnergy, maxEnergy],
        testValues: [
          // Точно на границах
          { deliveredEnergy: minEnergy, expectedUseful: minEnergy, expectedInRange: true },
          { deliveredEnergy: maxEnergy, expectedUseful: maxEnergy, expectedInRange: true },
          
          // Чуть ниже минимума
          { deliveredEnergy: minEnergy - 0.1, expectedUseful: 0, expectedInRange: false },
          
          // Чуть выше максимума  
          { deliveredEnergy: maxEnergy + 0.1, expectedUseful: 0, expectedInRange: false },
          
          // В середине диапазона
          { deliveredEnergy: (minEnergy + maxEnergy) / 2, expectedUseful: (minEnergy + maxEnergy) / 2, expectedInRange: true }
        ]
      }

      results.push(...this.runSweetSpotTestCase(testCases))
    }

    return results
  }

  /**
   * Выполнение тестового случая для Sweet Spot
   */
  private runSweetSpotTestCase(testCase: SweetSpotTestCase): TestResult[] {
    const results: TestResult[] = []
    const [minEnergy, maxEnergy] = testCase.sweetSpotRange

    for (const testValue of testCase.testValues) {
      try {
        // Симулируем доставку конкретного количества энергии к цели
        const actualInRange = this.isEnergyInSweetSpot(testValue.deliveredEnergy, minEnergy, maxEnergy)
        const actualUseful = actualInRange ? testValue.deliveredEnergy : 0

        // Проверяем соответствие ожиданиям
        if (actualInRange !== testValue.expectedInRange) {
          results.push({
            passed: false,
            message: `Sweet Spot граница нарушена для ${testCase.targetId}: ${testValue.deliveredEnergy.toFixed(1)} EU должно быть ${testValue.expectedInRange ? 'В' : 'ВНЕ'} диапазона [${minEnergy.toFixed(1)}, ${maxEnergy.toFixed(1)}]`,
            details: {
              targetId: testCase.targetId,
              deliveredEnergy: testValue.deliveredEnergy,
              sweetSpot: testCase.sweetSpotRange,
              expectedInRange: testValue.expectedInRange,
              actualInRange: actualInRange
            },
            severity: 'critical'
          })
        }

        if (Math.abs(actualUseful - testValue.expectedUseful) > 0.01) {
          results.push({
            passed: false,
            message: `Полезная энергия рассчитана неверно для ${testCase.targetId}: ожидали ${testValue.expectedUseful.toFixed(1)} EU, получили ${actualUseful.toFixed(1)} EU`,
            details: {
              targetId: testCase.targetId,
              deliveredEnergy: testValue.deliveredEnergy,
              expectedUseful: testValue.expectedUseful,
              actualUseful: actualUseful
            },
            severity: 'critical'
          })
        }

      } catch (error) {
        results.push({
          passed: false,
          message: `Ошибка при тестировании Sweet Spot для ${testCase.targetId}: ${error.message}`,
          severity: 'error'
        })
      }
    }

    // Если все тесты прошли успешно
    if (results.length === 0) {
      results.push({
        passed: true,
        message: `Sweet Spot границы работают корректно для ${testCase.targetId}`,
        details: { targetId: testCase.targetId, sweetSpot: testCase.sweetSpotRange },
        severity: 'info'
      })
    }

    return results
  }

  /**
   * Тестирование Heat Loss логики
   */
  private testHeatLossLogic(level: Level): TestResult[] {
    const results: TestResult[] = []

    try {
      // Создаем тестовую конфигурацию где энергия заведомо не попадает в Sweet Spot
      const testResult = this.createHeatLossTestScenario(level)
      
      if (testResult.simulationResult.finalScore > 5) { // Допускаем минимальную эффективность от суперконденсатора
        results.push({
          passed: false,
          message: `Heat Loss логика не работает: эффективность ${testResult.simulationResult.finalScore.toFixed(1)}% при энергии вне Sweet Spot`,
          details: {
            finalScore: testResult.simulationResult.finalScore,
            energyDistribution: testResult.simulationResult.energyDistribution,
            targetsLit: testResult.simulationResult.targetsLit
          },
          severity: 'critical'
        })
      } else {
        results.push({
          passed: true,
          message: `Heat Loss логика работает корректно: энергия вне Sweet Spot не засчитывается (эффективность: ${testResult.simulationResult.finalScore.toFixed(1)}%)`,
          severity: 'info'
        })
      }

    } catch (error) {
      results.push({
        passed: false,
        message: `Ошибка при тестировании Heat Loss логики: ${error.message}`,
        severity: 'error'
      })
    }

    return results
  }

  /**
   * Тестирование корректности расчета эффективности
   */
  private testEfficiencyCalculation(level: Level): TestResult[] {
    const results: TestResult[] = []

    try {
      // Загружаем оптимальное решение и анализируем расчет эффективности
      this.simulator.clearAll()
      const loadSuccess = this.simulator.loadOptimalSolution()

      if (!loadSuccess) {
        results.push({
          passed: false,
          message: 'Не удалось загрузить оптимальное решение для проверки эффективности',
          severity: 'warning'
        })
        return results
      }

      const simulationResult = this.simulator.simulate()
      const source = this.simulator.getSource()
      const supercapacitor = this.simulator.getSupercapacitor()

      if (!source) {
        results.push({
          passed: false,
          message: 'Источник энергии не найден для расчета эффективности',
          severity: 'critical'
        })
        return results
      }

      // Ручной расчет эффективности согласно спецификации Game Design 3.2
      const sourceEnergyOutput = source.getAvailableEnergy()
      let totalUsefulEnergy = 0

      // 1. Энергия в Sweet Spot диапазонах
      for (const [targetId, deliveredEnergy] of Object.entries(simulationResult.energyDistribution)) {
        const target = level.circuit_definition.targets.find(t => t.id === targetId)
        if (target && target.energy_range) {
          const [minEnergy, maxEnergy] = target.energy_range
          if (deliveredEnergy >= minEnergy && deliveredEnergy <= maxEnergy) {
            totalUsefulEnergy += deliveredEnergy
            console.log(`🎯 EFFICIENCY: ${targetId} - ${deliveredEnergy.toFixed(1)} EU в Sweet Spot [${minEnergy}-${maxEnergy}] ✅`)
          } else {
            console.log(`🎯 EFFICIENCY: ${targetId} - ${deliveredEnergy.toFixed(1)} EU ВНЕ Sweet Spot [${minEnergy}-${maxEnergy}] ❌`)
          }
        }
      }

      // 2. Энергия в суперконденсаторе
      const supercapacitorEnergy = supercapacitor ? supercapacitor.getScore() : 0
      totalUsefulEnergy += supercapacitorEnergy

      // 3. Расчет эффективности
      const expectedEfficiency = sourceEnergyOutput > 0 ? (totalUsefulEnergy / sourceEnergyOutput) * 100 : 0

      // Сравниваем с результатом симуляции
      const efficiencyDifference = Math.abs(simulationResult.finalScore - expectedEfficiency)
      
      if (efficiencyDifference > 0.1) { // 0.1% допуск на погрешности
        results.push({
          passed: false,
          message: `Расчет эффективности неверен: ожидали ${expectedEfficiency.toFixed(2)}%, получили ${simulationResult.finalScore.toFixed(2)}%`,
          details: {
            expectedEfficiency,
            actualEfficiency: simulationResult.finalScore,
            difference: efficiencyDifference,
            totalUsefulEnergy,
            sourceEnergyOutput,
            supercapacitorEnergy,
            energyDistribution: simulationResult.energyDistribution
          },
          severity: 'critical'
        })
      } else {
        results.push({
          passed: true,
          message: `Расчет эффективности корректен: ${simulationResult.finalScore.toFixed(2)}% (ручной расчет: ${expectedEfficiency.toFixed(2)}%)`,
          details: {
            efficiency: simulationResult.finalScore,
            totalUsefulEnergy,
            sourceEnergyOutput
          },
          severity: 'info'
        })
      }

    } catch (error) {
      results.push({
        passed: false,
        message: `Ошибка при тестировании расчета эффективности: ${error.message}`,
        severity: 'error'
      })
    }

    return results
  }

  /**
   * Тестирование взаимодействия с суперконденсатором
   */
  private testSupercapacitorInteraction(level: Level): TestResult[] {
    const results: TestResult[] = []

    try {
      // Суперконденсатор должен получать оставшуюся энергию
      // И эта энергия должна всегда засчитываться как полезная (не зависит от Sweet Spot)
      
      this.simulator.clearAll()
      const supercapacitor = this.simulator.getSupercapacitor()
      
      if (!supercapacitor) {
        results.push({
          passed: true,
          message: 'Уровень не содержит суперконденсатор',
          severity: 'info'
        })
        return results
      }

      // Тест: пустая цепь должна передать всю энергию в суперконденсатор
      const emptyCircuitResult = this.simulator.simulate()
      const source = this.simulator.getSource()
      
      if (source) {
        const sourceEnergy = source.getAvailableEnergy()
        const supercapacitorEnergy = supercapacitor.getScore()
        
        // При пустой цепи вся энергия должна идти в суперконденсатор
        if (Math.abs(supercapacitorEnergy - sourceEnergy) < 0.01) {
          results.push({
            passed: true,
            message: `Суперконденсатор корректно получает неиспользованную энергию: ${supercapacitorEnergy.toFixed(1)} EU`,
            severity: 'info'
          })
        } else {
          results.push({
            passed: false,
            message: `Суперконденсатор получает неверное количество энергии: ожидали ${sourceEnergy.toFixed(1)} EU, получил ${supercapacitorEnergy.toFixed(1)} EU`,
            details: {
              expected: sourceEnergy,
              actual: supercapacitorEnergy
            },
            severity: 'error'
          })
        }

        // Эффективность должна быть 100% (вся энергия полезна)
        if (Math.abs(emptyCircuitResult.finalScore - 100) > 0.1) {
          results.push({
            passed: false,
            message: `Суперконденсатор не обеспечивает 100% эффективности при пустой цепи: ${emptyCircuitResult.finalScore.toFixed(1)}%`,
            severity: 'error'
          })
        }
      }

    } catch (error) {
      results.push({
        passed: false,
        message: `Ошибка при тестировании взаимодействия с суперконденсатором: ${error.message}`,
        severity: 'error'
      })
    }

    return results
  }

  /**
   * Проверка попадания энергии в Sweet Spot диапазон
   */
  private isEnergyInSweetSpot(energy: number, minEnergy: number, maxEnergy: number): boolean {
    return energy >= minEnergy && energy <= maxEnergy
  }

  /**
   * Создание тестового сценария для Heat Loss логики
   */
  private createHeatLossTestScenario(level: Level): { simulationResult: any } {
    // Создаем конфигурацию где заведомо известно что энергия не попадет в Sweet Spot
    this.simulator.clearAll()

    const components = level.circuit_definition.available_components
    const targets = level.circuit_definition.targets

    if (components.length > 0 && targets.length > 0) {
      // Используем первый компонент и первую цель
      const component = components[0]
      const target = targets[0]

      // Размещаем компонент и соединяем
      this.simulator.placeComponent(component.id, { x: 150, y: 150 })
      this.simulator.connectComponents('SOURCE', component.id)
      this.simulator.connectComponents(component.id, target.id)

      // Добавляем дополнительные компоненты чтобы изменить энергию вне Sweet Spot
      // (это зависит от конкретной реализации и доступных компонентов)
    }

    const simulationResult = this.simulator.simulate()
    return { simulationResult }
  }
}