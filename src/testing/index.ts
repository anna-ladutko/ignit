/**
 * Level Testing System Export
 * Главный экспорт всей системы тестирования уровней
 */

// Core testing classes
export { LevelDuplicateChecker } from './LevelDuplicateChecker'
export { EnergyValidationSuite } from './EnergyValidationSuite'
export { SweetSpotValidator } from './SweetSpotValidator'
export { LevelTestRunner } from './LevelTestRunner'

// Types
export type {
  TestResult,
  LevelTestSuite,
  LevelValidationReport,
  EnergyTestScenario,
  SweetSpotTestCase,
  DuplicateCheckResult
} from './types'

// Singleton instance for convenience
import { LevelTestRunner } from './LevelTestRunner'
export const levelTestRunner = new LevelTestRunner()