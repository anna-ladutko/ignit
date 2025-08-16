/**
 * Game Audio Utility
 * 
 * Утилиты для проигрывания звуков в игре с учетом настроек пользователя.
 */

import { getSoundEnabled } from './soundSettings'

/**
 * Проиграть звук с учетом настроек пользователя
 */
export const playSound = (audioUrl: string, volume: number = 0.5): void => {
  // Проверяем, включены ли звуки
  if (!getSoundEnabled()) {
    return
  }

  try {
    const audio = new Audio(audioUrl)
    audio.volume = Math.max(0, Math.min(1, volume)) // Ограничиваем громкость от 0 до 1
    audio.play().catch(error => {
      console.warn('Failed to play sound:', error)
    })
  } catch (error) {
    console.warn('Error creating audio:', error)
  }
}

/**
 * Предзагруженные звуки для игры
 */
export const GameSounds = {
  // UI звуки
  simulate: () => playSound('/sounds/ui-sound-off-270300.mp3', 0.4),
  buttonClick: () => playSound('/sounds/button-click.mp3', 0.3),
  buttonHover: () => playSound('/sounds/button-hover.mp3', 0.2),
  
  // Игровые звуки
  componentPlace: () => playSound('/sounds/component-place.mp3', 0.4),
  componentRemove: () => playSound('/sounds/component-remove.mp3', 0.3),
  circuitComplete: () => playSound('/sounds/circuit-complete.mp3', 0.6),
  levelComplete: () => playSound('/sounds/level-complete.mp3', 0.8),
  
  // Обратная связь
  success: () => playSound('/sounds/success.mp3', 0.5),
  error: () => playSound('/sounds/error.mp3', 0.4),
} as const

/**
 * Пример использования в компонентах:
 * 
 * import { GameSounds } from '../../utils/gameAudio'
 * 
 * const handleButtonClick = () => {
 *   GameSounds.buttonClick()
 *   // остальная логика...
 * }
 */