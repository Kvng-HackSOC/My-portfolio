// src/components/Animations/CyberneticCircuit.tsx
'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

interface CyberneticCircuitProps {
  containerId: string;
}

export default function CyberneticCircuit({ containerId }: CyberneticCircuitProps) {
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

    // Create circuit elements
    const lines: THREE.Line[] = [];
    const nodes: THREE.Mesh[] = [];
    const pulses: { line: THREE.Line; position: number; speed: number; }[] = [];
    
    // Node material
    const nodeMaterial = new THREE.MeshBasicMaterial({ color: 0x6366f1 });
    const nodeGeometry = new THREE.SphereGeometry(0.05, 16, 16);
    
    // Line material
    const lineMaterial = new THREE.LineBasicMaterial({ color: 0x64748b });
    
    // Pulse material
    const pulseMaterial = new THREE.MeshBasicMaterial({ 
      color: 0xec4899,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending
    });
    const pulseGeometry = new THREE.SphereGeometry(0.02, 8, 8);
    
    // Find closest nodes
    const findClosestNodes = (sourceNode: THREE.Mesh, count: number) => {
      const distances: {node: THREE.Mesh, distance: number}[] = [];
      
      nodes.forEach(targetNode => {
        if (targetNode !== sourceNode) {
          const distance = sourceNode.position.distanceTo(targetNode.position);
          distances.push({node: targetNode, distance});
        }
      });
      
      // Sort by distance and get the closest ones
      distances.sort((a, b) => a.distance - b.distance);
      
      // Return closest nodes (limited by count and maximum distance)
      return distances
        .slice(0, count)
        .filter(item => item.distance < 1.5)
        .map(item => item.node);
    };
    
    // Generate circuit layout
    const createCircuitGrid = () => {
      const gridSize = 5;
      const gridDivisions = 6;
      const step = gridSize / gridDivisions;
      
      // Create nodes at grid intersections
      for (let x = -gridSize/2; x <= gridSize/2; x += step) {
        for (let y = -gridSize/2; y <= gridSize/2; y += step) {
          // Skip some nodes randomly to make it less uniform
          if (Math.random() > 0.75) continue;
          
          const node = new THREE.Mesh(nodeGeometry, nodeMaterial);
          node.position.set(
            x + (Math.random() - 0.5) * 0.2, // Add slight randomness
            y + (Math.random() - 0.5) * 0.2,
            0
          );
          
          scene.add(node);
          nodes.push(node);
        }
      }
      
      // Connect nodes with lines
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        
        // Find the closest nodes
        const closestNodes = findClosestNodes(node, 3);
        
        closestNodes.forEach(targetNode => {
          // Create a line between nodes
          const lineGeometry = new THREE.BufferGeometry().setFromPoints([
            node.position,
            targetNode.position
          ]);
          
          const line = new THREE.Line(lineGeometry, lineMaterial);
          scene.add(line);
          lines.push(line);
          
          // Add a pulse to some lines
          if (Math.random() > 0.7) {
            pulses.push({
              line: line,
              position: 0, // Start at the beginning
              speed: Math.random() * 0.01 + 0.005 // Random speed
            });
          }
        });
      }
    };
    
    // Create the circuit
    createCircuitGrid();
    
    // Create pulse objects
    const pulseObjects: THREE.Mesh[] = [];
    pulses.forEach(() => {
      const pulseMesh = new THREE.Mesh(pulseGeometry, pulseMaterial);
      scene.add(pulseMesh);
      pulseObjects.push(pulseMesh);
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
    
    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      
      // Update pulses
      pulses.forEach((pulse, index) => {
        pulse.position += pulse.speed;
        
        if (pulse.position > 1) {
          pulse.position = 0; // Reset position
        }
        
        // Get line points
        const linePoints = pulse.line.geometry.getAttribute('position').array;
        const start = new THREE.Vector3(linePoints[0], linePoints[1], linePoints[2]);
        const end = new THREE.Vector3(linePoints[3], linePoints[4], linePoints[5]);
        
        // Interpolate position along the line
        const pulsePos = new THREE.Vector3().lerpVectors(start, end, pulse.position);
        pulseObjects[index].position.copy(pulsePos);
      });
      
      // Rotate based on mouse position for subtle movement
      scene.rotation.y = mouseX * 0.05;
      scene.rotation.x = mouseY * 0.05;
      
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
      
      // Dispose all geometries and materials
      nodeGeometry.dispose();
      nodeMaterial.dispose();
      pulseGeometry.dispose();
      pulseMaterial.dispose();
      
      nodes.forEach(node => {
        scene.remove(node);
      });
      
      lines.forEach(line => {
        scene.remove(line);
        if (line.geometry) line.geometry.dispose();
      });
      
      pulseObjects.forEach(pulse => {
        scene.remove(pulse);
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