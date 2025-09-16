// src/components/ThemeToggle.jsx
import React from 'react';
import { useTheme } from '../context/ThemeContext';

const ThemeToggle = ({ className = '' }) => {
  const { theme, toggleTheme, isDark } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={`theme-toggle ${className}`}
      title={isDark ? 'Cambiar a tema claro' : 'Cambiar a tema oscuro'}
      aria-label={`Cambiar a tema ${isDark ? 'claro' : 'oscuro'}`}
    >
      <span className="sr-only">
        {isDark ? 'Cambiar a tema claro' : 'Cambiar a tema oscuro'}
      </span>
      <span style={{ 
        position: 'absolute', 
        left: isDark ? '8px' : '32px',
        top: '50%',
        transform: 'translateY(-50%)',
        fontSize: '14px',
        transition: 'all 0.3s ease',
        zIndex: 1
      }}>
        {isDark ? '🌙' : '☀️'}
      </span>
    </button>
  );
};

export default ThemeToggle;