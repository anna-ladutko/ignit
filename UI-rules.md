# UI Design Rules - IGNIT Mobile Game

## Border Radius Standards

### Window/Panel Radius
- **All windows and panels**: `20px` border radius
- This applies to: modals, panels, cards, containers
- **Examples**: MobilePanel, GameModal, Card components

### Button Radius  
- **All buttons**: `10px` border radius
- This applies to: TouchButton, IconButton, all interactive buttons
- **Examples**: Primary buttons, accent buttons, danger buttons

## Color Palette

### Background Colors
- **Primary dark background**: `#343635` (replaces old `#0F1425`)
- **No dark blue colors**: The `#0F1425` color has been completely removed from the palette

### Button Variants
- **Primary variant only**: `variant="primary"` is the standard
- **Secondary variant removed**: `variant="secondary"` has been eliminated
- **Available variants**: `primary`, `accent`, `danger`
- **Color scheme**: Limited and focused color palette for consistency

## Implementation Guidelines

### Theme Configuration
- Corner radius: `mobile.cornerRadius: 20px`
- Button radius: `borderRadius: 10px` in all button styles
- Board background: `circuit.boardBackground: "#343635"`

### Component Standards
- TouchButton: No secondary variant, only primary/accent/danger
- MobilePanel: No secondary variant, only primary/accent  
- All modals use 20px border radius
- All buttons use 10px border radius

### Typography
- Font family: Montserrat (primary font)
- Electronic titles: Bold, uppercase, gradient backgrounds
- Component labels: Medium weight, uppercase
- Button text: Bold, capitalize (not uppercase)

### Icon Standards

#### Settings Icon (⚙️)
- **Standard style**: Material-UI `Settings` icon with `fontSize="large"`
- **Color**: `#E5DFD1` (Creamy white from Ignit palette)
- **Hover**: `backgroundColor: 'rgba(229, 223, 209, 0.1)'`
- **Usage**: TopBar, LevelsScreen, all settings contexts
- **No variants**: Always use this exact style - no background circles, no different colors

#### Back Arrow (←)
- **Standard style**: Material-UI `ArrowBack` icon with `fontSize="large"`
- **Color**: `#E5DFD1` (Creamy white from Ignit palette)  
- **Hover**: `backgroundColor: 'rgba(229, 223, 209, 0.1)'`
- **Usage**: All navigation contexts (TopGameBar, SettingsScreen, etc.)
- **No variants**: Always use this exact style - no background circles, no different colors

#### Icon Implementation Rules
- **Library**: Always use `@mui/icons-material`
- **Size**: Use `fontSize="large"` for all navigation icons
- **Consistency**: All icons follow the same hover and color pattern
- **No customization**: Do not create custom background styles for standard navigation icons

## Design Philosophy

This design system prioritizes:
1. **Consistency**: Standard measurements across all UI elements  
2. **Simplicity**: Limited color variants to reduce complexity
3. **Mobile-first**: Optimized for touch interfaces
4. **Electronic aesthetic**: Industrial/technical visual style
5. **Accessibility**: Adequate touch targets and contrast ratios

## Component Hierarchy

```
UI Components:
├── TouchButton (primary, accent, danger variants)
├── MobilePanel (primary, accent variants)  
├── GameModal (20px radius, blur backdrop)
└── ComponentButton (specialized for game pieces)
```

---
*Last updated: Implementation of UI standardization rules*