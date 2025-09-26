// src/components/ThemeToggle.jsx
import React from 'react';
import { useTheme } from '../context/ThemeContext';
import '../styles/components/themeToggle.css';

const ThemeToggle = ({ className = '' }) => {
  const { theme, toggleTheme, isDark } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={`theme-toggle ${className}`}
      title={isDark ? 'Cambiar a tema claro' : 'Cambiar a tema oscuro'}
      aria-label={`Cambiar a tema ${isDark ? 'claro' : 'oscuro'}`}
      data-theme={isDark ? 'dark' : 'light'}
      style={{ position: 'relative' }}
    >
      <span style={{
        position: 'absolute',
        left: isDark ? '10px' : '30px',
        top: '50%',
        transform: 'translateY(-50%)',
        fontSize: '14px',
        transition: 'all 0.3s ease',
        zIndex: 2
      }}>
        {isDark ? '🌙' : '☀️'}
      </span>
    </button>
  );
};

export default ThemeToggle;