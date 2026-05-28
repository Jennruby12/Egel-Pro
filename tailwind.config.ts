import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ['class'],
  content: [
    './src/app/**/*.{ts,tsx}',
    './src/components/**/*.{ts,tsx}',
    './src/modules/**/*.{ts,tsx}',
    './emails/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: '1rem',
      screens: { '2xl': '1400px' },
    },
    extend: {
      colors: {
        // Tokens semánticos (shadcn-compatible, vía CSS vars)
        border: 'hsl(var(--border) / <alpha-value>)',
        input: 'hsl(var(--input) / <alpha-value>)',
        ring: 'hsl(var(--ring) / <alpha-value>)',
        background: 'hsl(var(--background) / <alpha-value>)',
        foreground: 'hsl(var(--foreground) / <alpha-value>)',
        primary: {
          DEFAULT: 'hsl(var(--primary) / <alpha-value>)',
          foreground: 'hsl(var(--primary-foreground) / <alpha-value>)',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary) / <alpha-value>)',
          foreground: 'hsl(var(--secondary-foreground) / <alpha-value>)',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive) / <alpha-value>)',
          foreground: 'hsl(var(--destructive-foreground) / <alpha-value>)',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted) / <alpha-value>)',
          foreground: 'hsl(var(--muted-foreground) / <alpha-value>)',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent) / <alpha-value>)',
          foreground: 'hsl(var(--accent-foreground) / <alpha-value>)',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover) / <alpha-value>)',
          foreground: 'hsl(var(--popover-foreground) / <alpha-value>)',
        },
        card: {
          DEFAULT: 'hsl(var(--card) / <alpha-value>)',
          foreground: 'hsl(var(--card-foreground) / <alpha-value>)',
        },

        // ===== PALETA "NEBULOSA PROFUNDA" =====
        // Backgrounds (dark mode primarios)
        bg: {
          base:     'hsl(var(--bg-base) / <alpha-value>)',     // #060716
          surface:  'hsl(var(--bg-surface) / <alpha-value>)',  // #0E1126
          raised:   'hsl(var(--bg-raised) / <alpha-value>)',   // #181B36
          elevated: 'hsl(var(--bg-elevated) / <alpha-value>)', // #1F2347
          border:   'hsl(var(--bg-border) / <alpha-value>)',   // #2A2E55
        },
        // Glass effect tokens
        glass: {
          bg:     'hsl(var(--glass-bg) / <alpha-value>)',
          border: 'hsl(var(--glass-border) / <alpha-value>)',
          shine:  'hsl(var(--glass-shine) / <alpha-value>)',
        },
        // Aurora gradient stops
        aurora: {
          1: 'hsl(var(--aurora-1) / <alpha-value>)', // #5B7CFF royal blue
          2: 'hsl(var(--aurora-2) / <alpha-value>)', // #B66BFF cosmic violet
          3: 'hsl(var(--aurora-3) / <alpha-value>)', // #FF6B9D nova pink
        },
        // Brand accents
        brand: {
          400: 'hsl(var(--brand-400) / <alpha-value>)', // electric purple #9F7AFF
          500: 'hsl(var(--brand-500) / <alpha-value>)',
          600: 'hsl(var(--brand-600) / <alpha-value>)',
        },
        cyan: {
          ice: 'hsl(var(--cyan-ice) / <alpha-value>)', // #6BE5FF
        },
        // Semánticos (success/warning/danger)
        success: 'hsl(var(--success) / <alpha-value>)', // #4ADE80
        warning: 'hsl(var(--warning) / <alpha-value>)', // #FBBF24
        danger:  'hsl(var(--danger) / <alpha-value>)',  // #FF6B6B
        // Gamification specials
        xp:     'hsl(var(--xp) / <alpha-value>)',     // #FFD700
        streak: 'hsl(var(--streak) / <alpha-value>)', // #FF8A3D
        // Áreas EGEL (mantener identidad por área)
        area1: 'hsl(var(--area-1) / <alpha-value>)', // azul royal
        area2: 'hsl(var(--area-2) / <alpha-value>)', // violeta cosmic
        area3: 'hsl(var(--area-3) / <alpha-value>)', // mint laser
        area4: 'hsl(var(--area-4) / <alpha-value>)', // gold xp
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-geist-mono)', 'ui-monospace', 'monospace'],
      },
      fontSize: {
        // Type scale completa (display + body)
        'display-2xl': ['4.5rem', { lineHeight: '1', letterSpacing: '-0.04em', fontWeight: '700' }],
        'display-xl':  ['3.75rem', { lineHeight: '1.05', letterSpacing: '-0.035em', fontWeight: '700' }],
        'display-lg':  ['3rem', { lineHeight: '1.1', letterSpacing: '-0.03em', fontWeight: '700' }],
        'display-md':  ['2.25rem', { lineHeight: '1.15', letterSpacing: '-0.025em', fontWeight: '700' }],
        'display-sm':  ['1.875rem', { lineHeight: '1.2', letterSpacing: '-0.02em', fontWeight: '600' }],
      },
      borderRadius: {
        sm:   '6px',
        md:   '10px',
        lg:   '14px',
        xl:   '20px',
        '2xl':'28px',
      },
      boxShadow: {
        // Elevations con tint del primary
        'elev-1': '0 1px 2px 0 hsl(var(--shadow-color) / 0.12)',
        'elev-2': '0 2px 8px -2px hsl(var(--shadow-color) / 0.18)',
        'elev-3': '0 8px 24px -8px hsl(var(--shadow-color) / 0.25)',
        'elev-4': '0 16px 48px -12px hsl(var(--shadow-color) / 0.35)',
        'elev-5': '0 24px 64px -16px hsl(var(--shadow-color) / 0.45)',
        // Glass shadow: inner border highlight + outer drop
        'glass': '0 1px 0 0 hsl(var(--glass-shine) / 0.15) inset, 0 16px 48px -12px hsl(var(--shadow-color) / 0.35)',
        // Glow effects
        'glow-brand': '0 0 24px -4px hsl(var(--brand-400) / 0.6)',
        'glow-xp':    '0 0 24px -4px hsl(var(--xp) / 0.6)',
        'glow-aurora':'0 0 32px -4px hsl(var(--aurora-2) / 0.5)',
      },
      transitionTimingFunction: {
        'out-expo': 'cubic-bezier(0.16, 1, 0.3, 1)',
        'spring':   'cubic-bezier(0.34, 1.56, 0.64, 1)',
        'bounce':   'cubic-bezier(0.68, -0.55, 0.27, 1.55)',
      },
      transitionDuration: {
        instant: '100ms',
        fast:    '200ms',
        normal:  '300ms',
        slow:    '500ms',
        slower:  '800ms',
      },
      keyframes: {
        'accordion-down': { from: { height: '0' }, to: { height: 'var(--radix-accordion-content-height)' } },
        'accordion-up':   { from: { height: 'var(--radix-accordion-content-height)' }, to: { height: '0' } },
        // Aurora background animation: gradient mesh shifting
        'aurora-shift': {
          '0%, 100%': { transform: 'translate(0%, 0%) rotate(0deg)' },
          '33%':      { transform: 'translate(8%, -6%) rotate(120deg)' },
          '66%':      { transform: 'translate(-6%, 8%) rotate(240deg)' },
        },
        // Shimmer (para skeletons + buttons)
        'shimmer': {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        // Pulse glow (botones primary, badges importantes)
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 0 0 hsl(var(--brand-400) / 0.5)' },
          '50%':      { boxShadow: '0 0 0 12px hsl(var(--brand-400) / 0)' },
        },
        // Subtle float (para mascot, hero illustrations)
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-8px)' },
        },
        // Spin slow (loaders aurora)
        'spin-slow': {
          to: { transform: 'rotate(360deg)' },
        },
        // Fade in con slight scale (page transitions)
        'fade-in-up': {
          '0%':   { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'marquee': {
          from: { transform: 'translateX(0)' },
          to:   { transform: 'translateX(calc(-100% - var(--gap)))' },
        },
        'marquee-vertical': {
          from: { transform: 'translateY(0)' },
          to:   { transform: 'translateY(calc(-100% - var(--gap)))' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up':   'accordion-up 0.2s ease-out',
        'aurora-shift':   'aurora-shift 20s ease-in-out infinite',
        'shimmer':        'shimmer 2.5s linear infinite',
        'pulse-glow':     'pulse-glow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float':          'float 4s ease-in-out infinite',
        'spin-slow':      'spin-slow 8s linear infinite',
        'fade-in-up':     'fade-in-up 0.5s cubic-bezier(0.16, 1, 0.3, 1) both',
        'marquee':        'marquee var(--marquee-duration, 40s) linear infinite',
        'marquee-vertical': 'marquee-vertical var(--marquee-duration, 40s) linear infinite',
      },
      backgroundImage: {
        // Aurora gradient mesh utility
        'aurora-mesh': 'radial-gradient(at 20% 30%, hsl(var(--aurora-1) / 0.35) 0px, transparent 50%), radial-gradient(at 80% 20%, hsl(var(--aurora-2) / 0.3) 0px, transparent 50%), radial-gradient(at 60% 80%, hsl(var(--aurora-3) / 0.25) 0px, transparent 50%)',
        'aurora-subtle': 'radial-gradient(at 20% 30%, hsl(var(--aurora-1) / 0.15) 0px, transparent 50%), radial-gradient(at 80% 20%, hsl(var(--aurora-2) / 0.12) 0px, transparent 50%)',
        'shimmer-gradient': 'linear-gradient(90deg, transparent, hsl(var(--glass-shine) / 0.15), transparent)',
      },
    },
  },
  plugins: [require('tailwindcss-animate'), require('@tailwindcss/typography')],
}

export default config
