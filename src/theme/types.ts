import '@mui/material/styles'

declare module '@mui/material/styles' {
  interface Palette {
    // Новая семантическая система (только для обратной совместимости на время миграции)
    semantic?: any
    components?: any
    
    // Кастомные тени
    customShadows: {
      mainShadow: string
    }
    
    // Временная обратная совместимость - будет удалена после рефакторинга всех компонентов
    circuit?: {
      boardBackground: string
      selection: string
      grid: string
    }
    
    simulation?: {
      energyFlow: string
      success: string
    }
    
    gradients?: {
      accentGradient: string
      backgroundPrimary: string
    }
    
    customColors?: {
      softShadow: string
    }
  }

  interface PaletteOptions {
    semantic?: any
    components?: any
    
    customShadows?: {
      mainShadow?: string
    }
    
    circuit?: {
      boardBackground?: string
      selection?: string
      grid?: string
    }
    
    simulation?: {
      energyFlow?: string
      success?: string
    }
    
    gradients?: {
      accentGradient?: string
      backgroundPrimary?: string
    }
    
    customColors?: {
      softShadow?: string
    }
  }

  interface Theme {
    // Мобильные размеры (актуальные)
    mobile: {
      touchTarget: number
      componentSize: number
      componentSizeSmall: number
      componentSizeLarge: number
      gridSpacing: number
      gridSpacingSmall: number
      cornerRadius: number
      animationDuration: number
    }
    
    // Размеры компонентов (актуальные)
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
    
    // Электронные z-index слои (актуальные)
    electronicZIndex: {
      background: number
      grid: number
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