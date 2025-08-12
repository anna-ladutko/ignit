import React from 'react'
import { SvgIcon, type SvgIconProps } from '@mui/material'

export const CapacitorMagneticSymbol: React.FC<SvgIconProps> = (props) => (
  <SvgIcon {...props} viewBox="0 0 100 40">
    <g>
      {/* Магнитные точки */}
      <circle cx="10" cy="20" r="6" fill="currentColor"/>
      <circle cx="90" cy="20" r="6" fill="currentColor"/>

      {/* Соединительные линии */}
      <line x1="10" y1="20" x2="42" y2="20" stroke="currentColor" strokeWidth="2"/>
      <line x1="58" y1="20" x2="90" y2="20" stroke="currentColor" strokeWidth="2"/>

      {/* Конденсатор - две параллельные пластины */}
      <line x1="42" y1="8" x2="42" y2="32" stroke="currentColor" strokeWidth="3"/>
      <line x1="58" y1="8" x2="58" y2="32" stroke="currentColor" strokeWidth="3"/>
    </g>
  </SvgIcon>
)

export default CapacitorMagneticSymbol