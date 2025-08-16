/**
 * Sound Settings Utility
 * 
 * Утилиты для работы с настройками звука в приложении.
 * Использует localStorage для сохранения состояния.
 */

import { useState } from 'react'

const SOUND_SETTING_KEY = 'ignit-sound-enabled'

/**
 * Получить текущее состояние звуковых настроек
 */
export const getSoundEnabled = (): boolean => {
  try {
    const saved = localStorage.getItem(SOUND_SETTING_KEY)
    if (saved !== null) {
      return JSON.parse(saved)
    }
    // По умолчанию звук включен
    return true
  } catch (error) {
    console.warn('Error reading sound settings:', error)
    return true
  }
}

/**
 * Сохранить состояние звуковых настроек
 */
export const setSoundEnabled = (enabled: boolean): void => {
  try {
    localStorage.setItem(SOUND_SETTING_KEY, JSON.stringify(enabled))
  } catch (error) {
    console.warn('Error saving sound settings:', error)
  }
}

/**
 * Переключить состояние звуковых настроек
 */
export const toggleSoundEnabled = (): boolean => {
  const currentState = getSoundEnabled()
  const newState = !currentState
  setSoundEnabled(newState)
  return newState
}

/**
 * Хук для использования звуковых настроек в React компонентах
 */

export const useSoundSettings = () => {
  const [soundEnabled, setSoundEnabledState] = useState(getSoundEnabled())

  const updateSoundEnabled = (enabled: boolean) => {
    setSoundEnabled(enabled)
    setSoundEnabledState(enabled)
  }

  const toggleSound = () => {
    const newState = toggleSoundEnabled()
    setSoundEnabledState(newState)
    return newState
  }

  return {
    soundEnabled,
    setSoundEnabled: updateSoundEnabled,
    toggleSound,
  }
}

// Для использования без React (например, в vanilla JS частях)
export const SoundSettings = {
  get enabled() {
    return getSoundEnabled()
  },
  set enabled(value: boolean) {
    setSoundEnabled(value)
  },
  toggle() {
    return toggleSoundEnabled()
  },
}