'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { FaArrowRight, FaCode, FaShieldAlt } from 'react-icons/fa';
import Link from 'next/link';
import Button from '@/components/UI/Button';

const Hero = () => {
  return (
    <section className="min-h-screen flex items-center relative overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            repeatType: "loop",
          }}
          className="absolute top-10 left-5 w-96 h-96 bg-gradient-radial from-indigo-500/20 to-transparent rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [360, 180, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            repeatType: "loop",
          }}
          className="absolute bottom-10 right-5 w-80 h-80 bg-gradient-radial from-pink-500/20 to-transparent rounded-full blur-3xl"
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex justify-center gap-4 mb-8">
              <motion.div
                whileHover={{ scale: 1.1 }}
                className="bg-gradient-to-br from-indigo-500 to-blue-500 p-4 rounded-lg flex items-center justify-center shadow-2xl shadow-indigo-500/30"
              >
                <FaCode className="text-white text-3xl" />
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.1 }}
                className="bg-gradient-to-br from-pink-500 to-rose-500 p-4 rounded-lg flex items-center justify-center shadow-2xl shadow-pink-500/30"
              >
                <FaShieldAlt className="text-white text-3xl" />
              </motion.div>
            </div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl md:text-5xl lg:text-6xl font-black bg-gradient-to-r from-slate-900 via-indigo-500 to-pink-500 bg-clip-text text-transparent mb-6"
            >
              Ezekiel Obanla
            </motion.h1>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-xl md:text-2xl text-slate-600 mb-6 font-medium"
          >
            Full Stack Developer & Cybersecurity Analyst
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-slate-600 mb-12 max-w-2xl mx-auto text-lg leading-relaxed"
          >
            Crafting secure, scalable solutions with modern technologies.
            Specializing in web development and cybersecurity best practices.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex gap-4 justify-center flex-wrap"
          >
            <Link href="/projects">
              <Button
                size="lg"
                className="bg-gradient-to-r from-indigo-500 to-blue-500 hover:from-indigo-600 hover:to-blue-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                View Projects
                <FaArrowRight className="ml-2" />
              </Button>
            </Link>
            <Link href="#contact">
              <Button
                variant="outline"
                size="lg"
                className="border-2 border-indigo-500 text-indigo-500 hover:bg-indigo-50 hover:border-indigo-600 hover:text-indigo-600"
              >
                Contact Me
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;