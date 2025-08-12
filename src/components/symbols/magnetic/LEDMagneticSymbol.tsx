import React from 'react'
import { SvgIcon, type SvgIconProps } from '@mui/material'

export const LEDMagneticSymbol: React.FC<SvgIconProps> = (props) => (
  <SvgIcon {...props} viewBox="0 0 100 40">
    <g>
      {/* Магнитные точки */}
      <circle cx="10" cy="20" r="6" fill="currentColor"/>
      <circle cx="90" cy="20" r="6" fill="currentColor"/>

      {/* Соединительные линии */}
      <line x1="10" y1="20" x2="35" y2="20" stroke="currentColor" strokeWidth="2"/>
      <line x1="65" y1="20" x2="90" y2="20" stroke="currentColor" strokeWidth="2"/>

      {/* LED диод - треугольник с линией */}
      <path d="M35 10 L35 30 L65 20 Z" stroke="currentColor" strokeWidth="2" fill="none"/>
      <line x1="65" y1="10" x2="65" y2="30" stroke="currentColor" strokeWidth="2"/>

      {/* Стрелки излучения */}
      <path d="M45 8 L48 5 M46 5 L48 5 L48 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none"/>
      <path d="M52 12 L55 9 M53 9 L55 9 L55 11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none"/>
    </g>
  </SvgIcon>
)

export default LEDMagneticSymbol