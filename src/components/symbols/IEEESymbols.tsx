import React from 'react'
import { SvgIcon, type SvgIconProps } from '@mui/material'

// IEEE Standard Resistor Symbol
export const ResistorSymbol: React.FC<SvgIconProps> = (props) => (
  <SvgIcon {...props} viewBox="0 0 100 24">
    <g stroke="currentColor" fill="none" strokeWidth="2" strokeLinecap="round">
      {/* Left lead */}
      <line x1="0" y1="12" x2="15" y2="12" />
      {/* Zigzag pattern */}
      <polyline points="15,12 20,6 25,18 30,6 35,18 40,6 45,18 50,6 55,18 60,6 65,18 70,6 75,18 80,6 85,12" />
      {/* Right lead */}
      <line x1="85" y1="12" x2="100" y2="12" />
    </g>
  </SvgIcon>
)

// IEEE Standard Capacitor Symbol 
export const CapacitorSymbol: React.FC<SvgIconProps> = (props) => (
  <SvgIcon {...props} viewBox="0 0 100 24">
    <g stroke="currentColor" fill="none" strokeWidth="2" strokeLinecap="round">
      {/* Left lead */}
      <line x1="0" y1="12" x2="35" y2="12" />
      {/* Left plate */}
      <line x1="35" y1="4" x2="35" y2="20" />
      {/* Right plate */}
      <line x1="45" y1="4" x2="45" y2="20" />
      {/* Right lead */}
      <line x1="45" y1="12" x2="80" y2="12" />
    </g>
  </SvgIcon>
)

// IEEE Standard Inductor Symbol
export const InductorSymbol: React.FC<SvgIconProps> = (props) => (
  <SvgIcon {...props} viewBox="0 0 100 24">
    <g stroke="currentColor" fill="none" strokeWidth="2" strokeLinecap="round">
      {/* Left lead */}
      <line x1="0" y1="12" x2="15" y2="12" />
      {/* Coil loops */}
      <path d="M15,12 Q20,4 25,12 Q30,4 35,12 Q40,4 45,12 Q50,4 55,12 Q60,4 65,12 Q70,4 75,12 Q80,4 85,12" />
      {/* Right lead */}
      <line x1="85" y1="12" x2="100" y2="12" />
    </g>
  </SvgIcon>
)

// IEEE Standard LED Symbol
export const LEDSymbol: React.FC<SvgIconProps> = (props) => (
  <SvgIcon {...props} viewBox="0 0 100 24">
    <g stroke="currentColor" fill="none" strokeWidth="2">
      {/* Left lead */}
      <line x1="0" y1="12" x2="30" y2="12" />
      {/* Diode triangle */}
      <polygon points="30,12 45,6 45,18" fill="none" />
      {/* Cathode line */}
      <line x1="45" y1="6" x2="45" y2="18" />
      {/* Right lead */}
      <line x1="45" y1="12" x2="75" y2="12" />
      {/* Light rays */}
      <g stroke="currentColor" strokeWidth="1.5">
        <line x1="52" y1="8" x2="60" y2="4" />
        <line x1="58" y1="4" x2="60" y2="4" />
        <line x1="60" y1="4" x2="60" y2="6" />
        <line x1="56" y1="6" x2="64" y2="2" />
        <line x1="62" y1="2" x2="64" y2="2" />
        <line x1="64" y1="2" x2="64" y2="4" />
      </g>
    </g>
  </SvgIcon>
)

// IEEE Standard DC Voltage Source Symbol
export const VoltageSourceSymbol: React.FC<SvgIconProps> = (props) => (
  <SvgIcon {...props} viewBox="0 0 100 24">
    <g stroke="currentColor" fill="none" strokeWidth="2">
      {/* Left lead */}
      <line x1="0" y1="12" x2="25" y2="12" />
      {/* Negative terminal (shorter line) */}
      <line x1="25" y1="8" x2="25" y2="16" />
      {/* Positive terminal (longer line) */}
      <line x1="35" y1="5" x2="35" y2="19" />
      {/* Right lead */}
      <line x1="35" y1="12" x2="60" y2="12" />
      {/* Plus sign */}
      <line x1="42" y1="12" x2="48" y2="12" strokeWidth="1.5" />
      <line x1="45" y1="9" x2="45" y2="15" strokeWidth="1.5" />
      {/* Minus sign */}
      <line x1="18" y1="12" x2="22" y2="12" strokeWidth="1.5" />
    </g>
  </SvgIcon>
)

// IEEE Standard Switch Symbol (SPST)
export const SwitchSymbol: React.FC<SvgIconProps & { isOpen?: boolean }> = ({ isOpen, ...props }) => (
  <SvgIcon {...props} viewBox="0 0 100 24">
    <g stroke="currentColor" fill="none" strokeWidth="2" strokeLinecap="round">
      {/* Left lead */}
      <line x1="0" y1="12" x2="25" y2="12" />
      {/* Left contact */}
      <circle cx="25" cy="12" r="2" fill="currentColor" />
      {/* Right contact */}
      <circle cx="75" cy="12" r="2" fill="currentColor" />
      {/* Switch blade */}
      <line 
        x1="25" 
        y1="12" 
        x2={isOpen ? "65" : "75"} 
        y2={isOpen ? "6" : "12"} 
        strokeWidth="3"
        strokeLinecap="round"
      />
      {/* Right lead */}
      <line x1="75" y1="12" x2="100" y2="12" />
    </g>
  </SvgIcon>
)

// IEEE Standard Ground Symbol
export const GroundSymbol: React.FC<SvgIconProps> = (props) => (
  <SvgIcon {...props} viewBox="0 0 100 24">
    <g stroke="currentColor" fill="none" strokeWidth="2" strokeLinecap="round">
      {/* Connection line */}
      <line x1="50" y1="0" x2="50" y2="16" />
      {/* Ground lines */}
      <line x1="30" y1="16" x2="70" y2="16" />
      <line x1="35" y1="19" x2="65" y2="19" strokeWidth="1.5" />
      <line x1="40" y1="22" x2="60" y2="22" strokeWidth="1" />
    </g>
  </SvgIcon>
)

// IEEE Standard Wire/Connection Symbol
export const WireSymbol: React.FC<SvgIconProps> = (props) => (
  <SvgIcon {...props} viewBox="0 0 100 24">
    <g stroke="currentColor" fill="none" strokeWidth="3" strokeLinecap="round">
      <line x1="0" y1="12" x2="100" y2="12" />
    </g>
  </SvgIcon>
)

// Connection Point (junction dot)
export const ConnectionPointSymbol: React.FC<SvgIconProps> = (props) => (
  <SvgIcon {...props} viewBox="0 0 24 24">
    <circle 
      cx="12" 
      cy="12" 
      r="4" 
      fill="currentColor" 
      stroke="currentColor" 
      strokeWidth="1"
    />
  </SvgIcon>
)

// Supercapacitor Symbol (double layer capacitor)
export const SupercapacitorSymbol: React.FC<SvgIconProps> = (props) => (
  <SvgIcon {...props} viewBox="0 0 100 24">
    <g stroke="currentColor" fill="none" strokeWidth="2" strokeLinecap="round">
      {/* Left lead */}
      <line x1="0" y1="12" x2="30" y2="12" />
      {/* Left plate */}
      <line x1="30" y1="4" x2="30" y2="20" />
      {/* Left curved plate */}
      <path d="M35,4 Q40,12 35,20" />
      {/* Right curved plate */}
      <path d="M45,4 Q40,12 45,20" />
      {/* Right plate */}
      <line x1="50" y1="4" x2="50" y2="20" />
      {/* Right lead */}
      <line x1="50" y1="12" x2="80" y2="12" />
      {/* Plus and minus indicators */}
      <text x="25" y="8" fontSize="8" textAnchor="middle">+</text>
      <text x="55" y="8" fontSize="8" textAnchor="middle">-</text>
    </g>
  </SvgIcon>
)