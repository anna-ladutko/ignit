import { createTheme } from "@mui/material/styles";
import "./types"; // Import the type declarations

export const themeIgnit = createTheme({
  palette: {
    mode: "dark",

    // Основная MUI палитра
    primary: {
      main: "#F4490C",
      light: "#FF8000",
      dark: "#00CC66",
    },
    secondary: {
      main: "#0088FF", // синий акцент
      light: "#3399FF",
      dark: "#0066CC",
    },
    success: {
      main: "#00FF88",
    },
    warning: {
      main: "#FFB800",
    },
    error: {
      main: "#FF4444",
    },
    background: {
      default: "#202221", // новый темный фон
      paper: "rgba(217, 217, 217, 0.2)", // поверхности
    },
    text: {
      primary: "#E5DFD1",
      secondary: "#818181",
    },

    // Electronics Component colors (each type has its own color for easy identification)
    electronicsComponents: {
      resistor: {
        main: "#FF6B35", // orange for resistors
        active: "#FF8555",
        disabled: "#CC4422",
      },
      capacitor: {
        main: "#4ECDC4", // бирюзовый для конденсаторов
        active: "#6EDDD6",
        disabled: "#3EADA4",
      },
      inductor: {
        main: "#A8E6CF", // светло-зеленый для индуктивностей
        active: "#B8F6DF",
        disabled: "#88C6AF",
      },
      led: {
        main: "#FFD93D", // yellow for LEDs
        active: "#FFE55D",
        disabled: "#CCB122",
      },
      source: {
        main: "#6C5CE7", // purple for sources
        active: "#8B7ED8",
        disabled: "#5544BB",
      },
      switch: {
        main: "#A4A4A4", // серый для переключателей
        active: "#B4B4B4",
        disabled: "#848484",
      },
      ground: {
        main: "#666666", // темно-серый для земли
        active: "#777777",
        disabled: "#555555",
      },
    },

    // Цвета схемы
    circuit: {
      wire: "#00FF88", // основной цвет проводов
      wireActive: "#33FF99", // активированный провод
      wireError: "#FF4444", // провод с ошибкой
      connectionPoint: "#FFFFFF", // connection points
      connectionPointActive: "#00DDFF", // active connection point
      grid: "transparent", // убрано для flat дизайна
      gridActive: "#3A3F5A", // активированная сетка
      selection: "#00DDFF", // component selection
      selectionSecondary: "#0088FF", // вторичное выделение
      boardBackground: "#343635", // фон игрового поля
    },

    // Simulation animation
    simulation: {
      energyFlow: "#00FF88", // main energy flow
      energyFlowHigh: "#88FF00", // high energy flow
      energyFlowLow: "#00FFAA", // low energy flow
      highVoltage: "#FF4444", // высокое напряжение (опасность)
      lowVoltage: "#4ECDC4", // низкое напряжение (безопасно)
      success: "#00FF88", // успешное решение
      successGlow: "#00FF8840", // свечение успеха
      error: "#FF4444", // ошибка
      errorGlow: "#FF444440", // свечение ошибки
      warning: "#FFB800", // предупреждение
    },

    // Градиенты для красивых эффектов
    gradients: {
      backgroundPrimary: "linear-gradient(135deg, #202221 0%, #1A1F3A 100%)",
      backgroundSecondary: "linear-gradient(135deg, #1A1F3A 0%, #202221 100%)",
      backgroundAccent: "linear-gradient(135deg, #FF8000 0%, #D84205 100%)",
      backgroundTransparent:
        "linear-gradient(135deg, rgba(0,255,136,0.1) 0%, rgba(0,136,255,0.1) 100%)",
      accentGradient: "linear-gradient(135deg, #FF8000 0%, #FF3939 100%)",
    },

    customColors: {
      uiTextSecondary: "#B0B8CC",
      uiTextSecondaryDark: "#8090A4",
      uiTextForWhiteBg: "#1A1F3A",
      uiTextLight: "#E5DFD1",
      uiIcon: "#B0B8CC",
      borderTransparent: "rgba(0, 255, 136, 0.2)",
    },

    customShadows: {
      mainShadow: "0px 4px 20px rgba(0, 0, 0, 0.6)",
    },
  },

  // Мобильные размеры оптимизированные для Android
  mobile: {
    touchTarget: 44, // минимальный размер касания (Google Material Design)
    componentSize: 36, // component size on board
    componentSizeSmall: 24, // small size
    componentSizeLarge: 48, // large size
    wireThickness: 3, // толщина проводов
    wireThicknessActive: 5, // толщина активных проводов
    gridSpacing: 44, // расстояние сетки (= touchTarget для точности)
    gridSpacingSmall: 32, // плотная сетка
    cornerRadius: 20, // радиус скругления
    animationDuration: 200, // длительность анимаций в мс
  },

  // Component sizes
  componentSizes: {
    icon: {
      small: 20,
      medium: 28,
      large: 36,
    },
    hitbox: {
      small: 32,
      medium: 44,
      large: 56,
    },
  },

  // Z-index слои для правильного наложения
  electronicZIndex: {
    background: 1,
    grid: 2,
    wires: 3,
    components: 4,
    selection: 5,
    dragging: 6,
    ui: 10,
    modal: 20,
  },

  // Типография оптимизированная для мобильных экранов
  typography: {
    fontFamily: '"Montserrat", "Arial", sans-serif',

    // Электронные заголовки
    electronicTitle: {
      fontFamily: '"Montserrat", sans-serif',
      fontSize: "24px",
      fontWeight: 700,
      lineHeight: 1.2,
      letterSpacing: "0.02em",
      textTransform: "uppercase",
    },

    // Component labels
    componentLabel: {
      fontFamily: '"Montserrat", sans-serif',
      fontSize: "12px",
      fontWeight: 500,
      lineHeight: 1.2,
      letterSpacing: "0.01em",
    },

    // Component values (resistance, capacitance, etc.)
    componentValue: {
      fontFamily: '"Montserrat", sans-serif',
      fontSize: "10px",
      fontWeight: 400,
      lineHeight: 1.2,
      letterSpacing: "0.01em",
    },

    // Energy/voltage values
    energyValue: {
      fontFamily: '"Montserrat", sans-serif',
      fontSize: "14px",
      fontWeight: 600,
      lineHeight: 1.2,
      letterSpacing: "0.02em",
      color: "#00FF88",
    },

    // Информация о схеме
    circuitInfo: {
      fontFamily: '"Montserrat", sans-serif',
      fontSize: "13px",
      fontWeight: 400,
      lineHeight: 1.4,
      letterSpacing: "0",
    },

    // Мобильные кнопки
    mobileButton: {
      fontFamily: '"Montserrat", sans-serif',
      fontSize: "16px",
      fontWeight: 600,
      lineHeight: 1.2,
      letterSpacing: "0.01em",
      textTransform: "capitalize",
    },
  },

  // Отступы адаптированные под мобильные экраны
  spacing: 4, // базовая единица 4px для более плотной компоновки на мобильных

  // Форма элементов
  shape: {
    borderRadius: 20, // стандартный радиус для панелей и окон
  },

  // Material UI components with custom styles
  components: {
    // Кнопки с электронной темой - используем styleOverrides вместо variants
    MuiButton: {
      styleOverrides: {
        root: ({ theme, ownerState }) => ({
          // Принудительно ставим 10px border-radius для всех кнопок
          borderRadius: "10px !important",
          
          // Специфичные стили в зависимости от variant
          ...(ownerState.variant === "electronicPrimary" && {
            background: theme.palette.gradients.accentGradient,
            color: theme.palette.text.primary,
            minHeight: theme.mobile.touchTarget,
            minWidth: theme.mobile.touchTarget * 2,
            fontSize: "16px",
            fontWeight: 600,
            textTransform: "capitalize",
            "&:hover": {
              background: theme.palette.gradients.accentGradient,
            },
            "&:active": {
              transform: "scale(0.98)",
            },
          }),
          
          ...(ownerState.variant === "electronicSecondary" && {
            background: "transparent",
            color: theme.palette.primary.main,
            minHeight: theme.mobile.touchTarget,
            minWidth: theme.mobile.touchTarget * 2,
            fontSize: "16px",
            fontWeight: 600,
            textTransform: "capitalize",
            "&:hover": {
              background: `${theme.palette.primary.main}15`,
            },
            "&:active": {
              transform: "scale(0.98)",
            },
          }),
          
          ...(ownerState.variant === "component" && {
            background: "transparent",
            color: theme.palette.text.secondary,
            minHeight: theme.mobile.touchTarget,
            minWidth: theme.mobile.touchTarget,
            padding: "8px",
            "&:hover": {
              background: `${theme.palette.circuit.selection}10`,
            },
            "&:active": {
              transform: "scale(0.95)",
            },
          }),
        }),
      },
    },

    // Cards с фиксированными стилями - используем styleOverrides вместо variants
    MuiCard: {
      styleOverrides: {
        root: ({ theme, ownerState }) => ({
          // Принудительно ставим 20px border-radius для всех панелей
          borderRadius: "20px !important",
          
          // Специфичные стили в зависимости от variant
          ...(ownerState.variant === "componentCard" && {
            background: theme.palette.background.paper,
            padding: theme.spacing(2),
          }),
          
          ...(ownerState.variant === "circuitBoard" && {
            background: theme.palette.circuit.boardBackground,
            padding: theme.spacing(1),
            position: "relative",
            overflow: "hidden",
          }),
          
          ...(ownerState.variant === "infoPanel" && {
            background: theme.palette.circuit.boardBackground,
            padding: theme.spacing(2),
            // boxShadow removed
          }),
          
          ...(ownerState.variant === "mobile" && {
            background: theme.palette.background.paper,
            padding: theme.spacing(2),
            minHeight: theme.mobile.touchTarget,
          }),
        }),
      },
    },

    // Типография с электронными вариантами
    MuiTypography: {
      defaultProps: {
        variantMapping: {
          electronicTitle: "h1",
          componentLabel: "span",
          componentValue: "span",
          energyValue: "span",
          circuitInfo: "p",
          mobileButton: "span",
        },
      },
      styleOverrides: {
        root: ({ theme, ownerState }) => ({
          ...(ownerState.variant === "electronicTitle" && {
            background: theme.palette.gradients.accentGradient,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            textAlign: "center",
            textShadow: "none", // убираем тень для gradient текста
          }),
          ...(ownerState.variant === "componentLabel" && {
            color: theme.palette.text.secondary,
            textTransform: "uppercase",
          }),
          ...(ownerState.variant === "energyValue" && {
            color: theme.palette.primary.main,
            fontWeight: 700,
          }),
        }),
      },
    },
  },
});

export default themeIgnit;
