'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { FaCode, FaShieldAlt, FaCloud, FaTerminal } from 'react-icons/fa';

const Skills = () => {
  const skillCategories = [
    {
      title: 'Frontend Development',
      icon: <FaCode className="text-blue-500" />,
      bgColor: 'bg-blue-50',
      iconBg: 'bg-blue-100',
      progressBg: 'bg-blue-100',
      progressFill: 'bg-blue-500',
      textColor: 'text-blue-600',
      skills: [
        { name: 'React.js', level: 95 },
        { name: 'Next.js', level: 90 },
        { name: 'TypeScript', level: 88 },
        { name: 'Tailwind CSS', level: 92 },
      ],
    },
    {
      title: 'Backend Development',
      icon: <FaTerminal className="text-pink-500" />,
      bgColor: 'bg-pink-50',
      iconBg: 'bg-pink-100',
      progressBg: 'bg-pink-100',
      progressFill: 'bg-pink-500',
      textColor: 'text-pink-600',
      skills: [
        { name: 'Node.js', level: 92 },
        { name: 'Python', level: 85 },
        { name: 'ASP.NET', level: 80 },
        { name: 'PHP', level: 88 },
      ],
    },
    {
      title: 'Database & Cloud',
      icon: <FaCloud className="text-purple-500" />,
      bgColor: 'bg-purple-50',
      iconBg: 'bg-purple-100',
      progressBg: 'bg-purple-100',
      progressFill: 'bg-purple-500',
      textColor: 'text-purple-600',
      skills: [
        { name: 'MySQL', level: 90 },
        { name: 'MongoDB', level: 88 },
        { name: 'AWS', level: 82 },
        { name: 'Docker', level: 78 },
      ],
    },
    {
      title: 'Cybersecurity',
      icon: <FaShieldAlt className="text-emerald-500" />,
      bgColor: 'bg-emerald-50',
      iconBg: 'bg-emerald-100',
      progressBg: 'bg-emerald-100',
      progressFill: 'bg-emerald-500',
      textColor: 'text-emerald-600',
      skills: [
        { name: 'Network Security', level: 90 },
        { name: 'Penetration Testing', level: 85 },
        { name: 'Risk Assessment', level: 92 },
        { name: 'Ethical Hacking', level: 88 },
      ],
    },
  ];

  return (
    <section
      id="skills"
      className="py-20 bg-gradient-to-b from-slate-50 to-white"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-slate-900 via-blue-600 to-blue-800 bg-clip-text text-transparent mb-4">
            Skills & Technologies
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            A comprehensive set of tools and technologies I use to build secure and scalable applications
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {skillCategories.map((category, index) => (
            <motion.div
              key={category.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="h-full"
            >
              <div className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 p-6 h-full border border-slate-100">
                <div className={`w-16 h-16 rounded-lg ${category.iconBg} flex items-center justify-center mb-6`}>
                  <div className={`text-2xl ${category.textColor}`}>
                    {category.icon}
                  </div>
                </div>

                <h3 className="text-xl font-bold text-slate-800 mb-6">
                  {category.title}
                </h3>

                <div className="space-y-4">
                  {category.skills.map((skill) => (
                    <div key={skill.name}>
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-semibold text-slate-700 text-sm">
                          {skill.name}
                        </span>
                        <span className="text-slate-500 text-sm">
                          {skill.level}%
                        </span>
                      </div>
                      <div className={`w-full ${category.progressBg} rounded-full h-2`}>
                        <div
                          className={`bg-gradient-to-r ${category.progressFill} to-slate-600 h-2 rounded-full transition-all duration-1000`}
                          style={{ width: `${skill.level}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;