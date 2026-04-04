'use client';

import { Separator } from '@/components/ui/separator';
import { Cpu, ShieldCheck, Wand2 } from 'lucide-react';
import React from 'react';

export function DashboardFooter(): React.ReactNode {
  return (
    <footer
      className="px-4 sm:px-10 py-3 sm:py-5 border-t border-island-border/50 bg-island-bg/40 flex flex-col gap-3 sm:gap-5 mt-auto"
    >
      <div className="flex flex-row md:grid md:grid-cols-3 items-center justify-around md:justify-start gap-2 sm:gap-6 overflow-x-auto no-scrollbar md:overflow-visible">
        <div className="flex flex-row md:flex-col items-center md:items-start text-left gap-2 sm:gap-3 group shrink-0">
          <div className="w-8 h-8 sm:w-10 sm:h-10 shrink-0 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500 border border-blue-500/20 shadow-sm group-hover:scale-110 transition-transform">
            <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div className="hidden xs:block md:block">
            <h4 className="text-[9px] sm:text-[11px] font-black uppercase tracking-widest text-foreground mb-0.5">100% Private</h4>
            <p className="hidden md:block text-[9px] sm:text-[10px] text-muted-foreground font-medium leading-tight sm:leading-relaxed max-w-[200px]">
              No data ever leaves your browser. All processing is local.
            </p>
          </div>
        </div>

        <div className="flex flex-row md:flex-col items-center md:items-start text-left gap-2 sm:gap-3 group shrink-0">
          <div className="w-8 h-8 sm:w-10 sm:h-10 shrink-0 rounded-xl bg-green-500/10 flex items-center justify-center text-green-500 border border-green-500/20 shadow-sm group-hover:scale-110 transition-transform">
            <Cpu className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div className="hidden xs:block md:block">
            <h4 className="text-[9px] sm:text-[11px] font-black uppercase tracking-widest text-foreground mb-0.5">Local Speed</h4>
            <p className="hidden md:block text-[9px] sm:text-[10px] text-muted-foreground font-medium leading-tight sm:leading-relaxed max-w-[200px]">
              Native performance with zero latency.
            </p>
          </div>
        </div>

        <div className="flex flex-row md:flex-col items-center md:items-start text-left gap-2 sm:gap-3 group shrink-0">
          <div className="w-8 h-8 sm:w-10 sm:h-10 shrink-0 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-500 border border-purple-500/20 shadow-sm group-hover:scale-110 transition-transform">
            <Wand2 className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div className="hidden xs:block md:block">
            <h4 className="text-[9px] sm:text-[11px] font-black uppercase tracking-widest text-foreground mb-0.5">Sharing Redefined</h4>
            <p className="hidden md:block text-[9px] sm:text-[10px] text-muted-foreground font-medium leading-tight sm:leading-relaxed max-w-[200px]">
              Persist and share your state through URL hashing.
            </p>
          </div>
        </div>
      </div>

      <div className="pt-3 sm:pt-6 border-t border-island-border/30 flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-4 text-[8px] sm:text-[10px] text-muted-foreground font-bold uppercase tracking-widest">
        <div className="flex items-center gap-3 sm:gap-4">
          <span>Privacy Guaranteed</span>
          <Separator className="opacity-30" />
          <span>Open Source</span>
        </div>
        <div className="text-muted-foreground/40 sm:text-muted-foreground/60">
          ZPLY Toolbox © {new Date().getFullYear()}
        </div>
      </div>
    </footer>
  );
}
