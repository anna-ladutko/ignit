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

// === COORDINATE SYSTEM CONSTANTS ===
export const GRID_SIZE = 40 // Optimal for magnetic connections (100px SVG = 2.5 cells)
export const GRID_COLS = 40 // Fixed grid columns for infinite canvas
export const GRID_ROWS = 40 // Fixed grid rows for infinite canvas
export const STANDARD_CANVAS_SIZE = { width: GRID_COLS * GRID_SIZE, height: GRID_ROWS * GRID_SIZE } // 1600x1600
export const CANVAS_PADDING = 20
export const COMPONENT_SIZE = 36 // Actual component size within grid cell
export const MIN_TOUCH_AREA = 300 // Minimum canvas height for touch interaction

// === SIMPLIFIED COORDINATE FUNCTIONS ===
// Convert pixel position to grid position (aligned with screen corner)
export const pixelToGrid = (pixelPos: Position): GridPosition => {
  return {
    row: Math.round((pixelPos.y - GRID_SIZE / 2) / GRID_SIZE),
    col: Math.round((pixelPos.x - GRID_SIZE / 2) / GRID_SIZE)
  }
}

// Convert grid position to pixel position (aligned with screen corner)
export const gridToPixel = (gridPos: GridPosition): Position => {
  return {
    x: gridPos.col * GRID_SIZE + GRID_SIZE / 2,
    y: gridPos.row * GRID_SIZE + GRID_SIZE / 2
  }
}

// Check if position is valid for component placement (simplified)
export const isValidGridPosition = (gridPos: GridPosition): boolean => {
  return (
    gridPos.col >= 0 &&
    gridPos.row >= 0 &&
    gridPos.col < GRID_COLS &&
    gridPos.row < GRID_ROWS
  )
}

// Snap pixel position to nearest grid point (returns pixel coordinates)
export const snapToGrid = (pixelPos: Position): Position => {
  const gridPos = pixelToGrid(pixelPos)
  return gridToPixel(gridPos)
}