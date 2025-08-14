import { useState, useEffect, useLayoutEffect, useRef } from 'react'
import { GameEngine } from '../game/GameEngine.js'
import { initializeGameEngineBridge, cleanupGameEngineBridge } from '../utils/gameEngineBridge.ts'

/**
 * useGameEngine - React хук для управления игровым движком
 * Чистое разделение: React управляет данными, GameEngine - интерактивностью
 */
export const useGameEngine = (level) => {
  const gameEngineRef = useRef(null)
  
  // REACT STATE: Только данные для UI
  const [gameState, setGameState] = useState({
    currentScore: 0, // последний результат симуляции
    bestScore: 0, // лучший результат за все попытки
    energyUsed: 0,
    gameStatus: 'loading', // loading | playing (убрали auto-complete)
    placedComponents: [], // Финальные позиции для сохранения
    isSimulating: false,
    levelTime: 0, // время прохождения уровня в секундах
    showSuccessModal: false, // показывать ли success модал
    hasValidSolution: false, // есть ли проходное решение (score > 50)
    attemptCount: 0, // количество симуляций
    canFinishLevel: false // можно ли завершить уровень
  })
  
  // Состояние готовности GameEngine - для контроля race condition
  const [gameEngineReady, setGameEngineReady] = useState(false)
  
  // Трекинг времени уровня
  const levelStartTimeRef = useRef(null)
  const levelTimerRef = useRef(null)
  
  // Метод для внешней инициализации GameEngine когда canvas готов
  const initializeGameEngine = (canvasElement) => {
    if (!canvasElement) {
      console.log('❌ USEGAMEENGINE: initializeGameEngine получил null element')
      return
    }
    
    if (gameEngineRef.current) {
      console.log('❌ USEGAMEENGINE: GameEngine уже инициализирован')
      return
    }
    
    console.log('🔄 USEGAMEENGINE: Initializing GameEngine через callback ref...')
    console.log('🔄 USEGAMEENGINE: Canvas element:', canvasElement, 'размеры:', canvasElement.offsetWidth, 'x', canvasElement.offsetHeight)
    
    try {
      // Инициализируем SVG bridge перед созданием GameEngine
      initializeGameEngineBridge()
      
      // Создать игровой движок с коллбэками
      gameEngineRef.current = new GameEngine(canvasElement, {
        onScoreChange: (score) => {
          setGameState(prev => ({ ...prev, score }))
        },
        
        onComponentPlace: (componentId, position) => {
          // Обновить позицию компонента в React state
          setGameState(prev => ({
            ...prev,
            placedComponents: prev.placedComponents.map(comp =>
              comp.id === componentId 
                ? { ...comp, position }
                : comp
            )
          }))
          console.log('useGameEngine: Component placed', componentId, position)
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
          console.log('useGameEngine: Component rotated', componentId, rotation)
        },
        
        onLevelComplete: () => {
          // УСТАРЕЛО: Этот callback больше не используется
          // Завершение уровня теперь происходит через finishLevel()
          console.log('useGameEngine: onLevelComplete called (legacy - now use finishLevel())')
        }
      })
      
      console.log('✅ USEGAMEENGINE: GameEngine инициализирован успешно через callback ref!')
      setGameEngineReady(true) // ВАЖНО: Устанавливаем готовность GameEngine
      
    } catch (error) {
      console.error('❌ USEGAMEENGINE: Ошибка инициализации GameEngine:', error)
      setGameState(prev => ({ ...prev, gameStatus: 'failed' }))
    }
  }
  
  
  // Загрузка уровня - ЖДЕМ ГОТОВНОСТИ GameEngine
  useEffect(() => {
    console.log('🔄 USEGAMEENGINE: useEffect triggered. gameEngineReady:', gameEngineReady, 'level:', !!level)
    
    if (!gameEngineReady) {
      console.log('❌ USEGAMEENGINE: GameEngine не готов, ждем инициализации...')
      return
    }
    
    if (!level) {
      console.log('❌ USEGAMEENGINE: Level отсутствует, ждем...')
      return
    }
    
    if (!gameEngineRef.current) {
      console.error('❌ USEGAMEENGINE: GameEngine ready=true но ref=null! Это не должно происходить.')
      return
    }
    
    console.log('✅ USEGAMEENGINE: GameEngine готов И level загружен - начинаем загрузку уровня:', level.metadata)
    
    try {
      // Подготовить данные уровня для игрового движка
      console.log('🔄 USEGAMEENGINE: Подготавливаем данные уровня...')
      const levelData = prepareLevelData(level)
      console.log('✅ USEGAMEENGINE: Данные подготовлены:', levelData)
      
      // Загрузить в движок
      console.log('🔄 USEGAMEENGINE: Загружаем в GameEngine...')
      gameEngineRef.current.loadLevel(levelData)
      console.log('✅ USEGAMEENGINE: GameEngine.loadLevel() выполнен')
      
      // Обновить React state
      console.log('🔄 USEGAMEENGINE: Обновляем React state на playing...')
      setGameState(prev => ({
        ...prev,
        placedComponents: levelData.preinstalledComponents || [],
        gameStatus: 'playing',
        currentScore: 0,
        bestScore: 0,
        energyUsed: 0,
        hasValidSolution: false,
        attemptCount: 0,
        canFinishLevel: false
      }))
      console.log('✅ USEGAMEENGINE: Уровень успешно загружен, gameStatus = playing')
      
    } catch (error) {
      console.error('❌ USEGAMEENGINE: Ошибка загрузки уровня:', error)
      setGameState(prev => ({ ...prev, gameStatus: 'failed' }))
    }
    
  }, [level, gameEngineReady]) // ВАЖНО: Добавили gameEngineReady в зависимости
  
  // Трекинг времени уровня
  useEffect(() => {
    if (gameState.gameStatus === 'playing' && !levelStartTimeRef.current) {
      // Начинаем отсчет времени
      levelStartTimeRef.current = Date.now()
      console.log('⏱️ USEGAMEENGINE: Начат отсчет времени уровня')
      
      // Обновляем время каждую секунду для UI (опционально)
      levelTimerRef.current = setInterval(() => {
        if (levelStartTimeRef.current) {
          const currentTime = Math.floor((Date.now() - levelStartTimeRef.current) / 1000)
          setGameState(prev => ({ ...prev, levelTime: currentTime }))
        }
      }, 1000)
    } else if (gameState.gameStatus !== 'playing' && levelTimerRef.current) {
      // Останавливаем таймер если не playing
      clearInterval(levelTimerRef.current)
      levelTimerRef.current = null
    }
  }, [gameState.gameStatus])

  // Cleanup effect - освобождаем ресурсы при размонтировании
  useEffect(() => {
    return () => {
      if (gameEngineRef.current) {
        console.log('🧹 USEGAMEENGINE: Cleanup - уничтожаем GameEngine')
        gameEngineRef.current = null
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
  
  // === ИГРОВЫЕ ДЕЙСТВИЯ (вызываются из React UI) ===
  
  const simulateCircuit = () => {
    if (!gameEngineRef.current) return
    
    console.log('useGameEngine: Starting simulation')
    
    setGameState(prev => ({ ...prev, isSimulating: true }))
    
    // Симуляция цепи (пока заглушка)
    setTimeout(() => {
      const currentScore = calculateScore(gameState.placedComponents)
      
      setGameState(prev => {
        const newBestScore = Math.max(prev.bestScore, currentScore)
        const newHasValidSolution = prev.hasValidSolution || currentScore > 50
        const newAttemptCount = prev.attemptCount + 1
        const newCanFinishLevel = newHasValidSolution
        
        console.log(`useGameEngine: Simulation complete. Score: ${currentScore}, Best: ${newBestScore}, Valid: ${newHasValidSolution}`)
        
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
    }, 2000)
  }
  
  const resetLevel = () => {
    if (!gameEngineRef.current || !level) return
    
    console.log('useGameEngine: Resetting level')
    
    const levelData = prepareLevelData(level)
    gameEngineRef.current.loadLevel(levelData)
    
    setGameState(prev => ({
      ...prev,
      placedComponents: levelData.preinstalledComponents || [],
      gameStatus: 'playing',
      currentScore: 0,
      bestScore: 0,
      energyUsed: 0,
      isSimulating: false,
      hasValidSolution: false,
      attemptCount: 0,
      canFinishLevel: false
    }))
  }
  
  const addComponentFromPalette = (componentId) => {
    if (!gameEngineRef.current || !level) return
    
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
    
    gameEngineRef.current.addComponent(newComponent)
    
    setGameState(prev => ({
      ...prev,
      placedComponents: [...prev.placedComponents, newComponent]
    }))
    
    console.log('useGameEngine: Added component from palette', {componentId, autoPosition, newComponent})
  }
  
  // НОВОЕ: Осознанное завершение уровня игроком
  const finishLevel = () => {
    if (!gameState.canFinishLevel) {
      console.warn('useGameEngine: Cannot finish level - no valid solution found yet')
      return
    }
    
    // Останавливаем таймер
    if (levelTimerRef.current) {
      clearInterval(levelTimerRef.current)
      levelTimerRef.current = null
    }
    
    const finalTime = levelStartTimeRef.current 
      ? Math.floor((Date.now() - levelStartTimeRef.current) / 1000)
      : gameState.levelTime
      
    // Обновляем состояние для завершения
    setGameState(prev => ({
      ...prev,
      gameStatus: 'complete', // Теперь официально завершен
      levelTime: finalTime,
      showSuccessModal: true
    }))
    
    console.log(`useGameEngine: Level finished by player! Best Score: ${gameState.bestScore}, Attempts: ${gameState.attemptCount}, Time: ${finalTime}s`)
  }

  // Actions для управления success modal
  const hideSuccessModal = () => {
    setGameState(prev => ({ ...prev, showSuccessModal: false }))
  }
  
  const resetForNextLevel = () => {
    // Сброс состояния для следующего уровня
    if (levelTimerRef.current) {
      clearInterval(levelTimerRef.current)
      levelTimerRef.current = null
    }
    levelStartTimeRef.current = null
    
    setGameState(prev => ({
      ...prev,
      gameStatus: 'loading',
      currentScore: 0,
      bestScore: 0,
      energyUsed: 0,
      levelTime: 0,
      showSuccessModal: false,
      hasValidSolution: false,
      attemptCount: 0,
      canFinishLevel: false,
      placedComponents: [],
      isSimulating: false
    }))
    
    console.log('useGameEngine: Reset for next level')
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

function calculateScore(components) {
  // Простая логика подсчета очков
  const userComponents = components.filter(c => !c.isPreinstalled)
  return userComponents.length * 10 + Math.floor(Math.random() * 50)
}

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
      console.log(`findNextAvailablePosition: Found free position at attempt ${attempt}:`, candidatePosition)
      return candidatePosition
    }
    
    console.log(`findNextAvailablePosition: Position occupied at attempt ${attempt}:`, candidatePosition)
  }
  
  // Если все позиции заняты, вернуть позицию справа от последней попытки
  const fallbackPosition = { x: START_X + 40, y: START_Y }
  console.warn('findNextAvailablePosition: All default positions occupied, using fallback:', fallbackPosition)
  return fallbackPosition
}