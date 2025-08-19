/**
 * Types for Level Testing System
 * Поддерживает все виды тестирования уровней: дубликаты, энергию, Sweet Spot
 */

import type { Level } from '../types'

export interface TestResult {
  passed: boolean
  message: string
  details?: any
  severity: 'info' | 'warning' | 'error' | 'critical'
}

export interface LevelTestSuite {
  levelId: string
  levelOrder: number
  tests: {
    uniqueness: TestResult[]
    energyValidation: TestResult[]
    sweetSpotValidation: TestResult[]
  }
  summary: {
    totalTests: number
    passed: number
    failed: number
    warnings: number
    errors: number
  }
}

export interface EnergyTestScenario {
  name: string
  description: string
  components: Array<{
    id: string
    type: string
    position: { x: number; y: number }
    rotation?: number
  }>
  connections: Array<{
    from: string
    to: string
  }>
  expectedResults: {
    totalUsefulEnergy: number
    efficiency: number
    targetsInSweetSpot: string[]
    energyConservation: boolean
  }
}

export interface SweetSpotTestCase {
  targetId: string
  sweetSpotRange: [number, number]
  testValues: Array<{
    deliveredEnergy: number
    expectedUseful: number
    expectedInRange: boolean
  }>
}

export interface DuplicateCheckResult {
  isDuplicate: boolean
  duplicateWith?: string
  similarityScore: number
  differences: {
    metadata: string[]
    circuit: string[]
    components: string[]
  }
}

export interface LevelValidationReport {
  levelOrder: number
  levelId: string
  timestamp: string
  testSuites: LevelTestSuite
  recommendations: string[]
  overallStatus: 'passed' | 'warning' | 'failed' | 'critical'
}