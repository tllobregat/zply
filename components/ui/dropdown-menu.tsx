'use client';

import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';
import React, { Context, createContext, RefObject, useContext, useEffect, useRef, useState } from 'react';

interface DropdownMenuContextType {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const DropdownMenuContext: Context<DropdownMenuContextType | undefined> = createContext<DropdownMenuContextType | undefined>(
  undefined
);

interface DropdownMenuProps {
  children: React.ReactNode;
}

export function DropdownMenu({ children }: DropdownMenuProps): React.ReactNode {
  const [open, setOpen] = useState(false);
  return (
    <DropdownMenuContext.Provider value={{ open, setOpen }}>
      <div className="relative inline-block text-left">
        {children}
      </div>
    </DropdownMenuContext.Provider>
  );
}

interface DropdownMenuTriggerProps {
  children: React.ReactNode;
  asChild?: boolean;
}

export function DropdownMenuTrigger({ children, asChild }: DropdownMenuTriggerProps): React.ReactNode {
  const { open, setOpen } = useContext(DropdownMenuContext)!;
  const triggerRef: RefObject<HTMLDivElement | null> = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent): void => {
      if (open && triggerRef.current && !triggerRef.current.contains(event.target as Node)) {
        // We handle closing in the content/overlay usually, but for a simple trigger-based menu:
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return (): void => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  const toggle = (): void => setOpen(!open);

  if (asChild && React.isValidElement(children)) {
    return (
      <div ref={triggerRef} onClick={toggle} className="cursor-pointer">
        {
          React.isValidElement(children)
            ? (
              React.cloneElement(children as React.ReactElement<React.HTMLAttributes<HTMLElement>>, {
                'aria-expanded': open,
              })
            )
            : children
        }
      </div>
    );
  }

  return (
    <div ref={triggerRef} onClick={toggle} className="cursor-pointer">
      {children}
    </div>
  );
}

interface DropdownMenuContentProps {
  children: React.ReactNode;
  align?: 'start' | 'end';
  side?: 'top' | 'bottom';
  className?: string;
}

export function DropdownMenuContent(
  {
    children,
    align = 'end',
    side = 'bottom',
    className
  }: DropdownMenuContentProps,
): React.ReactNode {
  const { open, setOpen } = useContext(DropdownMenuContext)!;
  const contentRef: RefObject<HTMLDivElement | null> = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent): void => {
      if (open && contentRef.current && !contentRef.current.contains(event.target as Node)) {
        // Check if target is NOT the trigger (which handles its own toggle)
        // For simplicity, we'll just close and let the trigger toggle it back if clicked
        setOpen(false);
      }
    };
    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return (): void => document.removeEventListener('mousedown', handleClickOutside);
  }, [open, setOpen]);

  const isTop: boolean = side === 'top';

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          ref={contentRef}
          initial={{ opacity: 0, scale: 0.95, y: isTop ? 10 : -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: isTop ? 10 : -10 }}
          transition={{ duration: 0.15, ease: 'easeOut' }}
          className={cn(
            'absolute z-50 min-w-32 overflow-hidden rounded-xl border border-island-border bg-island-bg/95 backdrop-blur-md p-1 shadow-xl ring-1 ring-black ring-opacity-5 focus:outline-none',
            isTop ? 'bottom-full mb-2' : 'top-full mt-2',
            align === 'end' ? 'right-0' : 'left-0',
            className
          )}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

interface DropdownMenuItemProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

export function DropdownMenuItem(
  {
    children,
    onClick,
    className
  }: DropdownMenuItemProps,
): React.ReactNode {
  const { setOpen } = useContext(DropdownMenuContext)!;

  const handleClick = (): void => {
    onClick?.();
    setOpen(false);
  };

  return (
    <div
      role="menuitem"
      onClick={handleClick}
      className={cn(
        'relative flex cursor-pointer select-none items-center rounded-lg px-3 py-2 text-xs font-medium text-muted-foreground outline-none transition-colors hover:bg-island-bg hover:text-foreground active:bg-island-bg/80',
        className
      )}
    >
      {children}
    </div>
  );
}

interface DropdownMenuLabelProps {
  children: React.ReactNode;
  className?: string;
}

export function DropdownMenuLabel({ children, className }: DropdownMenuLabelProps): React.ReactNode {
  return (
    <div className={cn('px-3 py-1.5 text-xs font-semibold text-foreground/70', className)}>
      {children}
    </div>
  );
}

interface DropdownMenuSeparatorProps {
  className?: string;
}

export function DropdownMenuSeparator({ className }: DropdownMenuSeparatorProps): React.ReactNode {
  return (
    <div className={cn('-mx-1 my-1 h-px bg-island-border', className)} />
  );
}
