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
            borderRadius: 2,
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
            borderRadius: 2,
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
            backgroundColor: theme.palette.background.paper,
            borderRadius: 2,
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
        background: (theme.palette as any).semantic?.gradients?.background || theme.palette.background.default,
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
            background: (theme.palette as any).semantic?.gradients?.primary || `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,

            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          🎨 Electronic Theme Palette Showcase
        </Typography>
      </motion.div>

      {/* MUI Theme Colors */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" sx={{ mb: 2, color: theme.palette.primary.main }}>
          ⚡ MUI Theme Colors
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={6} sm={4} md={2}>
            <ColorCard title="Background" color={theme.palette.background.default} />
          </Grid>
          <Grid item xs={6} sm={4} md={2}>
            <ColorCard title="Surface" color={theme.palette.background.paper} />
          </Grid>
          <Grid item xs={6} sm={4} md={2}>
            <ColorCard title="Primary" color={theme.palette.primary.main} />
          </Grid>
          <Grid item xs={6} sm={4} md={2}>
            <ColorCard title="Secondary" color={theme.palette.secondary.main} />
          </Grid>
          <Grid item xs={6} sm={4} md={2}>
            <ColorCard title="Warning" color={theme.palette.warning.main} />
          </Grid>
          <Grid item xs={6} sm={4} md={2}>
            <ColorCard title="Error" color={theme.palette.error.main} />
          </Grid>
        </Grid>
      </Box>

      <Divider sx={{ my: 3, opacity: 0.3 }} />

      {/* Semantic Colors */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" sx={{ mb: 2, color: theme.palette.primary.main }}>
          🎨 Semantic Color Tokens
        </Typography>
        <Grid container spacing={2}>
          {(theme.palette as any).semantic && Object.entries((theme.palette as any).semantic.surfaces).map(([key, color]) => (
            <Grid item xs={6} sm={4} md={3} key={key}>
              <ColorCard 
                title={`Surface: ${key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}`} 
                color={color as string}
                description="Surface colors" 
              />
            </Grid>
          ))}
          {(theme.palette as any).semantic && Object.entries((theme.palette as any).semantic.interactive).map(([key, color]) => (
            <Grid item xs={6} sm={4} md={3} key={key}>
              <ColorCard 
                title={`Interactive: ${key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}`} 
                color={color as string}
                description="Interactive elements" 
              />
            </Grid>
          ))}
        </Grid>
      </Box>

      <Divider sx={{ my: 3, opacity: 0.3 }} />

      {/* Component Tokens */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" sx={{ mb: 2, color: theme.palette.primary.main }}>
          🔧 Component Tokens
        </Typography>
        <Grid container spacing={2}>
          {(theme.palette as any).components && Object.entries((theme.palette as any).components.electronics).map(([key, color]) => (
            <Grid item xs={6} sm={4} md={3} key={key}>
              <ColorCard 
                title={key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())} 
                color={color as string}
                description="Electronic components" 
              />
            </Grid>
          ))}
        </Grid>
      </Box>

      <Divider sx={{ my: 3, opacity: 0.3 }} />

      {/* Game Colors */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" sx={{ mb: 2, color: theme.palette.primary.main }}>
          🎮 Game Colors
        </Typography>
        <Grid container spacing={2}>
          {(theme.palette as any).semantic && Object.entries((theme.palette as any).semantic.game).map(([key, color]) => (
            <Grid item xs={6} sm={4} md={3} key={key}>
              <ColorCard 
                title={key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())} 
                color={color as string}
                description="Game-specific colors" 
              />
            </Grid>
          ))}
        </Grid>
      </Box>

      <Divider sx={{ my: 3, opacity: 0.3 }} />

      {/* Gradients */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" sx={{ mb: 2, color: theme.palette.primary.main }}>
          🌈 Gradients
        </Typography>
        <Grid container spacing={2}>
          {(theme.palette as any).semantic && Object.entries((theme.palette as any).semantic.gradients).map(([key, gradient]) => (
            <Grid item xs={12} sm={6} md={4} key={key}>
              <GradientCard 
                title={key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())} 
                gradient={gradient as string} 
              />
            </Grid>
          ))}
        </Grid>
      </Box>

      <Divider sx={{ my: 3, opacity: 0.3 }} />

      {/* Feedback Colors */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" sx={{ mb: 2, color: theme.palette.primary.main }}>
          💬 Feedback Colors
        </Typography>
        <Grid container spacing={2}>
          {(theme.palette as any).semantic && Object.entries((theme.palette as any).semantic.feedback).map(([key, color]) => (
            <Grid item xs={6} sm={4} md={3} key={key}>
              <ColorCard 
                title={key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())} 
                color={color as string}
                description="User feedback colors" 
              />
            </Grid>
          ))}
        </Grid>
      </Box>

      <Divider sx={{ my: 3, opacity: 0.3 }} />

      {/* Typography Demo */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" sx={{ mb: 2, color: theme.palette.primary.main }}>
          📝 Typography System
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <Paper sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="h1" sx={{ mb: 1 }}>
                Title
              </Typography>
              <Typography variant="caption">
                H1 - Ignit Fire Theme
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Paper sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="button" sx={{ mb: 1, display: 'block' }}>
                Button Text
              </Typography>
              <Typography variant="caption">
                Button Typography
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Paper sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="body1" sx={{ mb: 1 }}>
                Body Text
              </Typography>
              <Typography variant="caption">
                Body1 Typography
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Paper sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="body2" sx={{ mb: 1 }}>
                Small Text
              </Typography>
              <Typography variant="caption">
                Body2 Typography
              </Typography>
            </Paper>
          </Grid>
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
          <Typography variant="h6" sx={{ mb: 2, color: theme.palette.primary.main }}>
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
            • Use this page to manually adjust palette colors in semantic-theme-system.ts
          </Typography>
        </Paper>
      </motion.div>
    </Box>
  )
}

export default ColorPalette