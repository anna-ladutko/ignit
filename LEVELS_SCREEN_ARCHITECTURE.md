# Архитектура экрана уровней - IGNIT Mobile Game

> **Подробное руководство по стандартизации экрана выбора уровней**
> 
> Версия: 1.0  
> Последнее обновление: Август 2025

## 📋 Содержание

1. [Обзор архитектуры](#обзор-архитектуры)
2. [Компонентная структура](#компонентная-структура)
3. [Система управления уровнями](#система-управления-уровнями)
4. [Логика разблокировки и прогрессии](#логика-разблокировки-и-прогрессии)
5. [Верстка и дизайн-система](#верстка-и-дизайн-система)
6. [Состояния уровней](#состояния-уровней)
7. [Адаптивная сетка](#адаптивная-сетка)
8. [Интеграция с игровой логикой](#интеграция-с-игровой-логикой)
9. [Типизация и интерфейсы](#типизация-и-интерфейсы)
10. [Руководство по портированию](#руководство-по-портированию)

---

## 🏗️ Обзор архитектуры

### Ключевые принципы

**Экран уровней IGNIT** реализует **трехслойную архитектуру**:

1. **Presentation Layer**: React компоненты для UI
2. **Business Logic Layer**: LevelManager для управления прогрессом
3. **Data Layer**: Level Registry + localStorage для персистентности

### Философия дизайна

- **Free Progression**: Нелинейная прогрессия с возможностью переигрывания
- **Visual Hierarchy**: Четкие состояния уровней через цвет и типографику
- **Mobile-First**: Оптимизирован для touch-интерфейсов
- **Performance**: Ленивая загрузка и кэширование уровней

---

## 🧩 Компонентная структура

### 1. LevelsScreen (Контейнер)

```tsx
// src/components/game/LevelsScreen/LevelsScreen.tsx
interface LevelsScreenProps {
  onBackClick: () => void
  onSettingsClick: () => void  
  onLevelClick: (levelNumber: number) => void
}
```

**Архитектурные решения:**

- **Фиксированный фон**: `position: fixed` с z-index для производительности
- **Scrollable Content**: `height: calc(100vh - 80px)` для header компенсации  
- **Custom Scrollbar**: Стилизованный под тему игры
- **Navigation Header**: Back и Settings кнопки по краям

**Ключевые стили:**
```tsx
// Фиксированный фон
backgroundImage: 'url(/theme-fire-bg2.webp)'
backgroundSize: 'cover'
position: 'fixed'
zIndex: -1

// Кастомный скроллбар
'&::-webkit-scrollbar': {
  width: '6px'
}
'&::-webkit-scrollbar-thumb': {
  backgroundColor: 'rgba(229, 223, 209, 0.3)'
  borderRadius: '3px'
}
```

### 2. LevelGrid (Сетка уровней)

```tsx
// src/components/game/LevelsScreen/LevelGrid.tsx
interface LevelGridProps {
  onLevelClick: (levelNumber: number) => void
}
```

**Логика отображения:**
- Получает прогресс игрока через `levelManager.getPlayerProgress()`
- Создает массив LevelData только для **разблокированных** уровней
- Обратный порядок отображения (новые уровни сверху)

**3-колоночная адаптивная сетка:**
```tsx
display: 'grid'
gridTemplateColumns: 'repeat(3, 1fr)'
gap: '16px'
padding: '0 20px'  // 125% от gap размера (правило UI-системы)
```

**Временная статистика (для демонстрации):**
```tsx
const mockStats = {
  1: { efficiency: 88.6, time: 183 },
  2: { efficiency: 88.6, time: 183 },
  // ... до level 7
}
```

### 3. LevelCard (Карточка уровня)

```tsx
// src/components/game/LevelsScreen/LevelCard.tsx
export type LevelState = 'current' | 'passed' | 'completed'

interface LevelCardProps {
  levelNumber: number
  state: LevelState
  bestEfficiency?: number  // 0-100%
  bestTime?: number        // В секундах
  onClick: () => void
}
```

**Три состояния карточек:**

| State | Background | Border | Icon | Stats |
|-------|-----------|---------|------|-------|
| **current** | `#D84205` (Ignit smolder) | none | ▶ (PlayArrow) | скрыты |
| **passed** | `transparent` | `rgba(32, 34, 33, 0.7)` | нет | показаны |
| **completed** | `rgba(32, 34, 33, 0.4)` | `rgba(32, 34, 33, 0.6)` | нет | показаны |

**Логика определения состояния:**
```tsx
// В LevelGrid.tsx
const isCurrent = i === playerProgress.currentLevel && !isCompleted
let state: LevelState
if (isCurrent) {
  state = 'current'
} else if (isCompleted) {
  // >= 85% efficiency = completed, < 85% = passed
  state = (stats?.efficiency || 0) >= 85 ? 'completed' : 'passed'
} else {
  state = 'current'  // Доступный но не пройденный
}
```

---

## 🎮 Система управления уровнями

### LevelManager (Singleton)

```typescript
// src/services/LevelManager.ts
export class LevelManager {
  private playerProgress: PlayerProgress
  private loadedLevels: Map<number, Level> = new Map()
  
  constructor() {
    this.playerProgress = this.loadPlayerProgress()
  }
}
```

**Ключевые методы:**

#### loadLevelByOrder(levelOrder: number)
```typescript
async loadLevelByOrder(levelOrder: number): Promise<Level | null> {
  // 1. Проверка кэша
  if (this.loadedLevels.has(levelOrder)) {
    return this.loadedLevels.get(levelOrder)!
  }
  
  // 2. Проверка разблокировки
  if (!isLevelUnlocked(levelOrder, completedLevels, totalScore)) {
    return null
  }
  
  // 3. Fetch и парсинг
  const levelPath = getLevelPath(levelOrder)  // '/levels/level-001.json'
  const response = await fetch(levelPath)
  const levelData = await response.json()
  
  // 4. Конвертация через loadLevel() utility
  const level = await loadLevel(levelData)
  
  // 5. Кэширование
  this.loadedLevels.set(levelOrder, level)
  return level
}
```

#### completeLevelWithScore(levelOrder: number, score: number)
```typescript
completeLevelWithScore(levelOrder: number, score: number): void {
  // Добавление в completedLevels массив
  if (!this.playerProgress.completedLevels.includes(levelOrder)) {
    this.playerProgress.completedLevels.push(levelOrder)
  }
  
  // Обновление totalScore
  this.playerProgress.totalScore += score
  
  // Продвижение currentLevel
  if (levelOrder === this.playerProgress.currentLevel) {
    const nextLevel = this.getNextAvailableLevel(levelOrder)
    if (nextLevel) {
      this.playerProgress.currentLevel = nextLevel
    }
  }
  
  // Сохранение в localStorage
  this.savePlayerProgress()
}
```

### PlayerProgress Interface

```typescript
export interface PlayerProgress {
  completedLevels: number[]    // [1, 2, 3, 5, 7] - список пройденных уровней
  currentLevel: number         // 8 - следующий рекомендуемый уровень
  totalScore: number          // 12450 - общий накопленный счет
}
```

**Персистентность:**
- Сохранение в `localStorage` под ключом `'ignit_player_progress'`
- Graceful fallback к дефолтным значениям при ошибках
- Автоматическое сохранение при любых изменениях прогресса

---

## 🔐 Логика разблокировки и прогрессии

### Level Registry System

```typescript
// src/levels/level-registry.ts (автогенерируемый файл)
export interface LevelRegistryEntry {
  id: number                    // 1, 2, 3...
  filename: string             // 'level-001.json'
  displayName: string          // 'Level 1'
  description: string          // Описание уровня
  unlockRequirements: {
    completedLevels: number[]  // [1, 2] - какие уровни должны быть пройдены
    minScore: number           // 0 - минимальный накопленный счет
  }
}
```

### Алгоритм разблокировки

```typescript
// Функция isLevelUnlocked
export function isLevelUnlocked(
  levelOrder: number, 
  completedLevels: number[], 
  playerScore: number
): boolean {
  const level = getLevelByOrder(levelOrder)
  if (!level) return false
  
  // Проверка требований по завершенным уровням
  const requiredCompleted = level.unlockRequirements.completedLevels.every(
    requiredLevel => completedLevels.includes(requiredLevel)
  )
  
  // Проверка требований по счету
  const scoreRequirementMet = playerScore >= level.unlockRequirements.minScore
  
  return requiredCompleted && scoreRequirementMet
}
```

### Free Progression Model

**Особенности:**
- **Нелинейная прогрессия**: Не обязательно проходить уровни по порядку
- **Replay возможности**: Можно переигрывать пройденные уровни
- **Flexible unlocking**: Уровни могут иметь сложные требования разблокировки
- **Score-based progression**: Некоторые уровни требуют минимальный счет

**Пример цепочки разблокировки:**
```
Level 1 → Level 2 → Level 3 → Level 5
              ↓
          Level 4 → Level 6 → Level 7
```

---

## 🎨 Верстка и дизайн-система

### Цветовая палитра Ignit Fire

```typescript
// Из semantic-theme-system.ts
ignitFire: {
  primary: '#D84205',     // Ignit smolder (основной)
  secondary: '#FF8000',   // Ignit fire (акцентный)
  surface: '#343635',     // Ignit ash (поверхности)
  background: '#202221',  // Ignit coal (фон)
  textPrimary: '#E5DFD1', // Creamy white (основной текст)
}
```

### Border Radius система

```typescript
// src/constants/design.ts
export const BORDER_RADIUS = {
  BUTTON: "10px",    // Все кнопки
  PANEL: "20px",     // Панели, модальные окна, карточки
  SMALL: "5px",      // Мелкие элементы
  LARGE: "24px",     // Большие контейнеры
} as const

// Использование в LevelCard
borderRadius: `${BORDER_RADIUS.PANEL}px !important`  // 20px принудительно
```

**⚠️ Критическая проблема Border Radius:**
- Theme values (20px) превращаются в гигантские размеры (400px) в браузере
- **Решение**: Использовать константы из `design.ts` + `!important`
- **Запрещено**: `theme.mobile.cornerRadius` или `theme.shape.borderRadius`

### Типографическая система

```typescript
// Montserrat font family используется везде
fontFamily: '"Montserrat", "Arial", sans-serif'

// Размеры для уровней:
// - Номер уровня: 16px, weight 500
// - Efficiency: 18px, weight 700  
// - Time: 12px, weight 400
```

### Spacing Standards

```typescript
// UI Element Margins - 20px от краев экрана
padding: '0 20px'  // В LevelGrid

// Grid gap - 16px между карточками
gap: '16px'

// Padding relationship: 20px = 16px * 1.25 (правило 125%)
```

---

## 📊 Состояния уровней

### Визуальные индикаторы

#### Current Level
```tsx
// Стили для текущего уровня
backgroundColor: '#D84205'        // Ignit smolder
color: '#E5DFD1'                 // Creamy white
showPlayIcon: true               // PlayArrow в правом нижнем углу
showStats: false                 // Статистика скрыта
```

#### Passed Level  
```tsx
// Стили для пройденного уровня (< 85% efficiency)
backgroundColor: 'transparent'
border: '1px solid rgba(32, 34, 33, 0.7)'  // Ignit coal с прозрачностью
levelNumberColor: '#D84205'      // Ignit smolder
statsColor: '#E5DFD1'           // Creamy white
showPlayIcon: false
showStats: true                  // Показать efficiency и time
```

#### Completed Level
```tsx
// Стили для завершенного уровня (>= 85% efficiency)
backgroundColor: 'rgba(32, 34, 33, 0.4)'    // Ignit coal с прозрачностью
border: '1px solid rgba(32, 34, 33, 0.6)'   // Темнее border
levelNumberColor: '#D84205'      // Ignit smolder  
statsColor: '#E5DFD1'           // Creamy white
showPlayIcon: false
showStats: true                  // Показать efficiency и time
```

### Анимации и интерактивность

```tsx
// Hover и tap эффекты
'&:hover': {
  transform: 'scale(1.02)'       // Легкое увеличение
}
'&:active': {
  transform: 'scale(0.98)'       // Сжатие при нажатии
}
transition: 'all 0.2s ease'      // Плавный переход
```

---

## 📱 Адаптивная сетка

### Grid Layout Pattern

```tsx
// 3-колоночная сетка на всех размерах экрана
display: 'grid'
gridTemplateColumns: 'repeat(3, 1fr)'
gap: '16px'
padding: '0 20px'
paddingBottom: '40px'  // Дополнительный отступ внизу

// Квадратные карточки
width: '100%'
aspectRatio: '1'       // 1:1 соотношение сторон
```

### Responsive поведение

- **Мобильные экраны**: 3 колонки (минимальная ширина карточки ~100px)
- **Планшеты**: 3 колонки (более крупные карточки)
- **Desktop**: 3 колонки (максимальная ширина контейнера)

### Scrolling поведение

```tsx
// Scrollable область
height: 'calc(100vh - 80px)'    // Компенсация header
overflowY: 'auto'
overflowX: 'hidden'

// Кастомный scrollbar в стиле игры
'&::-webkit-scrollbar': { width: '6px' }
'&::-webkit-scrollbar-thumb': {
  backgroundColor: 'rgba(229, 223, 209, 0.3)'
  borderRadius: '3px'
}
```

---

## 🔗 Интеграция с игровой логикой

### Навигационный поток

#### Вход на экран уровней
```tsx
// Из MainScreen
const handleLevelsClick = () => {
  setCurrentScreen('levels')
}

// Из GameScreen (после завершения уровня)
const handleBackToLevels = () => {
  setCurrentScreen('levels')
}
```

#### Выбор уровня
```tsx
// LevelsScreen → App.tsx
const handleLevelClick = (levelNumber: number) => {
  setSelectedLevel(levelNumber)
  setCurrentScreen('game')
}

// Загрузка выбранного уровня в App.tsx
useEffect(() => {
  if (selectedLevel && currentScreen === 'game') {
    const loadSelectedLevel = async () => {
      const level = await levelManager.loadLevelByOrder(selectedLevel)
      setTestLevel(level)
    }
    loadSelectedLevel()
  }
}, [selectedLevel, currentScreen])
```

### Синхронизация прогресса

#### После завершения уровня
```tsx
// В GameScreen при завершении уровня
const handleLevelComplete = (score: number) => {
  const currentLevelOrder = testLevel.registryOrder || 1
  
  // 1. Отметить уровень как завершенный
  levelManager.completeLevelWithScore(currentLevelOrder, score)
  
  // 2. Найти следующий доступный уровень
  const nextLevelOrder = levelManager.getNextAvailableLevel(currentLevelOrder)
  
  // 3. Загрузить следующий или вернуться к выбору
  if (nextLevelOrder) {
    const nextLevel = await levelManager.loadLevelByOrder(nextLevelOrder)
    setTestLevel(nextLevel)
  } else {
    setCurrentScreen('levels')  // Все уровни пройдены
  }
}
```

---

## 📝 Типизация и интерфейсы

### Основные типы

```typescript
// Состояние уровня в UI
export type LevelState = 'current' | 'passed' | 'completed'

// Данные для отображения уровня
interface LevelData {
  levelNumber: number
  state: LevelState
  bestEfficiency?: number  // 0-100
  bestTime?: number        // секунды
}

// Прогресс игрока
export interface PlayerProgress {
  completedLevels: number[]
  currentLevel: number
  totalScore: number
}

// Запись в реестре уровней
export interface LevelRegistryEntry {
  id: number
  filename: string
  displayName: string
  description: string
  unlockRequirements: {
    completedLevels: number[]
    minScore: number
  }
}
```

### Props интерфейсы

```typescript
// Главный экран уровней
interface LevelsScreenProps {
  onBackClick: () => void
  onSettingsClick: () => void
  onLevelClick: (levelNumber: number) => void
}

// Сетка уровней
interface LevelGridProps {
  onLevelClick: (levelNumber: number) => void
}

// Карточка уровня
interface LevelCardProps {
  levelNumber: number
  state: LevelState
  bestEfficiency?: number
  bestTime?: number
  onClick: () => void
}
```

---

## 🚀 Руководство по портированию

### 1. Подготовка структуры файлов

```
src/
├── components/game/LevelsScreen/
│   ├── LevelsScreen.tsx         # Главный контейнер
│   ├── LevelGrid.tsx           # Сетка уровней  
│   └── LevelCard.tsx           # Карточка уровня
├── services/
│   └── LevelManager.ts         # Управление прогрессом
├── levels/
│   └── level-registry.ts       # Реестр уровней
├── constants/
│   └── design.ts              # Константы дизайна
└── types/
    └── level.ts               # Типы уровней
```

### 2. Копирование основных файлов

**Обязательные файлы для копирования:**
- `LevelsScreen.tsx` - адаптировать пропсы под вашу навигацию
- `LevelGrid.tsx` - изменить `mockStats` на реальную статистику
- `LevelCard.tsx` - настроить цвета под вашу тему
- `LevelManager.ts` - адаптировать под ваши типы Level
- `level-registry.ts` - создать для ваших уровней
- `design.ts` - настроить border-radius константы

### 3. Настройка темы и стилей

#### Адаптация цветовой схемы
```typescript
// Замените Ignit Fire палитру на вашу
const yourTheme = {
  primary: '#YOUR_PRIMARY',      // Замена для #D84205
  secondary: '#YOUR_SECONDARY',  // Замена для #FF8000
  surface: '#YOUR_SURFACE',      // Замена для #343635
  background: '#YOUR_BACKGROUND',// Замена для #202221
  textPrimary: '#YOUR_TEXT',     // Замена для #E5DFD1
}
```

#### Border Radius константы
```typescript
// Настройте под ваш дизайн
export const BORDER_RADIUS = {
  BUTTON: "8px",      // Ваш размер для кнопок
  PANEL: "16px",      // Ваш размер для панелей
  SMALL: "4px",       // Мелкие элементы
  LARGE: "24px",      // Большие контейнеры
}
```

### 4. Интеграция с навигацией

#### Подключение к вашему роутеру
```tsx
// Пример интеграции
const YourApp = () => {
  const [currentScreen, setCurrentScreen] = useState('main')
  
  const handleLevelClick = (levelNumber: number) => {
    // Ваша логика загрузки уровня
    loadLevel(levelNumber)
    setCurrentScreen('game')
  }
  
  return (
    <>
      {currentScreen === 'levels' && (
        <LevelsScreen
          onBackClick={() => setCurrentScreen('main')}
          onSettingsClick={() => setCurrentScreen('settings')}
          onLevelClick={handleLevelClick}
        />
      )}
    </>
  )
}
```

### 5. Адаптация LevelManager

#### Подключение к вашей системе уровней
```typescript
// Адаптируйте loadLevel функцию
const level = await loadLevel(levelData) // Ваша функция загрузки
level.registryOrder = levelOrder         // Добавьте registry order

// Адаптируйте localStorage ключ
localStorage.setItem('your_game_progress', JSON.stringify(progress))
```

### 6. Создание Level Registry

#### Автогенерация или ручное создание
```typescript
export const LEVEL_REGISTRY: LevelRegistryEntry[] = [
  {
    id: 1,
    filename: 'level_001.json',  // Ваше именование файлов
    displayName: 'Level 1',
    description: 'Tutorial level',
    unlockRequirements: {
      completedLevels: [],       // Первый уровень всегда доступен
      minScore: 0
    }
  },
  // ... ваши уровни
]
```

### 7. Настройка статистики

#### Замена mockStats на реальные данные
```typescript
// В LevelGrid.tsx - замените это:
const mockStats = { /* временные данные */ }

// На ваш источник статистики:
const getRealStats = (levelNumber: number) => {
  return {
    efficiency: playerProgress.levelStats[levelNumber]?.efficiency,
    time: playerProgress.levelStats[levelNumber]?.bestTime
  }
}
```

### 8. Тестирование и отладка

**Чек-лист для проверки:**
- ✅ Уровни правильно разблокируются согласно требованиям
- ✅ Прогресс сохраняется в localStorage
- ✅ Статистика корректно отображается на карточках  
- ✅ Навигация работает между экранами
- ✅ Стили адаптированы под вашу тему
- ✅ Border radius отображается правильно (не гигантские размеры)
- ✅ Сетка адаптируется под разные размеры экранов
- ✅ Анимации и hover эффекты работают плавно

---

## 🔍 Дополнительные возможности

### Расширения архитектуры

#### Поиск и фильтрация
```typescript
// Можно добавить поиск по уровням
interface LevelGridProps {
  searchQuery?: string
  difficultyFilter?: 'easy' | 'medium' | 'hard'
  onLevelClick: (levelNumber: number) => void
}
```

#### Категории уровней
```typescript
// Группировка по темам/мирам
interface LevelCategory {
  id: string
  name: string  
  levels: number[]
  unlockRequirements: UnlockRequirements
}
```

#### Achievements система
```typescript
// Достижения за прохождение уровней
interface Achievement {
  id: string
  name: string
  description: string
  levelRequirements: number[]
  scoreRequirement?: number
}
```

### Performance оптимизации

#### Виртуализация для больших списков
```typescript
// Для игр с 100+ уровнями
import { FixedSizeGrid as Grid } from 'react-window'

const VirtualizedLevelGrid = ({ levels }) => {
  // Виртуализированный рендеринг
}
```

#### Image optimization
```typescript
// Lazy loading для фоновых изображений
const [imageLoaded, setImageLoaded] = useState(false)

useEffect(() => {
  const img = new Image()
  img.onload = () => setImageLoaded(true)
  img.src = '/theme-fire-bg2.webp'
}, [])
```

---

## 📚 Заключение

Архитектура экрана уровней IGNIT представляет **полноценную, масштабируемую систему** для управления прогрессией игрока в мобильных играх.

### Ключевые преимущества

- **Модульность**: Легко адаптируется под разные игры и темы
- **Производительность**: Ленивая загрузка и кэширование уровней  
- **UX**: Интуитивные состояния уровней и плавные анимации
- **Гибкость**: Free Progression модель с сложными требованиями разблокировки
- **Типобезопасность**: Полная TypeScript поддержка

### Готовые решения

- ✅ **Level Registry** система для управления метаданными
- ✅ **PlayerProgress** персистентность через localStorage
- ✅ **3-состояния уровней** с визуальной дифференциацией
- ✅ **Адаптивная 3-колоночная сетка** для всех устройств  
- ✅ **Performance кэширование** загруженных уровней
- ✅ **Seamless навигация** между экранами игры

### Время интеграции

**Базовая интеграция**: 2-4 часа (копирование + базовая настройка)
**Полная кастомизация**: 1-2 дня (стили + логика + тестирование)
**Продвинутые фичи**: 3-5 дней (achievements + analytics + effects)

---

*Данная архитектура успешно протестирована в production среде мобильной игры IGNIT и готова для портирования в другие проекты.*