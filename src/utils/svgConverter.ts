/**
 * SVG Converter - Hybrid Approach Utility
 * Converts React magnetic SVG components to inline SVG strings for GameEngine
 * Maintains single source of truth while optimizing for performance
 */

import { ComponentType } from '../types'

interface SVGMagneticSymbol {
  resistor: string
  capacitor: string
  inductor: string
  led: string
  voltage_source: string
  switch_open: string
  switch_closed: string
  supercapacitor: string
}

/**
 * Magnetic SVG symbols converted from React components to inline strings
 * These match exactly with the magnetic React components but optimized for GameEngine
 * ViewBox: 0 0 100 40 (consistent magnetic symbol dimensions)
 */
export const MAGNETIC_SVG_SYMBOLS: SVGMagneticSymbol = {
  resistor: `<svg width="100" height="40" viewBox="0 0 100 40">
    <g>
      <!-- Магнитные точки -->
      <circle cx="10" cy="20" r="6" fill="currentColor"/>
      <circle cx="90" cy="20" r="6" fill="currentColor"/>
      
      <!-- Соединительные линии -->
      <line x1="10" y1="20" x2="22" y2="20" stroke="currentColor" stroke-width="2"/>
      <line x1="78" y1="20" x2="90" y2="20" stroke="currentColor" stroke-width="2"/>
      
      <!-- Резистор - зигзаг -->
      <path d="M22,20 L26,12 L30,28 L34,12 L38,28 L42,12 L46,28 L50,12 L54,28 L58,12 L62,28 L66,12 L70,28 L74,12 L78,20" 
            stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round"/>
    </g>
  </svg>`,
  
  capacitor: `<svg width="100" height="40" viewBox="0 0 100 40">
    <g>
      <!-- Магнитные точки -->
      <circle cx="10" cy="20" r="6" fill="currentColor"/>
      <circle cx="90" cy="20" r="6" fill="currentColor"/>
      
      <!-- Соединительные линии -->
      <line x1="10" y1="20" x2="42" y2="20" stroke="currentColor" stroke-width="2"/>
      <line x1="58" y1="20" x2="90" y2="20" stroke="currentColor" stroke-width="2"/>
      
      <!-- Конденсатор - две параллельные пластины -->
      <line x1="42" y1="8" x2="42" y2="32" stroke="currentColor" stroke-width="3"/>
      <line x1="58" y1="8" x2="58" y2="32" stroke="currentColor" stroke-width="3"/>
    </g>
  </svg>`,
  
  inductor: `<svg width="100" height="40" viewBox="0 0 100 40">
    <g>
      <!-- Магнитные точки -->
      <circle cx="10" cy="20" r="6" fill="currentColor"/>
      <circle cx="90" cy="20" r="6" fill="currentColor"/>
      
      <!-- Соединительные линии -->
      <line x1="10" y1="20" x2="22" y2="20" stroke="currentColor" stroke-width="2"/>
      <line x1="78" y1="20" x2="90" y2="20" stroke="currentColor" stroke-width="2"/>
      
      <!-- Индуктор - спирали -->
      <path d="M22,20 Q26,12 30,20 Q34,12 38,20 Q42,12 46,20 Q50,12 54,20 Q58,12 62,20 Q66,12 70,20 Q74,12 78,20" 
            stroke="currentColor" stroke-width="2" fill="none"/>
    </g>
  </svg>`,
  
  led: `<svg width="100" height="40" viewBox="0 0 100 40">
    <g>
      <!-- Магнитные точки -->
      <circle cx="10" cy="20" r="6" fill="currentColor"/>
      <circle cx="90" cy="20" r="6" fill="currentColor"/>
      
      <!-- Соединительные линии -->
      <line x1="10" y1="20" x2="35" y2="20" stroke="currentColor" stroke-width="2"/>
      <line x1="65" y1="20" x2="90" y2="20" stroke="currentColor" stroke-width="2"/>
      
      <!-- LED - диод треугольник -->
      <path d="M35,20 L50,12 L50,28 Z" stroke="currentColor" stroke-width="2" fill="currentColor"/>
      <!-- Катод -->
      <line x1="50" y1="12" x2="50" y2="28" stroke="currentColor" stroke-width="3"/>
      <!-- Световые лучи -->
      <g stroke="currentColor" stroke-width="1.5">
        <line x1="55" y1="14" x2="62" y2="10"/>
        <line x1="60" y1="10" x2="62" y2="10"/>
        <line x1="62" y1="10" x2="62" y2="12"/>
        <line x1="58" y1="16" x2="65" y2="12"/>
        <line x1="63" y1="12" x2="65" y2="12"/>
        <line x1="65" y1="12" x2="65" y2="14"/>
      </g>
    </g>
  </svg>`,
  
  voltage_source: `<svg width="100" height="40" viewBox="0 0 100 40">
    <g>
      <!-- Магнитные точки -->
      <circle cx="10" cy="20" r="6" fill="currentColor"/>
      <circle cx="90" cy="20" r="6" fill="currentColor"/>
      
      <!-- Соединительные линии -->
      <line x1="10" y1="20" x2="30" y2="20" stroke="currentColor" stroke-width="2"/>
      <line x1="70" y1="20" x2="90" y2="20" stroke="currentColor" stroke-width="2"/>
      
      <!-- Источник напряжения - круг -->
      <circle cx="50" cy="20" r="20" stroke="currentColor" stroke-width="3" fill="none"/>
      
      <!-- Плюс и минус -->
      <text x="45" y="16" font-size="12" text-anchor="middle" fill="currentColor">+</text>
      <text x="55" y="28" font-size="12" text-anchor="middle" fill="currentColor">-</text>
    </g>
  </svg>`,
  
  switch_open: `<svg width="100" height="40" viewBox="0 0 100 40">
    <g>
      <!-- Магнитные точки -->
      <circle cx="10" cy="20" r="6" fill="currentColor"/>
      <circle cx="90" cy="20" r="6" fill="currentColor"/>
      
      <!-- Соединительные линии -->
      <line x1="10" y1="20" x2="25" y2="20" stroke="currentColor" stroke-width="2"/>
      <line x1="75" y1="20" x2="90" y2="20" stroke="currentColor" stroke-width="2"/>
      
      <!-- Контакты переключателя -->
      <circle cx="25" cy="20" r="2" fill="currentColor"/>
      <circle cx="75" cy="20" r="2" fill="currentColor"/>
      
      <!-- Переключатель (открытое состояние) -->
      <line x1="25" y1="20" x2="65" y2="12" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>
    </g>
  </svg>`,
  
  switch_closed: `<svg width="100" height="40" viewBox="0 0 100 40">
    <g>
      <!-- Магнитные точки -->
      <circle cx="10" cy="20" r="6" fill="currentColor"/>
      <circle cx="90" cy="20" r="6" fill="currentColor"/>
      
      <!-- Соединительные линии -->
      <line x1="10" y1="20" x2="25" y2="20" stroke="currentColor" stroke-width="2"/>
      <line x1="75" y1="20" x2="90" y2="20" stroke="currentColor" stroke-width="2"/>
      
      <!-- Контакты переключателя -->
      <circle cx="25" cy="20" r="2" fill="currentColor"/>
      <circle cx="75" cy="20" r="2" fill="currentColor"/>
      
      <!-- Переключатель (закрытое состояние) -->
      <line x1="25" y1="20" x2="75" y2="20" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>
    </g>
  </svg>`,
  
  supercapacitor: `<svg width="100" height="40" viewBox="0 0 100 40">
    <g>
      <!-- Магнитные точки -->
      <circle cx="10" cy="20" r="6" fill="currentColor"/>
      <circle cx="90" cy="20" r="6" fill="currentColor"/>
      
      <!-- Соединительные линии -->
      <line x1="10" y1="20" x2="30" y2="20" stroke="currentColor" stroke-width="2"/>
      <line x1="70" y1="20" x2="90" y2="20" stroke="currentColor" stroke-width="2"/>
      
      <!-- Суперконденсатор - левая пластина -->
      <line x1="30" y1="8" x2="30" y2="32" stroke="currentColor" stroke-width="3"/>
      <!-- Изогнутая пластина слева -->
      <path d="M35,8 Q40,20 35,32" stroke="currentColor" stroke-width="2" fill="none"/>
      <!-- Изогнутая пластина справа -->
      <path d="M65,8 Q60,20 65,32" stroke="currentColor" stroke-width="2" fill="none"/>
      <!-- Правая пластина -->
      <line x1="70" y1="8" x2="70" y2="32" stroke="currentColor" stroke-width="3"/>
      
      <!-- Индикаторы полярности -->
      <text x="25" y="12" font-size="8" text-anchor="middle" fill="currentColor">+</text>
      <text x="75" y="12" font-size="8" text-anchor="middle" fill="currentColor">-</text>
    </g>
  </svg>`
}

/**
 * Get SVG string for GameEngine inline use
 * Replaces currentColor with actual theme color for performance
 */
export function getGameEngineSVG(
  componentType: ComponentType[keyof ComponentType], 
  color: string, 
  switchState?: boolean
): string {
  let svgTemplate: string
  
  switch (componentType) {
    case ComponentType.RESISTOR:
      svgTemplate = MAGNETIC_SVG_SYMBOLS.resistor
      break
    case ComponentType.CAPACITOR:
      svgTemplate = MAGNETIC_SVG_SYMBOLS.capacitor
      break
    case ComponentType.INDUCTOR:
      svgTemplate = MAGNETIC_SVG_SYMBOLS.inductor
      break
    case ComponentType.LED:
      svgTemplate = MAGNETIC_SVG_SYMBOLS.led
      break
    case ComponentType.VOLTAGE_SOURCE:
      svgTemplate = MAGNETIC_SVG_SYMBOLS.voltage_source
      break
    case ComponentType.SWITCH:
      svgTemplate = switchState ? MAGNETIC_SVG_SYMBOLS.switch_closed : MAGNETIC_SVG_SYMBOLS.switch_open
      break
    case ComponentType.SUPERCAPACITOR:
      svgTemplate = MAGNETIC_SVG_SYMBOLS.supercapacitor
      break
    default:
      // Fallback generic component
      svgTemplate = `<svg width="100" height="40" viewBox="0 0 100 40">
        <g>
          <circle cx="10" cy="20" r="6" fill="currentColor"/>
          <circle cx="90" cy="20" r="6" fill="currentColor"/>
          <rect x="30" y="10" width="40" height="20" stroke="currentColor" stroke-width="2" fill="none"/>
        </g>
      </svg>`
  }
  
  // Replace all instances of currentColor with actual color
  return svgTemplate.replace(/currentColor/g, color)
}

/**
 * Get theme colors for GameEngine components
 * This integrates the Material UI theme with GameEngine rendering
 */
export function getThemeColor(
  componentType: ComponentType[keyof ComponentType],
  isActive = false
): string {
  // These colors match the theme-ignit-electronic.ts palette
  const colors = {
    [ComponentType.RESISTOR]: {
      main: '#FF6B35',
      active: '#FF8E53'
    },
    [ComponentType.CAPACITOR]: {
      main: '#4ECDC4',
      active: '#6ED4CC'
    },
    [ComponentType.INDUCTOR]: {
      main: '#45B7D1',
      active: '#67C3D6'
    },
    [ComponentType.LED]: {
      main: '#96CEB4',
      active: '#A8D4C0'
    },
    [ComponentType.VOLTAGE_SOURCE]: {
      main: '#FFEAA7',
      active: '#FFF0B8'
    },
    [ComponentType.SWITCH]: {
      main: '#DDA0DD',
      active: '#E5B4E5'
    },
    [ComponentType.SUPERCAPACITOR]: {
      main: '#4ECDC4',
      active: '#6ED4CC'
    }
  }
  
  const colorSet = colors[componentType]
  if (!colorSet) return '#FFFFFF'
  
  return isActive ? colorSet.active : colorSet.main
}

/**
 * Utility function to get complete GameEngine-ready SVG
 * Combines symbol generation with theme color integration
 */
export function getComponentSVGForGameEngine(
  componentType: ComponentType[keyof ComponentType],
  isActive = false,
  switchState = false
): string {
  const color = getThemeColor(componentType, isActive)
  return getGameEngineSVG(componentType, color, switchState)
}