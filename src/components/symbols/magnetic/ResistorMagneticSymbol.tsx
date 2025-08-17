import React from 'react'
import { SvgIcon, type SvgIconProps } from '@mui/material'

export const ResistorMagneticSymbol: React.FC<SvgIconProps> = (props) => (
  <SvgIcon {...props} viewBox="0 0 100 40">
    <g>
      {/* Обновленный дизайн резистора v03 */}
      <path d="M10 22C11.1046 22 12 21.1046 12 20C12 18.8954 11.1046 18 10 18C8.89543 18 8 18.8954 8 20C8 21.1046 8.89543 22 10 22Z" fill="currentColor"/>
      <path d="M90 22C91.1046 22 92 21.1046 92 20C92 18.8954 91.1046 18 90 18C88.8954 18 88 18.8954 88 20C88 21.1046 88.8954 22 90 22Z" fill="currentColor"/>
      <path d="M10 20H25" stroke="currentColor" strokeWidth="2"/>
      <path d="M76 20H90.5" stroke="currentColor" strokeWidth="2"/>
      <rect x="26" y="13" width="48" height="14" stroke="currentColor" strokeWidth="4" strokeLinejoin="round" fill="none"/>
    </g>
  </SvgIcon>
)

export default ResistorMagneticSymbol