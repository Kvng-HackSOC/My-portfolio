'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { FaGithub, FaLinkedin, FaEnvelope, FaTwitter } from 'react-icons/fa';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { icon: <FaGithub />, href: 'https://github.com/kvng-Hack-SOC', label: 'GitHub' },
    { icon: <FaLinkedin />, href: 'https://linkedin.com/in/obanlaopeyemitemilade', label: 'LinkedIn' },
    { icon: <FaEnvelope />, href: 'mailto:oba198175@gmail.com', label: 'Email' },
    { icon: <FaTwitter />, href: 'https://twitter.com/ObanlaTemilade', label: 'Twitter' },
  ];

  const footerLinks = [
    { title: 'Home', href: '/' },
    { title: 'About', href: '#about' },
    { title: 'Projects', href: '/projects' },
    { title: 'Contact', href: '#contact' },
  ];

  return (
    <footer className="bg-gradient-to-b from-slate-50 to-white border-t border-slate-200 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="space-y-4"
          >
            <h3 className="text-2xl font-bold bg-gradient-to-r from-indigo-500 to-pink-500 bg-clip-text text-transparent">
              Ezekiel Obanla
            </h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Full Stack Developer & Cybersecurity Professional creating secure
              and scalable web solutions.
            </p>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="space-y-4"
          >
            <h4 className="text-lg font-semibold text-slate-800">Quick Links</h4>
            <div className="flex flex-col space-y-2">
              {footerLinks.map((link) => (
                <a
                  key={link.title}
                  href={link.href}
                  className="text-slate-600 hover:text-indigo-600 transition-colors duration-300 text-sm"
                >
                  {link.title}
                </a>
              ))}
            </div>
          </motion.div>

          {/* Social Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-4"
          >
            <h4 className="text-lg font-semibold text-slate-800">Connect</h4>
            <div className="flex space-x-3 mb-4">
              {socialLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center hover:bg-gradient-to-r hover:from-indigo-500 hover:to-indigo-600 hover:text-white transition-all duration-300 hover:-translate-y-1 shadow-sm"
                  aria-label={link.label}
                >
                  {link.icon}
                </a>
              ))}
            </div>
            <p className="text-slate-600 text-sm">
              Open to new opportunities and collaborations
            </p>
          </motion.div>
        </div>

        {/* Divider */}
        <div className="border-t border-slate-200 my-8"></div>

        {/* Copyright */}
        <div className="text-center">
          <p className="text-slate-500 text-sm">
            © {currentYear} Ezekiel Obanla. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;