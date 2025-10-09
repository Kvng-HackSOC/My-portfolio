import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

interface FloatingObjectsProps {
  containerId: string;
}

export default function FloatingObjects({ containerId }: FloatingObjectsProps) {
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

    // Create objects array to hold all the 3D objects
    const objects: THREE.Mesh[] = [];
    
    // Create different geometric shapes
    const geometries = [
      new THREE.IcosahedronGeometry(0.5, 0), // Simple shape
      new THREE.TetrahedronGeometry(0.4, 0), // Pyramid
      new THREE.OctahedronGeometry(0.4, 0),  // Diamond-like
      new THREE.TorusKnotGeometry(0.3, 0.1, 64, 8, 2, 3), // Complex knot
    ];
    
    // Create materials with different colors
    const materials = [
      new THREE.MeshPhongMaterial({ color: 0x6366f1, flatShading: true }), // Indigo
      new THREE.MeshPhongMaterial({ color: 0xec4899, flatShading: true }), // Pink
      new THREE.MeshPhongMaterial({ color: 0x8b5cf6, flatShading: true }), // Purple
      new THREE.MeshPhongMaterial({ color: 0x3b82f6, flatShading: true })  // Blue
    ];
    
    // Create floating objects
    for (let i = 0; i < 12; i++) {
      const geomIndex = Math.floor(Math.random() * geometries.length);
      const matIndex = Math.floor(Math.random() * materials.length);
      
      const mesh = new THREE.Mesh(geometries[geomIndex], materials[matIndex]);
      
      // Position randomly in a circular pattern
      const radius = Math.random() * 3 + 1;
      const angle = Math.random() * Math.PI * 2;
      
      mesh.position.x = Math.cos(angle) * radius;
      mesh.position.y = Math.sin(angle) * radius;
      mesh.position.z = (Math.random() - 0.5) * 2;
      
      // Random rotation
      mesh.rotation.x = Math.random() * Math.PI;
      mesh.rotation.y = Math.random() * Math.PI;
      
      // Random floating animation parameters
      mesh.userData = {
        floatSpeed: (Math.random() * 0.01) + 0.005,
        rotateSpeed: (Math.random() * 0.01) + 0.005,
        floatRadius: Math.random() * 0.3 + 0.1,
        startAngle: Math.random() * Math.PI * 2,
        startY: mesh.position.y
      };
      
      scene.add(mesh);
      objects.push(mesh);
    }
    
    // Add lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);
    
    // Position camera
    camera.position.z = 5;
    
    // Mouse movement effect
    let mouseX = 0;
    let mouseY = 0;
    
    function onMouseMove(event: MouseEvent) {
      // Calculate mouse position relative to the container
      const rect = container.getBoundingClientRect();
      mouseX = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouseY = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    }
    
    window.addEventListener('mousemove', onMouseMove);
    
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
      
      // Update each object's position and rotation
      objects.forEach((object) => {
        const data = object.userData;
        
        // Floating motion
        object.position.y = data.startY + Math.sin(time + data.startAngle) * data.floatRadius;
        
        // Rotation
        object.rotation.x += data.rotateSpeed;
        object.rotation.y += data.rotateSpeed * 0.7;
        
        // Respond to mouse movement
        object.rotation.x += mouseY * 0.001;
        object.rotation.y += mouseX * 0.001;
      });
      
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
      
      objects.forEach(object => {
        scene.remove(object);
        if (object.geometry) object.geometry.dispose();
        if (object.material) {
          if (Array.isArray(object.material)) {
            object.material.forEach(material => material.dispose());
          } else {
            object.material.dispose();
          }
        }
      });
      
      geometries.forEach(geometry => geometry.dispose());
      materials.forEach(material => material.dispose());
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