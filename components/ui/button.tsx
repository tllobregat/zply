import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 cursor-pointer disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:size-3.5 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        primary:
          'bg-blue-600 text-white shadow-lg shadow-blue-600/20 hover:bg-blue-500',
        success:
          'bg-green-600 text-white shadow-lg shadow-green-600/20 hover:bg-green-500',
        secondary:
          'bg-island-bg border border-island-border text-foreground hover:bg-island-bg/80 shadow-sm',
        ghost:
          'text-muted-foreground hover:text-foreground hover:bg-island-bg/40',
        outline:
          'bg-transparent border border-island-border hover:border-island-border/50 text-muted-foreground hover:text-foreground',
        active:
          'bg-blue-600/10 border border-blue-500/30 text-blue-500 shadow-inner',
        tab:
          'px-4 py-2 rounded-2xl text-muted-foreground hover:text-foreground hover:bg-island-bg transition-all',
        tabActive:
          'px-4 py-2 rounded-2xl bg-island-bg text-foreground shadow-lg border border-island-border transition-all',
      },
      size: {
        default: 'px-5 py-2.5',
        sm: 'px-3 py-1.5',
        lg: 'px-6 py-3',
        icon: 'p-2.5',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'default',
    },
  }
);

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button: React.ForwardRefExoticComponent<ButtonProps & React.RefAttributes<HTMLButtonElement>> = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp: React.ElementType = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
