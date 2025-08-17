import React from 'react'
import { SvgIcon, type SvgIconProps } from '@mui/material'

export const LEDMagneticSymbol: React.FC<SvgIconProps> = (props) => (
  <SvgIcon {...props} viewBox="0 0 100 40">
    <g>
      {/* Обновленный дизайн LED v03 */}
      <circle cx="10" cy="20" r="2" fill="currentColor"/>
      <circle cx="90" cy="20" r="2" fill="currentColor"/>
      <path d="M38.5 21C39.0523 21 39.5 20.5523 39.5 20C39.5 19.4477 39.0523 19 38.5 19V20V21ZM59 19C58.4477 19 58 19.4477 58 20C58 20.5523 58.4477 21 59 21V20V19ZM10 20V21H38.5V20V19H10V20ZM59 20V21H90V20V19H59V20Z" fill="currentColor"/>
      <path d="M40 11V29.5" stroke="currentColor" strokeWidth="4" strokeLinecap="round" fill="none"/>
      <path d="M40 11L60 20L40 30" stroke="currentColor" strokeWidth="4" strokeLinecap="round" fill="none"/>
      <path d="M60 11V29.5" stroke="currentColor" strokeWidth="4" strokeLinecap="round" fill="none"/>
      <path d="M45.825 9.53009L48.3607 4.09225M48.3607 4.09225L45.2802 5.96593M48.3607 4.09225L48.9055 7.65641" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none"/>
      <path d="M52.1692 12.4884L54.7049 7.05056M54.7049 7.05056L51.6245 8.92425M54.7049 7.05056L55.2497 10.6147" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none"/>
    </g>
  </SvgIcon>
)

export default LEDMagneticSymbol