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
    score: 0,
    energyUsed: 0,
    gameStatus: 'loading', // loading | playing | complete | failed
    placedComponents: [], // Финальные позиции для сохранения
    isSimulating: false
  })
  
  // Состояние готовности GameEngine - для контроля race condition
  const [gameEngineReady, setGameEngineReady] = useState(false)
  
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
          setGameState(prev => ({ ...prev, gameStatus: 'complete' }))
          console.log('useGameEngine: Level completed!')
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
        score: 0,
        energyUsed: 0
      }))
      console.log('✅ USEGAMEENGINE: Уровень успешно загружен, gameStatus = playing')
      
    } catch (error) {
      console.error('❌ USEGAMEENGINE: Ошибка загрузки уровня:', error)
      setGameState(prev => ({ ...prev, gameStatus: 'failed' }))
    }
    
  }, [level, gameEngineReady]) // ВАЖНО: Добавили gameEngineReady в зависимости
  
  // Cleanup effect - освобождаем ресурсы при размонтировании
  useEffect(() => {
    return () => {
      if (gameEngineRef.current) {
        console.log('🧹 USEGAMEENGINE: Cleanup - уничтожаем GameEngine')
        gameEngineRef.current = null
      }
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
      const score = calculateScore(gameState.placedComponents)
      setGameState(prev => ({
        ...prev,
        isSimulating: false,
        score,
        gameStatus: score > 50 ? 'complete' : 'playing'
      }))
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
      score: 0,
      energyUsed: 0,
      isSimulating: false
    }))
  }
  
  const addComponentFromPalette = (componentType) => {
    if (!gameEngineRef.current) return
    
    // Создать новый компонент из палитры
    const newComponent = {
      id: `user_${componentType}_${Date.now()}`,
      type: componentType,
      position: { x: 200, y: 200 }, // Начальная позиция
      rotation: 0,
      isPreinstalled: false
    }
    
    gameEngineRef.current.addComponent(newComponent)
    
    setGameState(prev => ({
      ...prev,
      placedComponents: [...prev.placedComponents, newComponent]
    }))
    
    console.log('useGameEngine: Added component from palette', newComponent)
  }
  
  return {
    gameState,
    gameEngine: gameEngineRef.current,
    initializeGameEngine, // НОВОЕ: Метод для внешней инициализации
    actions: {
      simulateCircuit,
      resetLevel,
      addComponentFromPalette
    }
  }
}

// === УТИЛИТЫ ===

function prepareLevelData(level) {
  const preinstalledComponents = []
  
  // Добавить источник питания - точное позиционирование по сетке
  if (level.circuit_definition.source) {
    const source = level.circuit_definition.source
    preinstalledComponents.push({
      id: source.id,
      type: 'voltage_source',
      position: { x: 70, y: 200 }, // x: 70 → left=60px → магнитная точка на сеточной точке 60px
      rotation: 0,
      isPreinstalled: true,
      properties: {
        voltage: source.voltage,
        energyOutput: source.energy_output
      }
    })
  }
  
  // Добавить цели (LED лампочки) - компактный столбик по сетке
  level.circuit_definition.targets.forEach((target, index) => {
    preinstalledComponents.push({
      id: target.id,
      type: 'led',
      position: { x: 70, y: 280 + (index * 80) }, // Компактный шаг 80px (2×GRID_SIZE)
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