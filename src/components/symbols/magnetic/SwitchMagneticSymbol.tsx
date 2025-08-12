import React from 'react'
import { SvgIcon, type SvgIconProps } from '@mui/material'

interface SwitchMagneticSymbolProps extends SvgIconProps {
  isOpen?: boolean
}

export const SwitchMagneticSymbol: React.FC<SwitchMagneticSymbolProps> = ({ 
  isOpen = false, 
  ...props 
}) => (
  <SvgIcon {...props} viewBox="0 0 100 40">
    <g>
      {/* Магнитные точки */}
      <circle cx="10" cy="20" r="6" fill="currentColor"/>
      <circle cx="90" cy="20" r="6" fill="currentColor"/>

      {/* Соединительные линии */}
      <line x1="10" y1="20" x2="25" y2="20" stroke="currentColor" strokeWidth="2"/>
      <line x1="75" y1="20" x2="90" y2="20" stroke="currentColor" strokeWidth="2"/>

      {/* Контакты переключателя */}
      <circle cx="25" cy="20" r="2" fill="currentColor"/>
      <circle cx="75" cy="20" r="2" fill="currentColor"/>

      {/* Переключатель */}
      <line 
        x1="25" 
        y1="20" 
        x2={isOpen ? "65" : "75"} 
        y2={isOpen ? "12" : "20"} 
        stroke="currentColor" 
        strokeWidth="3"
        strokeLinecap="round"
      />
    </g>
  </SvgIcon>
)

export default SwitchMagneticSymbol