import React from 'react'
import { Box, Typography } from '@mui/material'
import { ComponentType } from '../types'
import { ComponentIcon, ComponentButton } from './electronic'
import { MobilePanel, TouchButton } from './ui'

export const ThemeDemo: React.FC = () => {
  return (
    <Box sx={{ p: 2, minHeight: '100vh' }}>
      <Typography variant="electronicTitle" sx={{ mb: 3 }}>
        IGNIT ELECTRONIC THEME DEMO
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {/* Component Icons Demo */}
        <MobilePanel title="IEEE Component Symbols" variant="primary">
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2 }}>
            {Object.values(ComponentType).map((type) => (
              <Box key={type} sx={{ textAlign: 'center' }}>
                <ComponentIcon type={type} size="large" />
                <Typography variant="componentLabel" sx={{ mt: 1, fontSize: '10px' }}>
                  {type}
                </Typography>
              </Box>
            ))}
          </Box>

          <Typography variant="componentLabel" sx={{ mb: 2 }}>
            Active States:
          </Typography>
          
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
            <ComponentIcon type={ComponentType.RESISTOR} size="medium" isActive />
            <ComponentIcon type={ComponentType.LED} size="medium" isActive />
            <ComponentIcon type={ComponentType.SWITCH} size="medium" isActive switchState />
          </Box>
        </MobilePanel>

        {/* Component Buttons Demo */}
        <MobilePanel title="Component Buttons" variant="primary">
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1 }}>
            <ComponentButton 
              type={ComponentType.RESISTOR} 
              value="470Ω" 
              count={3}
              onClick={() => console.log('Resistor clicked')}
            />
            <ComponentButton 
              type={ComponentType.CAPACITOR} 
              value="100μF" 
              count={1}
              selected
            />
            <ComponentButton 
              type={ComponentType.LED} 
              value="Red"
              count={2}
            />
            <ComponentButton 
              type={ComponentType.VOLTAGE_SOURCE} 
              value="12V"
            />
            <ComponentButton 
              type={ComponentType.SWITCH} 
              disabled
            />
            <ComponentButton 
              type={ComponentType.INDUCTOR} 
              value="10mH"
              count={0}
            />
          </Box>
        </MobilePanel>

        {/* Touch Buttons Demo */}
        <MobilePanel title="Touch Buttons" variant="accent">
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TouchButton variant="primary" fullWidth>
              Primary Action
            </TouchButton>
            <TouchButton variant="primary" fullWidth>
              Secondary Action
            </TouchButton>
            <TouchButton variant="accent" size="large">
              Accent Button
            </TouchButton>
            <TouchButton variant="danger" size="small">
              Danger Action
            </TouchButton>
          </Box>
        </MobilePanel>

        {/* Complete Typography Demo */}
        <MobilePanel title="Complete Typography System">
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            
            {/* Electronic Typography */}
            <Box>
              <Typography variant="componentLabel" sx={{ mb: 2, color: 'primary.main' }}>
                Electronic Typography Styles:
              </Typography>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, p: 2, bgcolor: 'background.paper', borderRadius: 2 }}>
                <Box>
                  <Typography variant="electronicTitle">
                    ELECTRONIC TITLE
                  </Typography>
                  <Typography variant="componentValue" sx={{ mt: 0.5, opacity: 0.7 }}>
                    24px • Montserrat Bold • Uppercase • Gradient
                  </Typography>
                </Box>
                
                <Box>
                  <Typography variant="componentLabel">
                    COMPONENT LABEL
                  </Typography>
                  <Typography variant="componentValue" sx={{ mt: 0.5, opacity: 0.7 }}>
                    12px • Montserrat Medium • Uppercase
                  </Typography>
                </Box>
                
                <Box>
                  <Typography variant="componentValue">
                    Component Value: 470Ω
                  </Typography>
                  <Typography variant="componentValue" sx={{ mt: 0.5, opacity: 0.7 }}>
                    10px • Montserrat Regular
                  </Typography>
                </Box>
                
                <Box>
                  <Typography variant="energyValue">
                    Energy: 12.5 EU
                  </Typography>
                  <Typography variant="componentValue" sx={{ mt: 0.5, opacity: 0.7 }}>
                    14px • Montserrat Semibold • Primary Color
                  </Typography>
                </Box>
                
                <Box>
                  <Typography variant="circuitInfo">
                    Circuit information text with normal styling and proper line height for readability. This text should be easy to read and understand.
                  </Typography>
                  <Typography variant="componentValue" sx={{ mt: 0.5, opacity: 0.7 }}>
                    13px • Montserrat Regular • Line Height 1.4
                  </Typography>
                </Box>
                
                <Box>
                  <Typography variant="mobileButton">
                    Mobile Button Text
                  </Typography>
                  <Typography variant="componentValue" sx={{ mt: 0.5, opacity: 0.7 }}>
                    16px • Montserrat Semibold • Capitalized
                  </Typography>
                </Box>
              </Box>
            </Box>

            {/* Standard MUI Typography for comparison */}
            <Box>
              <Typography variant="componentLabel" sx={{ mb: 2, color: 'primary.main' }}>
                Standard MUI Typography (for reference):
              </Typography>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, p: 2, bgcolor: 'circuit.boardBackground', borderRadius: 2 }}>
                <Box>
                  <Typography variant="h1" sx={{ fontSize: '2rem' }}>
                    H1 Heading
                  </Typography>
                  <Typography variant="componentValue" sx={{ mt: 0.5, opacity: 0.7 }}>
                    MUI H1 • 2rem
                  </Typography>
                </Box>
                
                <Box>
                  <Typography variant="h2" sx={{ fontSize: '1.75rem' }}>
                    H2 Heading
                  </Typography>
                  <Typography variant="componentValue" sx={{ mt: 0.5, opacity: 0.7 }}>
                    MUI H2 • 1.75rem
                  </Typography>
                </Box>
                
                <Box>
                  <Typography variant="h3" sx={{ fontSize: '1.5rem' }}>
                    H3 Heading
                  </Typography>
                  <Typography variant="componentValue" sx={{ mt: 0.5, opacity: 0.7 }}>
                    MUI H3 • 1.5rem
                  </Typography>
                </Box>
                
                <Box>
                  <Typography variant="body1">
                    Body1 text for general content. This is the default body text style.
                  </Typography>
                  <Typography variant="componentValue" sx={{ mt: 0.5, opacity: 0.7 }}>
                    MUI Body1 • 1rem
                  </Typography>
                </Box>
                
                <Box>
                  <Typography variant="body2">
                    Body2 text for secondary content or smaller descriptions.
                  </Typography>
                  <Typography variant="componentValue" sx={{ mt: 0.5, opacity: 0.7 }}>
                    MUI Body2 • 0.875rem
                  </Typography>
                </Box>
                
                <Box>
                  <Typography variant="caption">
                    Caption text for very small descriptions or metadata.
                  </Typography>
                  <Typography variant="componentValue" sx={{ mt: 0.5, opacity: 0.7 }}>
                    MUI Caption • 0.75rem
                  </Typography>
                </Box>
              </Box>
            </Box>

            {/* Typography Scale Information */}
            <Box>
              <Typography variant="componentLabel" sx={{ mb: 2, color: 'primary.main' }}>
                Typography Technical Info:
              </Typography>
              
              <Box sx={{ p: 2, bgcolor: 'background.paper', borderRadius: 2 }}>
                <Typography variant="circuitInfo" sx={{ mb: 2 }}>
                  <strong>Font Family:</strong> "Montserrat", "Arial", sans-serif
                </Typography>
                <Typography variant="circuitInfo" sx={{ mb: 2 }}>
                  <strong>Base Spacing:</strong> 4px (theme.spacing)
                </Typography>
                <Typography variant="circuitInfo" sx={{ mb: 2 }}>
                  <strong>Mobile Touch Target:</strong> 44px minimum
                </Typography>
                <Typography variant="circuitInfo">
                  <strong>Border Radius:</strong> 10px (buttons), 20px (panels)
                </Typography>
              </Box>
            </Box>

          </Box>
        </MobilePanel>

        {/* Color Palette Demo - Complete Theme Groups */}
        <MobilePanel title="Complete Theme Color Palette">
          
          {/* Main MUI Palette */}
          <Typography variant="componentLabel" sx={{ mb: 2 }}>
            Main MUI Palette:
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 3 }}>
            {[
              ['Primary Main', 'primary.main', '#F4490C'],
              ['Primary Light', 'primary.light', '#FF8000'],
              ['Primary Dark', 'primary.dark', '#00CC66'],
              ['Secondary Main', 'secondary.main', '#0088FF'],
              ['Success', 'success.main', '#00FF88'],
              ['Warning', 'warning.main', '#FFB800'],
              ['Error', 'error.main', '#FF4444'],
              ['Text Primary', 'text.primary', '#E5DFD1'],
              ['Text Secondary', 'text.secondary', '#818181'],
              ['Background Default', 'background.default', '#202221'],
              ['Background Paper', 'background.paper', 'rgba(217, 217, 217, 0.2)'],
            ].map(([name, path, hex]) => (
              <Box key={name} sx={{ textAlign: 'center', minWidth: 80 }}>
                <Box 
                  sx={{ 
                    width: 50, 
                    height: 50, 
                    backgroundColor: (theme) => {
                      const parts = path.split('.')
                      return (theme.palette as any)[parts[0]][parts[1]]
                    },
                    borderRadius: 2,
                    mb: 1,
                    border: '1px solid rgba(255,255,255,0.2)',
                    mx: 'auto'
                  }} 
                />
                <Typography variant="componentValue" sx={{ fontSize: '9px' }}>
                  {name}
                </Typography>
                <Typography variant="componentValue" sx={{ fontSize: '8px', opacity: 0.7 }}>
                  {hex}
                </Typography>
              </Box>
            ))}
          </Box>

          {/* Electronics Components Colors */}
          <Typography variant="componentLabel" sx={{ mb: 2 }}>
            Electronics Components Colors:
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 3 }}>
            {[
              ['Resistor', 'electronicsComponents.resistor.main', '#FF6B35'],
              ['Resistor Active', 'electronicsComponents.resistor.active', '#FF8555'],
              ['Capacitor', 'electronicsComponents.capacitor.main', '#4ECDC4'],
              ['Capacitor Active', 'electronicsComponents.capacitor.active', '#6EDDD6'],
              ['Inductor', 'electronicsComponents.inductor.main', '#A8E6CF'],
              ['LED', 'electronicsComponents.led.main', '#FFD93D'],
              ['Source', 'electronicsComponents.source.main', '#6C5CE7'],
              ['Switch', 'electronicsComponents.switch.main', '#A4A4A4'],
              ['Ground', 'electronicsComponents.ground.main', '#666666'],
            ].map(([name, path, hex]) => (
              <Box key={name} sx={{ textAlign: 'center', minWidth: 80 }}>
                <Box 
                  sx={{ 
                    width: 50, 
                    height: 50, 
                    backgroundColor: (theme) => {
                      const parts = path.split('.')
                      return (theme.palette as any)[parts[0]][parts[1]][parts[2]]
                    },
                    borderRadius: 2,
                    mb: 1,
                    border: '1px solid rgba(255,255,255,0.2)',
                    mx: 'auto'
                  }} 
                />
                <Typography variant="componentValue" sx={{ fontSize: '9px' }}>
                  {name}
                </Typography>
                <Typography variant="componentValue" sx={{ fontSize: '8px', opacity: 0.7 }}>
                  {hex}
                </Typography>
              </Box>
            ))}
          </Box>

          {/* Circuit Colors */}
          <Typography variant="componentLabel" sx={{ mb: 2 }}>
            Circuit Colors:
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 3 }}>
            {[
              ['Grid', 'circuit.grid', 'transparent'],
              ['Grid Active', 'circuit.gridActive', '#3A3F5A'],
              ['Selection', 'circuit.selection', '#00DDFF'],
              ['Selection Secondary', 'circuit.selectionSecondary', '#0088FF'],
              ['Board Background', 'circuit.boardBackground', '#343635'],
            ].map(([name, path, hex]) => (
              <Box key={name} sx={{ textAlign: 'center', minWidth: 80 }}>
                <Box 
                  sx={{ 
                    width: 50, 
                    height: 50, 
                    backgroundColor: (theme) => {
                      const parts = path.split('.')
                      return (theme.palette as any)[parts[0]][parts[1]]
                    },
                    borderRadius: 2,
                    mb: 1,
                    border: '1px solid rgba(255,255,255,0.2)',
                    mx: 'auto'
                  }} 
                />
                <Typography variant="componentValue" sx={{ fontSize: '9px' }}>
                  {name}
                </Typography>
                <Typography variant="componentValue" sx={{ fontSize: '8px', opacity: 0.7 }}>
                  {hex}
                </Typography>
              </Box>
            ))}
          </Box>

          {/* Simulation Colors */}
          <Typography variant="componentLabel" sx={{ mb: 2 }}>
            Simulation Animation Colors:
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 3 }}>
            {[
              ['Energy Flow', 'simulation.energyFlow', '#00FF88'],
              ['Energy Flow High', 'simulation.energyFlowHigh', '#88FF00'],
              ['Energy Flow Low', 'simulation.energyFlowLow', '#00FFAA'],
              ['High Voltage', 'simulation.highVoltage', '#FF4444'],
              ['Low Voltage', 'simulation.lowVoltage', '#4ECDC4'],
              ['Success', 'simulation.success', '#00FF88'],
              ['Error', 'simulation.error', '#FF4444'],
              ['Warning', 'simulation.warning', '#FFB800'],
            ].map(([name, path, hex]) => (
              <Box key={name} sx={{ textAlign: 'center', minWidth: 80 }}>
                <Box 
                  sx={{ 
                    width: 50, 
                    height: 50, 
                    backgroundColor: (theme) => {
                      const parts = path.split('.')
                      return (theme.palette as any)[parts[0]][parts[1]]
                    },
                    borderRadius: 2,
                    mb: 1,
                    border: '1px solid rgba(255,255,255,0.2)',
                    mx: 'auto'
                  }} 
                />
                <Typography variant="componentValue" sx={{ fontSize: '9px' }}>
                  {name}
                </Typography>
                <Typography variant="componentValue" sx={{ fontSize: '8px', opacity: 0.7 }}>
                  {hex}
                </Typography>
              </Box>
            ))}
          </Box>

          {/* Custom Colors */}
          <Typography variant="componentLabel" sx={{ mb: 2 }}>
            Custom UI Colors:
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 3 }}>
            {[
              ['UI Text Secondary', 'customColors.uiTextSecondary', '#B0B8CC'],
              ['UI Text Secondary Dark', 'customColors.uiTextSecondaryDark', '#8090A4'],
              ['UI Text for White Bg', 'customColors.uiTextForWhiteBg', '#1A1F3A'],
              ['UI Text Light', 'customColors.uiTextLight', '#E5DFD1'],
              ['UI Icon', 'customColors.uiIcon', '#B0B8CC'],
              ['Border Transparent', 'customColors.borderTransparent', 'rgba(0, 255, 136, 0.2)'],
            ].map(([name, path, hex]) => (
              <Box key={name} sx={{ textAlign: 'center', minWidth: 80 }}>
                <Box 
                  sx={{ 
                    width: 50, 
                    height: 50, 
                    backgroundColor: (theme) => {
                      const parts = path.split('.')
                      return (theme.palette as any)[parts[0]][parts[1]]
                    },
                    borderRadius: 2,
                    mb: 1,
                    border: '1px solid rgba(255,255,255,0.2)',
                    mx: 'auto'
                  }} 
                />
                <Typography variant="componentValue" sx={{ fontSize: '9px' }}>
                  {name}
                </Typography>
                <Typography variant="componentValue" sx={{ fontSize: '8px', opacity: 0.7 }}>
                  {hex}
                </Typography>
              </Box>
            ))}
          </Box>

          {/* Gradients Demo */}
          <Typography variant="componentLabel" sx={{ mb: 2 }}>
            Theme Gradients:
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
            {[
              ['Background Primary', 'backgroundPrimary'],
              ['Background Secondary', 'backgroundSecondary'],
              ['Background Accent', 'backgroundAccent'],
              ['Background Transparent', 'backgroundTransparent'],
              ['Accent Gradient', 'accentGradient'],
            ].map(([name, gradientKey]) => (
              <Box key={name} sx={{ textAlign: 'center', minWidth: 120 }}>
                <Box 
                  sx={{ 
                    width: 80, 
                    height: 50, 
                    background: (theme) => (theme.palette as any).gradients[gradientKey],
                    borderRadius: 2,
                    mb: 1,
                    border: '1px solid rgba(255,255,255,0.2)',
                    mx: 'auto'
                  }} 
                />
                <Typography variant="componentValue" sx={{ fontSize: '9px' }}>
                  {name}
                </Typography>
              </Box>
            ))}
          </Box>
        </MobilePanel>
      </Box>
    </Box>
  )
}