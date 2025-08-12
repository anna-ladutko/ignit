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
    const element = this.createComponentElement(componentData)
    this.canvas.appendChild(element)
    
    this.components.set(componentData.id, {
      element,
      data: componentData,
      position: { ...componentData.position },
      rotation: componentData.rotation || 0
    })
    
    console.log(`GameEngine: Added component ${componentData.id}`)
  }
  
  createComponentElement(componentData) {
    const element = document.createElement('div')
    element.className = 'game-component'
    element.setAttribute('data-component-id', componentData.id)
    element.setAttribute('data-component-type', componentData.type)
    
    // Позиционирование
    element.style.position = 'absolute'
    element.style.left = `${componentData.position.x - 20}px` // GRID_SIZE/2
    element.style.top = `${componentData.position.y - 20}px`
    element.style.width = '40px'
    element.style.height = '40px'
    element.style.cursor = 'pointer'
    element.style.zIndex = '10'
    
    // GPU оптимизации
    element.style.willChange = 'transform'
    element.style.backfaceVisibility = 'hidden'
    
    // Добавляем SVG символ компонента
    element.innerHTML = this.getComponentSVG(componentData)
    
    return element
  }
  
  getComponentSVG(componentData) {
    // Упрощенные SVG символы для максимальной производительности
    const color = this.getComponentColor(componentData.type)
    
    switch(componentData.type) {
      case 'resistor':
        return `<svg width="40" height="40" viewBox="0 0 40 40">
          <path d="M5 20L10 10L15 30L20 10L25 30L30 10L35 20" 
                stroke="${color}" stroke-width="3" fill="none" stroke-linecap="round"/>
        </svg>`
        
      case 'capacitor':
        return `<svg width="40" height="40" viewBox="0 0 40 40">
          <line x1="17" y1="8" x2="17" y2="32" stroke="${color}" stroke-width="3"/>
          <line x1="23" y1="8" x2="23" y2="32" stroke="${color}" stroke-width="3"/>
        </svg>`
        
      case 'led':
        return `<svg width="40" height="40" viewBox="0 0 40 40">
          <circle cx="20" cy="20" r="12" fill="none" stroke="${color}" stroke-width="3"/>
          <path d="M14 14L26 26M14 26L26 14" stroke="${color}" stroke-width="2"/>
        </svg>`
        
      case 'voltage_source':
        return `<svg width="40" height="40" viewBox="0 0 40 40">
          <circle cx="20" cy="20" r="15" fill="none" stroke="${color}" stroke-width="3"/>
          <text x="20" y="25" text-anchor="middle" fill="${color}" font-size="16">V</text>
        </svg>`
        
      default:
        return `<svg width="40" height="40" viewBox="0 0 40 40">
          <rect x="5" y="5" width="30" height="30" fill="none" stroke="${color}" stroke-width="2"/>
        </svg>`
    }
  }
  
  getComponentColor(type) {
    const colors = {
      resistor: '#FF6B35',
      capacitor: '#4ECDC4', 
      inductor: '#45B7D1',
      led: '#96CEB4',
      voltage_source: '#FFEAA7',
      switch: '#DDA0DD'
    }
    return colors[type] || '#FFFFFF'
  }
  
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
    
    this.draggedComponent.element.style.transform = 
      `translate3d(${deltaX}px, ${deltaY}px, 0)`
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
    this.draggedComponent.element.style.transform = ''
    
    this.isDragging = false
    this.draggedComponent = null
    this.dragStartPosition = null
  }
  
  rotateComponent(component) {
    component.rotation = (component.rotation + 90) % 360
    component.element.style.transform = `rotate(${component.rotation}deg)`
    
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
    component.element.style.left = `${snappedPosition.x - 20}px`
    component.element.style.top = `${snappedPosition.y - 20}px`
    
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
    if (selected) {
      element.style.filter = 'brightness(2) saturate(0)'
      element.style.transform = 'scale(1.1)'
      element.style.zIndex = '1000'
    } else {
      element.style.filter = ''
      element.style.transform = ''
      element.style.zIndex = '10'
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