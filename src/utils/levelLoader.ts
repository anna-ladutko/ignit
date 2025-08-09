import { ArchetypeType, ComponentType, DifficultyLevel, LEDColor } from '../types'
import type { Level } from '../types'

export class LevelLoadError extends Error {
  public field?: string
  
  constructor(message: string, field?: string) {
    super(message)
    this.name = 'LevelLoadError'
    this.field = field
  }
}

export function validateLevel(data: any): Level {
  if (!data || typeof data !== 'object') {
    throw new LevelLoadError('Invalid level data: must be an object')
  }

  // Validate metadata
  if (!data.metadata) {
    throw new LevelLoadError('Missing metadata section')
  }
  
  validateMetadata(data.metadata)

  // Validate circuit_definition
  if (!data.circuit_definition) {
    throw new LevelLoadError('Missing circuit_definition section')
  }
  
  validateCircuitDefinition(data.circuit_definition)

  // Validate solution_data
  if (!data.solution_data) {
    throw new LevelLoadError('Missing solution_data section')
  }
  
  validateSolutionData(data.solution_data)

  return data as Level
}

function validateMetadata(metadata: any): void {
  const required = ['level_id', 'difficulty', 'primary_archetype', 'generation_timestamp', 'generator_version']
  
  for (const field of required) {
    if (!metadata[field]) {
      throw new LevelLoadError(`Missing required metadata field: ${field}`, field)
    }
  }

  if (!Object.values(DifficultyLevel).includes(metadata.difficulty)) {
    throw new LevelLoadError(`Invalid difficulty level: ${metadata.difficulty}`, 'difficulty')
  }

  if (!Object.values(ArchetypeType).includes(metadata.primary_archetype)) {
    throw new LevelLoadError(`Invalid primary archetype: ${metadata.primary_archetype}`, 'primary_archetype')
  }

  if (metadata.secondary_archetype && !Object.values(ArchetypeType).includes(metadata.secondary_archetype)) {
    throw new LevelLoadError(`Invalid secondary archetype: ${metadata.secondary_archetype}`, 'secondary_archetype')
  }
}

function validateCircuitDefinition(circuit: any): void {
  // Validate source
  if (!circuit.source) {
    throw new LevelLoadError('Missing source in circuit_definition')
  }
  
  const source = circuit.source
  if (!source.id || typeof source.voltage !== 'number' || typeof source.energy_output !== 'number') {
    throw new LevelLoadError('Invalid source definition')
  }

  // Validate targets
  if (!Array.isArray(circuit.targets) || circuit.targets.length === 0) {
    throw new LevelLoadError('Missing or invalid targets array')
  }
  
  for (const target of circuit.targets) {
    if (!target.id || target.type !== ComponentType.LED || !Array.isArray(target.energy_range)) {
      throw new LevelLoadError(`Invalid target definition: ${target.id}`)
    }
    
    if (!Object.values(LEDColor).includes(target.color)) {
      throw new LevelLoadError(`Invalid LED color: ${target.color}`)
    }
  }

  // Validate available_components
  if (!Array.isArray(circuit.available_components)) {
    throw new LevelLoadError('Missing or invalid available_components array')
  }
  
  for (const component of circuit.available_components) {
    if (!component.id || !Object.values(ComponentType).includes(component.type)) {
      throw new LevelLoadError(`Invalid component definition: ${component.id}`)
    }
  }

  // Validate board_layout
  if (!circuit.board_layout) {
    throw new LevelLoadError('Missing board_layout')
  }
  
  const layout = circuit.board_layout
  if (typeof layout.width !== 'number' || typeof layout.height !== 'number' || !Array.isArray(layout.connection_points)) {
    throw new LevelLoadError('Invalid board_layout definition')
  }
}

function validateSolutionData(solution: any): void {
  if (!solution.optimal_solution) {
    throw new LevelLoadError('Missing optimal_solution')
  }
  
  const optimal = solution.optimal_solution
  if (!Array.isArray(optimal.components_used) || !Array.isArray(optimal.connections)) {
    throw new LevelLoadError('Invalid optimal_solution structure')
  }
  
  if (typeof optimal.expected_score !== 'number') {
    throw new LevelLoadError('Missing or invalid expected_score')
  }
}

export async function loadLevel(levelData: string | object): Promise<Level> {
  try {
    let data: any
    
    if (typeof levelData === 'string') {
      data = JSON.parse(levelData)
    } else {
      data = levelData
    }
    
    return validateLevel(data)
  } catch (error) {
    if (error instanceof LevelLoadError) {
      throw error
    }
    
    if (error instanceof SyntaxError) {
      throw new LevelLoadError(`Invalid JSON format: ${error.message}`)
    }
    
    throw new LevelLoadError(`Unknown error loading level: ${error}`)
  }
}

export async function loadLevelFromFile(file: File): Promise<Level> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    
    reader.onload = async (e) => {
      try {
        const content = e.target?.result as string
        const level = await loadLevel(content)
        resolve(level)
      } catch (error) {
        reject(error)
      }
    }
    
    reader.onerror = () => {
      reject(new LevelLoadError('Failed to read file'))
    }
    
    reader.readAsText(file)
  })
}