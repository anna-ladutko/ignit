import React from 'react'
import { SvgIcon, type SvgIconProps } from '@mui/material'

export const VoltageSourceMagneticSymbol: React.FC<SvgIconProps> = (props) => (
  <SvgIcon {...props} viewBox="0 0 100 40">
    <g>
      {/* Обновленный дизайн источника напряжения v03 */}
      <circle cx="10" cy="20" r="2" fill="currentColor"/>
      <circle cx="90" cy="20" r="2" fill="currentColor"/>
      <path d="M9 20H34.5M64 20H89M58 17V23M42.5 17V23M39.5 20H45.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      {/* Coal-colored inner fill for voltage source circle - after icons but before stroke */}
      <circle cx="50" cy="20" r="15" fill="#202221"/>
      <circle cx="50" cy="20" r="15" stroke="currentColor" strokeWidth="4" fill="none"/>
    </g>
  </SvgIcon>
)

export default VoltageSourceMagneticSymbol