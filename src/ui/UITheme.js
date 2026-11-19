/**
 * UI Theme and Visual Identity Constants
 * Modern, mature, sophisticated palette designed for 30+ demographic.
 */

export const THEME = {
  colors: {
    // Backgrounds
    bgDarkest: 0x070a12,
    bgDark: 0x0d1322,
    bgCard: 0x141c2e,
    bgCardHover: 0x1c2842,
    bgSurface: 0x1f293d,
    bgElevated: 0x273550,

    // Accents & Brand
    gold: 0xc9a84c,
    goldLight: 0xe5c368,
    goldDim: 0x8a7232,
    amber: 0xd97706,
    steel: 0x38bdf8,
    teal: 0x14b8a6,

    // Status / Resources
    time: 0x38bdf8,       // Sky blue
    energy: 0x10b981,     // Emerald
    money: 0xeab308,      // Gold/yellow
    stress: 0xef4444,     // Crimson
    relationships: 0xec4899, // Rose pink

    // State Colors
    success: 0x22c55e,
    warning: 0xf59e0b,
    danger: 0xef4444,
    info: 0x3b82f6,

    // Neutral Text & Borders
    border: 0x273550,
    borderLight: 0x3b4f73,
    borderGold: 0xc9a84c,
    textWhite: 0xf8fafc,
    textMuted: 0x94a3b8,
    textDim: 0x64748b,
    overlay: 0x000000
  },

  fonts: {
    serif: "'Crimson Pro', Georgia, serif",
    sans: "'Inter', -apple-system, sans-serif",
    mono: "'JetBrains Mono', monospace"
  },

  styles: {
    title: {
      fontFamily: "'Crimson Pro', Georgia, serif",
      fontSize: '40px',
      fontStyle: 'normal',
      color: '#f8fafc',
      align: 'center'
    },
    h1: {
      fontFamily: "'Crimson Pro', Georgia, serif",
      fontSize: '30px',
      color: '#f8fafc'
    },
    h2: {
      fontFamily: "'Inter', sans-serif",
      fontSize: '20px',
      fontWeight: '600',
      color: '#f1f5f9'
    },
    h3: {
      fontFamily: "'Inter', sans-serif",
      fontSize: '16px',
      fontWeight: '600',
      color: '#cbd5e1'
    },
    body: {
      fontFamily: "'Inter', sans-serif",
      fontSize: '14px',
      color: '#94a3b8',
      lineHeight: 1.5
    },
    caption: {
      fontFamily: "'Inter', sans-serif",
      fontSize: '11px',
      color: '#64748b'
    },
    goldHeading: {
      fontFamily: "'Crimson Pro', Georgia, serif",
      fontSize: '24px',
      color: '#c9a84c'
    }
  }
};
