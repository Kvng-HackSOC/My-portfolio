'use client';

import React from 'react';
import { Card as MuiCard, CardProps } from '@mui/material';
import { motion } from 'framer-motion';

interface CustomCardProps extends CardProps {
  children: React.ReactNode;
  hoverable?: boolean;
  glass?: boolean;
}

const Card: React.FC<CustomCardProps> = ({
  children,
  hoverable = false,
  glass = false,
  ...props
}) => {
  return (
    <MuiCard
      component={motion.div}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      {...props}
      sx={{
        ...props.sx,
        ...(glass && {
          background: 'rgba(255, 255, 255, 0.7)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.3)',
        }),
        ...(hoverable && {
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-8px)',
            boxShadow: '0 16px 48px rgba(0, 0, 0, 0.1)',
          },
        }),
      }}
    >
      {children}
    </MuiCard>
  );
};

export default Card;