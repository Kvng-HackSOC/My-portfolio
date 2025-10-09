// src/components/Animations/AnimatedShape.tsx
'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

interface AnimatedShapeProps {
  containerId: string;
}

export default function AnimatedShape({ containerId }: AnimatedShapeProps) {
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

    // Create a blob-like shape
    const createBlobShape = () => {
      // Create a sphere as the base
      const geometry = new THREE.SphereGeometry(1, 64, 64);
      
      // Get the vertex positions
      const positions = geometry.attributes.position;
      
      // Randomly distort the vertices to create a blob shape
      for (let i = 0; i < positions.count; i++) {
        const x = positions.getX(i);
        const y = positions.getY(i);
        const z = positions.getZ(i);
        
        // Calculate the distance from the center
        const distance = Math.sqrt(x * x + y * y + z * z);
        
        // Create a distortion based on position
        const noise = Math.sin(x * 5) * 0.1 + Math.cos(y * 5) * 0.1 + Math.sin(z * 5) * 0.1;
        
        // Apply the distortion to the vertex
        const newDistance = distance + noise;
        const scale = newDistance / distance;
        
        positions.setXYZ(i, x * scale, y * scale, z * scale);
      }
      
      geometry.computeVertexNormals(); // Important for proper lighting
      
      // Create a material with a gradient effect
      const material = new THREE.MeshPhongMaterial({
        color: 0x6366f1,
        transparent: true,
        opacity: 0.85,
        flatShading: false,
        shininess: 100,
        side: THREE.DoubleSide,
        emissive: 0x3b82f6,
        emissiveIntensity: 0.2
      });
      
      // Create the mesh
      const blob = new THREE.Mesh(geometry, material);
      return { blob, geometry, material };
    };
    
    // Create the blob
    const { blob, geometry, material } = createBlobShape();
    scene.add(blob);
    
    // Add a wireframe overlay
    const wireframeGeometry = new THREE.WireframeGeometry(geometry);
    const wireframeMaterial = new THREE.LineBasicMaterial({ 
      color: 0xec4899,
      transparent: true,
      opacity: 0.3
    });
    const wireframe = new THREE.LineSegments(wireframeGeometry, wireframeMaterial);
    blob.add(wireframe);
    
    // Add lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);
    
    // Position camera
    camera.position.z = 3;
    
    // Mouse movement
    let mouseX = 0;
    let mouseY = 0;
    
    function onMouseMove(event: MouseEvent) {
      // Calculate mouse position relative to the container
      const rect = container.getBoundingClientRect();
      mouseX = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouseY = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    }
    
    container.addEventListener('mousemove', onMouseMove);
    
    // Handle resize
    function handleResize() {
      const newRect = container.getBoundingClientRect();
      camera.aspect = newRect.width / newRect.height;
      camera.updateProjectionMatrix();
      renderer.setSize(newRect.width, newRect.height);
    }
    
    window.addEventListener('resize', handleResize);
    
    // Animation loop
    let time = 0;
    const animate = () => {
      requestAnimationFrame(animate);
      
      time += 0.01;
      
      // Pulsate the shape slightly
      blob.scale.x = 1 + Math.sin(time * 0.5) * 0.05;
      blob.scale.y = 1 + Math.sin(time * 0.5 + 0.2) * 0.05;
      blob.scale.z = 1 + Math.sin(time * 0.5 + 0.4) * 0.05;
      
      // Rotate the shape
      blob.rotation.x += 0.003;
      blob.rotation.y += 0.005;
      
      // Responsive to mouse movement
      blob.rotation.x += mouseY * 0.001;
      blob.rotation.y += mouseX * 0.001;
      
      // Animate the vertices for a more organic look
      const positions = geometry.attributes.position;
      for (let i = 0; i < positions.count; i++) {
        const x = positions.getX(i);
        const y = positions.getY(i);
        const z = positions.getZ(i);
        
        // Calculate the original position (before any animation)
        const originalX = geometry.attributes.position.getX(i);
        const originalY = geometry.attributes.position.getY(i);
        const originalZ = geometry.attributes.position.getZ(i);
        
        // Create a subtle wave motion
        const noise = 
          Math.sin(x * 2 + time) * 0.02 + 
          Math.cos(y * 2 + time * 1.3) * 0.02 + 
          Math.sin(z * 2 + time * 0.7) * 0.02;
        
        // Apply the noise to the original position
        positions.setXYZ(
          i, 
          originalX + noise * originalX,
          originalY + noise * originalY, 
          originalZ + noise * originalZ
        );
      }
      
      // Update the geometry
      geometry.attributes.position.needsUpdate = true;
      geometry.computeVertexNormals();
      
      renderer.render(scene, camera);
    };
    
    animate();
    setIsInitialized(true);
    
    // Cleanup
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', handleResize);
      container.removeEventListener('mousemove', onMouseMove);
      
      if (mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
      
      scene.remove(blob);
      geometry.dispose();
      material.dispose();
      wireframeMaterial.dispose();
      wireframeGeometry.dispose();
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