import { motion } from 'framer-motion';

export type CharacterType = 'MOCO' | 'CHOCO';

interface CharacterProps {
  type: CharacterType;
  x: number;
  y: number;
  size?: number;
  isError?: boolean;
}

const CHARACTER_COLORS = {
  MOCO: {
    primary: '#3b82f6',
    dark: '#2563eb',
    darker: '#1d4ed8',
    light: '#60a5fa',
    eye: '#e0f2fe',
  },
  CHOCO: {
    primary: '#dc2626',
    dark: '#b91c1c',
    darker: '#7f1d1d',
    light: '#f87171',
    eye: '#fee2e2',
  },
};

export function Character({
  type,
  x,
  y,
  size,
  isError = false,
}: CharacterProps) {
  const colors = CHARACTER_COLORS[type];

  return (
    <motion.g
      style={{ transformBox: 'fill-box' }}
      animate={{ x, y, scale: size }}
      transition={{
        x: { type: 'tween', duration: 0.15, ease: 'linear' },
        y: { type: 'tween', duration: 0.15, ease: 'linear' },
      }}
    >
      {/* Shake layer (relative motion only) */}
      <motion.g
        animate={{
          x: isError ? [-2, 2, -2, 0] : 0,
        }}
        transition={{ duration: 0.25 }}
      >
        {/* Antenna */}
        <line
          x1="0"
          y1="2"
          x2="0"
          y2="8"
          stroke={colors.dark}
          strokeWidth="2"
          strokeLinecap="round"
        />
        <motion.circle
          cx={0}
          cy={2}
          r={2}
          fill={isError ? '#ef4444' : colors.light}
          animate={isError ? { opacity: [0.4, 1, 0.4] } : undefined}
          transition={{ duration: 1.2, repeat: Infinity }}
        />


        {/* Head */}
        <rect
          x="-12"
          y="8"
          width="24"
          height="18"
          rx="4"
          fill={colors.primary}
        />

        {/* Eyes */}
        <circle cx="-5" cy="17" r="2" fill={colors.eye} />
        <circle cx="5" cy="17" r="2" fill={colors.eye} />

        {/* Mouth */}
        <rect
          x="-4"
          y="21"
          width="8"
          height="2"
          rx="1"
          fill={colors.light}
        />

        {/* Body */}
        <rect
          x="-10"
          y="26"
          width="20"
          height="14"
          rx="3"
          fill={colors.dark}
        />

        {/* Body panel */}
        <rect
          x="-6"
          y="30"
          width="12"
          height="6"
          rx="2"
          fill={colors.light}
        />

        {/* Arm / Pointer */}
        <line
          x1="0"
          y1="40"
          x2="0"
          y2="52"
          stroke={colors.darker}
          strokeWidth="3"
          strokeLinecap="round"
        />
        {/* Pointer hand */} 
        <circle cx="0" cy="54" r="3" fill={colors.darker} />
      </motion.g>
    </motion.g>
  );
}
