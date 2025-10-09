'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import {
  AppBar,
  Toolbar,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  Box,
  Button,
  useTheme,
  useMediaQuery,
  Backdrop,
} from '@mui/material';
import { Menu, Close } from '@mui/icons-material';
import { motion } from 'framer-motion';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: 'Home', href: '/', type: 'page' },
    { name: 'About', href: '#about', type: 'section' },
    { name: 'Projects', href: '/projects', type: 'page' },
    { name: 'Skills', href: '#skills', type: 'section' },
    { name: 'Contact', href: '#contact', type: 'section' },
  ];

  const handleNavClick = (e: React.MouseEvent<HTMLElement>, item: any) => {
    if (item.type === 'section') {
      e.preventDefault();
      if (pathname !== '/') {
        router.push('/' + item.href);
      } else {
        const element = document.getElementById(item.href.substring(1));
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    }
    setIsOpen(false);
  };

  return (
    <>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          background: scrolled
            ? 'rgba(255, 255, 255, 0.95)'
            : 'transparent',
          backdropFilter: scrolled ? 'blur(10px)' : 'none',
          transition: 'all 0.3s ease',
          borderBottom: scrolled ? '1px solid rgba(0, 0, 0, 0.05)' : 'none',
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between', px: { xs: 2, md: 6 } }}>
          <motion.div whileHover={{ scale: 1.05 }}>
            <Link href="/" passHref>
              <Box
                component="span"
                sx={{
                  fontSize: '1.5rem',
                  fontWeight: 'bold',
                  background: 'linear-gradient(45deg, #6366F1 30%, #EC4899 90%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  cursor: 'pointer',
                }}
              >
                EO
              </Box>
            </Link>
          </motion.div>

          {!isMobile && (
            <Box sx={{ display: 'flex', gap: 2 }}>
              {navItems.map((item) => (
                <motion.div key={item.name} whileHover={{ scale: 1.05 }}>
                  <Button
                    component={Link}
                    href={item.type === 'section' && pathname !== '/' ? '/' + item.href : item.href}
                    onClick={(e) => handleNavClick(e, item)}
                    sx={{
                      color: scrolled ? 'text.primary' : 'primary.main',
                      fontWeight: 600,
                      '&:hover': {
                        background: 'rgba(99, 102, 241, 0.08)',
                      },
                    }}
                  >
                    {item.name}
                  </Button>
                </motion.div>
              ))}
            </Box>
          )}

          {isMobile && (
            <IconButton
              edge="end"
              color={scrolled ? 'primary' : 'default'}
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <Close /> : <Menu />}
            </IconButton>
          )}
        </Toolbar>
      </AppBar>

      <Backdrop
        open={isOpen}
        onClick={() => setIsOpen(false)}
        sx={{ zIndex: theme.zIndex.drawer - 1 }}
      />

      <Drawer
        anchor="right"
        open={isOpen}
        onClose={() => setIsOpen(false)}
        PaperProps={{
          sx: {
            width: 280,
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
          },
        }}
      >
        <Box sx={{ pt: 8, px: 2 }}>
          <List>
            {navItems.map((item) => (
              <ListItem key={item.name} disablePadding>
                <ListItemButton
                  component={Link}
                  href={item.type === 'section' && pathname !== '/' ? '/' + item.href : item.href}
                  onClick={(e) => handleNavClick(e, item)}
                  sx={{
                    borderRadius: 2,
                    mb: 1,
                    '&:hover': {
                      background: 'rgba(99, 102, 241, 0.08)',
                    },
                  }}
                >
                  {item.name}
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
    </>
  );
};

export default Navbar;