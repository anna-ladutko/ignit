import React from 'react'
import { SvgIcon, type SvgIconProps } from '@mui/material'

export const InductorMagneticSymbol: React.FC<SvgIconProps> = (props) => (
  <SvgIcon {...props} viewBox="0 0 100 40">
    <g>
      {/* Обновленный дизайн индуктора v03 */}
      <circle cx="10" cy="20" r="2" fill="currentColor"/>
      <circle cx="90" cy="20" r="2" fill="currentColor"/>
      <path d="M24.2396 21C24.7919 21 25.2396 20.5523 25.2396 20C25.2396 19.4477 24.7919 19 24.2396 19L24.2396 20L24.2396 21ZM73.1981 19C72.6459 19 72.1981 19.4477 72.1981 20C72.1981 20.5523 72.6459 21 73.1981 21L73.1981 20L73.1981 19ZM10.5 20L10.5 21L24.2396 21L24.2396 20L24.2396 19L10.5 19L10.5 20ZM73.1981 20L73.1981 21L91 21L91 20L91 19L73.1981 19L73.1981 20Z" fill="currentColor"/>
      <path d="M38 21C38 16.5817 35.3137 13 32 13C28.6863 13 26 16.5817 26 21" stroke="currentColor" strokeWidth="4" strokeLinecap="round" fill="none"/>
      <path d="M50 21C50 16.5817 47.3137 13 44 13C40.6863 13 38 16.5817 38 21" stroke="currentColor" strokeWidth="4" strokeLinecap="round" fill="none"/>
      <path d="M62 21C62 16.5817 59.3137 13 56 13C52.6863 13 50 16.5817 50 21" stroke="currentColor" strokeWidth="4" strokeLinecap="round" fill="none"/>
      <path d="M74 21C74 16.5817 71.3137 13 68 13C64.6863 13 62 16.5817 62 21" stroke="currentColor" strokeWidth="4" strokeLinecap="round" fill="none"/>
    </g>
  </SvgIcon>
)

export default InductorMagneticSymbol