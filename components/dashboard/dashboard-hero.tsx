'use client';

import { motion } from 'framer-motion';
import { Shield, Zap, Globe } from 'lucide-react';
import React from 'react';

export function DashboardHero(): React.ReactNode {
  return (
    <div className="mb-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-10"
      >
        <h2 className="text-3xl sm:text-5xl font-black tracking-tight mb-4 text-foreground">
          The Swiss Army Knife for <span className="text-zply-blue">Your Daily Tasks</span>
        </h2>
        <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto font-medium">
          A collection of 100% private, local-first tools for data, security, and visualization.
          <span className="block mt-1 font-bold text-foreground/80 italic">No data leaves your browser.</span>
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-4xl mx-auto"
      >
        <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-island-bg/40 border border-island-border/50 shadow-sm backdrop-blur-sm">
          <div className="w-10 h-10 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center justify-center text-green-400 shrink-0">
            <Shield className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <h3 className="text-[10px] font-black uppercase tracking-wider text-foreground">100% Private</h3>
            <p className="text-[9px] text-muted-foreground leading-tight font-medium">Strictly browser-side</p>
          </div>
        </div>

        <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-island-bg/40 border border-island-border/50 shadow-sm backdrop-blur-sm">
          <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400 shrink-0">
            <Globe className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <h3 className="text-[10px] font-black uppercase tracking-wider text-foreground">Offline Ready</h3>
            <p className="text-[9px] text-muted-foreground leading-tight font-medium">Works without internet</p>
          </div>
        </div>

        <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-island-bg/40 border border-island-border/50 shadow-sm backdrop-blur-sm">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">
            <Zap className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <h3 className="text-[10px] font-black uppercase tracking-wider text-foreground">Ultra Fast</h3>
            <p className="text-[9px] text-muted-foreground leading-tight font-medium">Zero latency screens</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
