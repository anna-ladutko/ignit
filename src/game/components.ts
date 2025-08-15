import { ComponentType, LEDColor } from '../types'
import type { Position } from '../types'

export abstract class GameComponent {
  public id: string
  public type: ComponentType
  public position: Position
  public rotation: number = 0 // Поворот компонента в градусах (0, 90, 180, 270)
  public isConnected: boolean = false
  public connections: string[] = []

  constructor(id: string, type: ComponentType, position: Position = { x: 0, y: 0 }, rotation: number = 0) {
    this.id = id
    this.type = type
    this.position = position
    this.rotation = rotation
  }

  abstract clone(): GameComponent
  
  connect(componentId: string): void {
    if (!this.connections.includes(componentId)) {
      this.connections.push(componentId)
    }
  }

  disconnect(componentId: string): void {
    this.connections = this.connections.filter(id => id !== componentId)
  }

  setPosition(position: Position): void {
    this.position = position
  }

  setRotation(rotation: number): void {
    this.rotation = rotation
  }
}

export class GameVoltageSource extends GameComponent {
  public voltage: number
  public energyOutput: number
  public isStable: boolean

  constructor(
    id: string,
    voltage: number,
    energyOutput: number,
    isStable: boolean,
    position: Position = { x: 0, y: 0 },
    rotation: number = 0
  ) {
    super(id, ComponentType.VOLTAGE_SOURCE, position, rotation)
    this.voltage = voltage
    this.energyOutput = energyOutput
    this.isStable = isStable
  }

  clone(): GameVoltageSource {
    return new GameVoltageSource(this.id, this.voltage, this.energyOutput, this.isStable, { ...this.position }, this.rotation)
  }

  getAvailableEnergy(): number {
    return this.energyOutput
  }
}

export class GameLED extends GameComponent {
  public energyRange: [number, number]
  public color: LEDColor
  public currentEnergy: number = 0

  constructor(
    id: string,
    energyRange: [number, number],
    color: LEDColor,
    position: Position = { x: 0, y: 0 },
    rotation: number = 0
  ) {
    super(id, ComponentType.LED, position, rotation)
    this.energyRange = energyRange
    this.color = color
  }

  clone(): GameLED {
    return new GameLED(this.id, [...this.energyRange], this.color, { ...this.position }, this.rotation)
  }

  isEnergyInRange(energy: number): boolean {
    return energy >= this.energyRange[0] && energy <= this.energyRange[1]
  }

  setEnergy(energy: number): void {
    this.currentEnergy = energy
  }

  getTargetEnergy(): number {
    return (this.energyRange[0] + this.energyRange[1]) / 2
  }

  isLit(): boolean {
    return this.isEnergyInRange(this.currentEnergy)
  }
}

export class GameResistor extends GameComponent {
  public resistance: number
  public nominalValue: number
  public actualValue: number

  constructor(
    id: string,
    resistance: number,
    position: Position = { x: 0, y: 0 },
    rotation: number = 0
  ) {
    super(id, ComponentType.RESISTOR, position, rotation)
    this.resistance = resistance
    this.nominalValue = resistance
    this.actualValue = resistance
  }

  clone(): GameResistor {
    return new GameResistor(this.id, this.resistance, { ...this.position }, this.rotation)
  }

  calculateVoltageDrop(current: number): number {
    return current * this.actualValue
  }

  calculateEnergyLoss(current: number): number {
    return Math.pow(current, 2) * this.actualValue
  }
}

export class GameCapacitor extends GameComponent {
  public capacitance: number
  public nominalValue: number
  public actualValue: number
  public storedEnergy: number = 0

  constructor(
    id: string,
    capacitance: number,
    position: Position = { x: 0, y: 0 },
    rotation: number = 0
  ) {
    super(id, ComponentType.CAPACITOR, position, rotation)
    this.capacitance = capacitance
    this.nominalValue = capacitance
    this.actualValue = capacitance
  }

  clone(): GameCapacitor {
    return new GameCapacitor(this.id, this.capacitance, { ...this.position }, this.rotation)
  }

  charge(energy: number): void {
    this.storedEnergy += energy
  }

  discharge(): number {
    const energy = this.storedEnergy
    this.storedEnergy = 0
    return energy
  }

  getReactance(frequency: number): number {
    return 1 / (2 * Math.PI * frequency * this.actualValue)
  }
}

export class GameInductor extends GameComponent {
  public inductance: number
  public nominalValue: number
  public actualValue: number
  public storedEnergy: number = 0

  constructor(
    id: string,
    inductance: number,
    position: Position = { x: 0, y: 0 }
  ) {
    super(id, ComponentType.INDUCTOR, position)
    this.inductance = inductance
    this.nominalValue = inductance
    this.actualValue = inductance
  }

  clone(): GameInductor {
    return new GameInductor(this.id, this.inductance, { ...this.position })
  }

  getReactance(frequency: number): number {
    return 2 * Math.PI * frequency * this.actualValue
  }
}

export class GameSwitch extends GameComponent {
  public isClosed: boolean

  constructor(
    id: string,
    isClosed: boolean = false,
    position: Position = { x: 0, y: 0 }
  ) {
    super(id, ComponentType.SWITCH, position)
    this.isClosed = isClosed
  }

  clone(): GameSwitch {
    return new GameSwitch(this.id, this.isClosed, { ...this.position })
  }

  toggle(): void {
    this.isClosed = !this.isClosed
  }

  close(): void {
    this.isClosed = true
  }

  open(): void {
    this.isClosed = false
  }

  conducts(): boolean {
    return this.isClosed
  }
}

export class GameSupercapacitor extends GameComponent {
  public storedEnergy: number = 0

  constructor(id: string = 'SUPER', position: Position = { x: 0, y: 0 }, rotation: number = 0) {
    super(id, ComponentType.SUPERCAPACITOR, position, rotation)
  }

  clone(): GameSupercapacitor {
    return new GameSupercapacitor(this.id, { ...this.position }, this.rotation)
  }

  store(energy: number): void {
    this.storedEnergy += energy
  }

  getScore(): number {
    return this.storedEnergy
  }

  reset(): void {
    this.storedEnergy = 0
  }
}