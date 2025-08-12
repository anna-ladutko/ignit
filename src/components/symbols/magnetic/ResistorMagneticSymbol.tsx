import React from 'react'
import { SvgIcon, type SvgIconProps } from '@mui/material'

export const ResistorMagneticSymbol: React.FC<SvgIconProps> = (props) => (
  <SvgIcon {...props} viewBox="0 0 100 40">
    <g>
      {/* Магнитные точки */}
      <circle cx="10" cy="20" r="6" fill="currentColor"/>
      <circle cx="90" cy="20" r="6" fill="currentColor"/>

      {/* Соединительные линии */}
      <line x1="10" y1="20" x2="25" y2="20" stroke="currentColor" strokeWidth="2"/>
      <line x1="73" y1="20" x2="90" y2="20" stroke="currentColor" strokeWidth="2"/>

      {/* Зигзаг резистора */}
      <path d="M25 20L29 11L37 29L45 11L53 29L61 11L69 29L73 20"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"/>
    </g>
  </SvgIcon>
)

export default ResistorMagneticSymbol