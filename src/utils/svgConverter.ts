/**
 * SVG Converter - Static SVG Strings for GameEngine
 * Contains exact copies of React magnetic components as static SVG strings
 * Maintains visual consistency while ensuring GameEngine compatibility
 */

import { ComponentType, ComponentState } from '../types/enums'
import { ComponentColors } from './componentColors'

/**
 * Static SVG templates for magnetic components
 * These are exact copies of the React magnetic components
 * ViewBox: 0 0 100 40 for all components
 */
const MAGNETIC_SVG_TEMPLATES = {
  [ComponentType.RESISTOR]: `<svg width="100" height="40" viewBox="0 0 100 40">
    <g>
      <!-- Обновленный дизайн резистора v03 -->
      <path d="M10 22C11.1046 22 12 21.1046 12 20C12 18.8954 11.1046 18 10 18C8.89543 18 8 18.8954 8 20C8 21.1046 8.89543 22 10 22Z" fill="currentColor"/>
      <path d="M90 22C91.1046 22 92 21.1046 92 20C92 18.8954 91.1046 18 90 18C88.8954 18 88 18.8954 88 20C88 21.1046 88.8954 22 90 22Z" fill="currentColor"/>
      <path d="M10 20H25" stroke="currentColor" stroke-width="2"/>
      <path d="M76 20H90.5" stroke="currentColor" stroke-width="2"/>
      <!-- Coal-colored inner fill for resistor rectangle -->
      <rect x="30" y="17" width="40" height="6" fill="#202221"/>
      <rect x="26" y="13" width="48" height="14" stroke="currentColor" stroke-width="4" stroke-linejoin="round" fill="none"/>
    </g>
  </svg>`,
  
  [ComponentType.CAPACITOR]: `<svg width="100" height="40" viewBox="0 0 100 40">
    <g>
      <!-- Обновленный дизайн конденсатора v03 -->
      <circle cx="10" cy="20" r="2" fill="currentColor"/>
      <circle cx="90" cy="20" r="2" fill="currentColor"/>
      <path d="M45 21C45.5523 21 46 20.5523 46 20C46 19.4477 45.5523 19 45 19V20V21ZM53 19C52.4477 19 52 19.4477 52 20C52 20.5523 52.4477 21 53 21V20V19ZM10.5 20V21H45V20V19H10.5V20ZM53 20V21H90V20V19H53V20Z" fill="currentColor"/>
      <!-- Coal-colored inner fill for capacitor plates -->
      <rect x="44" y="11" width="4" height="18.5" fill="#202221"/>
      <rect x="52" y="11" width="4" height="18.5" fill="#202221"/>
      <path d="M46 11V29.5" stroke="currentColor" stroke-width="4" stroke-linecap="round" fill="none"/>
      <path d="M54 11V29.5" stroke="currentColor" stroke-width="4" stroke-linecap="round" fill="none"/>
    </g>
  </svg>`,
  
  [ComponentType.INDUCTOR]: `<svg width="100" height="40" viewBox="0 0 100 40">
    <g>
      <!-- Обновленный дизайн индуктора v03 -->
      <circle cx="10" cy="20" r="2" fill="currentColor"/>
      <circle cx="90" cy="20" r="2" fill="currentColor"/>
      <path d="M24.2396 21C24.7919 21 25.2396 20.5523 25.2396 20C25.2396 19.4477 24.7919 19 24.2396 19L24.2396 20L24.2396 21ZM73.1981 19C72.6459 19 72.1981 19.4477 72.1981 20C72.1981 20.5523 72.6459 21 73.1981 21L73.1981 20L73.1981 19ZM10.5 20L10.5 21L24.2396 21L24.2396 20L24.2396 19L10.5 19L10.5 20ZM73.1981 20L73.1981 21L91 21L91 20L91 19L73.1981 19L73.1981 20Z" fill="currentColor"/>
      <path d="M38 21C38 16.5817 35.3137 13 32 13C28.6863 13 26 16.5817 26 21" stroke="currentColor" stroke-width="4" stroke-linecap="round" fill="none"/>
      <path d="M50 21C50 16.5817 47.3137 13 44 13C40.6863 13 38 16.5817 38 21" stroke="currentColor" stroke-width="4" stroke-linecap="round" fill="none"/>
      <path d="M62 21C62 16.5817 59.3137 13 56 13C52.6863 13 50 16.5817 50 21" stroke="currentColor" stroke-width="4" stroke-linecap="round" fill="none"/>
      <path d="M74 21C74 16.5817 71.3137 13 68 13C64.6863 13 62 16.5817 62 21" stroke="currentColor" stroke-width="4" stroke-linecap="round" fill="none"/>
    </g>
  </svg>`,
  
  [ComponentType.LED]: `<svg width="100" height="40" viewBox="0 0 100 40">
    <g>
      <!-- Обновленный дизайн LED v03 -->
      <circle cx="10" cy="20" r="2" fill="currentColor"/>
      <circle cx="90" cy="20" r="2" fill="currentColor"/>
      <path d="M38.5 21C39.0523 21 39.5 20.5523 39.5 20C39.5 19.4477 39.0523 19 38.5 19V20V21ZM59 19C58.4477 19 58 19.4477 58 20C58 20.5523 58.4477 21 59 21V20V19ZM10 20V21H38.5V20V19H10V20ZM59 20V21H90V20V19H59V20Z" fill="currentColor"/>
      <!-- Coal-colored inner fill for LED triangle -->
      <path d="M40 11L60 20L40 30Z" fill="#202221"/>
      <path d="M40 11V29.5" stroke="currentColor" stroke-width="4" stroke-linecap="round" fill="none"/>
      <path d="M40 11L60 20L40 30" stroke="currentColor" stroke-width="4" stroke-linecap="round" fill="none"/>
      <path d="M60 11V29.5" stroke="currentColor" stroke-width="4" stroke-linecap="round" fill="none"/>
      <path d="M45.825 9.53009L48.3607 4.09225M48.3607 4.09225L45.2802 5.96593M48.3607 4.09225L48.9055 7.65641" stroke="currentColor" stroke-width="2" stroke-linecap="round" fill="none"/>
      <path d="M52.1692 12.4884L54.7049 7.05056M54.7049 7.05056L51.6245 8.92425M54.7049 7.05056L55.2497 10.6147" stroke="currentColor" stroke-width="2" stroke-linecap="round" fill="none"/>
    </g>
  </svg>`,
  
  [ComponentType.VOLTAGE_SOURCE]: `<svg width="100" height="40" viewBox="0 0 100 40">
    <g>
      <!-- Обновленный дизайн источника напряжения v03 -->
      <circle cx="10" cy="20" r="2" fill="currentColor"/>
      <circle cx="90" cy="20" r="2" fill="currentColor"/>
      <!-- Coal-colored inner fill for voltage source circle - before icons -->
      <circle cx="50" cy="20" r="15" fill="#202221"/>
      <path d="M9 20H34.5M64 20H89M58 17V23M42.5 17V23M39.5 20H45.5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
      <circle cx="50" cy="20" r="15" stroke="currentColor" stroke-width="4" fill="none"/>
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
 * Get component color based on state
 * New unified color system - all components use the same colors based on their state
 */
export function getComponentStateColor(
  componentState: ComponentState
): string {
  return ComponentColors[componentState]
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
  componentState: ComponentState = ComponentState.DISCONNECTED,
  switchState = false
): string {
  const color = getComponentStateColor(componentState)
  return getStaticSVG(componentType, color, switchState)
}