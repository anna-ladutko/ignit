import { useState, useEffect, useLayoutEffect, useRef, useCallback } from 'react'
import { GameEngine } from '../game/GameEngine.js'
import { CircuitSimulator } from '../game/circuitSimulator.ts'
import { initializeGameEngineBridge, cleanupGameEngineBridge } from '../utils/gameEngineBridge.ts'

/**
 * useGameEngine - React хук для управления игровым движком
 * Чистое разделение: React управляет данными, GameEngine - интерактивностью
 */
export const useGameEngine = (level) => {
  const gameEngineRef = useRef(null)
  const circuitSimulatorRef = useRef(null)
  
  // REACT STATE: Только данные для UI
  const [gameState, setGameState] = useState({
    currentScore: 0, // последний результат симуляции
    bestScore: 0, // лучший результат за все попытки
    energyUsed: 0,
    gameStatus: 'loading', // loading | playing (убрали auto-complete)
    placedComponents: [], // Финальные позиции для сохранения
    isSimulating: false,
    levelTime: 0, // время последней попытки в секундах
    bestTime: 0, // время лучшего score в секундах
    showSuccessModal: false, // показывать ли success модал
    hasValidSolution: false, // есть ли проходное решение (score > 50)
    attemptCount: 0, // количество симуляций
    canFinishLevel: false, // можно ли завершить уровень
    connectionPoints: [] // координаты активных магнитных соединений для визуализации
  })
  
  // Состояние готовности GameEngine - для контроля race condition
  const [gameEngineReady, setGameEngineReady] = useState(false)
  
  // Трекинг времени уровня
  const levelStartTimeRef = useRef(null)
  const levelTimerRef = useRef(null)
  
  // Метод для внешней инициализации GameEngine когда canvas готов
  const initializeGameEngine = useCallback((canvasElement) => {
    if (!canvasElement) {
      return
    }
    
    if (gameEngineRef.current) {
      return // Уже инициализирован
    }
    
    console.log('🔄 USEGAMEENGINE: Initializing GameEngine через callback ref...')
    console.log('🔄 USEGAMEENGINE: Canvas element:', canvasElement, 'размеры:', canvasElement.offsetWidth, 'x', canvasElement.offsetHeight)
    
    try {
      // Инициализируем SVG bridge перед созданием GameEngine
      initializeGameEngineBridge()
      
      // Создать CircuitSimulator
      circuitSimulatorRef.current = new CircuitSimulator()
      
      // Создать игровой движок с коллбэками
      gameEngineRef.current = new GameEngine(canvasElement, {
        onScoreChange: (score) => {
          setGameState(prev => ({ ...prev, score }))
        },
        
        onComponentPlace: (componentId, position) => {
          console.log(`🔄 CALLBACK: onComponentPlace вызван для componentId="${componentId}"`)
          // Обновить позицию компонента в React state
          setGameState(prev => {
            const updatedComponents = prev.placedComponents.map(comp => {
              if (comp.id === componentId) {
                const updatedComp = { ...comp, position }
                console.log(`🔄 CALLBACK: Обновляем компонент ${componentId}:`, updatedComp)
                console.log(`🔄 CALLBACK: originalComponentId сохранился="${updatedComp.originalComponentId}"`)
                return updatedComp
              }
              return comp
            })
            return {
              ...prev,
              placedComponents: updatedComponents
            }
          })
          // Пересчитать соединения после перемещения
          setTimeout(() => autoDetectConnections(), 0)
          // Component placed
        },
        
        onComponentRotate: (componentId, rotation) => {
          // Обновить поворот компонента в React state
          setGameState(prev => ({
            ...prev,
            placedComponents: prev.placedComponents.map(comp =>
              comp.id === componentId 
                ? { ...comp, rotation }
                : comp
            )
          }))
          // Пересчитать соединения после поворота
          setTimeout(() => autoDetectConnections(), 0)
          // Component rotated
        },
        
        onLevelComplete: () => {
          // УСТАРЕЛО: Этот callback больше не используется
          // Завершение уровня теперь происходит через finishLevel()
          console.log('useGameEngine: onLevelComplete called (legacy - now use finishLevel())')
        }
      })
      
      // Expose GameEngine globally for debugging
      window.gameEngine = gameEngineRef.current
      console.log('🔧 DEBUG: GameEngine exposed as window.gameEngine')
      
      setGameEngineReady(true)
      
    } catch (error) {
      console.error('❌ USEGAMEENGINE: Ошибка инициализации GameEngine:', error)
      setGameState(prev => ({ ...prev, gameStatus: 'failed' }))
    }
  }, []) // КРИТИЧЕСКИ ВАЖНО: пустые dependencies для стабильности
  
  
  // Загрузка уровня - ЖДЕМ ГОТОВНОСТИ GameEngine
  useEffect(() => {
    // useEffect triggered
    
    if (!gameEngineReady) {
      return
    }
    
    if (!level) {
      return
    }
    
    if (!gameEngineRef.current) {
      console.error('❌ USEGAMEENGINE: GameEngine ready=true но ref=null! Это не должно происходить.')
      return
    }
    
    // Начинаем загрузку уровня
    
    try {
      // Подготовить данные уровня для игрового движка
      const levelData = prepareLevelData(level)
      
      // Загрузить в движок
      gameEngineRef.current.loadLevel(levelData)
      
      // Загрузить уровень в CircuitSimulator
      if (circuitSimulatorRef.current) {
        circuitSimulatorRef.current.loadLevel(level)
      }
      
      // Запустить таймер уровня
      levelStartTimeRef.current = Date.now()
      console.log('⏱️ TIMER: Level timer started at', new Date(levelStartTimeRef.current).toLocaleTimeString())
      
      // Обновить React state
      // Обновляем React state
      setGameState(prev => ({
        ...prev,
        placedComponents: levelData.preinstalledComponents || [],
        gameStatus: 'playing',
        currentScore: 0,
        bestScore: 0,
        energyUsed: 0,
        levelTime: 0,
        bestTime: 0,
        hasValidSolution: false,
        attemptCount: 0,
        canFinishLevel: false,
        connectionPoints: []
      }))
      // Уровень загружен
      
    } catch (error) {
      console.error('❌ USEGAMEENGINE: Ошибка загрузки уровня:', error)
      setGameState(prev => ({ ...prev, gameStatus: 'failed' }))
    }
    
  }, [level?.metadata?.level_id, gameEngineReady]) // ИСПРАВЛЕНО: используем стабильный ID вместо объекта
  
  // ВРЕМЕННО ОТКЛЮЧЕН: Трекинг времени уровня для устранения постоянных state updates
  // useEffect(() => {
  //   if (gameState.gameStatus === 'playing' && !levelStartTimeRef.current) {
  //     levelStartTimeRef.current = Date.now()
  //     levelTimerRef.current = setInterval(() => {
  //       if (levelStartTimeRef.current) {
  //         const currentTime = Math.floor((Date.now() - levelStartTimeRef.current) / 1000)
  //         setGameState(prev => ({ ...prev, levelTime: currentTime }))
  //       }
  //     }, 1000)
  //   } else if (gameState.gameStatus !== 'playing' && levelTimerRef.current) {
  //     clearInterval(levelTimerRef.current)
  //     levelTimerRef.current = null
  //   }
  // }, [gameState.gameStatus])

  // Cleanup effect - освобождаем ресурсы при размонтировании
  useEffect(() => {
    return () => {
      if (gameEngineRef.current) {
        console.log('🧹 USEGAMEENGINE: Cleanup - уничтожаем GameEngine')
        gameEngineRef.current = null
      }
      
      if (circuitSimulatorRef.current) {
        console.log('🧹 USEGAMEENGINE: Cleanup - уничтожаем CircuitSimulator')
        circuitSimulatorRef.current = null
      }
      
      // Очищаем таймеры
      if (levelTimerRef.current) {
        clearInterval(levelTimerRef.current)
        levelTimerRef.current = null
      }
      levelStartTimeRef.current = null
      
      cleanupGameEngineBridge()
    }
  }, [])
  
  // === BRIDGE ФУНКЦИИ: React ↔ CircuitSimulator ===
  
  // Синхронизация React компонентов с CircuitSimulator
  const syncReactComponentsToSimulator = useCallback(() => {
    console.error('🚨 SYNC START - syncReactComponentsToSimulator вызвана!')
    
    if (!circuitSimulatorRef.current || !level) return false
    
    console.log('🌉 BRIDGE: Синхронизация React → CircuitSimulator')
    
    // 1. КРИТИЧЕСКИ ВАЖНО: Загрузить level для preinstalled компонентов (SOURCE, TARGET_LED_*)
    circuitSimulatorRef.current.loadLevel(level)
    console.log('🔧 BRIDGE: Загружен level с preinstalled компонентами')
    
    // 2. Разместить пользовательские компоненты
    let placedCount = 0
    gameState.placedComponents.forEach(reactComp => {
      if (!reactComp.isPreinstalled) { // Только пользовательские компоненты
        const success = circuitSimulatorRef.current.placeComponent(
          reactComp.originalComponentId || reactComp.id, 
          reactComp.position,
          reactComp.rotation || 0 // КРИТИЧЕСКИ ВАЖНО: Передаем rotation!
        )
        if (success) placedCount++
      }
    })
    
    // 3. Debug: показать все доступные компоненты в CircuitSimulator
    const simulator = circuitSimulatorRef.current
    const source = simulator.getSource()
    const targets = simulator.getTargets()
    const placedComponents = simulator.getPlacedComponents()
    console.log('🔍 BRIDGE DEBUG: Доступные компоненты в CircuitSimulator:')
    console.log('  SOURCE:', source?.id || 'не найден')
    console.log('  TARGETS:', targets.map(t => t.id) || 'не найдены')
    console.log('  PLACED:', placedComponents.map(p => p.id) || 'не найдены')
    
    // 4. Автоматически определить подключения
    autoDetectConnections()
    
    console.log(`🌉 BRIDGE: Размещено ${placedCount} компонентов`)
    return true
  }, [gameState.placedComponents, level])
  
  // Ref для актуального gameState
  const gameStateRef = useRef(gameState)
  gameStateRef.current = gameState
  
  // Helper функция для унифицированного поиска компонентов в CircuitSimulator
  const findComponentInSimulator = useCallback((simulator, searchId, reactComponent = null) => {
    console.log(`🔍 HELPER: Ищем компонент searchId="${searchId}"`)
    
    // 1. Поиск preinstalled компонентов (SOURCE, TARGET_LED_*)
    const source = simulator.getSource()
    console.log(`🔍 HELPER: SOURCE: ${source?.id || 'не найден'}`)
    if (source?.id === searchId) {
      console.log(`✅ HELPER: Найден SOURCE с ID ${searchId}`)
      return true
    }
    
    const targets = simulator.getTargets()
    console.log(`🔍 HELPER: TARGETS: [${targets.map(t => t.id).join(', ')}]`)
    if (targets.some(t => t.id === searchId)) {
      console.log(`✅ HELPER: Найден TARGET с ID ${searchId}`)
      return true
    }
    
    // 2. Поиск пользовательских компонентов (используем переданный searchId)
    const placedComponents = simulator.getPlacedComponents()
    console.log(`🔍 HELPER: PLACED COMPONENTS: [${placedComponents.map(p => p.id).join(', ')}]`)
    const foundInPlaced = placedComponents.some(p => p.id === searchId)
    if (foundInPlaced) {
      console.log(`✅ HELPER: Найден PLACED компонент с ID ${searchId}`)
    } else {
      console.log(`❌ HELPER: НЕ найден компонент с ID ${searchId}`)
    }
    
    return foundInPlaced
  }, [])
  
  // Автоматическое определение подключений через магнитные точки
  const autoDetectConnections = useCallback(() => {
    if (!circuitSimulatorRef.current) return
    
    console.log('🔗 BRIDGE: Автоопределение магнитных соединений (Variant 2)...')
    
    const simulator = circuitSimulatorRef.current
    const placedComponents = simulator.getPlacedComponents()
    
    // ВАРИАНТ 2: Использовать ВСЕ React компоненты (и preinstalled, и пользовательские)
    const currentGameState = gameStateRef.current
    const reactPreinstalled = currentGameState.placedComponents.filter(c => c.isPreinstalled)
    const reactUser = currentGameState.placedComponents.filter(c => !c.isPreinstalled)
    
    console.log(`🧲 React preinstalled компонентов: ${reactPreinstalled.length}`)
    console.log(`🧲 React пользовательских компонентов: ${reactUser.length}`)
    console.log(`🧲 Simulator placed компонентов: ${placedComponents.length}`)
    console.log('🔍 DEBUG: Все placedComponents из currentGameState:', currentGameState.placedComponents)
    console.log('🔍 DEBUG: Отфильтрованные preinstalled:', reactPreinstalled)
    console.log('🔍 DEBUG: Отфильтрованные пользовательские:', reactUser)
    console.log('🔍 DEBUG: Simulator placed components:', placedComponents)
    
    // Конвертировать ВСЕ React компоненты в формат для магнитных точек
    const reactForMagnetic = currentGameState.placedComponents.map(reactComp => ({
      id: reactComp.id,
      position: reactComp.position,
      rotation: reactComp.rotation || 0
    }))
    
    // Simulator компоненты не нужны, используем только React данные
    // const simulatorForMagnetic = placedComponents.map(simComp => ({
    //   id: simComp.id,
    //   position: simComp.position,
    //   rotation: simComp.rotation || 0
    // }))
    
    // Массив всех компонентов для расчета магнитных точек (только React)
    const allComponents = reactForMagnetic
    
    console.log('🔍 DEBUG: allComponents для магнитных точек:', allComponents)
    
    // 1. Собрать все магнитные точки всех компонентов
    const allMagneticPoints = []
    allComponents.forEach(comp => {
      const points = calculateMagneticPoints(comp)
      console.log(`🧲 Компонент ${comp.id} (${comp.position.x}, ${comp.position.y}) rotation=${comp.rotation} -> точки:`, points)
      allMagneticPoints.push(...points)
    })
    
    console.log('🔍 DEBUG: Все магнитные точки:', allMagneticPoints)
    
    // 2. Группировать точки по координатам
    const pointGroups = new Map()
    allMagneticPoints.forEach(point => {
      const key = `${point.x},${point.y}`
      if (!pointGroups.has(key)) {
        pointGroups.set(key, [])
      }
      pointGroups.get(key).push(point)
    })
    
    // 3. Создать соединения внутри каждой группы (2+ компонентов)
    let connectionsCount = 0
    const activeConnectionPoints = [] // Для визуализации
    
    pointGroups.forEach((group, coordinates) => {
      if (group.length >= 2) {
        console.log(`🧲 Магнитная точка ${coordinates}: ${group.length} компонентов`)
        
        // Добавить координаты для визуализации
        const [x, y] = coordinates.split(',').map(Number)
        activeConnectionPoints.push({ x, y })
        console.log(`🟢 ДОБАВЛЯЕМ зеленый круг на координаты: x=${x}, y=${y}`)
        
        // Соединить каждый с каждым в группе
        for (let i = 0; i < group.length; i++) {
          for (let j = i + 1; j < group.length; j++) {
            const comp1Id = group[i].componentId
            const comp2Id = group[j].componentId
            
            if (comp1Id !== comp2Id) { // Защита от самосоединения
              // Получить React компоненты для корректного поиска originalComponentId
              const comp1React = allComponents.find(c => c.id === comp1Id)
              const comp2React = allComponents.find(c => c.id === comp2Id)
              
              console.log(`🔗 MAPPING: comp1Id="${comp1Id}" -> comp1React:`, comp1React ? `FOUND (originalId=${comp1React.originalComponentId})` : 'NOT FOUND')
              console.log(`🔗 MAPPING: comp2Id="${comp2Id}" -> comp2React:`, comp2React ? `FOUND (originalId=${comp2React.originalComponentId})` : 'NOT FOUND')
              
              // КРИТИЧЕСКИ ВАЖНО: Использовать правильные ID для поиска в CircuitSimulator
              // Fallback: если originalComponentId undefined, извлечь из длинного ID
              const extractBaseId = (longId) => {
                // user_R_DIV_1_1755264744372 -> R_DIV_1
                const match = longId.match(/^user_(.+)_\d+$/)
                return match ? match[1] : longId
              }
              
              const searchComp1Id = comp1React && comp1React.originalComponentId 
                ? comp1React.originalComponentId  // user_R_DIV_1_XXX -> R_DIV_1
                : comp1Id.startsWith('user_') ? extractBaseId(comp1Id) : comp1Id  // для preinstalled или fallback
              const searchComp2Id = comp2React && comp2React.originalComponentId 
                ? comp2React.originalComponentId  // user_R_DIV_2_XXX -> R_DIV_2  
                : comp2Id.startsWith('user_') ? extractBaseId(comp2Id) : comp2Id  // для preinstalled или fallback
                
              console.log(`🔗 SEARCH: Будем искать comp1="${searchComp1Id}", comp2="${searchComp2Id}" в CircuitSimulator`)
              
              // Элегантная проверка существования через helper
              const comp1Exists = findComponentInSimulator(simulator, searchComp1Id, comp1React)
              const comp2Exists = findComponentInSimulator(simulator, searchComp2Id, comp2React)
              
              if (comp1Exists && comp2Exists) {
                // Использовать те же ID что и для поиска
                const success = simulator.connectComponents(searchComp1Id, searchComp2Id)
                if (success) {
                  connectionsCount++
                  console.log(`⚡ Соединение: ${searchComp1Id} ↔ ${searchComp2Id}`)
                } else {
                  console.warn(`❌ FAILED соединение: ${searchComp1Id} ↔ ${searchComp2Id}`)
                }
              } else {
                console.warn(`❌ SKIP соединение: ${comp1Id} (${comp1Exists}) ↔ ${comp2Id} (${comp2Exists}) - компонент не существует`)
              }
            }
          }
        }
      }
    })
    
    // Обновить React state с координатами активных соединений
    setGameState(prev => ({
      ...prev,
      connectionPoints: activeConnectionPoints
    }))
    
    console.log(`🔗 BRIDGE: Создано ${connectionsCount} магнитных соединений`)
    console.log(`🟢 VISUAL: Активных точек соединения: ${activeConnectionPoints.length}`)
  }, []) // Убираем dependency, используем gameStateRef
  
  // Расчет магнитных точек компонента с учетом поворота
  const calculateMagneticPoints = (component) => {
    const { x, y } = component.position
    const rotation = component.rotation || 0
    
    switch (rotation) {
      case 0:   // горизонтально → (исходное положение)
      case 180: // горизонтально ← (тот же результат для магнитных точек)
        return [
          { x: x - 40, y, componentId: component.id },
          { x: x + 40, y, componentId: component.id }
        ]
      case 90:  // вертикально ↓ (поворот на 90°)
      case 270: // вертикально ↑ (поворот на 270°, тот же результат)
        return [
          { x, y: y - 40, componentId: component.id },
          { x, y: y + 40, componentId: component.id }
        ]
      default:
        console.warn(`Неизвестный поворот компонента: ${rotation}°`)
        return []
    }
  }
  
  // Заполнение window.debugEfficiency для DebugPanel - СИНХРОНИЗИРОВАНО с новой логикой
  const populateDebugEfficiency = useCallback((simulationResult) => {
    if (!circuitSimulatorRef.current || !level) return
    
    const simulator = circuitSimulatorRef.current
    const source = simulator.getSource()
    const targets = simulator.getTargets()
    const supercapacitor = simulator.getSupercapacitor()
    
    // Подготовить данные для каждой цели с СТРОГИМИ sweet spot правилами
    const targetResults = targets.map(target => {
      const deliveredEnergy = simulationResult.energyDistribution[target.id] || 0
      const isConnected = simulationResult.targetsLit.includes(target.id) || deliveredEnergy > 0
      
      // СТРОГАЯ проверка sweet spot как в EnergyCalculator
      let isInSweetSpot = false
      if (target.energyRange && deliveredEnergy > 0) {
        const [minEnergy, maxEnergy] = target.energyRange
        isInSweetSpot = deliveredEnergy >= minEnergy && deliveredEnergy <= maxEnergy
      }
      
      return {
        targetId: target.id,
        deliveredEnergy,
        energyRange: target.energyRange,
        isInSweetSpot,
        usefulEnergy: isInSweetSpot ? deliveredEnergy : 0, // Только энергия в sweet spot полезна
        heatLoss: isInSweetSpot ? 0 : deliveredEnergy, // Энергия вне sweet spot = heat loss
        isConnected
      }
    })
    
    // Рассчитать efficiency ТОЧНО как в EnergyCalculator
    // Total Useful Energy = только энергия в sweet spots + Energy in Supercapacitor
    const usefulEnergyOnTargets = targetResults.reduce((sum, target) => sum + target.usefulEnergy, 0)
    const heatLossFromTargets = targetResults.reduce((sum, target) => sum + target.heatLoss, 0)
    const energyInSupercapacitor = supercapacitor ? supercapacitor.getScore() : 0
    const totalUsefulEnergy = usefulEnergyOnTargets + energyInSupercapacitor
    
    // Efficiency (%) = (Total Useful Energy / Source Energy Output) * 100
    const sourceEnergyOutput = source ? source.getAvailableEnergy() : 120
    const efficiency = sourceEnergyOutput > 0 ? (totalUsefulEnergy / sourceEnergyOutput) * 100 : 0
    
    // Ожидаемый score из метаданных уровня (если есть)
    const expectedScore = level.solution_data?.optimal_solution?.expected_score || 0
    
    // Заполнить window.debugEfficiency с расширенной информацией
    window.debugEfficiency = {
      sourceEnergyOutput,
      usefulEnergyOnTargets,
      heatLossFromTargets,
      energyInSupercapacitor,
      totalUsefulEnergy,
      efficiency,
      targetResults,
      expectedScore
    }
    
    console.log('🐛 DEBUG: window.debugEfficiency заполнен (новая логика):', window.debugEfficiency)
  }, [level])
  
  // Обновление состояний компонентов после симуляции - упрощенная версия
  const updateComponentStatesAfterSimulation = useCallback((simulationResult) => {
    if (!gameEngineRef.current) return
    
    console.log('🌉 BRIDGE: Passing simulation results to GameEngine...')
    
    // Simple pass-through to GameEngine - no React processing
    gameEngineRef.current.updateFromSimulation(simulationResult)
    
    console.log('🌉 BRIDGE: Component states updated by GameEngine')
  }, [])
  
  // === ИГРОВЫЕ ДЕЙСТВИЯ (вызываются из React UI) ===
  
  const simulateCircuit = () => {
    console.error('🚨 SIMULATE START - функция вызвана!')
    
    if (!gameEngineRef.current || !circuitSimulatorRef.current) return
    
    console.log('🔬 SIMULATION: Запуск реальной симуляции цепи')
    
    setGameState(prev => ({ ...prev, isSimulating: true }))
    
    // Реальная симуляция с CircuitSimulator
    setTimeout(() => {
      // 1. Синхронизировать React → CircuitSimulator
      const bridgeSuccess = syncReactComponentsToSimulator()
      
      if (!bridgeSuccess) {
        console.error('❌ SIMULATION: Bridge sync failed')
        setGameState(prev => ({ ...prev, isSimulating: false }))
        return
      }
      
      // 2. Запустить реальную симуляцию
      const simulationResult = circuitSimulatorRef.current.simulate()
      console.log('🔬 SIMULATION: Результат:', simulationResult)
      
      // 3. Извлечь efficiency score
      const currentScore = simulationResult.finalScore || 0
      const efficiency = simulationResult.finalScore || 0 // В CircuitSimulator finalScore = efficiency
      
      // 4. Заполнить window.debugEfficiency для DebugPanel
      populateDebugEfficiency(simulationResult)
      
      // 5. Обновить состояния всех компонентов в GameEngine
      updateComponentStatesAfterSimulation(simulationResult)
      
      setGameState(prev => {
        const newBestScore = Math.max(prev.bestScore, currentScore)
        const newHasValidSolution = prev.hasValidSolution || efficiency > 50
        const newAttemptCount = prev.attemptCount + 1
        const newCanFinishLevel = newHasValidSolution
        
        console.log(`🔬 SIMULATION: Score=${currentScore.toFixed(1)}, Efficiency=${efficiency.toFixed(1)}%`)
        
        return {
          ...prev,
          isSimulating: false,
          currentScore,
          bestScore: newBestScore,
          hasValidSolution: newHasValidSolution,
          attemptCount: newAttemptCount,
          canFinishLevel: newCanFinishLevel,
          // Важно: НЕ меняем gameStatus на 'complete' автоматически!
          gameStatus: 'playing'
        }
      })
    }, 2000) // Реалистичная задержка для UX
  }
  
  const resetLevel = () => {
    if (!gameEngineRef.current || !level) return
    
    // Resetting level
    
    // Перезапустить таймер уровня
    levelStartTimeRef.current = Date.now()
    
    const levelData = prepareLevelData(level)
    gameEngineRef.current.loadLevel(levelData)
    
    setGameState(prev => ({
      ...prev,
      placedComponents: levelData.preinstalledComponents || [],
      gameStatus: 'playing',
      currentScore: 0,
      // НЕ сбрасываем bestScore и bestTime при reset
      energyUsed: 0,
      levelTime: 0,
      isSimulating: false,
      hasValidSolution: false,
      attemptCount: 0,
      canFinishLevel: false,
      connectionPoints: []
    }))
  }
  
  const addComponentFromPalette = (componentId) => {
    if (!gameEngineRef.current || !level) return
    
    console.log(`🎯 PALETTE: addComponentFromPalette вызвана с componentId="${componentId}"`)
    
    // Найти определение компонента в уровне
    const componentDef = level.circuit_definition.available_components.find(c => c.id === componentId)
    if (!componentDef) {
      console.error('useGameEngine: Component definition not found for ID:', componentId)
      return
    }
    
    // Найти первую свободную позицию для автоматического размещения
    const autoPosition = findNextAvailablePosition(gameState.placedComponents)
    
    // Создать новый компонент из палитры с правильными данными
    const newComponent = {
      id: `user_${componentId}_${Date.now()}`,
      type: componentDef.type,
      position: autoPosition, // Автоматическая позиция вместо фиксированной
      rotation: 0,
      isPreinstalled: false,
      originalComponentId: componentId, // КРИТИЧЕСКИ ВАЖНО для подсчета в палитре
      properties: {
        resistance: componentDef.resistance,
        capacitance: componentDef.capacitance,
        inductance: componentDef.inductance,
        voltage: componentDef.voltage
      }
    }
    
    console.log(`🎯 PALETTE: Создан новый компонент:`, newComponent)
    console.log(`🎯 PALETTE: originalComponentId="${newComponent.originalComponentId}"`)
    
    gameEngineRef.current.addComponent(newComponent)
    
    setGameState(prev => {
      const updatedComponents = [...prev.placedComponents, newComponent]
      console.log(`🎯 PALETTE: Обновляем React state. Новый компонент в массиве:`)
      const addedComponent = updatedComponents[updatedComponents.length - 1]
      console.log(`🎯 PALETTE: Последний компонент в state:`, addedComponent)
      console.log(`🎯 PALETTE: originalComponentId в state="${addedComponent.originalComponentId}"`)
      
      return {
        ...prev,
        placedComponents: updatedComponents
      }
    })
    
    // Component added from palette
  }
  
  // НОВОЕ: Осознанное завершение уровня игроком
  const finishLevel = () => {
    if (!gameState.canFinishLevel) {
      // Cannot finish level
      return
    }
    
    // Рассчитать финальное время
    const finalTime = levelStartTimeRef.current 
      ? Math.floor((Date.now() - levelStartTimeRef.current) / 1000)
      : 0
      
    console.log('⏱️ TIMER: Level finished!')
    console.log('⏱️ TIMER: Final time:', finalTime, 'seconds')
    console.log('⏱️ TIMER: Current score:', gameState.currentScore)
    console.log('⏱️ TIMER: Previous best score:', gameState.bestScore)
    
    // Обновляем состояние для завершения с правильной логикой рекордов
    setGameState(prev => {
      const isNewRecord = prev.currentScore > prev.bestScore
      
      console.log('⏱️ TIMER: Is new record?', isNewRecord)
      console.log('⏱️ TIMER: Will save - bestScore:', isNewRecord ? prev.currentScore : prev.bestScore, 'bestTime:', isNewRecord ? finalTime : prev.bestTime)
      
      return {
        ...prev,
        gameStatus: 'complete', // Теперь официально завершен
        levelTime: finalTime,
        bestScore: isNewRecord ? prev.currentScore : prev.bestScore,
        bestTime: isNewRecord ? finalTime : prev.bestTime,
        showSuccessModal: true
      }
    })
    
    // Level finished by player
  }

  // Actions для управления success modal
  const hideSuccessModal = () => {
    setGameState(prev => ({ ...prev, showSuccessModal: false }))
  }
  
  const resetForNextLevel = () => {
    // Сброс состояния для следующего уровня
    levelStartTimeRef.current = null
    
    setGameState(prev => ({
      ...prev,
      gameStatus: 'loading',
      currentScore: 0,
      bestScore: 0,
      energyUsed: 0,
      levelTime: 0,
      bestTime: 0,
      showSuccessModal: false,
      hasValidSolution: false,
      attemptCount: 0,
      canFinishLevel: false,
      placedComponents: [],
      isSimulating: false,
      connectionPoints: []
    }))
    
    // Reset for next level
  }

  return {
    gameState,
    gameEngine: gameEngineRef.current,
    initializeGameEngine, // НОВОЕ: Метод для внешней инициализации
    actions: {
      simulateCircuit,
      resetLevel,
      addComponentFromPalette,
      finishLevel, // НОВОЕ: Осознанное завершение уровня
      hideSuccessModal,
      resetForNextLevel
    }
  }
}

// === УТИЛИТЫ ===

function prepareLevelData(level) {
  const preinstalledComponents = []
  
  // Добавить источник питания - стандартное правило позиционирования
  if (level.circuit_definition.source) {
    const source = level.circuit_definition.source
    preinstalledComponents.push({
      id: source.id,
      type: 'voltage_source',
      position: { x: 80, y: 200 }, // Правило: x всегда 80, y начинается с 200
      rotation: 0,
      isPreinstalled: true,
      originalComponentId: source.id, // ИСПРАВЛЕНИЕ: добавлено для правильного ID mapping
      properties: {
        voltage: source.voltage,
        energyOutput: source.energy_output
      }
    })
  }
  
  // Добавить цели (LED лампочки) - стандартное правило с шагом 40px
  level.circuit_definition.targets.forEach((target, index) => {
    preinstalledComponents.push({
      id: target.id,
      type: 'led',
      position: { x: 80, y: 240 + (index * 40) }, // Правило: x всегда 80, y: 240, 280, 320, 360...
      rotation: 0,
      isPreinstalled: true,
      originalComponentId: target.id, // ИСПРАВЛЕНИЕ: добавлено для правильного ID mapping
      properties: {
        energyRange: target.energy_range
      }
    })
  })
  
  return {
    preinstalledComponents,
    availableComponents: level.circuit_definition.available_components
  }
}

// Старая заглушка calculateScore удалена - теперь используется реальная симуляция CircuitSimulator

// === АВТОМАТИЧЕСКОЕ РАЗМЕЩЕНИЕ КОМПОНЕНТОВ ===

/**
 * Найти первую свободную позицию для размещения компонента из палитры
 * Начинает с x: 240, y: 120 и идет вниз с шагом 40px: 160, 200, 240, 280...
 */
function findNextAvailablePosition(placedComponents) {
  const START_X = 240
  const START_Y = 120
  const STEP_Y = 40 // Шаг сетки для вертикального размещения
  const MAX_ATTEMPTS = 20 // Максимум проверок, чтобы избежать бесконечного цикла
  
  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
    const candidatePosition = {
      x: START_X,
      y: START_Y + (attempt * STEP_Y)
    }
    
    // Проверить, свободна ли позиция
    const isOccupied = placedComponents.some(component => {
      const dx = Math.abs(component.position.x - candidatePosition.x)
      const dy = Math.abs(component.position.y - candidatePosition.y)
      return dx < 20 && dy < 20 // Те же правила что и в GameEngine.isPositionOccupied
    })
    
    if (!isOccupied) {
      // Position found
      return candidatePosition
    }
    
    // Position occupied
  }
  
  // Если все позиции заняты, вернуть позицию справа от последней попытки
  const fallbackPosition = { x: START_X + 40, y: START_Y }
  // Using fallback position
  return fallbackPosition
}