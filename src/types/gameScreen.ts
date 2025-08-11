import type { ComponentType, Terminal } from './enums'
import type { Level } from './level'

export interface Position {
  x: number
  y: number
}

export interface PlacedComponent {
  id: string
  type: ComponentType[keyof ComponentType]
  position: Position
  rotation: number // 0, 90, 180, 270 degrees
  properties: ComponentProperties
  originalComponentId?: string // Reference to level's available component
  isPreinstalled?: boolean // True for sources and targets that come with the level
}

export interface ComponentProperties {
  resistance?: number
  capacitance?: number
  inductance?: number
  voltage?: number
  energyOutput?: number
  energyRange?: [number, number]
  isSource?: boolean
  isTarget?: boolean
  isClosed?: boolean // for switches
}

export interface WireConnection {
  id: string
  fromComponent: string
  toComponent: string
  fromTerminal: Terminal[keyof Terminal]
  toTerminal: Terminal[keyof Terminal]
  energyFlow?: number
  isValid?: boolean
}

export interface GameScreenState {
  level: Level | null
  placedComponents: PlacedComponent[]
  connections: WireConnection[]
  selectedComponent: string | null
  selectedWire: string | null
  isSimulating: boolean
  score: number
  energyUsed: number
  gameStatus: 'loading' | 'playing' | 'complete' | 'failed'
  draggedComponent: {
    type: ComponentType[keyof ComponentType]
    sourceId?: string
    componentId?: string // Add componentId to track specific component
  } | null
  isDrawingWire: boolean
  wireStartPoint: {
    componentId: string
    terminal: Terminal[keyof Terminal]
    position: Position
  } | null
}

export interface GridPosition {
  row: number
  col: number
}

export const GRID_SIZE = 44 // Mobile touch target size
export const CANVAS_PADDING = 20
export const COMPONENT_SIZE = 36 // Actual component size within grid cell

// Convert pixel position to grid position
export const pixelToGrid = (pixelPos: Position): GridPosition => ({
  row: Math.round(pixelPos.y / GRID_SIZE),
  col: Math.round(pixelPos.x / GRID_SIZE)
})

// Convert grid position to pixel position (center of cell)
export const gridToPixel = (gridPos: GridPosition): Position => ({
  x: gridPos.col * GRID_SIZE + GRID_SIZE / 2,
  y: gridPos.row * GRID_SIZE + GRID_SIZE / 2
})

// Check if position is valid for component placement
export const isValidGridPosition = (
  gridPos: GridPosition,
  canvasSize: { width: number; height: number }
): boolean => {
  const maxCols = Math.floor(canvasSize.width / GRID_SIZE)
  const maxRows = Math.floor(canvasSize.height / GRID_SIZE)
  
  return (
    gridPos.col >= 0 &&
    gridPos.row >= 0 &&
    gridPos.col < maxCols &&
    gridPos.row < maxRows
  )
}