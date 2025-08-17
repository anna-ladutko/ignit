import React from 'react'
import { SvgIcon, type SvgIconProps } from '@mui/material'

export const CapacitorMagneticSymbol: React.FC<SvgIconProps> = (props) => (
  <SvgIcon {...props} viewBox="0 0 100 40">
    <g>
      {/* Обновленный дизайн конденсатора v03 */}
      <circle cx="10" cy="20" r="2" fill="currentColor"/>
      <circle cx="90" cy="20" r="2" fill="currentColor"/>
      <path d="M45 21C45.5523 21 46 20.5523 46 20C46 19.4477 45.5523 19 45 19V20V21ZM53 19C52.4477 19 52 19.4477 52 20C52 20.5523 52.4477 21 53 21V20V19ZM10.5 20V21H45V20V19H10.5V20ZM53 20V21H90V20V19H53V20Z" fill="currentColor"/>
      <path d="M46 11V29.5" stroke="currentColor" strokeWidth="4" strokeLinecap="round" fill="none"/>
      <path d="M54 11V29.5" stroke="currentColor" strokeWidth="4" strokeLinecap="round" fill="none"/>
    </g>
  </SvgIcon>
)

export default CapacitorMagneticSymbol