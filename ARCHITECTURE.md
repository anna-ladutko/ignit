# Гибридная React + Vanilla JS Архитектура

> **Документация высокопроизводительной архитектуры для интерактивных приложений**
> 
> Версия: 1.0  
> Последнее обновление: August 2025

## 📋 Содержание

1. [Обзор архитектуры](#обзор-архитектуры)
2. [Ключевые компоненты](#ключевые-компоненты)
3. [Диаграмма архитектуры](#диаграмма-архитектуры)
4. [Паттерны и решения](#паттерны-и-решения)
5. [Best Practices](#best-practices)
6. [Альтернативы и trade-offs](#альтернативы-и-trade-offs)
7. [Система управления уровнями](#система-управления-уровнями)
8. [Система навигации и экранов](#система-навигации-и-экранов)
9. [Производительность и оптимизация](#производительность-и-оптимизация)

---

## 🏗️ Обзор архитектуры

### Проблема
Создание высокопроизводительных интерактивных приложений (drag-n-drop, real-time анимации) в React приводит к проблемам производительности из-за частых re-renders во время интерактивных операций.

### Решение
**Гибридная архитектура** - комбинирование React для UI структуры и данных с Vanilla JavaScript для интерактивной логики.

### Принципы
- **React**: Управляет UI структурой, состоянием данных, пользовательскими предпочтениями
- **Vanilla JS**: Обрабатывает интерактивную логику, прямые DOM операции, события
- **Четкое разделение**: Никакого смешивания ответственностей

---

## 🔧 Ключевые компоненты

### 1. GameEngine (Vanilla JavaScript)
```javascript
// src/game/GameEngine.js
export class GameEngine {
  constructor(canvasElement, callbacks) {
    this.canvas = canvasElement
    this.components = new Map()
    this.setupEvents()
  }
  
  // Прямые DOM операции для производительности
  updateDrag(x, y) {
    this.draggedComponent.element.style.transform = 
      `translate3d(${deltaX}px, ${deltaY}px, 0)` // 60fps
  }
}
```

**Ответственности:**
- ✅ Интерактивная логика (drag-n-drop, selection)
- ✅ Прямые DOM манипуляции
- ✅ Event handling (touch, mouse)
- ✅ Компонент управление (add, move, rotate)
- ✅ GPU оптимизации

### 2. useGameEngine Hook (React Bridge)
```javascript
// src/hooks/useGameEngine.js
export const useGameEngine = (level) => {
  const gameEngineRef = useRef(null)
  const [gameState, setGameState] = useState(...)
  
  const initializeGameEngine = (canvasElement) => {
    gameEngineRef.current = new GameEngine(canvasElement, {
      onScoreChange: (score) => setGameState(prev => ({...prev, score}))
    })
  }
  
  return { gameState, initializeGameEngine, actions }
}
```

**Ответственности:**
- ✅ Мост между React и GameEngine
- ✅ Состояние данных для UI
- ✅ Lifecycle управление GameEngine
- ✅ Callback синхронизация

### 3. GameScreen (UI Shell)
```tsx
// src/components/game/GameScreen/index.tsx
export const GameScreen = ({ level }) => {
  const { gameState, initializeGameEngine } = useGameEngine(level)
  
  // Callback ref - правильная инициализация GameEngine
  const canvasRef = useCallback((element) => {
    if (element) initializeGameEngine(element)
  }, [initializeGameEngine])
  
  return (
    <Box>
      <TopGameBar {...gameState} />
      <div ref={canvasRef} /> {/* GameEngine canvas */}
      <ComponentPalette {...gameState} />
    </Box>
  )
}
```

**Ответственности:**
- ✅ UI структура и layout
- ✅ Статичные компоненты (меню, панели)
- ✅ Canvas инициализация через callback ref
- ❌ НЕ содержит игровую логику

---

## 📊 Диаграмма архитектуры

```
┌─────────────────────────────────────────────┐
│                React Layer                  │
├─────────────────────────────────────────────┤
│                                             │
│  ┌─────────────┐    ┌─────────────────────┐ │
│  │ GameScreen  │    │   useGameEngine     │ │
│  │ (UI Shell)  │◄───┤   (State Bridge)    │ │
│  │             │    │                     │ │
│  │ - Layout    │    │ - React State       │ │
│  │ - Canvas    │    │ - GameEngine ref    │ │
│  │ - UI comp.  │    │ - Callbacks         │ │
│  └─────────────┘    └─────────────────────┘ │
│         │                      │             │
└─────────│──────────────────────│─────────────┘
          │ callback ref         │ initializeGameEngine
          ▼                      ▼
┌─────────────────────────────────────────────┐
│              Vanilla JS Layer               │
├─────────────────────────────────────────────┤
│                                             │
│  ┌─────────────────────────────────────────┐ │
│  │            GameEngine                   │ │
│  │                                         │ │
│  │ - Direct DOM operations (60fps)         │ │
│  │ - Event handling (touch/mouse)          │ │
│  │ - Component management                  │ │
│  │ - GPU optimizations (translate3d)       │ │
│  │ - Drag-n-drop logic                    │ │
│  └─────────────────────────────────────────┘ │
│                      │                       │
└──────────────────────│───────────────────────┘
                       │ callbacks
                       ▼
                 ┌─────────────┐
                 │ React State │
                 │ Updates     │
                 └─────────────┘
```

### Поток данных

1. **Инициализация**: React → Callback Ref → GameEngine инициализация
2. **User Interaction**: DOM Events → GameEngine → Direct DOM manipulation
3. **State Sync**: GameEngine → Callbacks → React State → UI Update
4. **Data Changes**: React Props → useGameEngine → GameEngine methods

---

## 🎯 Паттерны и решения

### 1. Callback Ref паттерн
```tsx
// ❌ НЕ используем useEffect - race condition
useEffect(() => {
  if (canvasRef.current) initGameEngine(canvasRef.current)
}, [])

// ✅ Используем callback ref - гарантированная готовность DOM
const canvasRef = useCallback((element) => {
  if (element) initGameEngine(element)
}, [])
```

**Почему callback ref?**
- ✅ Срабатывает точно когда DOM элемент готов
- ✅ Нет race conditions с useEffect
- ✅ Автоматическая cleanup при unmount

### 2. Прямые DOM операции
```javascript
// ✅ 60fps производительность
updateDrag(x, y) {
  this.element.style.transform = `translate3d(${x}px, ${y}px, 0)`
  this.element.style.willChange = 'transform'
}

// ❌ НЕ через React state - медленно
setPosition({x, y}) // Вызовет re-render
```

### 3. Event handling стратегия
```javascript
// ✅ Нативные события с правильными опциями
canvas.addEventListener('touchmove', handler, { passive: false })

// ❌ НЕ React события для интерактивной логики  
<div onTouchMove={handler} /> // Медленнее + ограничения
```

### 4. Состояние синхронизация
```javascript
// GameEngine → React (через callbacks)
onComponentPlace: (id, position) => {
  setGameState(prev => ({
    ...prev,
    placedComponents: prev.placedComponents.map(comp =>
      comp.id === id ? {...comp, position} : comp
    )
  }))
}

// React → GameEngine (через методы)
const addComponent = (type) => {
  gameEngine.addComponent({id, type, position})
}
```

---

## 📚 Best Practices

### ✅ DO - Что делать

**React ответственности:**
- UI структура и layout
- Формы, меню, статичные элементы  
- Данные состояние (scores, levels, user preferences)
- Routing и навигация
- API calls и data fetching

**GameEngine ответственности:**
- Интерактивная логика (drag, selection, animation)
- Прямые DOM операции 
- Event handling для производительности
- Real-time обновления
- Физика, коллизии, game logic

**Инициализация:**
- Всегда используйте callback ref для DOM готовности
- Инициализируйте GameEngine после React mount
- Cleanup GameEngine в useEffect return

**Производительность:**
- Используйте translate3d для GPU ускорения
- Кешируйте getBoundingClientRect результаты
- willChange для анимированных элементов
- Прямые DOM операции вместо React state

### ❌ DON'T - Чего НЕ делать

**Смешивание ответственностей:**
- ❌ Игровая логика в React компонентах
- ❌ DOM манипуляции через React state
- ❌ React события для high-frequency операций
- ❌ useState для позиций drag элементов

**Performance anti-patterns:**
- ❌ setState во время drag операций
- ❌ Frequent re-renders для анимаций
- ❌ CSS классы вместо прямых styles для позиций
- ❌ useEffect для DOM инициализации

**Архитектурные ошибки:**
- ❌ Тесная связь между GameEngine и React
- ❌ Прямой доступ к DOM из React компонентов
- ❌ Отсутствие cleanup логики
- ❌ Callback hell в событийной логике

---

## ⚖️ Альтернативы и Trade-offs

### Когда использовать эту архитектуру

✅ **ИСПОЛЬЗУЙТЕ если:**
- Нужна производительность 60fps для интерактивных операций
- Сложная drag-n-drop логика
- Real-time анимации и эффекты
- Canvas или WebGL интеграция
- Игры, редакторы, интерактивные диаграммы

### Когда НЕ использовать

❌ **НЕ ИСПОЛЬЗУЙТЕ если:**
- Простые формы и статичный UI
- Редкие интерактивные операции
- Team не знакома с Vanilla JS
- Простота важнее производительности
- Прототипирование и MVP

### Trade-offs

| Aspect | Hybrid Architecture | Pure React |
|--------|-------------------|-----------|
| **Производительность** | ✅ 60fps | ❌ 3-15fps |
| **Сложность** | ❌ Высокая | ✅ Низкая |
| **Масштабируемость** | ✅ Хорошая | ❌ Проблемы при росте |
| **Team знания** | ❌ Vanilla JS нужен | ✅ Только React |
| **Debugging** | ❌ Два слоя | ✅ Один слой |
| **Тестирование** | ❌ Сложнее | ✅ Проще |

---

## 🔥 КРИТИЧЕСКИ ВАЖНЫЕ ДЕТАЛИ АРХИТЕКТУРЫ

### SVG Bridge Pattern - Ключевое архитектурное решение

**Проблема:** GameEngine (Vanilla JS) должен отображать React TypeScript компоненты без прямого доступа к React.

**Решение:** SVG Bridge через window.SVGConverter

```javascript
// GameEngine.js - Получение SVG от React компонентов
const { getComponentSVGForGameEngine, ComponentType } = window.SVGConverter || {}
if (getComponentSVGForGameEngine) {
  const svgResult = getComponentSVGForGameEngine(componentType, isActive, switchState)
  element.innerHTML = svgResult
}
```

```typescript
// gameEngineBridge.ts - Инициализация моста
export const initializeGameEngineBridge = () => {
  window.SVGConverter = {
    getComponentSVGForGameEngine,
    ComponentType: ComponentType as any
  }
}
```

**КРИТИЧЕСКИ ВАЖНО:**
- SVG Bridge ДОЛЖЕН быть инициализирован ДО создания GameEngine
- Любые ошибки в SVG Bridge приводят к ERROR компонентам
- Fallback SVG показывает визуальные ошибки на игровом поле

### Lifecycle Management - Предотвращение Race Conditions

```javascript
// ❌ НЕПРАВИЛЬНО - Race condition
useEffect(() => {
  if (canvasRef.current) initGameEngine(canvasRef.current)
}, [])

// ✅ ПРАВИЛЬНО - Callback ref гарантирует готовность DOM
const canvasRef = useCallback((element) => {
  if (element) {
    initializeGameEngineBridge()  // 1. Сначала bridge
    gameEngine = new GameEngine(element, callbacks)  // 2. Потом GameEngine
    setGameEngineReady(true)  // 3. Потом готовность
  }
}, [])

// ✅ ПРАВИЛЬНО - Загрузка уровня ТОЛЬКО после готовности
useEffect(() => {
  if (!gameEngineReady || !level) return
  gameEngine.loadLevel(levelData)
}, [level, gameEngineReady])
```

### Memory Management & Cleanup

```javascript
// ✅ Правильная очистка GameEngine
useEffect(() => {
  return () => {
    if (gameEngineRef.current) {
      gameEngineRef.current.destroy()  // Очистка событий
      gameEngineRef.current = null
    }
    cleanupGameEngineBridge()  // Очистка window.SVGConverter
  }
}, [])

// GameEngine.destroy() - обязательная очистка
destroy() {
  this.clearComponents()
  this.canvas.removeEventListener('touchstart', this.handleTouchStart)
  this.canvas.removeEventListener('touchmove', this.handleTouchMove)
  this.canvas.removeEventListener('touchend', this.handleTouchEnd)
}
```

### Coordinate System & Magnetic Grid

```javascript
// Магнитная сетка 40x40px с визуализацией
canvas.style.backgroundImage = 'radial-gradient(circle, #666666 2px, transparent 2px)'
canvas.style.backgroundSize = '40px 40px'
canvas.style.backgroundPosition = '20px 20px'

// Позиционирование компонентов 100x40px
// SVG магнитные точки: cx="10" и cx="90"
element.style.left = `${componentData.position.x - 10}px`  // Левая магнитная точка на сетку
element.style.top = `${componentData.position.y - 20}px`   // Центр по вертикали

// Snap to grid алгоритм
snapToGrid(position) {
  const GRID_SIZE = 40
  return {
    x: Math.round(position.x / GRID_SIZE) * GRID_SIZE,
    y: Math.round(position.y / GRID_SIZE) * GRID_SIZE
  }
}
```

### Touch vs Mouse Events - Cross-Platform Support

```javascript
// ✅ Универсальная обработка touch/mouse
setupEvents() {
  // Touch для мобильных
  this.canvas.addEventListener('touchstart', this.handleTouchStart, { passive: false })
  this.canvas.addEventListener('touchmove', this.handleTouchMove, { passive: false })
  this.canvas.addEventListener('touchend', this.handleTouchEnd, { passive: false })
  
  // Mouse для десктопа
  this.canvas.addEventListener('mousedown', this.handleMouseDown)
  this.canvas.addEventListener('mousemove', this.handleMouseMove)
  this.canvas.addEventListener('mouseup', this.handleMouseUp)
}

// Unified interaction logic
startInteraction(x, y, target) {
  const componentElement = target.closest('[data-component-id]')
  // ... единая логика для touch и mouse
}
```

### GPU Optimizations - 60fps Performance

```javascript
// ✅ GPU-accelerated transformations
updateDrag(x, y) {
  // translate3d активирует GPU acceleration
  element.style.transform = `translate3d(${deltaX}px, ${deltaY}px, 0)`
}

// ✅ willChange для анимированных элементов
element.style.willChange = 'transform'
element.style.backfaceVisibility = 'hidden'

// ✅ Прямые DOM операции вместо React setState
rotateComponent(component) {
  component.rotation = (component.rotation + 90) % 360
  component.element.style.transform = `rotate(${component.rotation}deg)`  // 60fps
  this.onComponentRotate(component.data.id, component.rotation)  // Notify React
}
```

### Error Boundaries & Debugging

```javascript
// ✅ Визуальные ошибки на игровом поле
getFallbackSVG(componentData) {
  console.error(`❌ КРИТИЧЕСКАЯ ОШИБКА: SVG Converter недоступен для ${componentData.type}!`)
  return `<svg width="100" height="40" viewBox="0 0 100 40">
    <rect x="2" y="2" width="96" height="36" fill="none" stroke="#FF0000" stroke-width="2" stroke-dasharray="4,4"/>
    <text x="50" y="20" text-anchor="middle" fill="#FF0000" font-size="12">ERROR</text>
  </svg>`
}

// ✅ Debug режим
if (process.env.NODE_ENV === 'development') {
  window.gameEngine = this  // Global access для debugging
}
```

### React State Synchronization Patterns

```javascript
// ✅ Правильная синхронизация: GameEngine → React
onComponentPlace: (componentId, position) => {
  setGameState(prev => ({
    ...prev,
    placedComponents: prev.placedComponents.map(comp =>
      comp.id === componentId ? {...comp, position} : comp
    )
  }))
}

// ✅ Правильная синхронизация: React → GameEngine
const addComponent = (type) => {
  const newComponent = {id, type, position, rotation: 0}
  gameEngine.addComponent(newComponent)  // 1. Сначала GameEngine
  setGameState(prev => ({                // 2. Потом React state
    ...prev,
    placedComponents: [...prev.placedComponents, newComponent]
  }))
}
```

### Tap Detection Algorithm

```javascript
// ✅ Точная детекция tap vs drag
endInteraction(x, y) {
  const deltaX = x - this.dragStartPosition.x
  const deltaY = y - this.dragStartPosition.y
  const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY)
  const duration = Date.now() - this.touchStartTime
  
  const isTap = distance < 10 && duration < 200  // Критические значения
  
  if (isTap) {
    this.rotateComponent(this.draggedComponent)  // Поворот
  } else {
    this.moveComponent(this.draggedComponent, deltaX, deltaY)  // Перемещение
  }
}
```

### Security Considerations

```javascript
// ✅ Безопасность window.SVGConverter
if (!getComponentSVGForGameEngine) {
  console.warn('❌ SVG Converter не загружен, используем fallback')
  return this.getFallbackSVG(componentData)  // Не ломаем приложение
}

// ✅ Валидация компонентов
const typeMap = {
  'resistor': ComponentType?.RESISTOR,
  // ... безопасное маппирование
}
if (!componentType) {
  console.warn(`❌ Неизвестный тип компонента: ${componentData.type}`)
  return this.getFallbackSVG(componentData)
}
```

---

## 🚀 Расширение архитектуры

### Добавление новых интерактивных компонентов

1. **В GameEngine** добавить новый компонент тип:
```javascript
// GameEngine.js
createComponentElement(componentData) {
  switch(componentData.type) {
    case 'new_component':
      return this.createNewComponentElement(componentData)
  }
}
```

2. **В useGameEngine** добавить action:
```javascript
const addNewComponent = (data) => {
  gameEngineRef.current?.addComponent(data)
}
```

3. **В UI** использовать через actions:
```tsx
<Button onClick={() => actions.addNewComponent({type: 'new_component'})}>
  Add Component
</Button>
```

### Debugging стратегии

```javascript
// GameEngine debug режим
class GameEngine {
  constructor(canvas, options) {
    this.debug = options.debug || false
    if (this.debug) {
      window.gameEngine = this // Global access для debugging
    }
  }
}

// React debug информация
const useGameEngine = (level) => {
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('GameEngine state:', gameEngineRef.current?.getDebugInfo())
    }
  })
}
```

---

## 📝 Заключение

Эта архитектура решает фундаментальную проблему производительности интерактивных приложений в React через правильное разделение ответственностей. 

**Ключ к успеху:** Использовать правильный инструмент для правильной задачи - React для UI структуры, Vanilla JS для интерактивной логики.

**Результат:** 60fps производительность с чистой архитектурой.

---

## 🚨 Известные проблемы и решения

### Border Radius Issue
**Проблема:** Theme values (20px) превращаются в гигантские значения (400px) в браузере.

**Статус:** Временно решено через константы и `!important`.

**Подробности:** См. [BORDER_RADIUS_ISSUE.md](./BORDER_RADIUS_ISSUE.md)

**Критические правила:**
- ❌ НЕ использовать `theme.mobile.cornerRadius` 
- ✅ Использовать константы из `src/constants/design.ts`
- ✅ `styleOverrides` вместо `variants` для MUI

---

## 🗂️ Система управления уровнями

### LevelManager - Центральная система управления контентом

```typescript
// src/services/LevelManager.ts
export class LevelManager {
  private playerProgress: PlayerProgress
  private loadedLevels: Map<number, Level> = new Map()
  
  constructor() {
    this.playerProgress = this.loadPlayerProgress()
  }
  
  // Динамическая загрузка уровней из JSON
  async loadLevelByOrder(levelOrder: number): Promise<Level | null>
  
  // Управление прогрессией игрока
  completeLevelWithScore(levelOrder: number, score: number): void
  getNextAvailableLevel(completedLevelOrder?: number): number | null
  
  // Персистентность данных
  private loadPlayerProgress(): PlayerProgress
  private savePlayerProgress(): void
}
```

### Принципы архитектуры LevelManager

**Кэширование и производительность:**
- ✅ Map<number, Level> для кэширования загруженных уровней
- ✅ Проверка кэша перед fetch запросами
- ✅ Детальное логирование для отладки загрузки

**Система прогрессии:**
- ✅ Free Progression - нелинейная прогрессия с replay возможностями
- ✅ Level Registry автогенерируемый из Prometheus Studio
- ✅ Unlocking logic основанная на completedLevels и totalScore

**Персистентность:**
- ✅ localStorage для сохранения прогресса игрока
- ✅ Graceful fallback при ошибках чтения
- ✅ Автоматическое сохранение при изменениях прогресса

### Level Registry System

```typescript
// src/levels/level-registry.ts (автогенерируемый)
export interface LevelRegistryEntry {
  id: number
  filename: string  // 'level-001.json'
  displayName: string
  description: string
  unlockRequirements: {
    completedLevels: number[]
    minScore: number
  }
}

export const LEVEL_REGISTRY: LevelRegistryEntry[] = [
  // Автоматически генерируется Prometheus Studio
]
```

**Ключевые функции:**
- `getLevelByOrder(order: number)` - поиск уровня по порядку
- `getNextLevel(currentOrder: number)` - следующий уровень в последовательности  
- `isLevelUnlocked(levelOrder, completedLevels, playerScore)` - проверка доступности
- `getLevelPath(levelOrder: number)` - путь к JSON файлу уровня

---

## 🖥️ Система навигации и экранов

### Screen Architecture

Приложение использует **четырехэкранную навигационную архитектуру** с четким разделением ответственности:

```typescript
// src/App.tsx - центральный роутер
const [currentScreen, setCurrentScreen] = useState<'main' | 'settings' | 'levels' | 'game'>('main')

// Навигационные экраны
- MainScreen     // Входная точка, Play кнопка
- LevelsScreen   // Сетка уровней для выбора
- GameScreen     // Активный геймплей
- SettingsScreen // Настройки игры
```

### MainScreen - Entry Point

```tsx
// src/components/game/MainScreen.tsx
export const MainScreen = ({ onPlayClick, onLevelsClick, onSettingsClick }) => {
  // Фокус на primary action - Play кнопке
  // Загружает playerProgress.currentLevel (не hardcoded level-001)
}
```

**Ответственности:**
- ✅ Primary CTA для продолжения прогрессии
- ✅ Быстрый доступ к level selection и settings
- ✅ Clean, uncluttered design для новых пользователей

### LevelsScreen - Free Progression Interface

```tsx
// src/components/game/LevelsScreen/
├── LevelsScreen.tsx    // Контейнер с header и background
├── LevelGrid.tsx       // 3-колоночная адаптивная сетка  
└── LevelCard.tsx       // Карточки уровней с 3 состояниями
```

**LevelCard States:**
- **Current:** `backgroundColor: '#D84205'` с play иконкой (▶)
- **Passed:** `transparent background` с серой рамкой + статистика
- **Completed:** `темный фон` с белым текстом + статистика

**Grid Layout Pattern:**
```css
/* 3-колоночная responsive grid */
display: grid;
grid-template-columns: repeat(3, 1fr);
gap: 16px;
padding: 0 20px; /* 125% от gap размера */

/* Square cards с aspect-ratio */
aspect-ratio: 1;
border-radius: 20px !important; /* Фиксированное значение */
```

### GameScreen - Hybrid Architecture Integration

```tsx
// src/components/game/GameScreen/index.tsx
export const GameScreen = ({ level, onBackToMain, onNextLevel }) => {
  const { gameState, initializeGameEngine } = useGameEngine(level)
  
  // Callback ref для правильной инициализации GameEngine
  const canvasRef = useCallback((element) => {
    if (element) initializeGameEngine(element)
  }, [initializeGameEngine])
  
  return (
    <Box>
      <TopGameBar {...gameState} />
      <div ref={canvasRef} /> {/* GameEngine mount point */}
      <ComponentPalette {...gameState} />
      <GameControls {...gameState} />
    </Box>
  )
}
```

### Navigation Flow Patterns

**Level Completion Flow:**
```typescript
// После завершения уровня
const handleNextLevel = async (score: number) => {
  const currentLevelOrder = testLevel.registryOrder || 1
  
  // 1. Отметить текущий уровень как завершенный
  levelManager.completeLevelWithScore(currentLevelOrder, score)
  
  // 2. Найти следующий доступный уровень  
  const nextLevelOrder = levelManager.getNextAvailableLevel(currentLevelOrder)
  
  // 3. Загрузить следующий уровень или показать завершение
  if (nextLevelOrder) {
    const nextLevel = await levelManager.loadLevelByOrder(nextLevelOrder)
    setTestLevel(nextLevel)
  } else {
    alert('Поздравляем! Все уровни пройдены!')
    setCurrentScreen('main')
  }
}
```

---

## ⚡ Производительность и оптимизация

### Timer System - Zero Performance Impact

**Проблема:** Live timers обновляющиеся каждую секунду создают ненужные re-renders и ухудшают производительность.

**Решение:** Lazy Timer Calculation

```javascript
// src/hooks/useGameEngine.js
const levelStartTimeRef = useRef(null)

// Запуск таймера (без live updates)
const initializeGameEngine = (canvasElement) => {
  levelStartTimeRef.current = Date.now()  // Один capture timestamp
  // ... остальная инициализация
}

// Расчет времени ТОЛЬКО при завершении
const finishLevel = () => {
  const finalTime = levelStartTimeRef.current 
    ? Math.floor((Date.now() - levelStartTimeRef.current) / 1000) : 0
    
  // Linked bestTime/bestScore logic
  const isNewRecord = prev.currentScore > prev.bestScore
  setGameState(prev => ({
    ...prev,
    levelTime: finalTime,
    bestScore: isNewRecord ? prev.currentScore : prev.bestScore,
    bestTime: isNewRecord ? finalTime : prev.bestTime,
  }))
}
```

**Benefits:**
- ✅ Нет performance impact во время геймплея
- ✅ Точная интеграция с scoring system
- ✅ Linked record tracking (bestScore + bestTime)

### Level Caching Strategy

```typescript
// LevelManager.ts - Intelligent caching
private loadedLevels: Map<number, Level> = new Map()

async loadLevelByOrder(levelOrder: number): Promise<Level | null> {
  // 1. Проверка кэша
  if (this.loadedLevels.has(levelOrder)) {
    return this.loadedLevels.get(levelOrder)!
  }
  
  // 2. Fetch только если нет в кэше
  const response = await fetch(`/levels/level-${levelOrder.toString().padStart(3, '0')}.json`)
  const levelData = await response.json()
  const level = await loadLevel(levelData)
  
  // 3. Кэширование результата
  this.loadedLevels.set(levelOrder, level)
  return level
}
```

### Border Radius Performance Issue

**⚠️ КРИТИЧЕСКАЯ ПРОБЛЕМА:** Theme values превращаются в гигантские размеры

```typescript
// ❌ ПРОБЛЕМА
borderRadius: theme.mobile.cornerRadius // 20px → 400px в браузере

// ✅ РЕШЕНИЕ  
borderRadius: `${BORDER_RADIUS.PANEL}px !important` // Принудительно 20px
```

**Архитектурное решение:**
- Constants файл: `src/constants/design.ts`
- `styleOverrides` вместо `variants` для MUI компонентов
- `!important` для критических border-radius значений

---

*Документация написана на основе реального опыта разработки высокопроизводительной игры-симулятора электронных схем.*