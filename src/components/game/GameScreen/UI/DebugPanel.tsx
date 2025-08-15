import React, { useState, useEffect } from 'react'
import { Box, Typography, Paper, Collapse, IconButton } from '@mui/material'
import { BugReport as BugIcon, ExpandMore as ExpandMoreIcon, ExpandLess as ExpandLessIcon } from '@mui/icons-material'
import { motion } from 'framer-motion'
import { BORDER_RADIUS } from '../../../../constants/design'

interface DebugPanelProps {
  isVisible?: boolean
}

export const DebugPanel: React.FC<DebugPanelProps> = ({ isVisible = true }) => {
  const [debugData, setDebugData] = useState<any>(null)
  const [isExpanded, setIsExpanded] = useState(true)

  // Polling для обновления debug данных из window.debugEfficiency
  useEffect(() => {
    const interval = setInterval(() => {
      if (window.debugEfficiency) {
        setDebugData({ ...window.debugEfficiency })
      }
    }, 2000) // УМЕНЬШЕНО: Обновляем каждые 2 секунды для стабильности

    return () => clearInterval(interval)
  }, [])

  if (!isVisible || !debugData) {
    return null
  }

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 16,
        right: 16,
        zIndex: 2000,
        maxWidth: '300px',
      }}
    >
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Paper
          elevation={8}
          sx={{
            backgroundColor: 'rgba(0, 0, 0, 0.85)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: BORDER_RADIUS.PANEL,
            overflow: 'hidden',
          }}
        >
          {/* Header */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              p: 1.5,
              borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <BugIcon sx={{ fontSize: '16px', color: '#4ECDC4' }} />
              <Typography
                variant="componentLabel"
                sx={{
                  fontSize: '12px',
                  fontWeight: 600,
                  color: '#4ECDC4',
                }}
              >
                Debug: Efficiency Formula
              </Typography>
            </Box>
            
            <IconButton
              size="small"
              onClick={() => setIsExpanded(!isExpanded)}
              sx={{
                color: 'rgba(255, 255, 255, 0.7)',
                '&:hover': { color: '#4ECDC4' },
              }}
            >
              {isExpanded ? <ExpandLessIcon fontSize="small" /> : <ExpandMoreIcon fontSize="small" />}
            </IconButton>
          </Box>

          {/* Content */}
          <Collapse in={isExpanded}>
            <Box sx={{ p: 1.5, fontFamily: 'monospace' }}>
              {/* Source Energy */}
              <Box sx={{ mb: 1 }}>
                <Typography variant="body2" sx={{ fontSize: '11px', color: 'rgba(255, 255, 255, 0.6)' }}>
                  Source Output:
                </Typography>
                <Typography variant="body2" sx={{ fontSize: '12px', color: '#FFEAA7', fontWeight: 600 }}>
                  {debugData.sourceEnergyOutput?.toFixed(1)} EU
                </Typography>
              </Box>

              {/* Target Results */}
              <Box sx={{ mb: 1 }}>
                <Typography variant="body2" sx={{ fontSize: '11px', color: 'rgba(255, 255, 255, 0.6)', mb: 0.5 }}>
                  Targets:
                </Typography>
                {debugData.targetResults?.map((target: any, index: number) => (
                  <Box key={target.targetId} sx={{ mb: 0.5, pl: 1 }}>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        fontSize: '11px', 
                        color: !target.isConnected ? '#FF4444' : 
                               target.isInSweetSpot ? '#96CEB4' : '#FF6B6B',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 0.5
                      }}
                    >
                      <span>Target {index + 1}:</span>
                      {!target.isConnected ? (
                        <>
                          <span style={{ fontWeight: 600, color: '#FF4444' }}>DISCONNECTED</span>
                          <span>❌</span>
                        </>
                      ) : (
                        <>
                          <span style={{ fontWeight: 600 }}>{target.deliveredEnergy?.toFixed(1)} EU</span>
                          <span style={{ fontSize: '10px' }}>
                            ({target.energyRange?.[0]}-{target.energyRange?.[1]})
                          </span>
                          {target.isInSweetSpot ? '✓' : '✗'}
                        </>
                      )}
                    </Typography>
                  </Box>
                ))}
              </Box>

              {/* Total Useful Energy */}
              <Box sx={{ mb: 1 }}>
                <Typography variant="body2" sx={{ fontSize: '11px', color: 'rgba(255, 255, 255, 0.6)' }}>
                  Total Useful Energy:
                </Typography>
                <Typography variant="body2" sx={{ fontSize: '12px', color: '#96CEB4', fontWeight: 600 }}>
                  {debugData.totalUsefulEnergy?.toFixed(1)} EU
                </Typography>
              </Box>

              {/* Calculated Efficiency */}
              <Box sx={{ mb: 1 }}>
                <Typography variant="body2" sx={{ fontSize: '11px', color: 'rgba(255, 255, 255, 0.6)' }}>
                  Calculated Efficiency:
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    fontSize: '14px', 
                    color: debugData.efficiency > 50 ? '#96CEB4' : '#FF6B6B',
                    fontWeight: 700 
                  }}
                >
                  {debugData.efficiency?.toFixed(1)}%
                </Typography>
              </Box>

              {/* Expected vs Actual */}
              <Box sx={{ pt: 1, borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
                <Typography variant="body2" sx={{ fontSize: '11px', color: 'rgba(255, 255, 255, 0.6)' }}>
                  Expected (from level):
                </Typography>
                <Typography variant="body2" sx={{ fontSize: '12px', color: '#DDA0DD', fontWeight: 600 }}>
                  {debugData.expectedScore?.toFixed(1)}%
                </Typography>
                
                {debugData.expectedScore > 0 && (
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      fontSize: '10px', 
                      color: 'rgba(255, 255, 255, 0.5)',
                      mt: 0.5
                    }}
                  >
                    Diff: {(debugData.efficiency - debugData.expectedScore).toFixed(1)}%
                  </Typography>
                )}
              </Box>
            </Box>
          </Collapse>
        </Paper>
      </motion.div>
    </Box>
  )
}

export default DebugPanel

// Добавляем типы для window.debugEfficiency
declare global {
  interface Window {
    debugEfficiency?: {
      sourceEnergyOutput: number
      totalUsefulEnergy: number
      efficiency: number
      targetResults: Array<{
        targetId: string
        deliveredEnergy: number
        energyRange: [number, number]
        isInSweetSpot: boolean
        usefulEnergy: number
        isConnected: boolean
      }>
      expectedScore: number
    }
  }
}