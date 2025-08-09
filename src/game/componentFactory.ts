import { ComponentType } from '../types'
import type { Component, Target, VoltageSource } from '../types'
import {
  GameComponent,
  GameVoltageSource,
  GameLED,
  GameResistor,
  GameCapacitor,
  GameInductor,
  GameSwitch,
  GameSupercapacitor
} from './components'

export class ComponentFactory {
  static createFromVoltageSource(source: VoltageSource): GameVoltageSource {
    return new GameVoltageSource(
      source.id,
      source.voltage,
      source.energy_output,
      source.is_stable,
      { x: source.position[0], y: source.position[1] }
    )
  }

  static createFromTarget(target: Target): GameLED {
    return new GameLED(
      target.id,
      [target.energy_range[0], target.energy_range[1]],
      target.color,
      { x: target.position[0], y: target.position[1] }
    )
  }

  static createFromComponent(component: Component): GameComponent {
    const position = { x: component.position[0], y: component.position[1] }

    switch (component.type) {
      case ComponentType.RESISTOR:
        if (!component.resistance) {
          throw new Error(`Resistor ${component.id} missing resistance value`)
        }
        return new GameResistor(component.id, component.resistance, position)

      case ComponentType.CAPACITOR:
        if (!component.capacitance) {
          throw new Error(`Capacitor ${component.id} missing capacitance value`)
        }
        return new GameCapacitor(component.id, component.capacitance, position)

      case ComponentType.INDUCTOR:
        if (!component.inductance) {
          throw new Error(`Inductor ${component.id} missing inductance value`)
        }
        return new GameInductor(component.id, component.inductance, position)

      case ComponentType.SWITCH:
        return new GameSwitch(
          component.id,
          component.is_closed || false,
          position
        )

      case ComponentType.SUPERCAPACITOR:
        return new GameSupercapacitor(component.id, position)

      default:
        throw new Error(`Unsupported component type: ${component.type}`)
    }
  }

  static createSupercapacitor(): GameSupercapacitor {
    return new GameSupercapacitor()
  }
}

export function createGameComponentsFromLevel(
  source: VoltageSource,
  targets: Target[],
  availableComponents: Component[]
): {
  source: GameVoltageSource
  targets: GameLED[]
  availableComponents: GameComponent[]
  supercapacitor: GameSupercapacitor
} {
  return {
    source: ComponentFactory.createFromVoltageSource(source),
    targets: targets.map(target => ComponentFactory.createFromTarget(target)),
    availableComponents: availableComponents.map(comp => ComponentFactory.createFromComponent(comp)),
    supercapacitor: ComponentFactory.createSupercapacitor()
  }
}