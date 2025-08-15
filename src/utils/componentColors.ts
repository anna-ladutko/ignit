import { ComponentState } from '../types'

/**
 * State-based цветовая палитра для компонентов
 * Унифицированная система где цвет зависит от состояния, а не от типа компонента
 */

export const ComponentColors = {
  [ComponentState.DISCONNECTED]: '#D84205', // 🔴 Красный - компонент не подключен к цепи
  [ComponentState.SELECTED]: '#FFFFFF',     // ⚪ Белый - пользователь взаимодействует с компонентом  
  [ComponentState.CONNECTED]: '#FFBE4D',    // 🟡 Золотой - компонент подключен к работающей цепи
  [ComponentState.SOURCE]: '#FFBE4D'        // 🟡 Золотой - источник энергии (всегда активен)
} as const

/**
 * Получить цвет компонента по его состоянию
 */
export function getComponentStateColor(state: ComponentState): string {
  return ComponentColors[state]
}

/**
 * Определить состояние компонента по результатам симуляции
 */
export function determineComponentState(
  componentId: string,
  isSource: boolean,
  isSelected: boolean,
  isConnectedToCircuit: boolean
): ComponentState {
  if (isSelected) {
    return ComponentState.SELECTED
  }
  
  if (isSource) {
    return ComponentState.SOURCE
  }
  
  if (isConnectedToCircuit) {
    return ComponentState.CONNECTED
  }
  
  return ComponentState.DISCONNECTED
}

/**
 * Проверить, светится ли LED (используется золотой цвет)
 */
export function isLEDActive(componentState: ComponentState): boolean {
  return componentState === ComponentState.CONNECTED || componentState === ComponentState.SOURCE
}