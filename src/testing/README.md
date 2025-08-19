# Level Testing System

Комплексная система тестирования уровней для Ignit Mobile Game, обеспечивающая валидацию трех критических областей:

1. **Level Uniqueness** - предотвращение дубликатов уровней
2. **Energy Calculations** - проверка что Total Useful Energy ≤ Source Energy Output
3. **Sweet Spot Rules** - валидация что энергия засчитывается как полезная только при попадании в Sweet Spot

## Архитектура

```
src/testing/
├── types.ts                 # TypeScript типы для системы тестирования
├── LevelDuplicateChecker.ts # Детекция дубликатов уровней
├── EnergyValidationSuite.ts # Проверка энергетических расчетов
├── SweetSpotValidator.ts    # Валидация Sweet Spot правил
├── LevelTestRunner.ts       # Координатор всех тестов
├── index.ts                 # Главный экспорт
└── README.md               # Документация
```

## Компоненты системы

### LevelDuplicateChecker

Детекция дубликатов уровней на основе анализа контента:

- **Нормализация данных**: Исключает уникальные поля (UUID, timestamps)
- **Сравнение структур**: Источники, цели, компоненты
- **Similarity Score**: Процент сходства между уровнями
- **Smart Detection**: 95%+ сходства = дубликат, 80%+ = предупреждение

```typescript
const duplicateChecker = new LevelDuplicateChecker()
duplicateChecker.addLevel(level1)
const results = duplicateChecker.checkForDuplicates(level2)
```

### EnergyValidationSuite

Автоматизированная проверка энергетических расчетов:

- **Energy Conservation**: Total Energy In = Total Energy Out
- **Source Validation**: Корректность свойств источника энергии
- **Target Properties**: Проверка Sweet Spot диапазонов
- **Optimal Solution**: Тестирование Prometheus решений
- **Edge Cases**: Граничные случаи и пустые цепи

```typescript
const energyValidator = new EnergyValidationSuite()
const results = energyValidator.validateLevel(level)
```

### SweetSpotValidator

Валидация Sweet Spot механики согласно Game Design 3.2:

- **Sweet Spot Definitions**: Корректность диапазонов энергии
- **Boundary Testing**: Точное попадание в границы диапазонов
- **Heat Loss Logic**: Энергия вне диапазона = 0 к эффективности
- **Efficiency Calculation**: Ручная проверка формулы эффективности
- **Supercapacitor Integration**: Взаимодействие с суперконденсатором

```typescript
const sweetSpotValidator = new SweetSpotValidator()
const results = sweetSpotValidator.validateSweetSpotRules(level)
```

### LevelTestRunner

Главный координатор всех тестов:

- **Full Validation**: Комплексное тестирование всех аспектов
- **Quick Checks**: Быстрые проверки конкретных областей
- **Reporting**: Детальные отчеты с рекомендациями
- **Batch Processing**: Тестирование всех уровней одновременно

```typescript
import { levelTestRunner } from './testing'

// Быстрая проверка
const results = await levelTestRunner.runQuickCheck(1, 'energy')

// Полная валидация
const report = await levelTestRunner.validateSingleLevel(level)

// Все уровни
const reports = await levelTestRunner.runFullValidation()
```

## Интеграция в Debug Panel

Система интегрирована в существующий Debug Panel через две вкладки:

### Efficiency Tab
- Оригинальная функциональность отладки эффективности
- Real-time данные из `window.debugEfficiency`
- Детализация расчетов по целям и Sweet Spot

### Testing Tab
- Быстрые тесты по категориям (Duplicates, Energy, Sweet Spot)
- Полная валидация уровня
- Визуализация результатов с иконками состояния
- Статистика прохождения тестов

## Использование

### В Debug Panel

1. Откройте любой уровень в игре
2. В правом верхнем углу найдите Debug Panel
3. Переключитесь на вкладку "Testing"
4. Выберите нужный тип теста или запустите полную валидацию

### Программно

```typescript
import { levelTestRunner, LevelDuplicateChecker } from '@/testing'

// Загрузить уровень
const level = await levelManager.loadLevelByOrder(1)

// Быстрые проверки
const duplicateResults = await levelTestRunner.runQuickCheck(1, 'duplicates')
const energyResults = await levelTestRunner.runQuickCheck(1, 'energy')
const sweetSpotResults = await levelTestRunner.runQuickCheck(1, 'sweetspot')

// Полная валидация
const fullReport = await levelTestRunner.validateSingleLevel(level)
console.log('Overall status:', fullReport.overallStatus)
console.log('Recommendations:', fullReport.recommendations)
```

## Test Result Types

```typescript
interface TestResult {
  passed: boolean
  message: string
  details?: any
  severity: 'info' | 'warning' | 'error' | 'critical'
}
```

- **info**: Информационные сообщения
- **warning**: Предупреждения (не блокируют)
- **error**: Ошибки требующие внимания
- **critical**: Критические ошибки требующие исправления

## Performance

- **Level Caching**: Уровни кэшируются для быстрых повторных проверок
- **Parallel Execution**: Независимые тесты выполняются параллельно
- **Lazy Loading**: Компоненты загружаются по требованию
- **Memory Management**: Автоматическая очистка кэшей

## Расширение

Для добавления новых тестов:

1. Создайте новый класс валидатора в `src/testing/`
2. Реализуйте методы возвращающие `TestResult[]`
3. Интегрируйте в `LevelTestRunner`
4. Добавьте в Debug Panel UI

```typescript
export class MyCustomValidator {
  validateCustomRules(level: Level): TestResult[] {
    const results: TestResult[] = []
    
    // Ваша логика тестирования
    if (customCondition) {
      results.push({
        passed: true,
        message: 'Custom test passed',
        severity: 'info'
      })
    }
    
    return results
  }
}
```

## Debugging

Все тесты логируют детальную информацию в консоль:

```javascript
console.log('🔍 DUPLICATE_CHECKER: Проверяем уровень на дубликаты...')
console.log('⚡ ENERGY_VALIDATOR: Начинаем валидацию уровня')
console.log('🎯 SWEETSPOT_VALIDATOR: Проверяем Sweet Spot правила')
```

Используйте консоль браузера для отслеживания выполнения тестов и диагностики проблем.