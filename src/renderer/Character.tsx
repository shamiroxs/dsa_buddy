import { motion } from 'framer-motion';

interface CharacterProps {
  color: 'blue' | 'red';
  action?: 'idle' | 'walk' | 'pick' | 'put';
}

export function Character({ color, action = 'idle' }: CharacterProps) {
  const coatColor = color === 'blue' ? '#3b82f6' : '#dc2626';
  const antennaColor = color === 'blue' ? '#38bdf8' : '#dc2626';

  const headRotate =
    action === 'pick' ? -15 :
    action === 'put' ? 15 :
    0;

  return (
    <svg width="24" height="36" viewBox="0 0 48 72">
      {/* HEAD */}
      <motion.g
        animate={{ rotate: headRotate }}
        style={{ transformOrigin: '24px 14px' }}
        transition={{ type: 'spring', stiffness: 200 }}
      >
        <ellipse cx="24" cy="14" rx="10" ry="8" fill="#7dd3fc" />
        <circle cx="20" cy="13" r="2" fill="#0f172a" />
        <circle cx="28" cy="13" r="2" fill="#0f172a" />
        <circle cx="24" cy="-2" r="2" fill={antennaColor} />
      </motion.g>

      {/* BODY / COAT */}
      <g>
        <path
          d="M12 26 Q24 20 36 26 V46 Q24 54 12 46 Z"
          fill={coatColor}
        />
        <circle cx="24" cy="32" r="1.5" fill="#fff" />
        <circle cx="24" cy="38" r="1.5" fill="#fff" />
      </g>

      {/* LEGS */}
      <motion.g
        animate={
          action === 'walk'
            ? { rotate: [-10, 10, -10] }
            : { rotate: 0 }
        }
        style={{ transformOrigin: '24px 14px' }}
        transition={{
          repeat: action === 'walk' ? Infinity : 0,
          duration: 0.4,
        }}
      >
        <rect x="18" y="50" width="4" height="12" rx="2" fill="#0f172a" />
        <rect x="26" y="50" width="4" height="12" rx="2" fill="#0f172a" />
      </motion.g>
    </svg>
  );
}
