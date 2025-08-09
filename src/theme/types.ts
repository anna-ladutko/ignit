import '@mui/material/styles'

declare module '@mui/material/styles' {
  interface Palette {
    // Электронная цветовая схема
    electronic: {
      background: string
      surface: string
      primary: string
      secondary: string
      warning: string
      error: string
    }
    
    // Цвета компонентов
    components: {
      resistor: { main: string; active: string; disabled: string }
      capacitor: { main: string; active: string; disabled: string }
      inductor: { main: string; active: string; disabled: string }
      led: { main: string; active: string; disabled: string }
      source: { main: string; active: string; disabled: string }
      switch: { main: string; active: string; disabled: string }
      ground: { main: string; active: string; disabled: string }
    }
    
    // Цвета схемы
    circuit: {
      wire: string
      wireActive: string
      wireError: string
      connectionPoint: string
      connectionPointActive: string
      grid: string
      gridActive: string
      selection: string
      selectionSecondary: string
      boardBackground: string
    }
    
    // Анимация симуляции
    simulation: {
      energyFlow: string
      energyFlowHigh: string
      energyFlowLow: string
      highVoltage: string
      lowVoltage: string
      success: string
      successGlow: string
      error: string
      errorGlow: string
      warning: string
    }
    
    // Существующие расширения из sudoku темы
    gradients: {
      backgroundPrimary: string
      backgroundSecondary: string
      backgroundAccent: string
      backgroundModule1: string
      backgroundModule2: string
      backgroundModule3: string
      backgroundTransparent: string
      titleAccent: string
      accentTopLeft: string
      accentTopRight: string
      accentBottomRight: string
      accentBottomLeft: string
    }
    
    customColors: {
      uiTextSecondary: string
      uiTextSecondaryDark: string
      uiTextForWhiteBg: string
      uiTextLight: string
      uiIcon: string
      borderTransparent: string
      uiAccentPurple: string
      uiAccentPurpleDisabled: string
      uiBackgroundAccent: string
      uiBackgroundLight: string
    }
    
    customShadows: {
      mainShadow: string
      softShadow: string
      textShadow: string
      componentShadow: string
      glow: string
    }
  }

  interface PaletteOptions {
    electronic?: {
      background?: string
      surface?: string
      primary?: string
      secondary?: string
      warning?: string
      error?: string
    }
    
    components?: {
      resistor?: { main?: string; active?: string; disabled?: string }
      capacitor?: { main?: string; active?: string; disabled?: string }
      inductor?: { main?: string; active?: string; disabled?: string }
      led?: { main?: string; active?: string; disabled?: string }
      source?: { main?: string; active?: string; disabled?: string }
      switch?: { main?: string; active?: string; disabled?: string }
      ground?: { main?: string; active?: string; disabled?: string }
    }
    
    circuit?: {
      wire?: string
      wireActive?: string
      wireError?: string
      connectionPoint?: string
      connectionPointActive?: string
      grid?: string
      gridActive?: string
      selection?: string
      selectionSecondary?: string
      boardBackground?: string
    }
    
    simulation?: {
      energyFlow?: string
      energyFlowHigh?: string
      energyFlowLow?: string
      highVoltage?: string
      lowVoltage?: string
      success?: string
      successGlow?: string
      error?: string
      errorGlow?: string
      warning?: string
    }
    
    gradients?: {
      backgroundPrimary?: string
      backgroundSecondary?: string
      backgroundAccent?: string
      backgroundModule1?: string
      backgroundModule2?: string
      backgroundModule3?: string
      backgroundTransparent?: string
      titleAccent?: string
      accentTopLeft?: string
      accentTopRight?: string
      accentBottomRight?: string
      accentBottomLeft?: string
    }
    
    customColors?: {
      uiTextSecondary?: string
      uiTextSecondaryDark?: string
      uiTextForWhiteBg?: string
      uiTextLight?: string
      uiIcon?: string
      borderTransparent?: string
      uiAccentPurple?: string
      uiAccentPurpleDisabled?: string
      uiBackgroundAccent?: string
      uiBackgroundLight?: string
    }
    
    customShadows?: {
      mainShadow?: string
      softShadow?: string
      textShadow?: string
      componentShadow?: string
      glow?: string
    }
  }

  interface Theme {
    // Мобильные размеры
    mobile: {
      touchTarget: number
      componentSize: number
      componentSizeSmall: number
      componentSizeLarge: number
      wireThickness: number
      wireThicknessActive: number
      gridSpacing: number
      gridSpacingSmall: number
      cornerRadius: number
      animationDuration: number
    }
    
    // Размеры компонентов
    componentSizes: {
      icon: {
        small: number
        medium: number
        large: number
      }
      hitbox: {
        small: number
        medium: number
        large: number
      }
    }
    
    // Электронные z-index слои
    electronicZIndex: {
      background: number
      grid: number
      wires: number
      components: number
      selection: number
      dragging: number
      ui: number
      modal: number
    }
  }

  interface ThemeOptions {
    mobile?: {
      touchTarget?: number
      componentSize?: number
      componentSizeSmall?: number
      componentSizeLarge?: number
      wireThickness?: number
      wireThicknessActive?: number
      gridSpacing?: number
      gridSpacingSmall?: number
      cornerRadius?: number
      animationDuration?: number
    }
    
    componentSizes?: {
      icon?: {
        small?: number
        medium?: number
        large?: number
      }
      hitbox?: {
        small?: number
        medium?: number
        large?: number
      }
    }
    
    electronicZIndex?: {
      background?: number
      grid?: number
      wires?: number
      components?: number
      selection?: number
      dragging?: number
      ui?: number
      modal?: number
    }
  }

  interface TypographyVariants {
    electronicTitle: React.CSSProperties
    componentLabel: React.CSSProperties
    componentValue: React.CSSProperties
    energyValue: React.CSSProperties
    circuitInfo: React.CSSProperties
    mobileButton: React.CSSProperties
  }

  interface TypographyVariantsOptions {
    electronicTitle?: React.CSSProperties
    componentLabel?: React.CSSProperties
    componentValue?: React.CSSProperties
    energyValue?: React.CSSProperties
    circuitInfo?: React.CSSProperties
    mobileButton?: React.CSSProperties
  }
}

declare module '@mui/material/Typography' {
  interface TypographyPropsVariantOverrides {
    electronicTitle: true
    componentLabel: true
    componentValue: true
    energyValue: true
    circuitInfo: true
    mobileButton: true
  }
}

declare module '@mui/material/Button' {
  interface ButtonPropsVariantOverrides {
    electronicPrimary: true
    electronicSecondary: true
    component: true
  }
}

declare module '@mui/material/Paper' {
  interface PaperPropsVariantOverrides {
    componentCard: true
    circuitBoard: true
    infoPanel: true
    mobile: true
  }
}

declare module '@mui/material/Card' {
  interface CardPropsVariantOverrides {
    componentCard: true
    circuitBoard: true
    infoPanel: true
    mobile: true
  }
}