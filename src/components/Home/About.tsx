'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaSchool, FaCertificate, FaBriefcase, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import Button from '@/components/UI/Button';

const About = () => {
  // State for tracking which sections are expanded
  const [expanded, setExpanded] = useState({
    bio: true,
    experience: false,
    certifications: false,
    education: false
  });

  // Toggle function for expandable sections
  const toggleExpand = (section: keyof typeof expanded) => {
    setExpanded({
      ...expanded,
      [section]: !expanded[section]
    });
  };

  const experiences = [
    {
      year: '2025 - PRESENT',
      title: 'Full Stack Developer',
      company: 'Tech Solutions Inc.',
      description: 'Building enterprise web applications'
    },
    {
      year: '2022 - 2024',
      title: 'Cybersecurity Analyst(Offensive Security)',
      company: 'Hacktales Ltd',
      description: 'Implemented security protocols and conducted ethical vulnerability attacks'
    },
    {
      year: '2020 - 2022',
      title: 'Frontend Developer',
      company: 'Digital Agency',
      description: 'Developed responsive web applications using modern frameworks'
    },
  ];

  const certifications = [
    'Fortinet Network Security Expert',
    'ISC Certified in Cybersecurity',
    'Certified Ethical Hacker (In-view)',
  ];
  
  const education = {
    degree: 'MSc Applied Computer Science',
    institution: 'University of Lincoln, United Kingdom',
    year: '2025'
  };

  return (
    <section
      id="about"
      className="py-20 bg-gradient-to-br from-slate-50 to-slate-100"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
            About Me
          </h2>
          <p className="text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Passionate about building secure and scalable web applications with a unique blend of development and cybersecurity expertise
          </p>
        </motion.div>

        {/* Profile Section - Centered */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <img
              src="/images/profile.jpg"
              alt="Ezekiel Obanla"
              className="w-44 h-44 rounded-full mx-auto mb-6 shadow-2xl border-4 border-white"
            />
            <h3 className="text-2xl font-bold text-blue-600 mb-2">
              Ezekiel Obanla
            </h3>
            <p className="text-lg text-slate-600">
              Full Stack Developer & Cybersecurity Professional
            </p>
          </motion.div>
        </div>

        {/* Expandable Grid Layout */}
        <div className="max-w-5xl mx-auto space-y-6">
          {/* Bio Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 flex items-center justify-between">
                <h3 className="text-xl font-bold text-white">
                  Bio
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleExpand('bio')}
                  className="text-white hover:bg-white/20"
                >
                  {expanded.bio ? <FaChevronUp /> : <FaChevronDown />}
                </Button>
              </div>
              {expanded.bio && (
                <div className="p-6">
                  <p className="text-slate-700 leading-relaxed mb-4">
                    With over 6 years of experience in software development and cybersecurity,
                    I bring a unique perspective to building secure, reliable applications.
                  </p>
                  <p className="text-slate-700 leading-relaxed mb-4">
                    My journey started with frontend development, evolved into full-stack
                    engineering, and expanded into cybersecurity. This diverse background
                    enables me to create solutions that are not only functional and beautiful
                    but also secure by design.
                  </p>
                  <p className="text-slate-700 leading-relaxed">
                    I specialize in modern web technologies, cloud architecture, and
                    implementing security best practices throughout the development lifecycle.
                  </p>
                </div>
              )}
            </div>
          </motion.div>

          {/* Experience Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <div className="bg-gradient-to-r from-pink-500 to-rose-500 p-6 flex items-center justify-between">
                <div className="flex items-center">
                  <FaBriefcase className="text-white mr-3" />
                  <h3 className="text-xl font-bold text-white">
                    Professional Experience
                  </h3>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleExpand('experience')}
                  className="text-white hover:bg-white/20"
                >
                  {expanded.experience ? <FaChevronUp /> : <FaChevronDown />}
                </Button>
              </div>
              {expanded.experience && (
                <div className="p-6">
                  <div className="space-y-4">
                    {experiences.map((exp, index) => (
                      <div key={index} className="bg-slate-50 p-4 rounded-lg border-l-4 border-pink-500">
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
                          {exp.year}
                        </p>
                        <h4 className="text-lg font-bold text-slate-800 mb-1">
                          {exp.title}
                        </h4>
                        <p className="text-blue-600 font-semibold mb-2">
                          {exp.company}
                        </p>
                        <p className="text-slate-600 text-sm">
                          {exp.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>

          {/* Certifications and Education Row */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Certifications Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 h-full">
                <div className="bg-gradient-to-r from-indigo-500 to-purple-500 p-6 flex items-center justify-between">
                  <div className="flex items-center">
                    <FaCertificate className="text-white mr-3" />
                    <h3 className="text-xl font-bold text-white">
                      Certifications
                    </h3>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleExpand('certifications')}
                    className="text-white hover:bg-white/20"
                  >
                    {expanded.certifications ? <FaChevronUp /> : <FaChevronDown />}
                  </Button>
                </div>
                {expanded.certifications && (
                  <div className="p-6">
                    <div className="space-y-3">
                      {certifications.map((cert, index) => (
                        <div key={index} className="flex items-center bg-blue-50 p-3 rounded-lg">
                          <FaCertificate className="text-blue-500 mr-3" />
                          <span className="font-semibold text-slate-800">{cert}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Education Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 h-full">
                <div className="bg-gradient-to-r from-emerald-500 to-teal-500 p-6 flex items-center justify-between">
                  <div className="flex items-center">
                    <FaSchool className="text-white mr-3" />
                    <h3 className="text-xl font-bold text-white">
                      Education
                    </h3>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleExpand('education')}
                    className="text-white hover:bg-white/20"
                  >
                    {expanded.education ? <FaChevronUp /> : <FaChevronDown />}
                  </Button>
                </div>
                {expanded.education && (
                  <div className="p-6">
                    <div className="bg-slate-50 p-6 rounded-lg text-center border-t-4 border-emerald-500">
                      <FaSchool className="text-emerald-500 text-4xl mx-auto mb-4" />
                      <h4 className="text-lg font-bold text-slate-800 mb-2">
                        {education.degree}
                      </h4>
                      <p className="text-blue-600 font-semibold mb-1">
                        {education.institution}
                      </p>
                      <p className="text-slate-600 text-sm">
                        {education.year}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;