import React, { useState, useEffect } from 'react'
import { Box, Typography, Paper, Collapse, IconButton, Button, Chip } from '@mui/material'
import { 
  BugReport as BugIcon, 
  ExpandMore as ExpandMoreIcon, 
  ExpandLess as ExpandLessIcon,
  PlayArrow as TestIcon,
  CheckCircle as PassedIcon,
  Error as ErrorIcon,
  Warning as WarningIcon
} from '@mui/icons-material'
import { motion } from 'framer-motion'
import { BORDER_RADIUS } from '../../../../constants/design'
import { levelTestRunner } from '../../../../testing'
import type { TestResult, LevelValidationReport } from '../../../../testing/types'
import type { Level } from '../../../../types'

interface DebugPanelProps {
  isVisible?: boolean
  level?: Level | null
}

export const DebugPanel: React.FC<DebugPanelProps> = ({ isVisible = true, level = null }) => {
  const [debugData, setDebugData] = useState<any>(null)
  const [isExpanded, setIsExpanded] = useState(true)
  const [testResults, setTestResults] = useState<TestResult[]>([])
  const [isRunningTests, setIsRunningTests] = useState(false)
  const [activeTestTab, setActiveTestTab] = useState<'efficiency' | 'testing'>('efficiency')

  // Polling для обновления debug данных из window.debugEfficiency
  useEffect(() => {
    const interval = setInterval(() => {
      if (window.debugEfficiency) {
        setDebugData({ ...window.debugEfficiency })
      }
    }, 2000) // УМЕНЬШЕНО: Обновляем каждые 2 секунды для стабильности

    return () => clearInterval(interval)
  }, [])

  // Функции для запуска тестов
  const runQuickTest = async (testType: 'duplicates' | 'energy' | 'sweetspot' | 'all') => {
    if (!level || isRunningTests) return

    setIsRunningTests(true)
    setTestResults([])

    try {
      const levelOrder = level.registryOrder || 1
      console.log(`🧪 DEBUG_PANEL: Запускаем ${testType} тест для уровня ${levelOrder}`)
      
      const results = await levelTestRunner.runQuickCheck(levelOrder, testType)
      setTestResults(results)
      
      console.log(`✅ DEBUG_PANEL: Тест завершен, результатов: ${results.length}`)
      results.forEach((result, index) => {
        const status = result.passed ? '✅' : '❌'
        console.log(`  ${status} ${index + 1}. ${result.message}`)
      })
      
    } catch (error) {
      console.error('❌ DEBUG_PANEL: Ошибка при запуске теста:', error)
      setTestResults([{
        passed: false,
        message: `Ошибка теста: ${error.message}`,
        severity: 'critical'
      }])
    } finally {
      setIsRunningTests(false)
    }
  }

  const runFullValidation = async () => {
    if (!level || isRunningTests) return

    setIsRunningTests(true)
    setTestResults([])

    try {
      console.log('🧪 DEBUG_PANEL: Запускаем полную валидацию уровня')
      
      const report = await levelTestRunner.validateSingleLevel(level)
      
      // Собираем все результаты из отчета
      const allResults: TestResult[] = [
        ...report.testSuites.tests.uniqueness,
        ...report.testSuites.tests.energyValidation,
        ...report.testSuites.tests.sweetSpotValidation
      ]
      
      setTestResults(allResults)
      console.log(`✅ DEBUG_PANEL: Полная валидация завершена, статус: ${report.overallStatus}`)
      
    } catch (error) {
      console.error('❌ DEBUG_PANEL: Ошибка при полной валидации:', error)
      setTestResults([{
        passed: false,
        message: `Ошибка валидации: ${error.message}`,
        severity: 'critical'
      }])
    } finally {
      setIsRunningTests(false)
    }
  }

  // Prometheus testing
  const runPrometheusTest = () => {
    if (!level || isRunningTests) return
    
    setIsRunningTests(true)
    setTestResults([])
    
    // Динамический импорт для тестирования
    import('../../../../prometheus/test-validator').then(({ runPrometheusValidation }) => {
      try {
        const result = runPrometheusValidation(level)
        console.log('🔍 PROMETHEUS_DEBUG: Результаты валидации:', result)
        
        // Показываем результаты в UI
        const testResults = [
          {
            passed: result.isValid,
            message: `Prometheus валидация: ${result.isValid ? 'PASSED' : 'FAILED'}`,
            details: {
              errors: result.errors.length,
              warnings: result.warnings.length,
              suggestions: result.suggestions.length
            },
            severity: result.isValid ? 'info' : 'error' as const
          }
        ]
        
        // Добавляем детали ошибок
        result.errors.forEach(error => {
          testResults.push({
            passed: false,
            message: `❌ ${error}`,
            severity: 'critical' as const
          })
        })
        
        // Добавляем предупреждения
        result.warnings.forEach(warning => {
          testResults.push({
            passed: false,
            message: `⚠️ ${warning}`,
            severity: 'warning' as const
          })
        })
        
        // Добавляем рекомендации
        result.suggestions.forEach(suggestion => {
          testResults.push({
            passed: true,
            message: `💡 ${suggestion}`,
            severity: 'info' as const
          })
        })
        
        setTestResults(testResults)
      } catch (error) {
        console.error('❌ PROMETHEUS_DEBUG: Ошибка валидации:', error)
        setTestResults([{
          passed: false,
          message: `Ошибка Prometheus валидации: ${error.message}`,
          severity: 'critical'
        }])
      } finally {
        setIsRunningTests(false)
      }
    }).catch(error => {
      console.error('❌ PROMETHEUS_DEBUG: Ошибка импорта:', error)
      setTestResults([{
        passed: false,
        message: `Ошибка загрузки Prometheus валидатора: ${error.message}`,
        severity: 'critical'
      }])
      setIsRunningTests(false)
    })
  }

  // Тестирование исправленного уровня
  const testCorrectedLevel = () => {
    if (!level || isRunningTests) return
    
    setIsRunningTests(true)
    setTestResults([])
    
    // Тестируем генератор Sweet Spot и исправленный уровень
    import('../../../../prometheus/test-validator').then(({ testSweetSpotGenerator }) => {
      testSweetSpotGenerator().then(result => {
        console.log('🎯 CORRECTED_LEVEL_TEST: Результаты:', result)
        
        const testResults = [
          {
            passed: result.validationResult.isValid,
            message: `Исправленный уровень: ${result.validationResult.isValid ? 'PASSED' : 'FAILED'}`,
            severity: result.validationResult.isValid ? 'info' : 'error' as const
          },
          {
            passed: true,
            message: `Общее улучшение: ${result.generationResult.overallImprovement.toFixed(1)}%`,
            severity: 'info' as const
          },
          {
            passed: true,
            message: `Новый expected_score: ${result.generationResult.energyBalance.newExpectedScore.toFixed(1)}%`,
            severity: 'info' as const
          }
        ]
        
        // Добавляем детали исправлений
        result.generationResult.correctedTargets.forEach(target => {
          testResults.push({
            passed: true,
            message: `${target.id}: [${target.correctedRange[0].toFixed(1)}-${target.correctedRange[1].toFixed(1)}] EU`,
            severity: 'info' as const
          })
        })
        
        setTestResults(testResults)
        setIsRunningTests(false)
      }).catch(error => {
        console.error('❌ CORRECTED_LEVEL_TEST: Ошибка:', error)
        setTestResults([{
          passed: false,
          message: `Ошибка тестирования исправленного уровня: ${error.message}`,
          severity: 'critical'
        }])
        setIsRunningTests(false)
      })
    }).catch(error => {
      console.error('❌ CORRECTED_LEVEL_TEST: Ошибка импорта:', error)
      setTestResults([{
        passed: false,
        message: `Ошибка загрузки тестов: ${error.message}`,
        severity: 'critical'
      }])
      setIsRunningTests(false)
    })
  }

  if (!isVisible) {
    return null
  }

  // Показываем панель если есть данные эффективности ИЛИ если активен режим тестирования
  if (!debugData && activeTestTab === 'efficiency') {
    return null
  }

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 16,
        right: 16,
        zIndex: 2000,
        maxWidth: '300px',
      }}
    >
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Paper
          elevation={8}
          sx={{
            backgroundColor: 'rgba(0, 0, 0, 0.85)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: BORDER_RADIUS.PANEL,
            overflow: 'hidden',
          }}
        >
          {/* Header */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              p: 1.5,
              borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <BugIcon sx={{ fontSize: '16px', color: '#4ECDC4' }} />
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Button
                  size="small"
                  onClick={() => setActiveTestTab('efficiency')}
                  sx={{
                    fontSize: '10px',
                    minWidth: 'auto',
                    px: 1,
                    py: 0.5,
                    color: activeTestTab === 'efficiency' ? '#4ECDC4' : 'rgba(255, 255, 255, 0.6)',
                    backgroundColor: activeTestTab === 'efficiency' ? 'rgba(78, 205, 196, 0.1)' : 'transparent',
                    '&:hover': { backgroundColor: 'rgba(78, 205, 196, 0.2)' }
                  }}
                >
                  Efficiency
                </Button>
                <Button
                  size="small"
                  onClick={() => setActiveTestTab('testing')}
                  sx={{
                    fontSize: '10px',
                    minWidth: 'auto',
                    px: 1,
                    py: 0.5,
                    color: activeTestTab === 'testing' ? '#FF6B6B' : 'rgba(255, 255, 255, 0.6)',
                    backgroundColor: activeTestTab === 'testing' ? 'rgba(255, 107, 107, 0.1)' : 'transparent',
                    '&:hover': { backgroundColor: 'rgba(255, 107, 107, 0.2)' }
                  }}
                >
                  Testing
                </Button>
              </Box>
            </Box>
            
            <IconButton
              size="small"
              onClick={() => setIsExpanded(!isExpanded)}
              sx={{
                color: 'rgba(255, 255, 255, 0.7)',
                '&:hover': { color: '#4ECDC4' },
              }}
            >
              {isExpanded ? <ExpandLessIcon fontSize="small" /> : <ExpandMoreIcon fontSize="small" />}
            </IconButton>
          </Box>

          {/* Content */}
          <Collapse in={isExpanded}>
            <Box sx={{ p: 1.5, fontFamily: 'monospace' }}>
              {activeTestTab === 'efficiency' ? (
                // Оригинальная панель эффективности
                <>
                  {/* Source Energy */}
                  <Box sx={{ mb: 1 }}>
                    <Typography variant="body2" sx={{ fontSize: '11px', color: 'rgba(255, 255, 255, 0.6)' }}>
                      Source Output:
                    </Typography>
                    <Typography variant="body2" sx={{ fontSize: '12px', color: '#FFEAA7', fontWeight: 600 }}>
                      {debugData?.sourceEnergyOutput?.toFixed(1)} EU
                    </Typography>
                  </Box>

                  {/* Target Results */}
                  <Box sx={{ mb: 1 }}>
                    <Typography variant="body2" sx={{ fontSize: '11px', color: 'rgba(255, 255, 255, 0.6)', mb: 0.5 }}>
                      Targets:
                    </Typography>
                    {debugData?.targetResults?.map((target: any, index: number) => (
                      <Box key={target.targetId} sx={{ mb: 0.5, pl: 1 }}>
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            fontSize: '11px', 
                            color: !target.isConnected ? '#FF4444' : 
                                   target.isInSweetSpot ? '#96CEB4' : '#FF6B6B',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 0.5
                          }}
                        >
                          <span>Target {index + 1}:</span>
                          {!target.isConnected ? (
                            <>
                              <span style={{ fontWeight: 600, color: '#FF4444' }}>DISCONNECTED</span>
                              <span>❌</span>
                            </>
                          ) : (
                            <>
                              <span style={{ fontWeight: 600 }}>{target.deliveredEnergy?.toFixed(1)} EU</span>
                              <span style={{ fontSize: '10px' }}>
                                ({target.energyRange?.[0]}-{target.energyRange?.[1]})
                              </span>
                              {target.isInSweetSpot ? '✓' : '✗'}
                            </>
                          )}
                        </Typography>
                      </Box>
                    ))}
                  </Box>

                  {/* Total Useful Energy */}
                  <Box sx={{ mb: 1 }}>
                    <Typography variant="body2" sx={{ fontSize: '11px', color: 'rgba(255, 255, 255, 0.6)' }}>
                      Total Useful Energy:
                    </Typography>
                    <Typography variant="body2" sx={{ fontSize: '12px', color: '#96CEB4', fontWeight: 600 }}>
                      {debugData?.totalUsefulEnergy?.toFixed(1)} EU
                    </Typography>
                  </Box>

                  {/* Calculated Efficiency */}
                  <Box sx={{ mb: 1 }}>
                    <Typography variant="body2" sx={{ fontSize: '11px', color: 'rgba(255, 255, 255, 0.6)' }}>
                      Calculated Efficiency:
                    </Typography>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        fontSize: '14px', 
                        color: debugData?.efficiency > 50 ? '#96CEB4' : '#FF6B6B',
                        fontWeight: 700 
                      }}
                    >
                      {debugData?.efficiency?.toFixed(1)}%
                    </Typography>
                  </Box>

                  {/* Expected vs Actual */}
                  <Box sx={{ pt: 1, borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
                    <Typography variant="body2" sx={{ fontSize: '11px', color: 'rgba(255, 255, 255, 0.6)' }}>
                      Expected (from level):
                    </Typography>
                    <Typography variant="body2" sx={{ fontSize: '12px', color: '#DDA0DD', fontWeight: 600 }}>
                      {debugData?.expectedScore?.toFixed(1)}%
                    </Typography>
                    
                    {debugData?.expectedScore > 0 && (
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          fontSize: '10px', 
                          color: 'rgba(255, 255, 255, 0.5)',
                          mt: 0.5
                        }}
                      >
                        Diff: {(debugData.efficiency - debugData.expectedScore).toFixed(1)}%
                      </Typography>
                    )}
                  </Box>
                </>
              ) : (
                // Новая панель тестирования
                <>
                  {/* Test Controls */}
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" sx={{ fontSize: '11px', color: 'rgba(255, 255, 255, 0.6)', mb: 1 }}>
                      Quick Tests:
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      <Button
                        size="small"
                        onClick={() => runQuickTest('duplicates')}
                        disabled={isRunningTests || !level}
                        sx={{
                          fontSize: '9px',
                          minWidth: 'auto',
                          px: 1,
                          py: 0.5,
                          backgroundColor: 'rgba(255, 107, 107, 0.1)',
                          color: '#FF6B6B',
                          '&:hover': { backgroundColor: 'rgba(255, 107, 107, 0.2)' }
                        }}
                      >
                        Duplicates
                      </Button>
                      <Button
                        size="small"
                        onClick={() => runQuickTest('energy')}
                        disabled={isRunningTests || !level}
                        sx={{
                          fontSize: '9px',
                          minWidth: 'auto',
                          px: 1,
                          py: 0.5,
                          backgroundColor: 'rgba(255, 235, 59, 0.1)',
                          color: '#FFEB3B',
                          '&:hover': { backgroundColor: 'rgba(255, 235, 59, 0.2)' }
                        }}
                      >
                        Energy
                      </Button>
                      <Button
                        size="small"
                        onClick={() => runQuickTest('sweetspot')}
                        disabled={isRunningTests || !level}
                        sx={{
                          fontSize: '9px',
                          minWidth: 'auto',
                          px: 1,
                          py: 0.5,
                          backgroundColor: 'rgba(150, 206, 180, 0.1)',
                          color: '#96CEB4',
                          '&:hover': { backgroundColor: 'rgba(150, 206, 180, 0.2)' }
                        }}
                      >
                        Sweet Spot
                      </Button>
                      <Button
                        size="small"
                        onClick={runPrometheusTest}
                        disabled={isRunningTests || !level}
                        sx={{
                          fontSize: '9px',
                          minWidth: 'auto',
                          px: 1,
                          py: 0.5,
                          backgroundColor: 'rgba(156, 39, 176, 0.1)',
                          color: '#9C27B0',
                          '&:hover': { backgroundColor: 'rgba(156, 39, 176, 0.2)' }
                        }}
                      >
                        Prometheus
                      </Button>
                      <Button
                        size="small"
                        onClick={testCorrectedLevel}
                        disabled={isRunningTests || !level}
                        sx={{
                          fontSize: '9px',
                          minWidth: 'auto',
                          px: 1,
                          py: 0.5,
                          backgroundColor: 'rgba(76, 175, 80, 0.1)',
                          color: '#4CAF50',
                          '&:hover': { backgroundColor: 'rgba(76, 175, 80, 0.2)' }
                        }}
                      >
                        Test Fix
                      </Button>
                    </Box>
                    
                    <Button
                      size="small"
                      onClick={runFullValidation}
                      disabled={isRunningTests || !level}
                      startIcon={<TestIcon />}
                      sx={{
                        fontSize: '10px',
                        mt: 1,
                        width: '100%',
                        backgroundColor: 'rgba(78, 205, 196, 0.1)',
                        color: '#4ECDC4',
                        '&:hover': { backgroundColor: 'rgba(78, 205, 196, 0.2)' }
                      }}
                    >
                      {isRunningTests ? 'Running Tests...' : 'Full Validation'}
                    </Button>
                  </Box>

                  {/* Test Results */}
                  {testResults.length > 0 && (
                    <Box sx={{ pt: 1, borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
                      <Typography variant="body2" sx={{ fontSize: '11px', color: 'rgba(255, 255, 255, 0.6)', mb: 1 }}>
                        Results ({testResults.length}):
                      </Typography>
                      <Box sx={{ maxHeight: '200px', overflowY: 'auto' }}>
                        {testResults.map((result, index) => (
                          <Box key={index} sx={{ mb: 1, display: 'flex', alignItems: 'flex-start', gap: 0.5 }}>
                            {result.passed ? (
                              <PassedIcon sx={{ fontSize: '12px', color: '#96CEB4', mt: 0.25 }} />
                            ) : (
                              result.severity === 'critical' ? (
                                <ErrorIcon sx={{ fontSize: '12px', color: '#FF4444', mt: 0.25 }} />
                              ) : (
                                <WarningIcon sx={{ fontSize: '12px', color: '#FFB74D', mt: 0.25 }} />
                              )
                            )}
                            <Typography
                              variant="body2"
                              sx={{
                                fontSize: '10px',
                                color: result.passed ? '#96CEB4' : 
                                       result.severity === 'critical' ? '#FF4444' : '#FFB74D',
                                lineHeight: 1.3,
                                flex: 1
                              }}
                            >
                              {result.message}
                            </Typography>
                          </Box>
                        ))}
                      </Box>
                      
                      {/* Test Summary */}
                      <Box sx={{ mt: 1, pt: 1, borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Chip
                            label={`✓ ${testResults.filter(r => r.passed).length}`}
                            size="small"
                            sx={{
                              fontSize: '9px',
                              height: '20px',
                              backgroundColor: 'rgba(150, 206, 180, 0.2)',
                              color: '#96CEB4'
                            }}
                          />
                          <Chip
                            label={`✗ ${testResults.filter(r => !r.passed).length}`}
                            size="small"
                            sx={{
                              fontSize: '9px',
                              height: '20px',
                              backgroundColor: 'rgba(255, 68, 68, 0.2)',
                              color: '#FF4444'
                            }}
                          />
                        </Box>
                      </Box>
                    </Box>
                  )}

                  {!level && (
                    <Typography
                      variant="body2"
                      sx={{
                        fontSize: '11px',
                        color: 'rgba(255, 255, 255, 0.4)',
                        textAlign: 'center',
                        fontStyle: 'italic',
                        mt: 2
                      }}
                    >
                      No level loaded for testing
                    </Typography>
                  )}
                </>
              )}
            </Box>
          </Collapse>
        </Paper>
      </motion.div>
    </Box>
  )
}

export default DebugPanel

// Добавляем типы для window.debugEfficiency
declare global {
  interface Window {
    debugEfficiency?: {
      sourceEnergyOutput: number
      totalUsefulEnergy: number
      efficiency: number
      targetResults: Array<{
        targetId: string
        deliveredEnergy: number
        energyRange: [number, number]
        isInSweetSpot: boolean
        usefulEnergy: number
        isConnected: boolean
      }>
      expectedScore: number
    }
  }
}