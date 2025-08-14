/**
 * Design System Constants
 * 
 * ВАЖНО: Эти константы созданы для обхода проблемы с theme values,
 * которые превращаются из 20px в 400px при использовании в некоторых контекстах.
 * 
 * См. BORDER_RADIUS_ISSUE.md для подробностей проблемы.
 */

// Border Radius константы (безопасные значения)
export const BORDER_RADIUS = {
  BUTTON: "10px",     // Для всех кнопок
  PANEL: "20px",      // Для панелей, модальных окон, карточек  
  SMALL: "5px",       // Для мелких элементов
  LARGE: "24px",      // Для больших контейнеров
} as const

// Вспомогательные утилиты
export const getBorderRadius = (type: keyof typeof BORDER_RADIUS) => BORDER_RADIUS[type]

// Типы для TypeScript
export type BorderRadiusType = keyof typeof BORDER_RADIUS