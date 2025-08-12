import React from 'react'
import { SvgIcon, type SvgIconProps } from '@mui/material'

export const SupercapacitorMagneticSymbol: React.FC<SvgIconProps> = (props) => (
  <SvgIcon {...props} viewBox="0 0 100 40">
    <g>
      {/* Магнитные точки */}
      <circle cx="10" cy="20" r="6" fill="currentColor"/>
      <circle cx="90" cy="20" r="6" fill="currentColor"/>

      {/* Соединительные линии */}
      <line x1="10" y1="20" x2="30" y2="20" stroke="currentColor" strokeWidth="2"/>
      <line x1="70" y1="20" x2="90" y2="20" stroke="currentColor" strokeWidth="2"/>

      {/* Суперконденсатор - левая пластина */}
      <line x1="30" y1="8" x2="30" y2="32" stroke="currentColor" strokeWidth="3"/>
      {/* Изогнутая пластина слева */}
      <path d="M35,8 Q40,20 35,32" stroke="currentColor" strokeWidth="2" fill="none"/>
      {/* Изогнутая пластина справа */}
      <path d="M65,8 Q60,20 65,32" stroke="currentColor" strokeWidth="2" fill="none"/>
      {/* Правая пластина */}
      <line x1="70" y1="8" x2="70" y2="32" stroke="currentColor" strokeWidth="3"/>

      {/* Индикаторы полярности */}
      <text x="25" y="12" fontSize="8" textAnchor="middle" fill="currentColor">+</text>
      <text x="75" y="12" fontSize="8" textAnchor="middle" fill="currentColor">-</text>
    </g>
  </SvgIcon>
)

export default SupercapacitorMagneticSymbol