/**
 * LevelTestRunner
 * Координатор системы тестирования уровней
 * Запускает все виды проверок и генерирует комплексные отчеты
 */

import { LevelDuplicateChecker } from './LevelDuplicateChecker'
import { EnergyValidationSuite } from './EnergyValidationSuite'
import { SweetSpotValidator } from './SweetSpotValidator'
import { levelManager } from '../services/LevelManager'
import type { Level } from '../types'
import type { LevelTestSuite, LevelValidationReport, TestResult } from './types'

export class LevelTestRunner {
  private duplicateChecker: LevelDuplicateChecker
  private energyValidator: EnergyValidationSuite
  private sweetSpotValidator: SweetSpotValidator
  private isRunning = false

  constructor() {
    this.duplicateChecker = new LevelDuplicateChecker()
    this.energyValidator = new EnergyValidationSuite()
    this.sweetSpotValidator = new SweetSpotValidator()
  }

  /**
   * Запуск полной проверки всех уровней
   */
  async runFullValidation(): Promise<LevelValidationReport[]> {
    if (this.isRunning) {
      throw new Error('Тестирование уже выполняется')
    }

    this.isRunning = true
    const reports: LevelValidationReport[] = []

    try {
      console.log('🚀 LEVEL_TEST_RUNNER: Начинаем полную валидацию всех уровней...')

      // Получаем список всех доступных уровней
      const availableLevels = levelManager.getAvailableLevels()
      console.log(`📊 LEVEL_TEST_RUNNER: Найдено ${availableLevels.length} уровней для проверки`)

      // Предварительная загрузка уровней для проверки дубликатов
      const loadedLevels: Level[] = []
      for (const levelInfo of availableLevels) {
        try {
          const level = await levelManager.loadLevelByOrder(levelInfo.id)
          if (level) {
            loadedLevels.push(level)
            this.duplicateChecker.addLevel(level)
            console.log(`✅ LEVEL_TEST_RUNNER: Загружен уровень ${levelInfo.id}`)
          } else {
            console.warn(`⚠️ LEVEL_TEST_RUNNER: Не удалось загрузить уровень ${levelInfo.id}`)
          }
        } catch (error) {
          console.error(`❌ LEVEL_TEST_RUNNER: Ошибка загрузки уровня ${levelInfo.id}:`, error)
        }
      }

      // Выполняем тестирование каждого уровня
      for (const level of loadedLevels) {
        try {
          console.log(`🔍 LEVEL_TEST_RUNNER: Тестируем уровень ${level.registryOrder}...`)
          const report = await this.validateSingleLevel(level)
          reports.push(report)
        } catch (error) {
          console.error(`❌ LEVEL_TEST_RUNNER: Критическая ошибка при тестировании уровня:`, error)
          
          // Создаем отчет об ошибке
          reports.push(this.createErrorReport(level, error))
        }
      }

      // Генерируем сводную статистику
      this.generateSummaryStats(reports)

    } finally {
      this.isRunning = false
    }

    console.log(`🏁 LEVEL_TEST_RUNNER: Валидация завершена. Обработано ${reports.length} уровней`)
    return reports
  }

  /**
   * Валидация конкретного уровня
   */
  async validateSingleLevel(level: Level): Promise<LevelValidationReport> {
    const startTime = Date.now()
    const levelId = level.registryOrder?.toString() || level.metadata.level_id

    console.log(`🔬 LEVEL_TEST_RUNNER: Детальная валидация уровня ${levelId}...`)

    // Создаем структуру результатов тестирования
    const testSuite: LevelTestSuite = {
      levelId: level.metadata.level_id,
      levelOrder: level.registryOrder || 0,
      tests: {
        uniqueness: [],
        energyValidation: [],
        sweetSpotValidation: []
      },
      summary: {
        totalTests: 0,
        passed: 0,
        failed: 0,
        warnings: 0,
        errors: 0
      }
    }

    try {
      // 1. Проверка уникальности
      console.log(`🔍 LEVEL_TEST_RUNNER: Проверяем уникальность уровня ${levelId}...`)
      testSuite.tests.uniqueness = this.duplicateChecker.checkForDuplicates(level)

      // 2. Валидация энергетической системы
      console.log(`⚡ LEVEL_TEST_RUNNER: Валидируем энергетические расчеты уровня ${levelId}...`)
      testSuite.tests.energyValidation = this.energyValidator.validateLevel(level)

      // 3. Проверка Sweet Spot правил
      console.log(`🎯 LEVEL_TEST_RUNNER: Проверяем Sweet Spot правила уровня ${levelId}...`)
      testSuite.tests.sweetSpotValidation = this.sweetSpotValidator.validateSweetSpotRules(level)

      // Подсчитываем статистику
      this.calculateTestSummary(testSuite)

      // Определяем общий статус
      const overallStatus = this.determineOverallStatus(testSuite)

      // Генерируем рекомендации
      const recommendations = this.generateRecommendations(testSuite)

      const endTime = Date.now()
      const duration = endTime - startTime

      console.log(`✅ LEVEL_TEST_RUNNER: Валидация уровня ${levelId} завершена за ${duration}ms`)
      console.log(`📊 LEVEL_TEST_RUNNER: Статистика: ${testSuite.summary.passed}/${testSuite.summary.totalTests} тестов прошли, статус: ${overallStatus}`)

      return {
        levelOrder: level.registryOrder || 0,
        levelId: level.metadata.level_id,
        timestamp: new Date().toISOString(),
        testSuites: testSuite,
        recommendations,
        overallStatus
      }

    } catch (error) {
      console.error(`❌ LEVEL_TEST_RUNNER: Ошибка валидации уровня ${levelId}:`, error)
      throw error
    }
  }

  /**
   * Быстрая проверка конкретного аспекта
   */
  async runQuickCheck(levelOrder: number, checkType: 'duplicates' | 'energy' | 'sweetspot' | 'all'): Promise<TestResult[]> {
    console.log(`⚡ LEVEL_TEST_RUNNER: Быстрая проверка ${checkType} для уровня ${levelOrder}`)

    const level = await levelManager.loadLevelByOrder(levelOrder)
    if (!level) {
      return [{
        passed: false,
        message: `Не удалось загрузить уровень ${levelOrder}`,
        severity: 'critical'
      }]
    }

    switch (checkType) {
      case 'duplicates':
        // Нужно загрузить другие уровни для сравнения
        const allLevels = await this.loadAllLevelsForComparison()
        allLevels.forEach(l => this.duplicateChecker.addLevel(l))
        return this.duplicateChecker.checkForDuplicates(level)

      case 'energy':
        return this.energyValidator.validateLevel(level)

      case 'sweetspot':
        return this.sweetSpotValidator.validateSweetSpotRules(level)

      case 'all':
        const allResults: TestResult[] = []
        allResults.push(...await this.runQuickCheck(levelOrder, 'duplicates'))
        allResults.push(...await this.runQuickCheck(levelOrder, 'energy'))
        allResults.push(...await this.runQuickCheck(levelOrder, 'sweetspot'))
        return allResults

      default:
        return [{
          passed: false,
          message: `Неизвестный тип проверки: ${checkType}`,
          severity: 'error'
        }]
    }
  }

  /**
   * Получение статистики тестирования
   */
  getTestingStats() {
    return {
      isRunning: this.isRunning,
      duplicateChecker: this.duplicateChecker.getStats()
    }
  }

  /**
   * Очистка кешей и сброс состояния
   */
  reset(): void {
    this.duplicateChecker.clear()
    this.isRunning = false
    console.log('🗑️ LEVEL_TEST_RUNNER: Состояние тестирования сброшено')
  }

  /**
   * Подсчет статистики тестирования
   */
  private calculateTestSummary(testSuite: LevelTestSuite): void {
    const allTests = [
      ...testSuite.tests.uniqueness,
      ...testSuite.tests.energyValidation,
      ...testSuite.tests.sweetSpotValidation
    ]

    testSuite.summary.totalTests = allTests.length
    testSuite.summary.passed = allTests.filter(t => t.passed).length
    testSuite.summary.failed = allTests.filter(t => !t.passed).length
    testSuite.summary.warnings = allTests.filter(t => t.severity === 'warning').length
    testSuite.summary.errors = allTests.filter(t => t.severity === 'error' || t.severity === 'critical').length
  }

  /**
   * Определение общего статуса валидации
   */
  private determineOverallStatus(testSuite: LevelTestSuite): 'passed' | 'warning' | 'failed' | 'critical' {
    const allTests = [
      ...testSuite.tests.uniqueness,
      ...testSuite.tests.energyValidation,
      ...testSuite.tests.sweetSpotValidation
    ]

    // Проверяем критические ошибки
    if (allTests.some(t => t.severity === 'critical' && !t.passed)) {
      return 'critical'
    }

    // Проверяем обычные ошибки
    if (allTests.some(t => t.severity === 'error' && !t.passed)) {
      return 'failed'
    }

    // Проверяем предупреждения
    if (allTests.some(t => t.severity === 'warning')) {
      return 'warning'
    }

    return 'passed'
  }

  /**
   * Генерация рекомендаций на основе результатов тестирования
   */
  private generateRecommendations(testSuite: LevelTestSuite): string[] {
    const recommendations: string[] = []
    const allTests = [
      ...testSuite.tests.uniqueness,
      ...testSuite.tests.energyValidation,
      ...testSuite.tests.sweetSpotValidation
    ]

    // Анализируем ошибки и предлагаем решения
    const duplicateErrors = testSuite.tests.uniqueness.filter(t => !t.passed)
    if (duplicateErrors.length > 0) {
      recommendations.push('Обнаружены дубликаты уровней. Используйте Prometheus Studio для создания уникального контента.')
    }

    const energyErrors = testSuite.tests.energyValidation.filter(t => t.severity === 'critical' && !t.passed)
    if (energyErrors.length > 0) {
      recommendations.push('Критические нарушения энергетических расчетов. Проверьте компоненты и их сопротивления.')
    }

    const sweetSpotErrors = testSuite.tests.sweetSpotValidation.filter(t => t.severity === 'critical' && !t.passed)
    if (sweetSpotErrors.length > 0) {
      recommendations.push('Нарушения Sweet Spot правил. Убедитесь что energy_range корректно задан для всех targets.')
    }

    // Общие рекомендации
    if (testSuite.summary.errors > testSuite.summary.totalTests * 0.3) {
      recommendations.push('Высокий процент ошибок в уровне. Рекомендуется полная ревизия конфигурации.')
    }

    if (recommendations.length === 0) {
      recommendations.push('Уровень прошел все проверки успешно. Никаких действий не требуется.')
    }

    return recommendations
  }

  /**
   * Создание отчета об ошибке
   */
  private createErrorReport(level: Level, error: any): LevelValidationReport {
    return {
      levelOrder: level.registryOrder || 0,
      levelId: level.metadata.level_id,
      timestamp: new Date().toISOString(),
      testSuites: {
        levelId: level.metadata.level_id,
        levelOrder: level.registryOrder || 0,
        tests: {
          uniqueness: [],
          energyValidation: [],
          sweetSpotValidation: []
        },
        summary: {
          totalTests: 1,
          passed: 0,
          failed: 1,
          warnings: 0,
          errors: 1
        }
      },
      recommendations: ['Критическая ошибка при тестировании. Проверьте консоль для деталей.'],
      overallStatus: 'critical'
    }
  }

  /**
   * Загрузка всех уровней для сравнения
   */
  private async loadAllLevelsForComparison(): Promise<Level[]> {
    const levels: Level[] = []
    const availableLevels = levelManager.getAvailableLevels()

    for (const levelInfo of availableLevels) {
      try {
        const level = await levelManager.loadLevelByOrder(levelInfo.id)
        if (level) {
          levels.push(level)
        }
      } catch (error) {
        console.warn(`Не удалось загрузить уровень ${levelInfo.id} для сравнения:`, error)
      }
    }

    return levels
  }

  /**
   * Генерация сводной статистики
   */
  private generateSummaryStats(reports: LevelValidationReport[]): void {
    const totalLevels = reports.length
    const passedLevels = reports.filter(r => r.overallStatus === 'passed').length
    const warningLevels = reports.filter(r => r.overallStatus === 'warning').length
    const failedLevels = reports.filter(r => r.overallStatus === 'failed').length
    const criticalLevels = reports.filter(r => r.overallStatus === 'critical').length

    console.log(`📊 LEVEL_TEST_RUNNER: СВОДНАЯ СТАТИСТИКА`)
    console.log(`📊 Всего уровней: ${totalLevels}`)
    console.log(`✅ Прошли проверку: ${passedLevels} (${(passedLevels/totalLevels*100).toFixed(1)}%)`)
    console.log(`⚠️ С предупреждениями: ${warningLevels} (${(warningLevels/totalLevels*100).toFixed(1)}%)`)
    console.log(`❌ С ошибками: ${failedLevels} (${(failedLevels/totalLevels*100).toFixed(1)}%)`)
    console.log(`🚨 Критические ошибки: ${criticalLevels} (${(criticalLevels/totalLevels*100).toFixed(1)}%)`)

    if (criticalLevels > 0) {
      console.log(`🚨 ВНИМАНИЕ: Обнаружены уровни с критическими ошибками!`)
      const criticalReports = reports.filter(r => r.overallStatus === 'critical')
      criticalReports.forEach(r => {
        console.log(`  - Уровень ${r.levelOrder}: ${r.recommendations.join(', ')}`)
      })
    }
  }
}