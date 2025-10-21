// src/components/Animations/ParticleNetwork.tsx
'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

interface ParticleNetworkProps {
  containerId: string;
}

export default function ParticleNetwork({ containerId }: ParticleNetworkProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (!mountRef.current || isInitialized) return;

    // Get container dimensions
    const container = document.getElementById(containerId);
    if (!container) return;

    const containerRect = container.getBoundingClientRect();
    
    // Initialize Three.js
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, containerRect.width / containerRect.height, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

    renderer.setSize(containerRect.width, containerRect.height);
    renderer.setClearColor(0x000000, 0);
    mountRef.current.appendChild(renderer.domElement);

    // Create particles
    const particleCount = 150;
    const particles: THREE.Points[] = [];
    const connections: THREE.Line[] = [];
    
    const particleGeometry = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    
    // Set random positions
    for (let i = 0; i < particleCount * 3; i += 3) {
      particlePositions[i] = (Math.random() - 0.5) * 8;
      particlePositions[i + 1] = (Math.random() - 0.5) * 8;
      particlePositions[i + 2] = (Math.random() - 0.5) * 4;
    }
    
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    
    // Create particle material
    const particleMaterial = new THREE.PointsMaterial({
      color: 0x3b82f6,
      size: 0.05,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending
    });
    
    // Create particle system
    const particleSystem = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particleSystem);
    particles.push(particleSystem);
    
    // Connection line material
    const lineMaterial = new THREE.LineBasicMaterial({
      color: 0x64748b,
      transparent: true,
      opacity: 0.25,
      blending: THREE.AdditiveBlending
    });
    
    // Position camera
    camera.position.z = 5;
    
    // Mouse movement
    let mouseX = 0;
    let mouseY = 0;
    
    function onMouseMove(event: MouseEvent) {
      if (!container) return;
      
      // Calculate mouse position relative to the container
      const rect = container.getBoundingClientRect();
      mouseX = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouseY = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    }
    
    window.addEventListener('mousemove', onMouseMove);
    
    // Handle resize
    function handleResize() {
      if (!container) return;
      
      const newRect = container.getBoundingClientRect();
      camera.aspect = newRect.width / newRect.height;
      camera.updateProjectionMatrix();
      renderer.setSize(newRect.width, newRect.height);
    }
    
    window.addEventListener('resize', handleResize);
    
    // Array to store particle velocities
    const velocities: { x: number; y: number; z: number }[] = [];
    for (let i = 0; i < particleCount; i++) {
      velocities.push({
        x: (Math.random() - 0.5) * 0.01,
        y: (Math.random() - 0.5) * 0.01,
        z: (Math.random() - 0.5) * 0.005
      });
    }
    
    // Function to draw connections between particles
    const drawConnections = () => {
      // Remove previous connections
      connections.forEach(line => {
        scene.remove(line);
        if (line.geometry) line.geometry.dispose();
      });
      connections.length = 0;
      
      const positions = particleGeometry.attributes.position.array;
      const threshold = 1.5; // Maximum distance for connections
      
      for (let i = 0; i < particleCount; i++) {
        const ix = i * 3;
        const x1 = positions[ix];
        const y1 = positions[ix + 1];
        const z1 = positions[ix + 2];
        
        for (let j = i + 1; j < particleCount; j++) {
          const jx = j * 3;
          const x2 = positions[jx];
          const y2 = positions[jx + 1];
          const z2 = positions[jx + 2];
          
          const dx = x1 - x2;
          const dy = y1 - y2;
          const dz = z1 - z2;
          const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);
          
          if (distance < threshold) {
            // Create a line between these particles
            const lineGeometry = new THREE.BufferGeometry().setFromPoints([
              new THREE.Vector3(x1, y1, z1),
              new THREE.Vector3(x2, y2, z2)
            ]);
            
            // Set line opacity based on distance
            const lineOpacity = 1 - (distance / threshold);
            const customLineMaterial = lineMaterial.clone();
            customLineMaterial.opacity = lineOpacity * 0.25;
            
            const line = new THREE.Line(lineGeometry, customLineMaterial);
            scene.add(line);
            connections.push(line);
            
            // Limit the number of connections to prevent performance issues
            if (connections.length > 250) break;
          }
        }
        
        if (connections.length > 250) break;
      }
    };
    
    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      
      // Update particle positions
      const positions = particleGeometry.attributes.position.array;
      
      for (let i = 0; i < particleCount; i++) {
        const ix = i * 3;
        
        // Update position based on velocity
        positions[ix] += velocities[i].x;
        positions[ix + 1] += velocities[i].y;
        positions[ix + 2] += velocities[i].z;
        
        // Boundary check and bounce
        if (Math.abs(positions[ix]) > 4) {
          velocities[i].x *= -1;
        }
        if (Math.abs(positions[ix + 1]) > 4) {
          velocities[i].y *= -1;
        }
        if (Math.abs(positions[ix + 2]) > 2) {
          velocities[i].z *= -1;
        }
      }
      
      particleGeometry.attributes.position.needsUpdate = true;
      
      // Draw connections (not every frame to improve performance)
      if (Math.random() > 0.9) {
        drawConnections();
      }
      
      // Rotate the entire system based on mouse position
      particleSystem.rotation.y += mouseX * 0.0005;
      particleSystem.rotation.x += mouseY * 0.0005;
      
      renderer.render(scene, camera);
    };
    
    animate();
    setIsInitialized(true);
    
    // Cleanup
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', handleResize);
      
      if (mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
      
      particles.forEach(particle => {
        scene.remove(particle);
        if (particle.geometry) particle.geometry.dispose();
        if (particle.material) {
          if (Array.isArray(particle.material)) {
            particle.material.forEach(material => material.dispose());
          } else {
            particle.material.dispose();
          }
        }
      });
      
      connections.forEach(line => {
        scene.remove(line);
        if (line.geometry) line.geometry.dispose();
        if (line.material) {
          if (Array.isArray(line.material)) {
            line.material.forEach(material => material.dispose());
          } else {
            line.material.dispose();
          }
        }
      });
      
      renderer.dispose();
    };
  }, [containerId, isInitialized]);

  return (
    <div 
      ref={mountRef} 
      style={{ 
        position: 'absolute', 
        top: 0, 
        left: 0, 
        width: '100%', 
        height: '100%', 
        zIndex: 0,
        pointerEvents: 'none',
      }}
    />
  );
}