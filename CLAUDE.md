# Hello World App

A simple React TypeScript application built with Vite, Material UI, and Framer Motion.

## Tech Stack

- **Vite** - Build tool and dev server
- **React** - UI framework
- **TypeScript** - Type safety
- **Material UI** - Component library and styling (using sx props)
- **Framer Motion** - Animations

## Getting Started

```bash
yarn install
yarn dev
```

## Available Scripts

- `yarn dev` - Start development server
- `yarn build` - Build for production
- `yarn lint` - Run ESLint
- `yarn preview` - Preview production build

## Project Structure

- `src/App.tsx` - Main app component with Material UI and Framer Motion
- `src/main.tsx` - App entry point with Material UI theme provider

# important-instruction-reminders

## ⚠️ КРИТИЧЕСКИ ВАЖНО: Обязательное чтение документации
ЛЮБАЯ работа с проектом ДОЛЖНА начинаться с полного изучения:
1. **ARCHITECTURE.md** - архитектура проекта (Hybrid React + Vanilla JS)
2. **UI-rules.md** - стандарты UI дизайна, правила иконок, цветов, border-radius

Без понимания каждой запятой архитектуры и UI правил - работа запрещена.
Hybrid React + Vanilla JS архитектура требует точного следования принципам разделения ответственностей.

Do what has been asked; nothing more, nothing less.
NEVER create files unless they're absolutely necessary for achieving your goal.
ALWAYS prefer editing an existing file to creating a new one.
NEVER proactively create documentation files (*.md) or README files. Only create documentation files if explicitly requested by the User.

# UI Design Rules
NEVER use glow effects in the interface by default. The app's design philosophy is clean and minimalistic. Glow effects should only be used in extremely rare and exceptional cases (less than 1% of use cases). Avoid animations like `glow`, `pulse`, or similar lighting effects unless specifically requested.

# border-radius-rules
⚠️ КРИТИЧЕСКАЯ ПРОБЛЕМА: Theme values превращаются в гигантские размеры (20px → 400px)

ЗАПРЕЩЕНО использовать:
- `theme.mobile.cornerRadius`
- `theme.shape.borderRadius` 
- MUI `variants` для кастомных стилей

ОБЯЗАТЕЛЬНО использовать:
- Константы из `src/constants/design.ts`: `BORDER_RADIUS.BUTTON` (10px), `BORDER_RADIUS.PANEL` (20px)
- `styleOverrides` вместо `variants` для MUI компонентов
- `!important` для критических значений border-radius

См. BORDER_RADIUS_ISSUE.md для полного описания проблемы.
