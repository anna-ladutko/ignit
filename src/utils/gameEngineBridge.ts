/**
 * GameEngine Bridge - Makes TypeScript SVG utilities available to vanilla JS GameEngine
 * This is part of the Hybrid SVG Architecture approach
 */

import { getComponentSVGForGameEngine } from './svgConverter'
import { ComponentType } from '../types/enums'

/**
 * Initialize the bridge between React/TypeScript and vanilla JS GameEngine
 * Call this before initializing GameEngine to ensure SVG Converter is available
 */
export function initializeGameEngineBridge() {
  console.log('🚀 GameEngine Bridge: Initializing SVG Converter...')
  
  // Make SVG utilities available globally for GameEngine
  ;(window as any).SVGConverter = {
    getComponentSVGForGameEngine,
    ComponentType
  }
  
  // Verify bridge was set up correctly
  const testConverter = (window as any).SVGConverter
  console.log('🔍 GameEngine Bridge: Verification - getComponentSVGForGameEngine available:', !!testConverter?.getComponentSVGForGameEngine)
  console.log('🔍 GameEngine Bridge: Verification - ComponentType available:', !!testConverter?.ComponentType)
  console.log('🔍 GameEngine Bridge: ComponentType keys:', Object.keys(testConverter?.ComponentType || {}))
  
  console.log('✅ GameEngine Bridge: SVG Converter initialized and available globally')
}

/**
 * Clean up global bridge (call when unmounting game components)
 */
export function cleanupGameEngineBridge() {
  if ((window as any).SVGConverter) {
    delete (window as any).SVGConverter
    console.log('🧹 GameEngine Bridge: SVG Converter cleaned up')
  }
}