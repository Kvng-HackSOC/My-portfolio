// src/components/Animations/index.tsx
'use client';

import React from 'react';
import FloatingObjects from './FloatingObjects';
import ParticleNetwork from './ParticleNetwork';
import CyberneticCircuit from './CyberneticCircuit';
import AnimatedShape from './AnimatedShape';

interface AnimationWrapperProps {
  animation: 'floating-objects' | 'particle-network' | 'cybernetic-circuit' | 'animated-shape';
  containerId: string;
}

/**
 * Animation wrapper component that makes it easy to apply different animations to different sections
 */
export default function AnimationWrapper({ animation, containerId }: AnimationWrapperProps) {
  // Select animation component based on the 'animation' prop
  switch (animation) {
    case 'floating-objects':
      return <FloatingObjects containerId={containerId} />;
    
    case 'particle-network':
      return <ParticleNetwork containerId={containerId} />;
    
    case 'cybernetic-circuit':
      return <CyberneticCircuit containerId={containerId} />;
    
    case 'animated-shape':
      return <AnimatedShape containerId={containerId} />;
    
    default:
      return null;
  }
}

/**
 * Alternative implementation using a more simplified approach
 * This can be used directly in your page or component files
 */
export function SectionWithAnimation({ 
  children, 
  id, 
  animation 
}: { 
  children: React.ReactNode; 
  id: string; 
  animation: 'floating-objects' | 'particle-network' | 'cybernetic-circuit' | 'animated-shape';
}) {
  return (
    <div 
      id={id} 
      style={{ 
        position: 'relative', 
        minHeight: '100vh',
      }}
    >
      <AnimationWrapper animation={animation} containerId={id} />
      {children}
    </div>
  );
}