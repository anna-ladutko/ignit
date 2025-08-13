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

        {/* Typography Demo */}
        <MobilePanel title="Typography Variants">
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Typography variant="electronicTitle">
              Electronic Title
            </Typography>
            <Typography variant="componentLabel">
              Component Label Text
            </Typography>
            <Typography variant="componentValue">
              Component Value: 470Ω
            </Typography>
            <Typography variant="energyValue">
              Energy: 12.5 EU
            </Typography>
            <Typography variant="circuitInfo">
              Circuit information text with normal styling and proper line height for readability.
            </Typography>
            <Typography variant="mobileButton">
              Mobile Button Text
            </Typography>
          </Box>
        </MobilePanel>

        {/* Color Palette Demo */}
        <MobilePanel title="Electronic Color Palette">
          <Typography variant="componentLabel" sx={{ mb: 2 }}>
            Component Colors:
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 3 }}>
            {[
              ['Resistor', 'components.resistor.main'],
              ['Capacitor', 'components.capacitor.main'],
              ['Inductor', 'components.inductor.main'],
              ['LED', 'components.led.main'],
              ['Source', 'components.source.main'],
              ['Switch', 'components.switch.main'],
              ['Ground', 'components.ground.main'],
            ].map(([name, path]) => (
              <Box key={name} sx={{ textAlign: 'center' }}>
                <Box 
                  sx={{ 
                    width: 40, 
                    height: 40, 
                    backgroundColor: (theme) => {
                      const parts = path.split('.')
                      return (theme.palette as any)[parts[0]][parts[1]][parts[2]]
                    },
                    borderRadius: 2,
                    mb: 1,
                    border: '1px solid rgba(255,255,255,0.2)',
                  }} 
                />
                <Typography variant="componentValue">
                  {name}
                </Typography>
              </Box>
            ))}
          </Box>

          <Typography variant="componentLabel" sx={{ mb: 2 }}>
            Circuit Colors:
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
            {[
              ['Wire', 'circuit.wire'],
              ['Wire Active', 'circuit.wireActive'],
              ['Wire Error', 'circuit.wireError'],
              ['Selection', 'circuit.selection'],
              ['Grid', 'circuit.grid'],
            ].map(([name, path]) => (
              <Box key={name} sx={{ textAlign: 'center' }}>
                <Box 
                  sx={{ 
                    width: 40, 
                    height: 40, 
                    backgroundColor: (theme) => {
                      const parts = path.split('.')
                      return (theme.palette as any)[parts[0]][parts[1]]
                    },
                    borderRadius: 2,
                    mb: 1,
                    border: '1px solid rgba(255,255,255,0.2)',
                  }} 
                />
                <Typography variant="componentValue">
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