'use client';

import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Box,
} from '@mui/material';
import { Close } from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  children,
  title,
  size = 'lg'
}) => {
  const sizes = {
    sm: '400px',
    md: '600px',
    lg: '800px',
    xl: '1200px',
    full: '90vw'
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog
          open={isOpen}
          onClose={onClose}
          maxWidth={false}
          PaperProps={{
            sx: {
              borderRadius: 4,
              width: sizes[size],
              maxWidth: '90vw',
              maxHeight: '90vh',
            },
          }}
        >
          {title && (
            <DialogTitle sx={{ m: 0, p: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                {title}
                <IconButton
                  aria-label="close"
                  onClick={onClose}
                  sx={{
                    color: (theme) => theme.palette.grey[500],
                  }}
                >
                  <Close />
                </IconButton>
              </Box>
            </DialogTitle>
          )}
          <DialogContent dividers>
            {children}
          </DialogContent>
        </Dialog>
      )}
    </AnimatePresence>
  );
};

export default Modal;