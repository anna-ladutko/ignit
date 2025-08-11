import { ArchetypeType, ComponentType, DifficultyLevel, LEDColor, Terminal } from './enums'

export interface Position {
  x: number
  y: number
}

export interface LevelMetadata {
  level_id: string
  difficulty: DifficultyLevel
  primary_archetype: ArchetypeType
  secondary_archetype: ArchetypeType | null
  mutator: string | null
  generation_timestamp: string
  generator_version: string
}

export interface VoltageSource {
  id: string
  voltage: number
  energy_output: number
  is_stable: boolean
  position: [number, number]
}

export interface Target {
  id: string
  type: 'led'
  energy_range: [number, number]
  color: LEDColor
  position: [number, number]
}

export interface Component {
  id: string
  type: ComponentType
  nominal_value: number
  actual_value: number
  quantity: number
  is_red_herring: boolean
  position: [number, number]
  // Component-specific properties
  resistance?: number // for resistors
  capacitance?: number // for capacitors  
  inductance?: number // for inductors
  is_closed?: boolean // for switches
}

export interface BoardLayout {
  width: number
  height: number
  connection_points: Position[]
}

export interface CircuitDefinition {
  source: VoltageSource
  targets: Target[]
  available_components: Component[]
  board_layout: BoardLayout
}

export interface Connection {
  from: string
  to: string
  from_terminal: Terminal
  to_terminal: Terminal
}

export interface SimulationResult {
  targets_satisfied: Record<string, boolean>
  energy_distribution: Record<string, number>
  total_losses: number
}

export interface OptimalSolution {
  components_used: string[]
  connections: Connection[]
  expected_score: number
  simulation_result: SimulationResult
}

export interface ValidationResults {
  validation_performed: boolean
}

export interface SolutionData {
  optimal_solution: OptimalSolution
  validation_results: ValidationResults
}

export interface Level {
  metadata: LevelMetadata
  circuit_definition: CircuitDefinition
  solution_data: SolutionData
  registryOrder?: number  // Order number from level registry (1, 2, 3...)
}