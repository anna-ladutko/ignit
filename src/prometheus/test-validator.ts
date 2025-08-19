/**
 * Тестирование PrometheusValidator на реальных уровнях
 */

import { PrometheusValidator } from './PrometheusValidator'
import type { Level } from '../types'

// Импортируем уровни для тестирования
async function loadLevel(order: number): Promise<Level> {
  const response = await fetch(`/levels/level-${order.toString().padStart(3, '0')}.json`)
  if (!response.ok) {
    throw new Error(`Failed to load level ${order}`)
  }
  return response.json()
}

export async function testPrometheusValidator() {
  console.log('🧪 PROMETHEUS_TEST: Начинаем тестирование валидатора')
  
  const validator = new PrometheusValidator()
  
  // Тестируем на известных проблемных уровнях
  const problemLevels = [1, 6, 8]
  
  for (const levelOrder of problemLevels) {
    try {
      console.log(`\n📋 PROMETHEUS_TEST: Анализируем уровень ${levelOrder}`)
      
      const level = await loadLevel(levelOrder)
      const result = validator.validateLevel(level)
      
      console.log(`📊 PROMETHEUS_TEST: Результаты для уровня ${levelOrder}:`)
      console.log(`   Валидный: ${result.isValid}`)
      console.log(`   Ошибки: ${result.errors.length}`)
      console.log(`   Предупреждения: ${result.warnings.length}`)
      
      if (result.errors.length > 0) {
        console.log('🚨 Критические ошибки:')
        result.errors.forEach((error, i) => {
          console.log(`   ${i + 1}. ${error}`)
        })
      }
      
      if (result.warnings.length > 0) {
        console.log('⚠️ Предупреждения:')
        result.warnings.forEach((warning, i) => {
          console.log(`   ${i + 1}. ${warning}`)
        })
      }
      
      if (result.suggestions.length > 0) {
        console.log('💡 Рекомендации:')
        result.suggestions.forEach((suggestion, i) => {
          console.log(`   ${i + 1}. ${suggestion}`)
        })
      }
      
      // Демонстрируем исправленный уровень
      if (!result.isValid) {
        console.log(`\n🔧 PROMETHEUS_TEST: Генерируем исправленную версию уровня ${levelOrder}`)
        const correctedLevel = validator.generateCorrectedLevel(level, result)
        
        // Проверяем исправленный уровень
        const correctedResult = validator.validateLevel(correctedLevel)
        console.log(`✅ Исправленный уровень валидный: ${correctedResult.isValid}`)
        
        if (correctedResult.isValid) {
          console.log(`📈 Новый expected_score: ${correctedLevel.solution_data?.optimal_solution?.expected_score?.toFixed(1)}%`)
        }
      }
      
    } catch (error) {
      console.error(`❌ PROMETHEUS_TEST: Ошибка при тестировании уровня ${levelOrder}:`, error)
    }
  }
  
  console.log('\n🎯 PROMETHEUS_TEST: Тестирование завершено')
}

// Функция для интеграции в Debug Panel
export function runPrometheusValidation(level: Level) {
  const validator = new PrometheusValidator()
  return validator.validateLevel(level)
}

export function generateCorrectedLevel(level: Level) {
  const validator = new PrometheusValidator()
  const validationResult = validator.validateLevel(level)
  
  if (!validationResult.isValid) {
    return validator.generateCorrectedLevel(level, validationResult)
  }
  
  return level // Уже корректный
}

// Тестирование SweetSpotGenerator
export async function testSweetSpotGenerator() {
  console.log('🎯 SWEETSPOT_TEST: Тестируем генератор Sweet Spot')
  
  try {
    // Загружаем проблемный уровень 008
    const level008 = await loadLevel(8)
    
    // Импортируем SweetSpotGenerator
    const { SweetSpotGenerator } = await import('./SweetSpotGenerator')
    const generator = new SweetSpotGenerator()
    
    // Генерируем исправленные Sweet Spot диапазоны
    const generationResult = generator.generateCorrectSweetSpots(level008)
    
    console.log('📊 SWEETSPOT_TEST: Результаты генерации для уровня 008:')
    console.log('Оригинальные targets:')
    generationResult.originalTargets.forEach(target => {
      console.log(`  ${target.id}: [${target.originalRange[0].toFixed(1)}-${target.originalRange[1].toFixed(1)}] EU, получает ${target.deliveredEnergy.toFixed(1)} EU`)
    })
    
    console.log('Исправленные targets:')
    generationResult.correctedTargets.forEach(target => {
      console.log(`  ${target.id}: [${target.correctedRange[0].toFixed(1)}-${target.correctedRange[1].toFixed(1)}] EU, улучшение ${target.improvementFactor.toFixed(1)}%`)
    })
    
    console.log(`Общее улучшение: ${generationResult.overallImprovement.toFixed(1)}%`)
    console.log(`Новый expected_score: ${generationResult.energyBalance.newExpectedScore.toFixed(1)}%`)
    
    // Применяем исправления
    const correctedLevel = generator.applyCorrectedSweetSpots(level008, generationResult)
    
    // Проверяем исправленный уровень
    const validator = new PrometheusValidator()
    const correctedValidation = validator.validateLevel(correctedLevel)
    
    console.log(`✅ SWEETSPOT_TEST: Исправленный уровень валидный: ${correctedValidation.isValid}`)
    console.log(`   Ошибки: ${correctedValidation.errors.length}`)
    console.log(`   Предупреждения: ${correctedValidation.warnings.length}`)
    
    return {
      generationResult,
      correctedLevel,
      validationResult: correctedValidation
    }
    
  } catch (error) {
    console.error('❌ SWEETSPOT_TEST: Ошибка при тестировании:', error)
    throw error
  }
}