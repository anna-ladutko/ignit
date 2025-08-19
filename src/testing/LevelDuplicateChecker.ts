/**
 * LevelDuplicateChecker
 * Детекция дубликатов уровней по контенту, структуре и метаданным
 * Предотвращает проблему когда разные JSON файлы содержат идентичный контент
 */

import type { Level } from '../types'
import type { DuplicateCheckResult, TestResult } from './types'

export class LevelDuplicateChecker {
  private loadedLevels: Map<string, Level> = new Map()

  /**
   * Добавить уровень в базу для сравнения
   */
  addLevel(level: Level): void {
    const levelKey = level.registryOrder?.toString() || level.metadata.level_id
    this.loadedLevels.set(levelKey, level)
    console.log(`📚 DUPLICATE_CHECKER: Добавлен уровень ${levelKey} для сравнения`)
  }

  /**
   * Проверить уровень на дубликаты со всеми загруженными уровнями
   */
  checkForDuplicates(level: Level): TestResult[] {
    const results: TestResult[] = []
    const levelKey = level.registryOrder?.toString() || level.metadata.level_id

    console.log(`🔍 DUPLICATE_CHECKER: Проверяем уровень ${levelKey} на дубликаты...`)

    for (const [existingKey, existingLevel] of this.loadedLevels) {
      // Не сравниваем уровень сам с собой
      if (existingKey === levelKey) continue

      const duplicateResult = this.compareLevels(level, existingLevel)
      
      if (duplicateResult.isDuplicate) {
        results.push({
          passed: false,
          message: `Уровень ${levelKey} является дубликатом уровня ${existingKey}`,
          details: {
            similarityScore: duplicateResult.similarityScore,
            differences: duplicateResult.differences
          },
          severity: 'critical'
        })
      } else if (duplicateResult.similarityScore > 0.8) {
        results.push({
          passed: true,
          message: `Уровень ${levelKey} очень похож на уровень ${existingKey} (${(duplicateResult.similarityScore * 100).toFixed(1)}% сходства)`,
          details: {
            similarityScore: duplicateResult.similarityScore,
            differences: duplicateResult.differences
          },
          severity: 'warning'
        })
      }
    }

    if (results.length === 0) {
      results.push({
        passed: true,
        message: `Уровень ${levelKey} уникален`,
        severity: 'info'
      })
    }

    return results
  }

  /**
   * Детальное сравнение двух уровней
   */
  private compareLevels(level1: Level, level2: Level): DuplicateCheckResult {
    console.log(`🔬 DUPLICATE_CHECKER: Сравниваем уровни ${level1.metadata.level_id} и ${level2.metadata.level_id}`)

    const differences = {
      metadata: [] as string[],
      circuit: [] as string[],
      components: [] as string[]
    }

    let totalChecks = 0
    let matchingChecks = 0

    // 1. Сравнение метаданных (исключая UUID и временные метки)
    const metadata1 = this.normalizeMetadata(level1.metadata)
    const metadata2 = this.normalizeMetadata(level2.metadata)
    
    const metadataComparison = this.compareObjects(metadata1, metadata2, 'metadata')
    differences.metadata = metadataComparison.differences
    totalChecks += metadataComparison.totalChecks
    matchingChecks += metadataComparison.matchingChecks

    // 2. Сравнение source
    const sourceComparison = this.compareObjects(
      this.normalizeSource(level1.circuit_definition.source),
      this.normalizeSource(level2.circuit_definition.source),
      'source'
    )
    differences.circuit.push(...sourceComparison.differences)
    totalChecks += sourceComparison.totalChecks
    matchingChecks += sourceComparison.matchingChecks

    // 3. Сравнение targets
    const targetsComparison = this.compareTargets(level1.circuit_definition.targets, level2.circuit_definition.targets)
    differences.circuit.push(...targetsComparison.differences)
    totalChecks += targetsComparison.totalChecks
    matchingChecks += targetsComparison.matchingChecks

    // 4. Сравнение available components
    const componentsComparison = this.compareComponents(
      level1.circuit_definition.available_components,
      level2.circuit_definition.available_components
    )
    differences.components = componentsComparison.differences
    totalChecks += componentsComparison.totalChecks
    matchingChecks += componentsComparison.matchingChecks

    const similarityScore = totalChecks > 0 ? matchingChecks / totalChecks : 0
    const isDuplicate = similarityScore > 0.95 // 95% сходства считается дубликатом

    console.log(`📊 DUPLICATE_CHECKER: Сходство: ${(similarityScore * 100).toFixed(1)}% (${matchingChecks}/${totalChecks})`)
    console.log(`🔍 DUPLICATE_CHECKER: Дубликат: ${isDuplicate ? 'ДА' : 'НЕТ'}`)

    return {
      isDuplicate,
      duplicateWith: isDuplicate ? level2.metadata.level_id : undefined,
      similarityScore,
      differences
    }
  }

  /**
   * Нормализация метаданных для сравнения (исключаем уникальные поля)
   */
  private normalizeMetadata(metadata: any): any {
    const normalized = { ...metadata }
    // Исключаем поля которые всегда должны быть уникальными
    delete normalized.level_id
    delete normalized.generation_timestamp
    delete normalized.generator_version
    delete normalized.display_name
    delete normalized.display_description
    delete normalized.game_order
    return normalized
  }

  /**
   * Нормализация source для сравнения
   */
  private normalizeSource(source: any): any {
    return {
      voltage: source.voltage,
      energy_output: source.energy_output,
      is_stable: source.is_stable
      // position исключаем так как может отличаться
    }
  }

  /**
   * Сравнение массива targets
   */
  private compareTargets(targets1: any[], targets2: any[]): { differences: string[]; totalChecks: number; matchingChecks: number } {
    const differences: string[] = []
    let totalChecks = 1
    let matchingChecks = 0

    // Сравниваем количество targets
    if (targets1.length !== targets2.length) {
      differences.push(`Разное количество targets: ${targets1.length} vs ${targets2.length}`)
    } else {
      matchingChecks++
    }

    // Нормализуем и сравниваем targets (сортируем по energy_range)
    const norm1 = targets1.map(t => ({
      type: t.type,
      energy_range: t.energy_range,
      color: t.color
    })).sort((a, b) => a.energy_range[0] - b.energy_range[0])

    const norm2 = targets2.map(t => ({
      type: t.type,
      energy_range: t.energy_range,
      color: t.color
    })).sort((a, b) => a.energy_range[0] - b.energy_range[0])

    totalChecks += norm1.length
    for (let i = 0; i < Math.min(norm1.length, norm2.length); i++) {
      const target1 = norm1[i]
      const target2 = norm2[i]
      
      if (JSON.stringify(target1) === JSON.stringify(target2)) {
        matchingChecks++
      } else {
        differences.push(`Target ${i} отличается: ${JSON.stringify(target1)} vs ${JSON.stringify(target2)}`)
      }
    }

    return { differences, totalChecks, matchingChecks }
  }

  /**
   * Сравнение массива available components
   */
  private compareComponents(components1: any[], components2: any[]): { differences: string[]; totalChecks: number; matchingChecks: number } {
    const differences: string[] = []
    let totalChecks = 1
    let matchingChecks = 0

    // Сравниваем количество компонентов
    if (components1.length !== components2.length) {
      differences.push(`Разное количество компонентов: ${components1.length} vs ${components2.length}`)
    } else {
      matchingChecks++
    }

    // Нормализуем компоненты для сравнения (исключаем id и position)
    const norm1 = components1.map(c => ({
      type: c.type,
      nominal_value: c.nominal_value,
      actual_value: c.actual_value,
      quantity: c.quantity,
      is_red_herring: c.is_red_herring,
      resistance: c.resistance
    })).sort((a, b) => (a.nominal_value || 0) - (b.nominal_value || 0))

    const norm2 = components2.map(c => ({
      type: c.type,
      nominal_value: c.nominal_value,
      actual_value: c.actual_value,
      quantity: c.quantity,
      is_red_herring: c.is_red_herring,
      resistance: c.resistance
    })).sort((a, b) => (a.nominal_value || 0) - (b.nominal_value || 0))

    totalChecks += norm1.length
    for (let i = 0; i < Math.min(norm1.length, norm2.length); i++) {
      const comp1 = norm1[i]
      const comp2 = norm2[i]
      
      if (JSON.stringify(comp1) === JSON.stringify(comp2)) {
        matchingChecks++
      } else {
        differences.push(`Component ${i} отличается: ${JSON.stringify(comp1)} vs ${JSON.stringify(comp2)}`)
      }
    }

    return { differences, totalChecks, matchingChecks }
  }

  /**
   * Универсальное сравнение объектов
   */
  private compareObjects(obj1: any, obj2: any, category: string): { differences: string[]; totalChecks: number; matchingChecks: number } {
    const differences: string[] = []
    const keys = new Set([...Object.keys(obj1), ...Object.keys(obj2)])
    let totalChecks = keys.size
    let matchingChecks = 0

    for (const key of keys) {
      if (obj1[key] === obj2[key]) {
        matchingChecks++
      } else {
        differences.push(`${category}.${key}: ${obj1[key]} vs ${obj2[key]}`)
      }
    }

    return { differences, totalChecks, matchingChecks }
  }

  /**
   * Очистить базу уровней
   */
  clear(): void {
    this.loadedLevels.clear()
    console.log(`🗑️ DUPLICATE_CHECKER: База уровней очищена`)
  }

  /**
   * Получить статистику
   */
  getStats(): { totalLevels: number; levelIds: string[] } {
    return {
      totalLevels: this.loadedLevels.size,
      levelIds: Array.from(this.loadedLevels.keys())
    }
  }
}