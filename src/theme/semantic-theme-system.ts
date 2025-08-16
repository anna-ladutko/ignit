/**
 * SEMANTIC THEME SYSTEM
 * 
 * Правильная архитектура тем с семантическими токенами
 * 3 уровня абстракции: Primitive → Semantic → Component
 */

import { createTheme } from "@mui/material/styles";
import type { Theme } from "@mui/material/styles";

// ============================================================================
// 1. PRIMITIVE TOKENS (Сырые цвета каждой темы)
// ============================================================================

export interface PrimitiveTokens {
  // 7 базовых цветов темы
  primary: string;        // основной акцентный цвет
  secondary: string;      // вторичный акцентный цвет  
  surface: string;        // цвет поверхностей
  background: string;     // основной фон
  
  // Текстовые цвета
  textPrimary: string;    // основной текст
  textSecondary: string;  // вторичный текст
  textDisabled: string;   // неактивный текст
  
  // Кастомные градиенты
  gradients: {
    primary: string;      // основной градиент
    secondary: string;    // вторичный градиент  
    background: string;   // фоновый градиент
  };
  
  // Типографическая система темы
  typography: {
    fontFamily: string;   // основной шрифт темы
    title: {
      fontSize: string;
      fontWeight: number;
      lineHeight: number;
      letterSpacing?: string;
    };
    button: {
      fontSize: string;
      fontWeight: number;
      lineHeight: number;
      letterSpacing?: string;
    };
    body: {
      fontSize: string;
      fontWeight: number;
      lineHeight: number;
      letterSpacing?: string;
    };
    small: {
      fontSize: string;
      fontWeight: number;
      lineHeight: number;
      letterSpacing?: string;
    };
  };
}

// Все темы проекта
export const primitiveTokens: Record<string, PrimitiveTokens> = {
  // Текущая тема (example) - упрощенная версия current theme
  example: {
    primary: '#F4490C',
    secondary: '#0088FF', 
    surface: 'rgba(217, 217, 217, 0.2)',
    background: '#202221',
    
    textPrimary: '#E5DFD1',
    textSecondary: '#818181',
    textDisabled: '#666666',
    
    gradients: {
      primary: 'linear-gradient(135deg, #F4490C 0%, #0088FF 100%)',
      secondary: 'linear-gradient(135deg, #202221 0%, #F4490C 100%)',
      background: 'linear-gradient(135deg, #202221 0%, rgba(217, 217, 217, 0.2) 100%)',
    },
    
    typography: {
      fontFamily: '"Montserrat", "Arial", sans-serif',
      title: {
        fontSize: '32px',
        fontWeight: 700,
        lineHeight: 1.2,
        letterSpacing: '0.02em',
      },
      button: {
        fontSize: '16px',
        fontWeight: 600,
        lineHeight: 1.2,
        letterSpacing: '0.01em',
      },
      body: {
        fontSize: '14px',
        fontWeight: 400,
        lineHeight: 1.4,
      },
      small: {
        fontSize: '12px',
        fontWeight: 400,
        lineHeight: 1.2,
      },
    },
  },
  
  // Новая тема Ignit Fire - твоя огненная палитра
  ignitFire: {
    primary: '#D84205',    // Ignit smolder
    secondary: '#FF8000',  // Ignit fire
    surface: '#343635',    // Ignit ash
    background: '#202221', // Ignit coal
    
    textPrimary: '#E5DFD1',  // Creamy white
    textSecondary: '#818181', // приглушенный
    textDisabled: '#343635',  // Ignit ash
    
    gradients: {
      primary: 'linear-gradient(135deg, #D84205 0%, #FF8000 100%)',      // smolder → fire
      secondary: 'linear-gradient(135deg, #202221 0%, #D84205 100%)',    // coal → smolder
      background: 'linear-gradient(135deg, #202221 0%, #343635 100%)',   // coal → ash
    },
    
    typography: {
      fontFamily: '"Montserrat", "Arial", sans-serif',
      title: {
        fontSize: '36px',     // Ignit titles - Montserrat 36 bold
        fontWeight: 700,
        lineHeight: 1.1,
        letterSpacing: '0.02em',
      },
      button: {
        fontSize: '18px',     // Ignit buttons - Montserrat 18 bold
        fontWeight: 700,
        lineHeight: 1.2,
        letterSpacing: '0.01em',
      },
      body: {
        fontSize: '16px',     // Ignit text basic - Montserrat 16 Medium
        fontWeight: 500,
        lineHeight: 1.4,
      },
      small: {
        fontSize: '12px',     // Ignit text small - Montserrat 12 Medium
        fontWeight: 500,
        lineHeight: 1.2,
      },
    },
  }
};

// ============================================================================
// 2. SEMANTIC TOKENS (Семантические роли в интерфейсе)
// ============================================================================

export interface SemanticTokens {
  // Поверхности игры
  surfaces: {
    gameBoard: string;      // игровое поле
    componentPalette: string; // палитра компонентов
    uiPanel: string;        // UI панели
    modal: string;          // модальные окна
    tooltip: string;        // всплывающие подсказки
  };
  
  // Интерактивные элементы
  interactive: {
    primary: string;        // основные кнопки/действия
    secondary: string;      // вторичные кнопки
    accent: string;         // акцентные элементы
    selection: string;      // выделение компонентов
    hover: string;          // состояние hover
    active: string;         // активное состояние
    disabled: string;       // неактивные элементы
  };
  
  // Текст и контент
  content: {
    primary: string;        // основной текст
    secondary: string;      // вторичный текст
    accent: string;         // акцентный текст
    disabled: string;       // неактивный текст
    inverse: string;        // инвертированный текст
  };
  
  // Обратная связь и состояния
  feedback: {
    success: string;        // успешные действия
    successBackground: string;
    warning: string;        // предупреждения  
    warningBackground: string;
    error: string;          // ошибки
    errorBackground: string;
    info: string;           // информация
    infoBackground: string;
  };
  
  // Игровые элементы
  game: {
    energyFlow: string;     // анимация потока энергии
    energyFlowGlow: string; // свечение энергии
    componentSelection: string; // выделение компонентов на поле
    gridLines: string;      // линии сетки
    gridBackground: string; // фон сетки
  };
  
  // Градиенты
  gradients: {
    primary: string;        // основной градиент
    secondary: string;      // вторичный градиент
    accent: string;         // акцентный градиент
    background: string;     // фоновый градиент
  };
  
  // Семантическая типографика
  typography: {
    fontFamily: string;     // основной шрифт
    headings: {             // заголовки (title из primitive)
      fontSize: string;
      fontWeight: number;
      lineHeight: number;
      letterSpacing?: string;
    };
    buttons: {              // кнопки (button из primitive)
      fontSize: string;
      fontWeight: number;
      lineHeight: number;
      letterSpacing?: string;
    };
    body: {                 // основной текст (body из primitive)
      fontSize: string;
      fontWeight: number;
      lineHeight: number;
      letterSpacing?: string;
    };
    captions: {             // мелкий текст (small из primitive)
      fontSize: string;
      fontWeight: number;
      lineHeight: number;
      letterSpacing?: string;
    };
  };
}

// Функция для создания семантических токенов из примитивов
export function createSemanticTokens(primitives: PrimitiveTokens): SemanticTokens {
  return {
    surfaces: {
      gameBoard: primitives.background,
      componentPalette: primitives.surface,
      uiPanel: primitives.surface,
      modal: primitives.surface,
      tooltip: primitives.surface,
    },
    
    interactive: {
      primary: primitives.primary,
      secondary: primitives.secondary,
      accent: primitives.primary,
      selection: primitives.secondary,           // используем secondary для выделения
      hover: `${primitives.primary}80`,          // primary с прозрачностью для hover
      active: primitives.primary,
      disabled: primitives.textDisabled,
    },
    
    content: {
      primary: primitives.textPrimary,
      secondary: primitives.textSecondary,
      accent: primitives.primary,
      disabled: primitives.textDisabled,
      inverse: primitives.background,
    },
    
    feedback: {
      success: primitives.secondary,             // fire для успеха
      successBackground: `${primitives.secondary}20`,
      warning: primitives.primary,               // smolder для предупреждения  
      warningBackground: `${primitives.primary}20`,
      error: primitives.primary,                 // smolder для ошибки
      errorBackground: `${primitives.primary}20`,
      info: primitives.secondary,                // fire для информации
      infoBackground: `${primitives.secondary}20`,
    },
    
    game: {
      energyFlow: primitives.secondary,          // fire для потока энергии
      energyFlowGlow: `${primitives.secondary}40`,
      componentSelection: primitives.primary,    // smolder для выделения компонентов
      gridLines: `${primitives.textSecondary}30`,
      gridBackground: 'transparent',
    },
    
    gradients: {
      primary: primitives.gradients.primary,     // используем кастомные градиенты
      secondary: primitives.gradients.secondary,
      accent: primitives.gradients.primary,      // accent = primary gradient
      background: primitives.gradients.background,
    },
    
    typography: {
      fontFamily: primitives.typography.fontFamily,
      headings: {
        fontSize: primitives.typography.title.fontSize,
        fontWeight: primitives.typography.title.fontWeight,
        lineHeight: primitives.typography.title.lineHeight,
        letterSpacing: primitives.typography.title.letterSpacing,
      },
      buttons: {
        fontSize: primitives.typography.button.fontSize,
        fontWeight: primitives.typography.button.fontWeight,
        lineHeight: primitives.typography.button.lineHeight,
        letterSpacing: primitives.typography.button.letterSpacing,
      },
      body: {
        fontSize: primitives.typography.body.fontSize,
        fontWeight: primitives.typography.body.fontWeight,
        lineHeight: primitives.typography.body.lineHeight,
        letterSpacing: primitives.typography.body.letterSpacing,
      },
      captions: {
        fontSize: primitives.typography.small.fontSize,
        fontWeight: primitives.typography.small.fontWeight,
        lineHeight: primitives.typography.small.lineHeight,
        letterSpacing: primitives.typography.small.letterSpacing,
      },
    },
  };
}

// ============================================================================
// 3. COMPONENT TOKENS (Конкретное применение в компонентах)
// ============================================================================

export interface ComponentTokens {
  button: {
    primary: {
      background: string;
      text: string;
      border: string;
      hover: {
        background: string;
        text: string;
      };
    };
    secondary: {
      background: string;
      text: string;
      border: string;
      hover: {
        background: string;
        text: string;
      };
    };
  };
  
  gameBoard: {
    background: string;
    gridLines: string;
    selection: string;
    hover: string;
  };
  
  componentPalette: {
    background: string;
    itemBackground: string;
    itemHover: string;
    itemSelected: string;
    itemText: string;
  };
  
  electronics: {
    resistor: string;
    capacitor: string;
    inductor: string;
    led: string;
    source: string;
    switch: string;
    ground: string;
  };
}

// Функция для создания компонентных токенов из семантических
export function createComponentTokens(semantic: SemanticTokens): ComponentTokens {
  return {
    button: {
      primary: {
        background: semantic.interactive.primary,
        text: semantic.content.inverse,
        border: semantic.interactive.primary,
        hover: {
          background: semantic.interactive.hover,
          text: semantic.content.inverse,
        },
      },
      secondary: {
        background: 'transparent',
        text: semantic.interactive.primary,
        border: semantic.interactive.primary,
        hover: {
          background: semantic.interactive.primary + '20',
          text: semantic.interactive.primary,
        },
      },
    },
    
    gameBoard: {
      background: semantic.surfaces.gameBoard,
      gridLines: semantic.game.gridLines,
      selection: semantic.game.componentSelection,
      hover: semantic.interactive.hover,
    },
    
    componentPalette: {
      background: semantic.surfaces.componentPalette,
      itemBackground: 'transparent',
      itemHover: semantic.interactive.hover + '20',
      itemSelected: semantic.interactive.selection + '30',
      itemText: semantic.content.primary,
    },
    
    electronics: {
      resistor: '#FF6B35',      // Эти цвета можно тоже сделать семантическими
      capacitor: '#4ECDC4',     // но пока оставим как константы
      inductor: '#A8E6CF',      // так как они специфичны для электроники
      led: '#FFD93D',
      source: '#6C5CE7',
      switch: '#A4A4A4',
      ground: '#666666',
    },
  };
}

// ============================================================================
// 4. THEME FACTORY (Создание MUI темы)
// ============================================================================

export function createSemanticTheme(themeKey: keyof typeof primitiveTokens): Theme {
  const primitives = primitiveTokens[themeKey];
  const semantic = createSemanticTokens(primitives);
  const components = createComponentTokens(semantic);
  
  return createTheme({
    palette: {
      mode: "dark",
      
      // Маппинг семантических токенов на MUI палитру
      primary: {
        main: semantic.interactive.primary,
        light: semantic.interactive.hover,
        dark: semantic.interactive.active,
      },
      secondary: {
        main: semantic.interactive.secondary,
      },
      background: {
        default: semantic.surfaces.gameBoard,
        paper: semantic.surfaces.uiPanel,
      },
      text: {
        primary: semantic.content.primary,
        secondary: semantic.content.secondary,
      },
      success: {
        main: semantic.feedback.success,
      },
      warning: {
        main: semantic.feedback.warning,
      },
      error: {
        main: semantic.feedback.error,
      },
      info: {
        main: semantic.feedback.info,
      },
      
      // Кастомные семантические токены
      semantic,
      components,
      
      // Временная обратная совместимость для быстрого исправления
      circuit: {
        boardBackground: semantic.surfaces.gameBoard,
        selection: semantic.interactive.selection,
        grid: semantic.game.gridLines,
      },
      
      simulation: {
        energyFlow: semantic.game.energyFlow,
        success: semantic.feedback.success,
      },
      
      gradients: {
        accentGradient: semantic.gradients.primary,
        backgroundPrimary: semantic.gradients.background,
      },
      
      customColors: {
        softShadow: semantic.surfaces.gameBoard,
      },
      
      customShadows: {
        mainShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
      },
      
    } as any,
    
    // Typography из семантических токенов
    typography: {
      fontFamily: semantic.typography.fontFamily,
      
      // Основные MUI варианты
      h1: {
        fontFamily: semantic.typography.fontFamily,
        fontSize: semantic.typography.headings.fontSize,
        fontWeight: semantic.typography.headings.fontWeight,
        lineHeight: semantic.typography.headings.lineHeight,
        letterSpacing: semantic.typography.headings.letterSpacing,
      },
      h2: {
        fontFamily: semantic.typography.fontFamily,
        fontSize: `calc(${semantic.typography.headings.fontSize} * 0.8)`,
        fontWeight: semantic.typography.headings.fontWeight,
        lineHeight: semantic.typography.headings.lineHeight,
      },
      h3: {
        fontFamily: semantic.typography.fontFamily,
        fontSize: `calc(${semantic.typography.headings.fontSize} * 0.6)`,
        fontWeight: semantic.typography.headings.fontWeight,
        lineHeight: semantic.typography.headings.lineHeight,
      },
      body1: {
        fontFamily: semantic.typography.fontFamily,
        fontSize: semantic.typography.body.fontSize,
        fontWeight: semantic.typography.body.fontWeight,
        lineHeight: semantic.typography.body.lineHeight,
      },
      body2: {
        fontFamily: semantic.typography.fontFamily,
        fontSize: semantic.typography.captions.fontSize,
        fontWeight: semantic.typography.captions.fontWeight,
        lineHeight: semantic.typography.captions.lineHeight,
      },
      button: {
        fontFamily: semantic.typography.fontFamily,
        fontSize: semantic.typography.buttons.fontSize,
        fontWeight: semantic.typography.buttons.fontWeight,
        lineHeight: semantic.typography.buttons.lineHeight,
        letterSpacing: semantic.typography.buttons.letterSpacing,
        textTransform: 'none',
      },
      caption: {
        fontFamily: semantic.typography.fontFamily,
        fontSize: semantic.typography.captions.fontSize,
        fontWeight: semantic.typography.captions.fontWeight,
        lineHeight: semantic.typography.captions.lineHeight,
      },
      
      // Кастомные варианты для совместимости
      electronicTitle: {
        fontFamily: semantic.typography.fontFamily,
        fontSize: semantic.typography.headings.fontSize,
        fontWeight: semantic.typography.headings.fontWeight,
        lineHeight: semantic.typography.headings.lineHeight,
        letterSpacing: semantic.typography.headings.letterSpacing,
        textTransform: "uppercase",
      },
      
      componentLabel: {
        fontFamily: semantic.typography.fontFamily,
        fontSize: semantic.typography.captions.fontSize,
        fontWeight: semantic.typography.captions.fontWeight,
        lineHeight: semantic.typography.captions.lineHeight,
        textTransform: "uppercase",
      },
      
      componentValue: {
        fontFamily: semantic.typography.fontFamily,
        fontSize: `calc(${semantic.typography.captions.fontSize} * 0.8)`,
        fontWeight: semantic.typography.captions.fontWeight,
        lineHeight: semantic.typography.captions.lineHeight,
      },
      
      energyValue: {
        fontFamily: semantic.typography.fontFamily,
        fontSize: semantic.typography.body.fontSize,
        fontWeight: semantic.typography.body.fontWeight,
        lineHeight: semantic.typography.body.lineHeight,
        color: semantic.content.accent,
      },
      
      circuitInfo: {
        fontFamily: semantic.typography.fontFamily,
        fontSize: semantic.typography.body.fontSize,
        fontWeight: semantic.typography.body.fontWeight,
        lineHeight: semantic.typography.body.lineHeight,
      },
      
      mobileButton: {
        fontFamily: semantic.typography.fontFamily,
        fontSize: semantic.typography.buttons.fontSize,
        fontWeight: semantic.typography.buttons.fontWeight,
        lineHeight: semantic.typography.buttons.lineHeight,
        letterSpacing: semantic.typography.buttons.letterSpacing,
        textTransform: "capitalize",
      },
    } as any,
    
    // Остальные настройки из оригинальной темы
    spacing: 4,
    shape: {
      borderRadius: 20,
    },
    
    // Мобильные настройки
    mobile: {
      touchTarget: 48,
      componentSize: 40,
      componentSizeSmall: 32,
      componentSizeLarge: 56,
      gridSpacing: 8,
      gridSpacingSmall: 4,
      cornerRadius: 20,
      animationDuration: 200,
    },
    
    // Размеры компонентов
    componentSizes: {
      icon: {
        small: 16,
        medium: 24,
        large: 32,
      },
      hitbox: {
        small: 32,
        medium: 48,
        large: 64,
      },
    },
    
    // Z-index слои
    electronicZIndex: {
      background: 1,
      grid: 10,
      components: 100,
      selection: 200,
      dragging: 300,
      ui: 1000,
      modal: 2000,
    },
    
    // MUI компоненты с семантическими стилями
    components: {
      MuiButton: {
        styleOverrides: {
          root: ({ theme, ownerState }) => ({
            borderRadius: "10px !important",
            
            ...(ownerState.variant === "contained" && {
              background: (theme.palette as any).components.button.primary.background,
              color: (theme.palette as any).components.button.primary.text,
              "&:hover": {
                background: (theme.palette as any).components.button.primary.hover.background,
              },
            }),
            
            ...(ownerState.variant === "outlined" && {
              background: (theme.palette as any).components.button.secondary.background,
              color: (theme.palette as any).components.button.secondary.text,
              borderColor: (theme.palette as any).components.button.secondary.border,
              "&:hover": {
                background: (theme.palette as any).components.button.secondary.hover.background,
              },
            }),
          }),
        },
      },
      
      MuiCard: {
        styleOverrides: {
          root: ({ theme }) => ({
            borderRadius: "20px !important",
            background: (theme.palette as any).semantic.surfaces.uiPanel,
          }),
        },
      },
    },
  });
}

// ============================================================================
// 5. CLEAN IGNIT FIRE THEME (без legacy кода)
// ============================================================================

// Создаем чистую ignitFire тему без слоя совместимости
export const ignitFireTheme = createSemanticTheme('ignitFire');

// ============================================================================
// 6. EXPORT
// ============================================================================

export default createSemanticTheme;