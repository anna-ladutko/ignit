import React, { useState } from 'react';
import { Box, Typography, Button, Card, Switch, FormControlLabel } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import { createSemanticTheme, primitiveTokens } from '../theme/semantic-theme-system';

// Демо компонент для тестирования семантических тем
export const SemanticThemeDemo: React.FC = () => {
  const [currentTheme, setCurrentTheme] = useState<'example' | 'ignitFire'>('example');
  
  // Создаем тему на основе выбранного ключа
  const theme = createSemanticTheme(currentTheme);
  
  const handleThemeSwitch = () => {
    setCurrentTheme(currentTheme === 'example' ? 'ignitFire' : 'example');
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ p: 3, minHeight: '100vh', bgcolor: 'background.default' }}>
        
        {/* Theme Switcher */}
        <Card sx={{ p: 3, mb: 4 }}>
          <Typography variant="h4" sx={{ mb: 2, color: 'text.primary' }}>
            🎨 SEMANTIC THEME SANDBOX
          </Typography>
          
          <FormControlLabel
            control={
              <Switch 
                checked={currentTheme === 'ignitFire'}
                onChange={handleThemeSwitch}
                color="primary"
              />
            }
            label={
              <Typography variant="body1" sx={{ color: 'text.primary' }}>
                Current Theme: <strong>{currentTheme === 'example' ? 'Example (Current)' : 'Ignit Fire (New)'}</strong>
              </Typography>
            }
          />
          
          <Typography variant="body2" sx={{ mt: 1, color: 'text.secondary' }}>
            {currentTheme === 'ignitFire' 
              ? '🔥 Настройка новой огненной темы (заполни цвета в semantic-theme-system.ts)'
              : '📘 Текущая тема проекта для сравнения'
            }
          </Typography>
        </Card>

        {/* Semantic Tokens Visualization */}
        <Card sx={{ p: 3, mb: 4 }}>
          <Typography variant="h5" sx={{ mb: 3, color: 'primary.main' }}>
            📋 Semantic Tokens Preview
          </Typography>
          
          {/* Surfaces */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" sx={{ mb: 2, color: 'text.primary' }}>
              🏠 Surfaces
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              {[
                ['Game Board', 'semantic.surfaces.gameBoard'],
                ['Component Palette', 'semantic.surfaces.componentPalette'], 
                ['UI Panel', 'semantic.surfaces.uiPanel'],
                ['Modal', 'semantic.surfaces.modal'],
              ].map(([name, path]) => (
                <Box key={name} sx={{ textAlign: 'center', minWidth: 100 }}>
                  <Box 
                    sx={{ 
                      width: 60, 
                      height: 40, 
                      backgroundColor: (theme) => {
                        const parts = path.split('.');
                        return (theme.palette as any)[parts[0]][parts[1]][parts[2]];
                      },
                      borderRadius: 1,
                      mb: 1,
                      border: '1px solid',
                      borderColor: 'text.secondary',
                      mx: 'auto'
                    }} 
                  />
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    {name}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>

          {/* Interactive Elements */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" sx={{ mb: 2, color: 'text.primary' }}>
              🎯 Interactive Elements
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              {[
                ['Primary', 'semantic.interactive.primary'],
                ['Secondary', 'semantic.interactive.secondary'],
                ['Selection', 'semantic.interactive.selection'],
                ['Hover', 'semantic.interactive.hover'],
              ].map(([name, path]) => (
                <Box key={name} sx={{ textAlign: 'center', minWidth: 100 }}>
                  <Box 
                    sx={{ 
                      width: 60, 
                      height: 40, 
                      backgroundColor: (theme) => {
                        const parts = path.split('.');
                        return (theme.palette as any)[parts[0]][parts[1]][parts[2]];
                      },
                      borderRadius: 1,
                      mb: 1,
                      border: '1px solid',
                      borderColor: 'text.secondary',
                      mx: 'auto'
                    }} 
                  />
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    {name}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>

          {/* Feedback Colors */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" sx={{ mb: 2, color: 'text.primary' }}>
              💬 Feedback States
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              {[
                ['Success', 'semantic.feedback.success'],
                ['Warning', 'semantic.feedback.warning'],
                ['Error', 'semantic.feedback.error'],
                ['Info', 'semantic.feedback.info'],
              ].map(([name, path]) => (
                <Box key={name} sx={{ textAlign: 'center', minWidth: 100 }}>
                  <Box 
                    sx={{ 
                      width: 60, 
                      height: 40, 
                      backgroundColor: (theme) => {
                        const parts = path.split('.');
                        return (theme.palette as any)[parts[0]][parts[1]][parts[2]];
                      },
                      borderRadius: 1,
                      mb: 1,
                      border: '1px solid',
                      borderColor: 'text.secondary',
                      mx: 'auto'
                    }} 
                  />
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    {name}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>
        </Card>

        {/* Component Tokens Demo */}
        <Card sx={{ p: 3, mb: 4 }}>
          <Typography variant="h5" sx={{ mb: 3, color: 'primary.main' }}>
            🧩 Component Tokens Demo
          </Typography>
          
          {/* Buttons */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" sx={{ mb: 2, color: 'text.primary' }}>
              🔘 Buttons (Using Component Tokens)
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <Button variant="contained" size="large">
                Primary Button
              </Button>
              <Button variant="outlined" size="large">
                Secondary Button
              </Button>
              <Button variant="text" size="large" sx={{ color: 'text.primary' }}>
                Text Button
              </Button>
            </Box>
          </Box>

          {/* Game Board Preview */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" sx={{ mb: 2, color: 'text.primary' }}>
              🎮 Game Board Preview
            </Typography>
            <Box 
              sx={{ 
                width: '100%',
                height: 200,
                backgroundColor: (theme) => (theme.palette as any).components.gameBoard.background,
                borderRadius: 2,
                border: '2px solid',
                borderColor: (theme) => (theme.palette as any).components.gameBoard.selection,
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Typography variant="h6" sx={{ 
                color: (theme) => (theme.palette as any).semantic.content.primary,
                textAlign: 'center'
              }}>
                Game Board Background
                <br />
                <Typography variant="caption" component="span" sx={{ 
                  color: (theme) => (theme.palette as any).semantic.content.secondary 
                }}>
                  With selection border
                </Typography>
              </Typography>
            </Box>
          </Box>

          {/* Typography System Demo */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" sx={{ mb: 2, color: 'text.primary' }}>
              📝 Typography System (Semantic + Themed)
            </Typography>
            <Box sx={{ p: 3, bgcolor: (theme) => (theme.palette as any).semantic.surfaces.uiPanel, borderRadius: 2 }}>
              
              {/* Headings */}
              <Typography variant="h1" sx={{ mb: 2, color: 'text.primary' }}>
                H1 - Large Title ({currentTheme === 'ignitFire' ? '36px Bold' : '32px Bold'})
              </Typography>
              
              <Typography variant="h2" sx={{ mb: 2, color: 'text.primary' }}>
                H2 - Medium Title
              </Typography>
              
              <Typography variant="h3" sx={{ mb: 3, color: 'text.primary' }}>
                H3 - Small Title
              </Typography>
              
              {/* Body Text */}
              <Typography variant="body1" sx={{ mb: 2, color: 'text.primary' }}>
                Body1 - Main content text ({currentTheme === 'ignitFire' ? '16px Medium' : '14px Regular'})
              </Typography>
              
              <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
                Body2 - Secondary content text ({currentTheme === 'ignitFire' ? '12px Medium' : '12px Regular'})
              </Typography>
              
              {/* Buttons */}
              <Box sx={{ display: 'flex', gap: 2, mb: 3, alignItems: 'center' }}>
                <Button variant="contained">
                  Button Text ({currentTheme === 'ignitFire' ? '18px Bold' : '16px Semibold'})
                </Button>
                
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                  Caption text for small labels
                </Typography>
              </Box>
              
              {/* Custom Typography Variants */}
              <Box sx={{ p: 2, bgcolor: 'background.paper', borderRadius: 1, mb: 2 }}>
                <Typography variant="electronicTitle" sx={{ mb: 1 }}>
                  ELECTRONIC TITLE (UPPERCASE)
                </Typography>
                <Typography variant="componentLabel" sx={{ mb: 1 }}>
                  COMPONENT LABEL
                </Typography>
                <Typography variant="componentValue" sx={{ mb: 1 }}>
                  Component Value: 470Ω
                </Typography>
                <Typography variant="energyValue" sx={{ mb: 1 }}>
                  Energy: 12.5 EU
                </Typography>
                <Typography variant="circuitInfo">
                  Circuit information with proper line height for readability
                </Typography>
              </Box>
              
              {/* Typography Scale Info */}
              <Box sx={{ p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
                <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 1 }}>
                  Current Theme Typography Scale:
                </Typography>
                <Typography variant="caption" sx={{ color: 'text.disabled', fontFamily: 'monospace' }}>
                  {currentTheme === 'ignitFire' 
                    ? 'Titles: 36px Bold • Buttons: 18px Bold • Body: 16px Medium • Small: 12px Medium'
                    : 'Titles: 32px Bold • Buttons: 16px Semibold • Body: 14px Regular • Small: 12px Regular'
                  }
                </Typography>
              </Box>
              
            </Box>
          </Box>
        </Card>

        {/* Raw Values Inspector */}
        <Card sx={{ p: 3 }}>
          <Typography variant="h5" sx={{ mb: 3, color: 'primary.main' }}>
            🔍 Current Theme Values
          </Typography>
          
          <Typography variant="h6" sx={{ mb: 2, color: 'text.primary' }}>
            Primitive Tokens ({currentTheme}):
          </Typography>
          
          <Box sx={{ 
            fontFamily: 'monospace', 
            fontSize: '12px', 
            backgroundColor: 'rgba(0,0,0,0.3)', 
            p: 2, 
            borderRadius: 1,
            color: 'text.secondary',
            overflow: 'auto'
          }}>
            <pre>{JSON.stringify(primitiveTokens[currentTheme], null, 2)}</pre>
          </Box>
          
          <Typography variant="body2" sx={{ mt: 2, color: 'text.secondary' }}>
            💡 <strong>Tip:</strong> Заполни пустые значения в ignitFire теме в файле semantic-theme-system.ts
          </Typography>
        </Card>

      </Box>
    </ThemeProvider>
  );
};