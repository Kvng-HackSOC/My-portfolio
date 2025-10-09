'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaPaperPlane, FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';
import Button from '@/components/UI/Button';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  // Auto-hide success message after 5 seconds
  useEffect(() => {
    if (sent) {
      const timer = setTimeout(() => {
        setSent(false);
      }, 5000); // 5 seconds

      return () => clearTimeout(timer);
    }
  }, [sent]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setError('');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        if (data.fallback && data.mailto) {
          // Fallback to mailto link
          window.location.href = data.mailto;
          setTimeout(() => {
            setSent(true);
            setFormData({
              name: '',
              email: '',
              subject: '',
              message: ''
            });
          }, 1000);
        } else {
          // Email sent successfully via SMTP
          setSent(true);
          setFormData({
            name: '',
            email: '',
            subject: '',
            message: ''
          });
        }
      } else {
        setError(data.error || 'Failed to send message. Please try again.');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setError('Failed to send message. Please try again or contact me directly.');
    } finally {
      setSending(false);
    }
  };

  const contactItems = [
    { icon: <FaEnvelope className="text-blue-500" />, text: 'oba198175@gmail.com', link: 'mailto:oba198175@gmail.com' },
    { icon: <FaPhone className="text-blue-500" />, text: '+44 07946669751', link: 'tel:+4407946669751' },
    { icon: <FaMapMarkerAlt className="text-blue-500" />, text: 'United Kingdom', link: 'https://maps.google.com/?q=United+Kingdom' },
  ];

  return (
    <section
      id="contact"
      className="py-16 bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-slate-800 via-blue-800 to-indigo-800 bg-clip-text text-transparent mb-4">
            Get In Touch
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            I'm always open to new opportunities and collaborations. Let's connect!
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-5xl mx-auto"
        >
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200/50">
            <div className="grid lg:grid-cols-2">
              {/* Left side - Contact form */}
              <div className="p-6 md:p-8 lg:p-10">
                <div className="mb-6">
                  <h3 className="text-2xl font-bold text-slate-800 mb-2">
                    Send Me a Message
                  </h3>
                  <p className="text-slate-600 text-sm">
                    I'll get back to you as soon as possible.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <input
                      type="text"
                      name="name"
                      placeholder="Your Name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-lg bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 text-slate-800 placeholder-slate-400"
                    />
                  </div>

                  <div>
                    <input
                      type="email"
                      name="email"
                      placeholder="Your Email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-lg bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 text-slate-800 placeholder-slate-400"
                    />
                  </div>

                  <div>
                    <input
                      type="text"
                      name="subject"
                      placeholder="Subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-lg bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 text-slate-800 placeholder-slate-400"
                    />
                  </div>

                  <div>
                    <textarea
                      name="message"
                      placeholder="Your Message"
                      rows={4}
                      value={formData.message}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-lg bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 resize-none text-slate-800 placeholder-slate-400"
                    />
                  </div>

                  <div>
                    <Button
                      type="submit"
                      disabled={sending || sent}
                      className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white py-3 px-6 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5"
                    >
                      {sent ? 'Message Sent!' : sending ? 'Sending...' : 'Send Message'}
                      <FaPaperPlane className="ml-2 text-sm" />
                    </Button>
                  </div>
                </form>
              </div>

              {/* Right side - Contact details */}
              <div className="bg-gradient-to-br from-indigo-600 via-blue-600 to-purple-700 p-6 md:p-8 lg:p-10 text-white relative overflow-hidden">
                {/* Decorative elements */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-16 translate-x-16"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12"></div>
                <div className="absolute top-1/2 left-1/2 w-16 h-16 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2"></div>

                <div className="relative z-10 h-full flex flex-col">
                  <div>
                    <h3 className="text-2xl font-bold mb-6">
                      Contact Info
                    </h3>

                    <div className="space-y-5">
                      {contactItems.map((item, index) => (
                        <a
                          key={index}
                          href={item.link}
                          target={item.link.startsWith('https') ? '_blank' : '_self'}
                          rel="noopener noreferrer"
                          className="flex items-center gap-4 hover:translate-x-1 transition-transform duration-300 group"
                        >
                          <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center group-hover:bg-white/30 transition-colors">
                            {item.icon}
                          </div>
                          <span className="text-base font-medium">{item.text}</span>
                        </a>
                      ))}
                    </div>
                  </div>

                  <div className="mt-auto pt-8">
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                      <p className="text-white/90 text-sm leading-relaxed">
                        Let's build something amazing together. I'm excited to hear about your project ideas!
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Success/Error Messages */}
        {sent && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="fixed bottom-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg"
          >
            Thank you for your message! I'll get back to you soon.
          </motion.div>
        )}

        {error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="fixed bottom-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg"
          >
            {error}
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default Contact;