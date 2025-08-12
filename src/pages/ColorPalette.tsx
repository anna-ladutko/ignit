import React from 'react'
import { Box, Typography, Paper, Grid, useTheme, Divider } from '@mui/material'
import { motion } from 'framer-motion'

const ColorPalette: React.FC = () => {
  const theme = useTheme()

  const ColorCard = ({ 
    title, 
    color, 
    description 
  }: { 
    title: string
    color: string
    description?: string 
  }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Paper
        sx={{
          p: 2,
          textAlign: 'center',
          background: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        }}
      >
        <Box
          sx={{
            width: 80,
            height: 80,
            backgroundColor: color,
            borderRadius: 1,
            mx: 'auto',
            mb: 1,
            border: '2px solid rgba(255, 255, 255, 0.2)',
            boxShadow: `0 4px 12px ${color}40`,
          }}
        />
        <Typography variant="componentLabel" sx={{ fontSize: '10px', mb: 0.5 }}>
          {title}
        </Typography>
        <Typography variant="body2" sx={{ fontSize: '9px', opacity: 0.7, fontFamily: 'monospace' }}>
          {color}
        </Typography>
        {description && (
          <Typography variant="caption" sx={{ fontSize: '8px', opacity: 0.6, mt: 0.5, display: 'block' }}>
            {description}
          </Typography>
        )}
      </Paper>
    </motion.div>
  )

  const GradientCard = ({ 
    title, 
    gradient, 
    description 
  }: { 
    title: string
    gradient: string
    description?: string 
  }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Paper
        sx={{
          p: 2,
          textAlign: 'center',
          background: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        }}
      >
        <Box
          sx={{
            width: 120,
            height: 60,
            background: gradient,
            borderRadius: 1,
            mx: 'auto',
            mb: 1,
            border: '2px solid rgba(255, 255, 255, 0.2)',
          }}
        />
        <Typography variant="componentLabel" sx={{ fontSize: '10px', mb: 0.5 }}>
          {title}
        </Typography>
        <Typography variant="body2" sx={{ 
          fontSize: '8px', 
          opacity: 0.7, 
          fontFamily: 'monospace',
          wordBreak: 'break-all',
          maxWidth: '120px',
          mx: 'auto'
        }}>
          {gradient.length > 40 ? `${gradient.substring(0, 40)}...` : gradient}
        </Typography>
        {description && (
          <Typography variant="caption" sx={{ fontSize: '8px', opacity: 0.6, mt: 0.5, display: 'block' }}>
            {description}
          </Typography>
        )}
      </Paper>
    </motion.div>
  )

  const ShadowCard = ({ 
    title, 
    shadow, 
    description 
  }: { 
    title: string
    shadow: string
    description?: string 
  }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Paper
        sx={{
          p: 2,
          textAlign: 'center',
          background: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        }}
      >
        <Box
          sx={{
            width: 80,
            height: 80,
            backgroundColor: theme.palette.electronic.surface,
            borderRadius: 1,
            mx: 'auto',
            mb: 1,
            border: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: shadow,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Typography variant="caption" sx={{ fontSize: '8px', opacity: 0.8 }}>
            SHADOW
          </Typography>
        </Box>
        <Typography variant="componentLabel" sx={{ fontSize: '10px', mb: 0.5 }}>
          {title}
        </Typography>
        <Typography variant="body2" sx={{ 
          fontSize: '8px', 
          opacity: 0.7, 
          fontFamily: 'monospace',
          wordBreak: 'break-all',
          maxWidth: '120px',
          mx: 'auto'
        }}>
          {shadow.length > 30 ? `${shadow.substring(0, 30)}...` : shadow}
        </Typography>
        {description && (
          <Typography variant="caption" sx={{ fontSize: '8px', opacity: 0.6, mt: 0.5, display: 'block' }}>
            {description}
          </Typography>
        )}
      </Paper>
    </motion.div>
  )

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: theme.palette.gradients.backgroundPrimary,
        p: 3,
        overflowY: 'auto',
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Typography 
          variant="electronicTitle" 
          sx={{ 
            textAlign: 'center', 
            mb: 4,
            background: theme.palette.gradients.accentGradient,
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          🎨 Electronic Theme Palette Showcase
        </Typography>
      </motion.div>

      {/* Electronic Colors */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" sx={{ mb: 2, color: theme.palette.electronic.primary }}>
          ⚡ Electronic Colors
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={6} sm={4} md={2}>
            <ColorCard title="Background" color={theme.palette.electronic.background} />
          </Grid>
          <Grid item xs={6} sm={4} md={2}>
            <ColorCard title="Surface" color={theme.palette.electronic.surface} />
          </Grid>
          <Grid item xs={6} sm={4} md={2}>
            <ColorCard title="Primary" color={theme.palette.electronic.primary} />
          </Grid>
          <Grid item xs={6} sm={4} md={2}>
            <ColorCard title="Secondary" color={theme.palette.electronic.secondary} />
          </Grid>
          <Grid item xs={6} sm={4} md={2}>
            <ColorCard title="Warning" color={theme.palette.electronic.warning} />
          </Grid>
          <Grid item xs={6} sm={4} md={2}>
            <ColorCard title="Error" color={theme.palette.electronic.error} />
          </Grid>
        </Grid>
      </Box>

      <Divider sx={{ my: 3, opacity: 0.3 }} />

      {/* Component Colors */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" sx={{ mb: 2, color: theme.palette.electronic.primary }}>
          🔧 Component Colors
        </Typography>
        <Grid container spacing={2}>
          {Object.entries(theme.palette.components).map(([componentType, colors]) => (
            <React.Fragment key={componentType}>
              <Grid item xs={12} sm={6} md={4}>
                <Typography variant="h6" sx={{ mb: 1, fontSize: '14px', textTransform: 'capitalize' }}>
                  {componentType}
                </Typography>
                <Grid container spacing={1}>
                  <Grid item xs={4}>
                    <ColorCard title="Main" color={colors.main} />
                  </Grid>
                  <Grid item xs={4}>
                    <ColorCard title="Active" color={colors.active} />
                  </Grid>
                  <Grid item xs={4}>
                    <ColorCard title="Disabled" color={colors.disabled} />
                  </Grid>
                </Grid>
              </Grid>
            </React.Fragment>
          ))}
        </Grid>
      </Box>

      <Divider sx={{ my: 3, opacity: 0.3 }} />

      {/* Circuit Colors */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" sx={{ mb: 2, color: theme.palette.electronic.primary }}>
          🔌 Circuit Colors
        </Typography>
        <Grid container spacing={2}>
          {Object.entries(theme.palette.circuit).map(([key, color]) => (
            <Grid item xs={6} sm={4} md={3} key={key}>
              <ColorCard 
                title={key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())} 
                color={color} 
              />
            </Grid>
          ))}
        </Grid>
      </Box>

      <Divider sx={{ my: 3, opacity: 0.3 }} />

      {/* Simulation Colors */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" sx={{ mb: 2, color: theme.palette.electronic.primary }}>
          ⚡ Simulation Colors
        </Typography>
        <Grid container spacing={2}>
          {Object.entries(theme.palette.simulation).map(([key, color]) => (
            <Grid item xs={6} sm={4} md={3} key={key}>
              <ColorCard 
                title={key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())} 
                color={color} 
              />
            </Grid>
          ))}
        </Grid>
      </Box>

      <Divider sx={{ my: 3, opacity: 0.3 }} />

      {/* Gradients */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" sx={{ mb: 2, color: theme.palette.electronic.primary }}>
          🌈 Gradients
        </Typography>
        <Grid container spacing={2}>
          {Object.entries(theme.palette.gradients).map(([key, gradient]) => (
            <Grid item xs={12} sm={6} md={4} key={key}>
              <GradientCard 
                title={key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())} 
                gradient={gradient} 
              />
            </Grid>
          ))}
        </Grid>
      </Box>

      <Divider sx={{ my: 3, opacity: 0.3 }} />

      {/* Custom Colors */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" sx={{ mb: 2, color: theme.palette.electronic.primary }}>
          🎨 Custom Colors
        </Typography>
        <Grid container spacing={2}>
          {Object.entries(theme.palette.customColors).map(([key, color]) => (
            <Grid item xs={6} sm={4} md={3} key={key}>
              <ColorCard 
                title={key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())} 
                color={color} 
              />
            </Grid>
          ))}
        </Grid>
      </Box>

      <Divider sx={{ my: 3, opacity: 0.3 }} />

      {/* Custom Shadows */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" sx={{ mb: 2, color: theme.palette.electronic.primary }}>
          🌟 Custom Shadows
        </Typography>
        <Grid container spacing={2}>
          {Object.entries(theme.palette.customShadows).map(([key, shadow]) => (
            <Grid item xs={6} sm={4} md={3} key={key}>
              <ShadowCard 
                title={key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())} 
                shadow={shadow} 
              />
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Instructions */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
      >
        <Paper
          sx={{
            p: 3,
            mt: 4,
            background: 'rgba(255, 255, 255, 0.02)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          }}
        >
          <Typography variant="h6" sx={{ mb: 2, color: theme.palette.electronic.primary }}>
            📝 Instructions
          </Typography>
          <Typography variant="body2" sx={{ mb: 1, opacity: 0.8 }}>
            • This showcase displays all colors, gradients, and effects from the Electronic Theme Palette
          </Typography>
          <Typography variant="body2" sx={{ mb: 1, opacity: 0.8 }}>
            • Colors are grouped by category: Electronic, Components, Circuit, Simulation
          </Typography>
          <Typography variant="body2" sx={{ mb: 1, opacity: 0.8 }}>
            • Each color shows its hex value and visual representation
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.8 }}>
            • Use this page to manually adjust palette colors in theme-ignit-electronic.ts
          </Typography>
        </Paper>
      </motion.div>
    </Box>
  )
}

export default ColorPalette