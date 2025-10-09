// src/app/page.tsx
'use client';

import React, { useEffect, useRef, useState, Suspense } from 'react';
import dynamic from 'next/dynamic';
import * as THREE from 'three';

// Lazy load heavy components
const Hero = dynamic(() => import('@/components/Home/Hero'), {
  loading: () => <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div></div>
});

const About = dynamic(() => import('@/components/Home/About'), {
  loading: () => <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div></div>
});

const Skills = dynamic(() => import('@/components/Home/Skills'), {
  loading: () => <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div></div>
});

const Projects = dynamic(() => import('@/components/Home/Projects'), {
  loading: () => <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div></div>
});

const Contact = dynamic(() => import('@/components/Home/Contact'), {
  loading: () => <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div></div>
});

// Lazy load animations
const FloatingObjects = dynamic(() => import('@/components/Animations/FloatingObjects'), { ssr: false });
const ParticleNetwork = dynamic(() => import('@/components/Animations/ParticleNetwork'), { ssr: false });
const CyberneticCircuit = dynamic(() => import('@/components/Animations/CyberneticCircuit'), { ssr: false });
const AnimatedShape = dynamic(() => import('@/components/Animations/AnimatedShape'), { ssr: false });

// ThreeJS Background Animation Component
function ThreeJSBackground() {
  const mountRef = useRef<HTMLDivElement>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (!mountRef.current || isInitialized) return;

    // Initialize Three.js
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    mountRef.current.appendChild(renderer.domElement);

    // Create floating particles
    const particlesGeometry = new THREE.BufferGeometry();
    const particleCount = 800;
    
    const posArray = new Float32Array(particleCount * 3);
    const colorsArray = new Float32Array(particleCount * 3);
    
    // Fill arrays with random positions and colors
    for (let i = 0; i < particleCount * 3; i += 3) {
      // Positions - create a disc shape
      const radius = Math.random() * 5 + 3;
      const angle = Math.random() * Math.PI * 2;
      
      posArray[i] = Math.cos(angle) * radius;
      posArray[i + 1] = Math.sin(angle) * radius;
      posArray[i + 2] = (Math.random() - 0.5) * 3;
      
      // Colors - use brand colors
      if (Math.random() > 0.5) {
        // Primary color (blue/indigo)
        colorsArray[i] = 0.39;       // 99/255
        colorsArray[i + 1] = 0.4;    // 102/255
        colorsArray[i + 2] = 0.94;   // 241/255
      } else {
        // Secondary color (pink)
        colorsArray[i] = 0.93;       // 236/255
        colorsArray[i + 1] = 0.28;   // 72/255
        colorsArray[i + 2] = 0.6;    // 153/255
      }
    }
    
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colorsArray, 3));
    
    // Particle material
    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.02,
      transparent: true,
      opacity: 0.6,
      vertexColors: true,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true,
    });
    
    // Create particle system
    const particleMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particleMesh);
    
    // Add a soft ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    // Position camera
    camera.position.z = 5;
    
    // Mouse movement effect
    let mouseX = 0;
    let mouseY = 0;
    
    function onMouseMove(event: MouseEvent) {
      mouseX = (event.clientX / window.innerWidth) * 2 - 1;
      mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
    }
    
    window.addEventListener('mousemove', onMouseMove);
    
    // Handle resize
    function handleResize() {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    }
    
    window.addEventListener('resize', handleResize);
    
    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      
      // Gently rotate based on mouse position
      particleMesh.rotation.x += 0.0004;
      particleMesh.rotation.y += 0.0005;
      
      if (mouseX && mouseY) {
        particleMesh.rotation.x += mouseY * 0.0002;
        particleMesh.rotation.y += mouseX * 0.0002;
      }
      
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
      
      scene.remove(particleMesh);
      particlesGeometry.dispose();
      particlesMaterial.dispose();
      renderer.dispose();
    };
  }, [isInitialized]);

  return (
    <div 
      ref={mountRef} 
      style={{ 
        position: 'fixed', 
        top: 0, 
        left: 0, 
        width: '100%', 
        height: '100%', 
        zIndex: -1,
        pointerEvents: 'none',
      }}
    />
  );
}

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 overflow-x-hidden">
      {/* Main ThreeJS Background */}
      <ThreeJSBackground />

      {/* Gradient overlay to help text readability */}
      <div className="fixed inset-0 bg-gradient-radial from-transparent via-slate-50/70 to-slate-50 pointer-events-none -z-10" />

      {/* Page content with section-specific animations */}
      <div className="min-h-screen flex flex-col relative z-10">
        {/* Hero section with Floating 3D Objects animation */}
        <section id="hero-section" className="relative min-h-screen">
          <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div></div>}>
            <FloatingObjects containerId="hero-section" />
            <Hero />
          </Suspense>
        </section>

        {/* About section with Interactive Particle Network */}
        <section id="about-section" className="relative min-h-screen">
          <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div></div>}>
            <ParticleNetwork containerId="about-section" />
            <About />
          </Suspense>
        </section>

        {/* Skills section with Cybernetic Circuit Board animation */}
        <section id="skills-section" className="relative min-h-screen">
          <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div></div>}>
            <CyberneticCircuit containerId="skills-section" />
            <Skills />
          </Suspense>
        </section>

        {/* Projects section */}
        <section id="projects-section" className="relative">
          <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div></div>}>
            <Projects />
          </Suspense>
        </section>

        {/* Contact section with Elegant Animated Shape */}
        <section id="contact-section" className="relative min-h-screen">
          <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div></div>}>
            <AnimatedShape containerId="contact-section" />
            <Contact />
          </Suspense>
        </section>
      </div>
    </main>
  );
}