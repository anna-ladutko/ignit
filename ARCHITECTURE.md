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

*Документация написана на основе реального опыта разработки высокопроизводительной игры-симулятора электронных схем.*