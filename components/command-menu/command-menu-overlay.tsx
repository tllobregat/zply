'use client';

import { motion } from 'framer-motion';
import React from 'react';

interface CommandMenuOverlayProps {
  onClose: () => void;
}

export function CommandMenuOverlay({ onClose }: CommandMenuOverlayProps): React.ReactNode {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 bg-background/60 backdrop-blur-sm z-100"
    />
  );
}
