import React from 'react'
import { SvgIcon, type SvgIconProps } from '@mui/material'

export const VoltageSourceMagneticSymbol: React.FC<SvgIconProps> = (props) => (
  <SvgIcon {...props} viewBox="0 0 100 40">
    <g>
      {/* Магнитные точки */}
      <circle cx="10" cy="20" r="6" fill="currentColor"/>
      <circle cx="90" cy="20" r="6" fill="currentColor"/>

      {/* Соединительные линии */}
      <line x1="10" y1="20" x2="35" y2="20" stroke="currentColor" strokeWidth="2"/>
      <line x1="65" y1="20" x2="90" y2="20" stroke="currentColor" strokeWidth="2"/>

      {/* Источник напряжения - круг с + и - */}
      <circle cx="50" cy="20" r="15" stroke="currentColor" strokeWidth="2" fill="none"/>
      
      {/* Плюс (длинная вертикальная линия) */}
      <line x1="43" y1="12" x2="43" y2="28" stroke="currentColor" strokeWidth="2"/>
      <line x1="39" y1="20" x2="47" y2="20" stroke="currentColor" strokeWidth="2"/>
      
      {/* Минус (короткая горизонтальная линия) */}
      <line x1="53" y1="20" x2="61" y2="20" stroke="currentColor" strokeWidth="2"/>
    </g>
  </SvgIcon>
)

export default VoltageSourceMagneticSymbol