/**
 * GameEngine - Чистый JavaScript игровой движок
 * Отвечает за всю игровую механику без React
 */

export class GameEngine {
  constructor(canvasElement, options = {}) {
    this.canvas = canvasElement
    this.components = new Map() // id -> {element, data, position}
    this.isDragging = false
    this.draggedComponent = null
    this.dragStartPosition = null
    this.touchStartTime = 0
    
    // Callbacks для связи с React
    this.onScoreChange = options.onScoreChange || (() => {})
    this.onComponentPlace = options.onComponentPlace || (() => {})
    this.onComponentRotate = options.onComponentRotate || (() => {})
    this.onLevelComplete = options.onLevelComplete || (() => {})
    
    this.setupCanvas()
    this.setupEvents()
  }
  
  setupCanvas() {
    // Настройка канваса для игры
    this.canvas.style.position = 'relative'
    this.canvas.style.width = '100%'
    this.canvas.style.height = '100%'
    this.canvas.style.overflow = 'hidden'
    this.canvas.style.touchAction = 'none' // Отключаем браузерные жесты
    this.canvas.style.userSelect = 'none'
    this.canvas.style.webkitUserSelect = 'none'
    
    // Добавляем визуальную сетку из серых точечек
    this.canvas.style.backgroundImage = 'radial-gradient(circle, #666666 2px, transparent 2px)'
    this.canvas.style.backgroundSize = '40px 40px'
    this.canvas.style.backgroundPosition = '20px 20px' // Центрируем точки в grid
    
    console.log('✅ GameEngine: Canvas setup завершен с визуальной сеткой')
  }
  
  setupEvents() {
    // Прямая регистрация событий для максимальной производительности
    this.canvas.addEventListener('touchstart', this.handleTouchStart.bind(this), { passive: false })
    this.canvas.addEventListener('touchmove', this.handleTouchMove.bind(this), { passive: false })
    this.canvas.addEventListener('touchend', this.handleTouchEnd.bind(this), { passive: false })
    
    // Mouse events для десктопа
    this.canvas.addEventListener('mousedown', this.handleMouseDown.bind(this))
    this.canvas.addEventListener('mousemove', this.handleMouseMove.bind(this))
    this.canvas.addEventListener('mouseup', this.handleMouseUp.bind(this))
  }
  
  // === ИГРОВАЯ МЕХАНИКА ===
  
  addComponent(componentData) {
    console.log(`🎮 GAMEENGINE: addComponent вызвана с componentData:`, componentData)
    console.log(`🎮 GAMEENGINE: originalComponentId="${componentData.originalComponentId}"`)
    
    const element = this.createComponentElement(componentData)
    this.canvas.appendChild(element)
    
    const componentRecord = {
      element,
      data: componentData,
      position: { ...componentData.position },
      rotation: componentData.rotation || 0
    }
    
    this.components.set(componentData.id, componentRecord)
    
    console.log(`🎮 GAMEENGINE: Added component ${componentData.id}`)
    console.log(`🎮 GAMEENGINE: componentRecord.data.originalComponentId="${componentRecord.data.originalComponentId}"`)
    
    // Debug: проверить что данные сохранились
    const storedComponent = this.components.get(componentData.id)
    console.log(`🎮 GAMEENGINE: Проверка сохранения - storedComponent.data.originalComponentId="${storedComponent.data.originalComponentId}"`)
  }
  
  createComponentElement(componentData) {
    const element = document.createElement('div')
    element.className = 'game-component'
    element.setAttribute('data-component-id', componentData.id)
    element.setAttribute('data-component-type', componentData.type)
    
    // Позиционирование для магнитных символов (100x40) - синхронизация с сеткой
    element.style.position = 'absolute'
    
    // Магнитные точки должны попадать на сеточные точки (20px, 60px, 100px...)
    // SVG магнитные точки: cx="10" и cx="90" (в 100px компоненте)
    // Чтобы левая магнитная точка (10px) попала на сеточную точку position.x:
    // left = position.x - 10px
    element.style.left = `${componentData.position.x - 10}px` 
    element.style.top = `${componentData.position.y - 20}px` // Центр по вертикали
    element.style.width = '100px'
    element.style.height = '40px'
    element.style.cursor = 'pointer'
    element.style.zIndex = '10'
    
    // GPU оптимизации
    element.style.willChange = 'transform'
    element.style.backfaceVisibility = 'hidden'
    
    // Добавляем SVG символ компонента
    element.innerHTML = this.getComponentSVG(componentData)
    
    // КРИТИЧЕСКИ ВАЖНО: SVG элементы должны пропускать события к GameEngine
    const svg = element.querySelector('svg')
    if (svg) {
      svg.style.pointerEvents = 'none' // События проходят к контейнеру
    }
    
    return element
  }
  
  getComponentSVG(componentData) {
    console.log(`🔧 GameEngine: getComponentSVG called for type: ${componentData.type}`)
    
    // Используем новый hybrid SVG подход с магнитными символами
    const { getComponentSVGForGameEngine, ComponentType } = window.SVGConverter || {}
    
    console.log(`🔗 GameEngine: SVGConverter available:`, !!getComponentSVGForGameEngine, !!ComponentType)
    
    if (!getComponentSVGForGameEngine) {
      console.warn('❌ SVG Converter не загружен, используем fallback')
      return this.getFallbackSVG(componentData)
    }
    
    // Преобразуем строковые типы в ComponentType enum
    // Поддержка как базовых типов, так и палитных названий компонентов
    const typeMap = {
      // Базовые типы
      'resistor': ComponentType?.RESISTOR,
      'capacitor': ComponentType?.CAPACITOR,
      'inductor': ComponentType?.INDUCTOR,
      'led': ComponentType?.LED,
      'voltage_source': ComponentType?.VOLTAGE_SOURCE,
      'switch': ComponentType?.SWITCH,
      'supercapacitor': ComponentType?.SUPERCAPACITOR,
      
      // Палитные типы резисторов
      'R_DIV_1': ComponentType?.RESISTOR,
      'R_DIV_2': ComponentType?.RESISTOR,
      
      // Палитные типы конденсаторов  
      'C_FILTER': ComponentType?.CAPACITOR,
      'C_WRONG_1': ComponentType?.CAPACITOR,
      
      // Палитные типы индуктивностей
      'L_FILTER': ComponentType?.INDUCTOR,
      
      // Палитные типы LED
      'TARGET_LED_1': ComponentType?.LED,
      'TARGET_LED_2': ComponentType?.LED
    }
    
    const componentType = typeMap[componentData.type]
    console.log(`🎯 GameEngine: Mapped ${componentData.type} to:`, componentType)
    
    if (!componentType) {
      console.warn(`❌ Неизвестный тип компонента: ${componentData.type}`)
      return this.getFallbackSVG(componentData)
    }
    
    // Определить состояние компонента
    const isSource = componentData.type === 'voltage_source'
    const isTarget = componentData.type === 'led' && componentData.isPreinstalled
    const isSelected = false // Будет обновляться через setComponentState
    const isConnected = componentData.isConnected || false
    
    // Получить ComponentState enum
    const { ComponentState } = window.SVGConverter || {}
    let componentState = 'disconnected' // fallback
    
    if (ComponentState) {
      if (isSource || isTarget) {
        // SOURCE и TARGETS всегда золотые (#FFBE4D)
        componentState = ComponentState.SOURCE
      } else if (isConnected) {
        componentState = ComponentState.CONNECTED  
      } else {
        componentState = ComponentState.DISCONNECTED
      }
    }
    
    const switchState = componentData.switchState || false
    
    console.log(`✅ GameEngine: Calling getComponentSVGForGameEngine with state: ${componentState}`)
    const svgResult = getComponentSVGForGameEngine(componentType, componentState, switchState)
    console.log(`📄 GameEngine: Generated SVG length:`, svgResult?.length)
    
    return svgResult
  }
  
  getFallbackSVG(componentData) {
    // КРИТИЧЕСКАЯ ОШИБКА: SVG Converter должен быть всегда доступен
    console.error(`❌ КРИТИЧЕСКАЯ ОШИБКА: SVG Converter недоступен для ${componentData.type}!`)
    console.error(`❌ Bridge не инициализирован или произошла ошибка загрузки`)
    
    // Показываем ошибку визуально на игровом поле
    const color = '#FF0000' // Красный цвет для ошибок
    
    return `<svg width="100" height="40" viewBox="0 0 100 40">
      <rect x="2" y="2" width="96" height="36" fill="none" stroke="${color}" stroke-width="2" stroke-dasharray="4,4"/>
      <text x="50" y="20" text-anchor="middle" fill="${color}" font-size="12">ERROR</text>
      <text x="50" y="32" text-anchor="middle" fill="${color}" font-size="8">${componentData.type}</text>
    </svg>`
  }
  
  // Старая type-based система цветов удалена
  // Теперь используется state-based система через ComponentState
  
  // === DRAG & DROP ===
  
  handleTouchStart(e) {
    e.preventDefault()
    const touch = e.touches[0]
    this.startInteraction(touch.clientX, touch.clientY, e.target)
  }
  
  handleMouseDown(e) {
    e.preventDefault()
    this.startInteraction(e.clientX, e.clientY, e.target)
  }
  
  startInteraction(x, y, target) {
    // Найти компонент под курсором
    const componentElement = target.closest('[data-component-id]')
    if (!componentElement) return
    
    const componentId = componentElement.getAttribute('data-component-id')
    const component = this.components.get(componentId)
    if (!component) return
    
    // Начать взаимодействие
    this.isDragging = true
    this.draggedComponent = component
    this.dragStartPosition = { x, y }
    this.touchStartTime = Date.now()
    
    // Мгновенное выделение
    this.setComponentSelected(componentElement, true)
    
    console.log(`GameEngine: Started dragging ${componentId}`)
  }
  
  handleTouchMove(e) {
    e.preventDefault()
    if (!this.isDragging || !this.draggedComponent) return
    
    const touch = e.touches[0]
    this.updateDrag(touch.clientX, touch.clientY)
  }
  
  handleMouseMove(e) {
    if (!this.isDragging || !this.draggedComponent) return
    
    this.updateDrag(e.clientX, e.clientY)
  }
  
  updateDrag(x, y) {
    if (!this.draggedComponent || !this.dragStartPosition) return
    
    // Прямое обновление позиции для 60fps
    const deltaX = x - this.dragStartPosition.x
    const deltaY = y - this.dragStartPosition.y
    
    // КРИТИЧЕСКИ ВАЖНО: Разделить rotate и translate для правильных координат
    const currentRotation = this.draggedComponent.rotation || 0
    this.draggedComponent.element.style.rotate = `${currentRotation}deg`
    this.draggedComponent.element.style.translate = `${deltaX}px ${deltaY}px`
  }
  
  handleTouchEnd(e) {
    e.preventDefault()
    if (!this.isDragging) return
    
    const touch = e.changedTouches[0]
    this.endInteraction(touch.clientX, touch.clientY)
  }
  
  handleMouseUp(e) {
    if (!this.isDragging) return
    
    this.endInteraction(e.clientX, e.clientY)
  }
  
  endInteraction(x, y) {
    if (!this.draggedComponent || !this.dragStartPosition) return
    
    const deltaX = x - this.dragStartPosition.x
    const deltaY = y - this.dragStartPosition.y
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY)
    const duration = Date.now() - this.touchStartTime
    
    // Определить тип взаимодействия
    const isTap = distance < 10 && duration < 200
    
    if (isTap) {
      // Поворот компонента
      this.rotateComponent(this.draggedComponent)
    } else {
      // Перемещение компонента
      this.moveComponent(this.draggedComponent, deltaX, deltaY)
    }
    
    // Очистка
    this.setComponentSelected(this.draggedComponent.element, false)
    // Убираем временную трансформацию drag'а - поворот сохранится через setComponentSelected
    
    this.isDragging = false
    this.draggedComponent = null
    this.dragStartPosition = null
  }
  
  rotateComponent(component) {
    component.rotation = (component.rotation + 90) % 360
    component.element.style.rotate = `${component.rotation}deg`
    
    // Уведомить React
    this.onComponentRotate(component.data.id, component.rotation)
    
    console.log(`GameEngine: Rotated ${component.data.id} to ${component.rotation}°`)
  }
  
  moveComponent(component, deltaX, deltaY) {
    // Вычислить новую позицию
    const newPosition = {
      x: component.position.x + deltaX,
      y: component.position.y + deltaY
    }
    
    // Snap to grid
    const snappedPosition = this.snapToGrid(newPosition)
    
    // Проверка коллизий
    if (this.isPositionOccupied(snappedPosition, component.data.id)) {
      console.log(`GameEngine: Position occupied, can't move ${component.data.id}`)
      return
    }
    
    // Применить новую позицию
    component.position = snappedPosition
    component.element.style.left = `${snappedPosition.x - 10}px`  // Синхронизация с createComponentElement
    component.element.style.top = `${snappedPosition.y - 20}px`   // Центр по вертикали
    
    // Уведомить React
    this.onComponentPlace(component.data.id, snappedPosition)
    
    console.log(`GameEngine: Moved ${component.data.id} to`, snappedPosition)
  }
  
  // === УТИЛИТЫ ===
  
  snapToGrid(position) {
    const GRID_SIZE = 40
    return {
      x: Math.round(position.x / GRID_SIZE) * GRID_SIZE,
      y: Math.round(position.y / GRID_SIZE) * GRID_SIZE
    }
  }
  
  isPositionOccupied(position, excludeComponentId) {
    for (const [id, component] of this.components) {
      if (id === excludeComponentId) continue
      
      const dx = Math.abs(component.position.x - position.x)
      const dy = Math.abs(component.position.y - position.y)
      
      if (dx < 20 && dy < 20) { // GRID_SIZE/2
        return true
      }
    }
    return false
  }
  
  setComponentSelected(element, selected) {
    // Получить текущий поворот компонента для сохранения трансформации
    const componentId = element.getAttribute('data-component-id')
    const component = this.components.get(componentId)
    const currentRotation = component?.rotation || 0
    
    if (selected) {
      // Обновить SVG с состоянием SELECTED (белый цвет)
      this.updateComponentState(componentId, 'selected')
      element.style.rotate = `${currentRotation}deg`
      element.style.scale = '1.1'
      element.style.zIndex = '1000'
    } else {
      // Вернуть к обычному состоянию
      this.updateComponentState(componentId, null) // Определится автоматически
      element.style.rotate = `${currentRotation}deg`
      element.style.scale = '1'
      element.style.translate = '0px 0px'
      element.style.zIndex = '10'
    }
  }
  
  // Маппинг типов компонентов для SVGConverter
  mapComponentType(type) {
    const { ComponentType } = window.SVGConverter || {}
    if (!ComponentType) return type
    
    const typeMap = {
      'resistor': ComponentType.RESISTOR,
      'capacitor': ComponentType.CAPACITOR,
      'inductor': ComponentType.INDUCTOR,
      'led': ComponentType.LED,
      'voltage_source': ComponentType.VOLTAGE_SOURCE,
      'switch': ComponentType.SWITCH,
      'supercapacitor': ComponentType.SUPERCAPACITOR,
      
      // Палитные типы
      'R_DIV_1': ComponentType.RESISTOR,
      'R_DIV_2': ComponentType.RESISTOR,
      'C_FILTER': ComponentType.CAPACITOR,
      'C_WRONG_1': ComponentType.CAPACITOR,
      'L_FILTER': ComponentType.INDUCTOR,
      'TARGET_LED_1': ComponentType.LED,
      'TARGET_LED_2': ComponentType.LED
    }
    
    return typeMap[type] || type
  }
  
  // Новый метод для обновления состояния компонента
  updateComponentState(componentId, forceState = null) {
    const component = this.components.get(componentId)
    if (!component) return
    
    // Определить состояние
    const isSource = component.data.type === 'voltage_source'
    const isTarget = component.data.type === 'led' && component.data.isPreinstalled
    const isConnected = component.data.isConnected || false
    
    let state = 'disconnected'
    if (forceState) {
      state = forceState
    } else if (isSource || isTarget) {
      // SOURCE и TARGETS всегда золотые
      state = 'source'
    } else if (isConnected) {
      state = 'connected'
    }
    
    // Получить ComponentState enum
    const { ComponentState } = window.SVGConverter || {}
    let componentState = state
    
    if (ComponentState) {
      switch(state) {
        case 'selected': componentState = ComponentState.SELECTED; break
        case 'connected': componentState = ComponentState.CONNECTED; break
        case 'source': componentState = ComponentState.SOURCE; break
        default: componentState = ComponentState.DISCONNECTED; break
      }
    }
    
    // Обновить SVG с новым состоянием
    const { getComponentSVGForGameEngine } = window.SVGConverter || {}
    if (getComponentSVGForGameEngine) {
      const componentType = this.mapComponentType(component.data.type)
      const newSVG = getComponentSVGForGameEngine(componentType, componentState, false)
      component.element.innerHTML = newSVG
      
      // Убедиться что SVG пропускает события
      const svg = component.element.querySelector('svg')
      if (svg) {
        svg.style.pointerEvents = 'none'
      }
    }
  }
  
  // === ПУБЛИЧНЫЙ API ===
  
  loadLevel(levelData) {
    this.clearComponents()
    
    // Загрузить предустановленные компоненты
    if (levelData.preinstalledComponents) {
      levelData.preinstalledComponents.forEach(comp => {
        this.addComponent(comp)
      })
    }
    
    console.log('GameEngine: Level loaded', levelData)
  }
  
  clearComponents() {
    for (const [id, component] of this.components) {
      this.canvas.removeChild(component.element)
    }
    this.components.clear()
  }
  
  destroy() {
    this.clearComponents()
    // Remove event listeners
    this.canvas.removeEventListener('touchstart', this.handleTouchStart)
    this.canvas.removeEventListener('touchmove', this.handleTouchMove) 
    this.canvas.removeEventListener('touchend', this.handleTouchEnd)
    this.canvas.removeEventListener('mousedown', this.handleMouseDown)
    this.canvas.removeEventListener('mousemove', this.handleMouseMove)
    this.canvas.removeEventListener('mouseup', this.handleMouseUp)
  }
}