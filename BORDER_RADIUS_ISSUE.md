# Border Radius Issue - Техническое расследование

## 🚨 Описание проблемы

**Симптомы:** Border-radius значения из Material-UI theme превращаются из корректных (20px) в гигантские (400px) при рендеринге в браузере.

**Обнаружено:** 14.08.2024  
**Статус:** Временно решено через обходные методы  

## 📊 Детали проблемы

### Затронутые элементы:
- ❌ MUI `variants` в Button и Card компонентах
- ❌ `theme.mobile.cornerRadius` (20px → 400px)
- ❌ `theme.shape.borderRadius` (20px → 400px) 
- ✅ Стандартные MUI варианты (`contained`, `outlined`) работали корректно
- ✅ Прямые CSS значения (`"20px"`) работали корректно

### Примеры проблемного кода:
```typescript
// ❌ НЕ РАБОТАЕТ - превращается в 400px
borderRadius: theme.mobile.cornerRadius

// ❌ НЕ РАБОТАЕТ - variants система дает 400px
{
  props: { variant: "electronicPrimary" },
  style: { borderRadius: 10 }
}

// ✅ РАБОТАЕТ - прямые значения
borderRadius: "20px !important"
```

## 🔧 Временные решения (реализованы)

### 1. Константы дизайн-системы
Создан файл `src/constants/design.ts`:
```typescript
export const BORDER_RADIUS = {
  BUTTON: "10px",
  PANEL: "20px", 
  SMALL: "5px",
  LARGE: "24px",
} as const
```

### 2. Замена MUI variants на styleOverrides
```typescript
// Вместо variants:
MuiButton: {
  styleOverrides: {
    root: ({ ownerState }) => ({
      borderRadius: "10px !important", // Принудительно
      ...(ownerState.variant === "electronicPrimary" && {
        // стили...
      })
    })
  }
}
```

### 3. Принудительные значения
Все критические border-radius используют `!important`:
```typescript
borderRadius: "20px !important"
```

## 🔍 Гипотезы о причинах

### Гипотеза 1: CSS-in-JS конфликт
- **Версии:** @mui/material, emotion, styled-components
- **Подозрение:** Конфликт между emotion (MUI) и другими CSS-in-JS библиотеками
- **Тестирование:** Требуется изоляция MUI от других зависимостей

### Гипотеза 2: Theme calculation bug
- **Симптом:** Только значения из theme объекта искажаются
- **Подозрение:** Bug в MUI theme resolution или CSS variable calculation
- **Особенность:** 400px может быть результатом математической операции (20px * 20 = 400px)

### Гипотеза 3: Build tool issue (Vite)
- **Симптом:** Проблема проявляется в dev режиме
- **Подозрение:** Vite Hot Module Reload или CSS processing
- **Тестирование:** Нужна проверка в production build

### Гипотеза 4: Browser-specific bug
- **Симптом:** Проблема может быть специфичной для определенных браузеров
- **Тестирование:** Требуется проверка в разных браузерах

## 📋 План исследования корневой причины

### Этап 1: Минимальная репродукция
- [ ] Создать изолированный компонент только с MUI theme
- [ ] Протестировать разные способы задания border-radius
- [ ] Определить минимальные условия для воспроизведения

### Этап 2: Аудит зависимостей
- [ ] Проверить версии всех CSS-in-JS библиотек
- [ ] Удалить потенциально конфликтующие зависимости
- [ ] Протестировать на чистой MUI установке

### Этап 3: Build environment
- [ ] Протестировать в production build
- [ ] Проверить разные browsers
- [ ] Исследовать Vite конфигурацию и plugins

### Этап 4: MUI debugging  
- [ ] Включить MUI debug режим
- [ ] Исследовать CSS generation процесс
- [ ] Проверить theme resolution chain

## 🏗️ Долгосрочные архитектурные решения

### Опция 1: Design Tokens System
```typescript
// CSS Custom Properties
:root {
  --border-radius-button: 10px;
  --border-radius-panel: 20px;
}

// Использование в компонентах
borderRadius: 'var(--border-radius-panel)'
```

### Опция 2: Styled Components Migration
```typescript
const StyledButton = styled(Button)`
  border-radius: ${props => props.theme.borderRadius.button};
`
```

### Опция 3: CSS Modules + PostCSS
```css
.panel {
  border-radius: 20px;
}
```

## 🚨 Правила команды (действующие)

### Запрещено:
- `theme.mobile.cornerRadius`
- `theme.shape.borderRadius`
- MUI `variants` для новых компонентов

### Обязательно:
- Константы из `src/constants/design.ts`
- `styleOverrides` вместо `variants`
- `!important` для критических значений

### Code Review Checklist:
- [ ] Нет использования theme radius values
- [ ] Все border-radius из design constants
- [ ] MUI кастомизация через styleOverrides

## 📈 Мониторинг

### Метрики для отслеживания:
- Количество `!important` в CSS (должно уменьшаться)
- Использование theme values (должно быть 0)
- Новые случаи 400px в DevTools

### Индикаторы успеха долгосрочного решения:
- Удаление всех `!important` 
- Возврат к нормальной theme системе
- Стабильный border-radius во всех браузерах

---

**Последнее обновление:** 14.08.2024  
**Ответственный:** Development Team  
**Приоритет:** HIGH - блокирует консистентность UI