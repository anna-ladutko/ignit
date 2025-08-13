import React, { useState } from 'react'
import { Box, Typography } from '@mui/material'
import { MobilePanel, TouchButton, GameModal } from './ui'

export const ModalDemo: React.FC = () => {
  const [basicModalOpen, setBasicModalOpen] = useState(false)
  const [blurTestModalOpen, setBlurTestModalOpen] = useState(false)
  const [contentTestModalOpen, setContentTestModalOpen] = useState(false)
  const [successModalOpen, setSuccessModalOpen] = useState(false)

  return (
    <Box sx={{ p: 2, minHeight: '100vh' }}>
      <Typography variant="electronicTitle" sx={{ mb: 3 }}>
        MODAL SYSTEM SANDBOX
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        
        {/* Basic Modal Tests */}
        <MobilePanel title="Basic Modal Tests" variant="primary">
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
            <TouchButton 
              variant="primary" 
              onClick={() => setBasicModalOpen(true)}
            >
              Basic Modal
            </TouchButton>
            
            <TouchButton 
              variant="primary" 
              onClick={() => setBlurTestModalOpen(true)}
            >
              Blur Test
            </TouchButton>
            
            <TouchButton 
              variant="primary" 
              onClick={() => setContentTestModalOpen(true)}
            >
              Content Test
            </TouchButton>
          </Box>
        </MobilePanel>

        {/* Success Modal Prototype */}
        <MobilePanel title="Success Modal Prototype" variant="accent">
          <Box sx={{ mb: 2 }}>
            <Typography variant="componentLabel" sx={{ mb: 1 }}>
              Test the Level Complete modal design:
            </Typography>
            <TouchButton 
              variant="primary" 
              size="large"
              onClick={() => setSuccessModalOpen(true)}
            >
              Success Modal
            </TouchButton>
          </Box>
        </MobilePanel>

        {/* Modal Design Guidelines */}
        <MobilePanel title="Design Guidelines" variant="primary">
          <Typography variant="componentLabel" sx={{ mb: 2, fontSize: '14px' }}>
            Modal Specifications:
          </Typography>
          <Box sx={{ fontSize: '12px', color: 'text.secondary', lineHeight: 1.5 }}>
            <div>• Background: rgba(217, 217, 217, 0.2)</div>
            <div>• Backdrop blur: 10px</div>
            <div>• Z-index: 2000 (above everything)</div>
            <div>• Animation: fade in/out 300ms</div>
            <div>• Success title: Montserrat Bold 48px with backgroundAccent gradient</div>
            <div>• Next Level button: #D84205, radius 10px, Montserrat Bold 18px</div>
          </Box>
        </MobilePanel>

      </Box>

      {/* Modal Instances */}
      <GameModal 
        open={basicModalOpen} 
        onClose={() => setBasicModalOpen(false)}
      >
        <Box sx={{ textAlign: 'center', p: 4 }}>
          <Typography variant="electronicTitle" sx={{ mb: 2, fontSize: '32px' }}>
            Basic Modal
          </Typography>
          <Typography variant="componentLabel" sx={{ mb: 3 }}>
            This is a basic GameModal test
          </Typography>
          <TouchButton 
            variant="primary" 
            onClick={() => setBasicModalOpen(false)}
          >
            Close
          </TouchButton>
        </Box>
      </GameModal>

      <GameModal 
        open={blurTestModalOpen} 
        onClose={() => setBlurTestModalOpen(false)}
      >
        <Box sx={{ textAlign: 'center', p: 4 }}>
          <Typography variant="electronicTitle" sx={{ mb: 2, fontSize: '32px' }}>
            Blur Effect Test
          </Typography>
          <Typography variant="componentLabel" sx={{ mb: 3 }}>
            Testing backdrop-filter blur effect
            <br />
            Background should be blurred
          </Typography>
          <TouchButton 
            variant="primary" 
            onClick={() => setBlurTestModalOpen(false)}
          >
            Close Blur Test
          </TouchButton>
        </Box>
      </GameModal>

      <GameModal 
        open={contentTestModalOpen} 
        onClose={() => setContentTestModalOpen(false)}
      >
        <Box sx={{ textAlign: 'center', p: 4, maxWidth: '400px' }}>
          <Typography variant="electronicTitle" sx={{ mb: 2, fontSize: '32px' }}>
            Content Test
          </Typography>
          <Typography variant="componentLabel" sx={{ mb: 2 }}>
            Testing various content layouts
          </Typography>
          <MobilePanel variant="primary" sx={{ mb: 3, p: 2 }}>
            <Typography variant="componentLabel">
              Panel inside modal works?
            </Typography>
          </MobilePanel>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
            <TouchButton 
              variant="primary" 
              size="small"
              onClick={() => alert('Button works!')}
            >
              Test Action
            </TouchButton>
            <TouchButton 
              variant="primary" 
              size="small"
              onClick={() => setContentTestModalOpen(false)}
            >
              Close
            </TouchButton>
          </Box>
        </Box>
      </GameModal>

      <GameModal 
        open={successModalOpen} 
        onClose={() => setSuccessModalOpen(false)}
      >
        <Box sx={{ textAlign: 'center', p: 4 }}>
          {/* Success Title with Gradient */}
          <Typography 
            sx={{ 
              fontFamily: 'Montserrat, sans-serif',
              fontWeight: 'bold',
              fontSize: '48px',
              mb: 4,
              background: 'linear-gradient(135deg, #4ECDC4 0%, #44A08D 100%)', // backgroundAccent gradient
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              color: 'transparent',
              WebkitTextFillColor: 'transparent'
            }}
          >
            Success!
          </Typography>

          {/* Placeholder for future content */}
          <Box sx={{ 
            width: 300, 
            height: 150, 
            backgroundColor: 'rgba(255,255,255,0.1)', 
            borderRadius: 4,
            mb: 4,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Typography variant="componentLabel" sx={{ color: 'text.secondary' }}>
              Future content area
            </Typography>
          </Box>

          {/* Next Level Button */}
          <TouchButton
            sx={{
              backgroundColor: '#D84205',
              borderRadius: '10px',
              fontFamily: 'Montserrat, sans-serif',
              fontWeight: 'bold',
              fontSize: '18px',
              px: 4,
              py: 1.5,
              '&:hover': {
                backgroundColor: '#C73A04'
              }
            }}
            onClick={() => {
              alert('Next level!')
              setSuccessModalOpen(false)
            }}
          >
            Next Level
          </TouchButton>
        </Box>
      </GameModal>
    </Box>
  )
}

export default ModalDemo