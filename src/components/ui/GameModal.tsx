import React from 'react'
import { Box, Modal, Backdrop } from '@mui/material'
import { motion, AnimatePresence } from 'framer-motion'

interface GameModalProps {
  open: boolean
  onClose?: () => void
  children: React.ReactNode
  allowBackdropClick?: boolean
}

export const GameModal: React.FC<GameModalProps> = ({
  open,
  onClose,
  children,
  allowBackdropClick = true
}) => {
  const handleBackdropClick = () => {
    if (allowBackdropClick && onClose) {
      onClose()
    }
  }

  return (
    <Modal
      open={open}
      onClose={handleBackdropClick}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 300,
        sx: {
          backgroundColor: 'rgba(217, 217, 217, 0.2)',
          backdropFilter: 'blur(10px)',
          zIndex: 2000 // Above everything including TopGameBar
        }
      }}
      sx={{
        zIndex: 2000 // Ensure modal is on top
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          outline: 'none', // Remove focus outline
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: 2
        }}
        onClick={handleBackdropClick}
      >
        <AnimatePresence mode="wait">
          {open && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              onClick={(e) => e.stopPropagation()} // Prevent closing when clicking on content
              style={{
                maxWidth: '90vw',
                maxHeight: '90vh',
                overflow: 'auto'
              }}
            >
              {children}
            </motion.div>
          )}
        </AnimatePresence>
      </Box>
    </Modal>
  )
}

export default GameModal