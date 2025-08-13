/**
 * SVG Converter - Static SVG Strings for GameEngine
 * Contains exact copies of React magnetic components as static SVG strings
 * Maintains visual consistency while ensuring GameEngine compatibility
 */

import { ComponentType } from '../types/enums'

/**
 * Static SVG templates for magnetic components
 * These are exact copies of the React magnetic components
 * ViewBox: 0 0 100 40 for all components
 */
const MAGNETIC_SVG_TEMPLATES = {
  [ComponentType.RESISTOR]: `<svg width="100" height="40" viewBox="0 0 100 40">
    <g>
      <!-- Магнитные точки -->
      <circle cx="10" cy="20" r="6" fill="currentColor"/>
      <circle cx="90" cy="20" r="6" fill="currentColor"/>
      <!-- Соединительные линии -->
      <line x1="10" y1="20" x2="25" y2="20" stroke="currentColor" stroke-width="2"/>
      <line x1="73" y1="20" x2="90" y2="20" stroke="currentColor" stroke-width="2"/>
      <!-- Зигзаг резистора -->
      <path d="M25 20L29 11L37 29L45 11L53 29L61 11L69 29L73 20" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
    </g>
  </svg>`,
  
  [ComponentType.CAPACITOR]: `<svg width="100" height="40" viewBox="0 0 100 40">
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
  
  [ComponentType.INDUCTOR]: `<svg width="100" height="40" viewBox="0 0 100 40">
    <g>
      <!-- Магнитные точки -->
      <circle cx="10" cy="20" r="6" fill="currentColor"/>
      <circle cx="90" cy="20" r="6" fill="currentColor"/>
      <!-- Соединительные линии -->
      <line x1="10" y1="20" x2="22" y2="20" stroke="currentColor" stroke-width="2"/>
      <line x1="78" y1="20" x2="90" y2="20" stroke="currentColor" stroke-width="2"/>
      <!-- Индуктор - спирали -->
      <path d="M22 20Q26 10 30 20Q34 10 38 20Q42 10 46 20Q50 10 54 20Q58 10 62 20Q66 10 70 20Q74 10 78 20" stroke="currentColor" stroke-width="2" fill="none"/>
    </g>
  </svg>`,
  
  [ComponentType.LED]: `<svg width="100" height="40" viewBox="0 0 100 40">
    <g>
      <!-- Магнитные точки -->
      <circle cx="10" cy="20" r="6" fill="currentColor"/>
      <circle cx="90" cy="20" r="6" fill="currentColor"/>
      <!-- Соединительные линии -->
      <line x1="10" y1="20" x2="35" y2="20" stroke="currentColor" stroke-width="2"/>
      <line x1="65" y1="20" x2="90" y2="20" stroke="currentColor" stroke-width="2"/>
      <!-- LED диод - треугольник с линией -->
      <path d="M35 10 L35 30 L65 20 Z" stroke="currentColor" stroke-width="2" fill="none"/>
      <line x1="65" y1="10" x2="65" y2="30" stroke="currentColor" stroke-width="2"/>
      <!-- Стрелки излучения -->
      <path d="M45 8 L48 5 M46 5 L48 5 L48 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" fill="none"/>
      <path d="M52 12 L55 9 M53 9 L55 9 L55 11" stroke="currentColor" stroke-width="2" stroke-linecap="round" fill="none"/>
    </g>
  </svg>`,
  
  [ComponentType.VOLTAGE_SOURCE]: `<svg width="100" height="40" viewBox="0 0 100 40">
    <g>
      <!-- Магнитные точки -->
      <circle cx="10" cy="20" r="6" fill="currentColor"/>
      <circle cx="90" cy="20" r="6" fill="currentColor"/>
      <!-- Соединительные линии -->
      <line x1="10" y1="20" x2="35" y2="20" stroke="currentColor" stroke-width="2"/>
      <line x1="65" y1="20" x2="90" y2="20" stroke="currentColor" stroke-width="2"/>
      <!-- Источник напряжения - круг с + и - -->
      <circle cx="50" cy="20" r="15" stroke="currentColor" stroke-width="2" fill="none"/>
      <!-- Плюс (длинная вертикальная линия) -->
      <line x1="43" y1="12" x2="43" y2="28" stroke="currentColor" stroke-width="2"/>
      <line x1="39" y1="20" x2="47" y2="20" stroke="currentColor" stroke-width="2"/>
      <!-- Минус (короткая горизонтальная линия) -->
      <line x1="53" y1="20" x2="61" y2="20" stroke="currentColor" stroke-width="2"/>
    </g>
  </svg>`,
  
  [ComponentType.SWITCH]: `<svg width="100" height="40" viewBox="0 0 100 40">
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
      <!-- Переключатель (состояние зависит от switchState) -->
      <line x1="25" y1="20" x2="65" y2="12" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>
    </g>
  </svg>`,
  
  [ComponentType.SUPERCAPACITOR]: `<svg width="100" height="40" viewBox="0 0 100 40">
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
 * Get theme colors for GameEngine components
 * This integrates the Material UI theme with GameEngine rendering
 */
export function getThemeColor(
  componentType: ComponentType,
  isActive = false
): string {
  // These colors match the theme-ignit-electronic.ts palette
  const colors: Record<ComponentType, { main: string; active: string }> = {
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
 * Get static SVG string for GameEngine with color theming
 * Replaces currentColor with actual theme color
 */
function getStaticSVG(
  componentType: ComponentType,
  color: string,
  switchState?: boolean
): string {
  let svgTemplate = MAGNETIC_SVG_TEMPLATES[componentType]
  
  if (!svgTemplate) {
    console.warn(`Unknown component type: ${componentType}`)
    return getFallbackSVG(componentType)
  }
  
  // Handle switch state for switch components
  if (componentType === ComponentType.SWITCH) {
    if (switchState) {
      // Closed switch - direct line
      svgTemplate = svgTemplate.replace(
        '<line x1="25" y1="20" x2="65" y2="12"',
        '<line x1="25" y1="20" x2="75" y2="20"'
      )
    }
    // Open switch state is the default template
  }
  
  // Replace all instances of currentColor with actual theme color
  const coloredSVG = svgTemplate.replace(/currentColor/g, color)
  
  console.log(`✅ SVG Converter: Generated static SVG for ${componentType}`)
  return coloredSVG
}

/**
 * Fallback SVG for unknown or failed components
 */
function getFallbackSVG(componentType: ComponentType): string {
  return `<svg width="100" height="40" viewBox="0 0 100 40">
    <g>
      <circle cx="10" cy="20" r="6" fill="#FF0000"/>
      <circle cx="90" cy="20" r="6" fill="#FF0000"/>
      <rect x="30" y="10" width="40" height="20" stroke="#FF0000" stroke-width="2" fill="none" stroke-dasharray="4,4"/>
      <text x="50" y="20" text-anchor="middle" fill="#FF0000" font-size="10">ERROR</text>
      <text x="50" y="30" text-anchor="middle" fill="#FF0000" font-size="6">${componentType}</text>
    </g>
  </svg>`
}

/**
 * Utility function to get complete GameEngine-ready SVG
 * Uses direct React component rendering for true single source of truth
 */
export function getComponentSVGForGameEngine(
  componentType: ComponentType,
  isActive = false,
  switchState = false
): string {
  const color = getThemeColor(componentType, isActive)
  return getStaticSVG(componentType, color, switchState)
}