'use client'

import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils/cn'

const magicButtonVariants = cva(
  'relative inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-semibold ring-offset-background transition-all duration-normal ease-out-expo focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 overflow-hidden [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        // Default = aurora gradient con shimmer
        aurora:
          'text-white shadow-glow-brand bg-[linear-gradient(135deg,hsl(var(--aurora-1)),hsl(var(--aurora-2))_50%,hsl(var(--aurora-3)))] bg-[length:200%_200%] hover:bg-[position:100%_100%] hover:shadow-[0_0_32px_-4px_hsl(var(--aurora-2)/0.7)]',
        // Glow pulse continuo
        glow:
          'bg-primary text-primary-foreground hover:bg-primary/90 animate-pulse-glow',
        // Shimmer atravesando
        shimmer:
          'bg-bg-raised text-foreground border border-bg-border hover:border-brand-400/50 before:absolute before:inset-0 before:bg-shimmer-gradient before:animate-shimmer before:bg-[length:200%_100%]',
        // Solid simple (sin efectos)
        solid:
          'bg-primary text-primary-foreground hover:bg-primary/90',
        // Ghost glass
        ghost:
          'bg-transparent text-foreground hover:bg-bg-raised/60 hover:backdrop-blur-md',
        // Outline glass
        outline:
          'border border-bg-border bg-transparent text-foreground hover:bg-bg-raised/40 hover:border-brand-400/50',
        destructive:
          'bg-danger text-white hover:bg-danger/90 shadow-elev-2',
      },
      size: {
        sm:   'h-9 px-4 py-2 text-xs',
        md:   'h-11 px-6 py-2.5 text-sm',
        lg:   'h-12 px-8 py-3 text-base',
        xl:   'h-14 px-10 py-3.5 text-base',
        icon: 'h-11 w-11',
      },
    },
    defaultVariants: { variant: 'aurora', size: 'md' },
  },
)

export interface MagicButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof magicButtonVariants> {
  asChild?: boolean
}

export const MagicButton = React.forwardRef<HTMLButtonElement, MagicButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    return (
      <Comp
        className={cn(magicButtonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  },
)
MagicButton.displayName = 'MagicButton'

export { magicButtonVariants }
