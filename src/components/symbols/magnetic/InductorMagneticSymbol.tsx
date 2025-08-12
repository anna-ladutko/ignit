import React from 'react'
import { SvgIcon, type SvgIconProps } from '@mui/material'

export const InductorMagneticSymbol: React.FC<SvgIconProps> = (props) => (
  <SvgIcon {...props} viewBox="0 0 100 40">
    <g>
      {/* Магнитные точки */}
      <circle cx="10" cy="20" r="6" fill="currentColor"/>
      <circle cx="90" cy="20" r="6" fill="currentColor"/>

      {/* Соединительные линии */}
      <line x1="10" y1="20" x2="25" y2="20" stroke="currentColor" strokeWidth="2"/>
      <line x1="75" y1="20" x2="90" y2="20" stroke="currentColor" strokeWidth="2"/>

      {/* Индуктивность - серия полукругов */}
      <path d="M25 20 C25 12, 35 12, 35 20 C35 12, 45 12, 45 20 C45 12, 55 12, 55 20 C55 12, 65 12, 65 20 C65 12, 75 12, 75 20" 
            stroke="currentColor" 
            strokeWidth="3" 
            strokeLinecap="round" 
            fill="none"/>
    </g>
  </SvgIcon>
)

export default InductorMagneticSymbol