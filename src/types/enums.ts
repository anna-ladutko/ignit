export const ComponentType = {
  VOLTAGE_SOURCE: 'voltage_source',
  LED: 'led',
  RESISTOR: 'resistor',
  CAPACITOR: 'capacitor',
  INDUCTOR: 'inductor',
  SWITCH: 'switch',
  SUPERCAPACITOR: 'supercapacitor'
} as const

export type ComponentType = typeof ComponentType[keyof typeof ComponentType]

export const ArchetypeType = {
  STABILIZER: 'stabilizer',
  SPLITTER: 'splitter',
  TIMED_CHARGE: 'timed_charge',
  PROTECTOR: 'protector',
  LOGIC_GATE: 'logic_gate'
} as const

export type ArchetypeType = typeof ArchetypeType[keyof typeof ArchetypeType]

export const DifficultyLevel = {
  TUTORIAL: 1,
  BASIC: 2,
  ADVANCED: 3,
  HARD: 4,
  EXPERT: 5
} as const

export type DifficultyLevel = typeof DifficultyLevel[keyof typeof DifficultyLevel]

export const LEDColor = {
  RED: 'red',
  BLUE: 'blue',
  GREEN: 'green'
} as const

export type LEDColor = typeof LEDColor[keyof typeof LEDColor]

export const Terminal = {
  IN: 'in',
  OUT: 'out'
} as const

export type Terminal = typeof Terminal[keyof typeof Terminal]